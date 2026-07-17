"""Service for generating diagrams from live Kubernetes cluster resources."""
import subprocess
import json
import os
import uuid
import tempfile
from typing import List, Optional, Dict, Any

from constants import MIME_TYPES
from utils import get_app_logger, log_unexpected_error
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content, dot_to_dot_json, redact_temp_paths

logger = get_app_logger(__name__)

COMMON_RESOURCE_TYPES = frozenset({
    'pods', 'services', 'deployments', 'replicasets', 'statefulsets',
    'daemonsets', 'configmaps', 'secrets', 'ingresses',
    'persistentvolumeclaims', 'persistentvolumes', 'nodes',
    'namespaces', 'serviceaccounts', 'roles', 'rolebindings',
    'clusterroles', 'clusterrolebindings', 'jobs', 'cronjobs',
    'horizontalpodautoscalers', 'networkpolicies', 'storageclasses',
    'runtimeclasses',
    # events and endpoints excluded: they produce noisy intermediate resources
})

_KUBECTL_NOT_FOUND = (
    "kubectl is not installed or not found in PATH. "
    "Install it from https://kubernetes.io/docs/tasks/tools/ and ensure it is available."
)
_CANNOT_REACH_API = (
    "Cannot reach the Kubernetes API server. "
    "Start your cluster (e.g. minikube start, kind create cluster, k3d cluster create) "
    "and verify your kubeconfig with: kubectl config current-context"
)


def _connection_error_message(error_msg: str, fallback_msg: str) -> str:
    """Return a user-friendly message based on kubectl's connection error output."""
    if "connect: no route to host" in error_msg or "dial tcp" in error_msg:
        return (
            "Cannot reach the Kubernetes API server (no route to host). "
            "Start your cluster (e.g. minikube start, kind create cluster) "
            "and verify your kubeconfig with: kubectl config current-context"
        )
    if "Unable to connect to the server" in error_msg:
        return _CANNOT_REACH_API
    if "connection refused" in error_msg.lower():
        return (
            "Connection to the Kubernetes API server was refused. "
            "Make sure your cluster is running and the API server is accessible."
        )
    return fallback_msg


def _run_kubectl(cmd: List[str], timeout: int) -> tuple[Optional[subprocess.CompletedProcess], Optional[str]]:
    try:
        return subprocess.run(cmd, check=False, capture_output=True, text=True, timeout=timeout), None
    except FileNotFoundError:
        return None, _KUBECTL_NOT_FOUND
    except subprocess.TimeoutExpired:
        return None, (
            f"kubectl timed out after {timeout}s. "
            "Check that your cluster is running and reachable, then try again."
        )


def get_contexts() -> tuple[Optional[List[Dict[str, Any]]], Optional[str]]:
    """Retrieve the list of kubectl contexts configured locally, marking which one is current."""
    try:
        proc, error = _run_kubectl(["kubectl", "config", "get-contexts", "-o", "name"], timeout=10)
        if error:
            return None, error
        if proc.returncode != 0:
            error_msg = proc.stderr.strip() if proc.stderr else f"kubectl exited with code {proc.returncode}"
            return None, _connection_error_message(error_msg, f"kubectl error while fetching contexts: {error_msg[:200]}")

        names = [line.strip() for line in proc.stdout.splitlines() if line.strip()]
        current, _ = get_current_context()
        return [{"name": name, "current": name == current} for name in names], None
    except Exception:
        return None, log_unexpected_error(logger, "fetching contexts")


def _is_known_context(context: str) -> bool:
    """Check context against the real list of locally configured kubectl contexts."""
    contexts, error = get_contexts()
    if error or not contexts:
        return False
    return any(c["name"] == context for c in contexts)


def get_namespaces(context: Optional[str] = None) -> tuple[Optional[List[str]], Optional[str]]:
    """Retrieve the sorted list of namespace names from the connected Kubernetes cluster via kubectl."""
    if context and not _is_known_context(context):
        return None, f"Unknown kubectl context: {context!r}"
    try:
        cmd = ["kubectl"]
        if context:
            cmd.extend(["--context", context])
        cmd.extend(["get", "namespaces", "-o", "json"])
        proc, error = _run_kubectl(cmd, timeout=20)
        if error:
            return None, error
        if proc.returncode != 0:
            error_msg = proc.stderr.strip() if proc.stderr else f"kubectl exited with code {proc.returncode}"
            return None, _connection_error_message(error_msg, f"kubectl error while fetching namespaces: {error_msg[:200]}")
        result = json.loads(proc.stdout)
        return sorted([item["metadata"]["name"] for item in result.get("items", [])]), None
    except json.JSONDecodeError:
        return None, log_unexpected_error(logger, "parsing kubectl output")
    except Exception:
        return None, log_unexpected_error(logger, "fetching namespaces")


def get_resource_types(context: Optional[str] = None) -> tuple[Optional[List[Dict[str, Any]]], Optional[str]]:
    """
    Retrieve all resource types known by the cluster via kubectl api-resources.
    Each entry includes name, shortNames, namespaced scope flag, and isCommon flag.
    Common types exclude events and endpoints to avoid noisy intermediate resources.
    """
    if context and not _is_known_context(context):
        return None, f"Unknown kubectl context: {context!r}"
    try:
        cmd = ["kubectl"]
        if context:
            cmd.extend(["--context", context])
        cmd.extend(["api-resources", "--verbs=list", "--no-headers"])
        proc, error = _run_kubectl(cmd, timeout=30)
        if error:
            return None, error
        if proc.returncode != 0:
            error_msg = proc.stderr.strip() if proc.stderr else f"kubectl exited with code {proc.returncode}"
            return None, _connection_error_message(error_msg, f"kubectl error while fetching resource types: {error_msg[:200]}")

        resources = []
        seen = set()

        for line in proc.stdout.strip().splitlines():
            tokens = line.split()
            if len(tokens) < 4:
                continue

            name = tokens[0]
            # Deduplicate by simple name (e.g. "deployments" from "deployments.apps")
            simple_name = name.split('.')[0]
            if simple_name in seen:
                continue
            seen.add(simple_name)

            # kubectl api-resources columns: NAME [SHORTNAMES] APIVERSION NAMESPACED KIND
            # NAMESPACED is always second-to-last, KIND is last
            namespaced = tokens[-2].lower() == 'true'
            short_names = [tokens[1]] if len(tokens) >= 5 else []

            resources.append({
                "name": simple_name,
                "shortNames": short_names,
                "namespaced": namespaced,
                "isCommon": simple_name in COMMON_RESOURCE_TYPES,
            })

        resources.sort(key=lambda x: (not x['isCommon'], x['name']))
        return resources, None
    except Exception:
        return None, log_unexpected_error(logger, "fetching resource types")


def get_current_context() -> tuple[Optional[str], Optional[str]]:
    """Return the name of the currently active kubectl context."""
    try:
        proc, error = _run_kubectl(["kubectl", "config", "current-context"], timeout=5)
        if error:
            return None, error
        if proc.returncode != 0:
            error_msg = proc.stderr.strip() if proc.stderr else f"kubectl exited with code {proc.returncode}"
            return None, f"No active kubectl context found: {error_msg}"
        return proc.stdout.strip(), None
    except Exception:
        return None, log_unexpected_error(logger, "fetching context")


def _make_diagrams_error(stdout: str, stderr: str, cmd: List[str], *paths: str) -> DiagramResult:
    """Return a DiagramResult describing why kubectl-diagrams failed."""
    command = redact_temp_paths(" ".join(cmd), *paths)
    if "Unable to connect" in stderr or "connect: no route to host" in stderr:
        return DiagramResult(
            success=False,
            error="Cannot reach the Kubernetes API server. "
                  "Start your cluster (e.g. minikube start, kind create cluster) "
                  "and verify your kubeconfig with: kubectl config current-context",
            command=command,
            stdout=stdout,
            stderr=stderr,
        )
    return DiagramResult(
        success=False,
        error="kubectl-diagrams failed. See command output below.",
        command=command,
        stdout=stdout,
        stderr=stderr,
    )


def generate_from_cluster(
    resource_types: List[str],
    namespace: Optional[str] = None,
    all_namespaces: bool = False,
    output_format: str = "png",
    extra_args: str = "",
    without_namespace: bool = False,
    context: Optional[str] = None
) -> DiagramResult:
    """Generate diagram using kubectl-diagrams plugin directly."""
    cmd: List[str] = []
    requested_output = png_output = dot_output = None
    try:
        if context and not _is_known_context(context):
            return DiagramResult(success=False, error=f"Unknown kubectl context: {context!r}")

        resources_arg = ','.join(resource_types)
        base_name = f"cluster-diagram-{uuid.uuid4().hex[:8]}"
        base_path = os.path.join(tempfile.gettempdir(), base_name)
        requested_output, png_output = FileManager.get_output_paths(base_path, output_format)
        dot_output = requested_output.replace(".dot_json", ".dot") if output_format == "dot_json" else None

        cmd = ["kubectl-diagrams", resources_arg]

        if context:
            cmd.extend(["--context", context])

        if all_namespaces:
            cmd.append("--all-namespaces")
        elif namespace:
            cmd.extend(["-n", namespace])

        cmd.extend(["-o", dot_output or requested_output])

        if output_format != "png" and not dot_output:
            cmd.extend(["-f", output_format])

        if without_namespace:
            cmd.append("--without-namespace")

        if extra_args.strip():
            cmd.extend(parse_extra_args(extra_args, "kubectl-diagrams"))

        proc = subprocess.run(cmd, check=False, capture_output=True, text=True, timeout=60)
        stdout_output = proc.stdout or ""
        stderr_output = proc.stderr or ""

        if proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output):
            return _make_diagrams_error(stdout_output, stderr_output, cmd, requested_output, png_output, dot_output)

        if output_format == "dot_json":
            if not os.path.exists(dot_output):
                return DiagramResult(
                    success=False,
                    error=f"Output file not found: {os.path.basename(dot_output)}",
                    command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output),
                    stdout=stdout_output,
                    stderr=stderr_output
                )
            if not dot_to_dot_json(dot_output, requested_output):
                FileManager.cleanup_files(dot_output)
                return DiagramResult(
                    success=False,
                    error="dot -Tjson conversion failed (is graphviz installed?).",
                    command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output),
                    stdout=stdout_output,
                    stderr=stderr_output
                )
            output_file, produced_format = requested_output, "dot_json"
        else:
            output_info = FileManager.find_output_file(requested_output, png_output)
            if output_info is None:
                return DiagramResult(
                    success=False,
                    error=f"Output file not found: {os.path.basename(requested_output)}",
                    command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output),
                    stdout=stdout_output,
                    stderr=stderr_output
                )
            output_file, produced_format = output_info

        content = FileManager.read_file_content(output_file, binary=True)
        encoded = encode_content(content, produced_format)
        FileManager.cleanup_files(output_file, dot_output)

        return DiagramResult(
            success=True,
            diagram=encoded,
            mime_type=MIME_TYPES.get(produced_format, "application/octet-stream"),
            filename=f"{base_name}.{produced_format}",
            message="Diagram successfully generated from cluster resources using kubectl-diagrams.",
            command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output),
            stdout=stdout_output,
            stderr=stderr_output
        )

    except FileNotFoundError:
        return DiagramResult(
            success=False,
            error="kubectl-diagrams is not installed or not found in PATH. "
                  "Install the kubectl-diagrams plugin and ensure kubectl is configured: "
                  "kubectl config current-context",
            command="kubectl-diagrams"
        )
    except subprocess.TimeoutExpired:
        return DiagramResult(
            success=False,
            error="Command timed out. The cluster might be slow or unresponsive.",
            command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output) or "kubectl-diagrams"
        )
    except Exception:
        return DiagramResult(
            success=False,
            error=log_unexpected_error(logger, "generating diagram from cluster"),
            command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output) or "kubectl-diagrams"
        )
