"""Service for generating diagrams from live Kubernetes cluster resources."""
import subprocess
import json
import os
import uuid
import tempfile
from typing import List, Optional, Dict, Any

from constants import MIME_TYPES
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content

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


def _raise_connection_error(error_msg: str, fallback_msg: str) -> None:
    """Raise RuntimeError with a user-friendly message based on kubectl's connection error output."""
    if "connect: no route to host" in error_msg or "dial tcp" in error_msg:
        raise RuntimeError(
            "Cannot reach the Kubernetes API server (no route to host). "
            "Start your cluster (e.g. minikube start, kind create cluster) "
            "and verify your kubeconfig with: kubectl config current-context"
        )
    if "Unable to connect to the server" in error_msg:
        raise RuntimeError(_CANNOT_REACH_API)
    if "connection refused" in error_msg.lower():
        raise RuntimeError(
            "Connection to the Kubernetes API server was refused. "
            "Make sure your cluster is running and the API server is accessible."
        )
    raise RuntimeError(fallback_msg)


def _run_kubectl(cmd: List[str], timeout: int) -> subprocess.CompletedProcess:
    """
    Run a kubectl command and return the completed process.
    Raises RuntimeError if kubectl is not installed or the command times out.
    CalledProcessError propagates for the caller to handle context-specifically.
    """
    try:
        return subprocess.run(cmd, check=True, capture_output=True, text=True, timeout=timeout)
    except FileNotFoundError:
        raise RuntimeError(_KUBECTL_NOT_FOUND)
    except subprocess.TimeoutExpired:
        raise RuntimeError(
            f"kubectl timed out after {timeout}s. "
            "Check that your cluster is running and reachable, then try again."
        )


def get_namespaces() -> List[str]:
    """Retrieve the sorted list of namespace names from the connected Kubernetes cluster via kubectl."""
    try:
        proc = _run_kubectl(["kubectl", "get", "namespaces", "-o", "json"], timeout=20)
        result = json.loads(proc.stdout)
        return sorted([item["metadata"]["name"] for item in result.get("items", [])])
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.strip() if e.stderr else str(e)
        _raise_connection_error(error_msg, f"kubectl error while fetching namespaces: {error_msg[:200]}")
    except RuntimeError:
        raise
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Could not parse kubectl output: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Unexpected error while fetching namespaces: {str(e)}")


def get_resource_types() -> List[Dict[str, Any]]:
    """
    Retrieve all resource types known by the cluster via kubectl api-resources.
    Each entry includes name, shortNames, namespaced scope flag, and isCommon flag.
    Common types exclude events and endpoints to avoid noisy intermediate resources.
    """
    try:
        proc = _run_kubectl(
            ["kubectl", "api-resources", "--verbs=list", "--no-headers"], timeout=30
        )
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
        return resources
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.strip() if e.stderr else str(e)
        _raise_connection_error(error_msg, f"kubectl error while fetching resource types: {error_msg[:200]}")
    except RuntimeError:
        raise
    except Exception as e:
        raise RuntimeError(f"Unexpected error while fetching resource types: {str(e)}")


def get_current_context() -> str:
    """Return the name of the currently active kubectl context."""
    try:
        proc = _run_kubectl(["kubectl", "config", "current-context"], timeout=5)
        return proc.stdout.strip()
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.strip() if e.stderr else str(e)
        raise RuntimeError(f"No active kubectl context found: {error_msg}")
    except RuntimeError:
        raise
    except Exception as e:
        raise RuntimeError(f"Unexpected error while fetching context: {str(e)}")


def _make_diagrams_error(stdout: str, stderr: str, cmd: List[str]) -> DiagramResult:
    """Return a DiagramResult describing why kubectl-diagrams failed."""
    if "Unable to connect" in stderr or "connect: no route to host" in stderr:
        return DiagramResult(
            success=False,
            error="Cannot reach the Kubernetes API server. "
                  "Start your cluster (e.g. minikube start, kind create cluster) "
                  "and verify your kubeconfig with: kubectl config current-context",
            command=" ".join(cmd),
            stdout=stdout,
            stderr=stderr,
        )
    return DiagramResult(
        success=False,
        error="kubectl-diagrams failed. See command output below.",
        command=" ".join(cmd),
        stdout=stdout,
        stderr=stderr,
    )


def generate_from_cluster(
    resource_types: List[str],
    namespace: Optional[str] = None,
    all_namespaces: bool = False,
    output_format: str = "png",
    extra_args: str = "",
    without_namespace: bool = False
) -> DiagramResult:
    """Generate diagram using kubectl-diagrams plugin directly."""
    cmd: List[str] = []
    try:
        resources_arg = ','.join(resource_types)
        base_name = f"cluster-diagram-{uuid.uuid4().hex[:8]}"
        base_path = os.path.join(tempfile.gettempdir(), base_name)
        requested_output, png_output = FileManager.get_output_paths(base_path, output_format)

        cmd = ["kubectl-diagrams", resources_arg]

        if all_namespaces:
            cmd.append("--all-namespaces")
        elif namespace:
            cmd.extend(["-n", namespace])

        cmd.extend(["-o", requested_output])

        if output_format != "png":
            cmd.extend(["-f", output_format])

        if without_namespace:
            cmd.append("--without-namespace")

        if extra_args.strip():
            cmd.extend(parse_extra_args(extra_args))

        proc = subprocess.run(cmd, check=False, capture_output=True, text=True, timeout=60)
        stdout_output = proc.stdout or ""
        stderr_output = proc.stderr or ""

        if proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output):
            return _make_diagrams_error(stdout_output, stderr_output, cmd)

        output_info = FileManager.find_output_file(requested_output, png_output)
        if output_info is None:
            return DiagramResult(
                success=False,
                error=f"Output file not found: {requested_output}",
                command=" ".join(cmd),
                stdout=stdout_output,
                stderr=stderr_output
            )
        output_file, produced_format = output_info

        content = FileManager.read_file_content(output_file, binary=True)
        encoded = encode_content(content, produced_format)
        FileManager.cleanup_files(output_file)

        return DiagramResult(
            success=True,
            diagram=encoded,
            mime_type=MIME_TYPES.get(produced_format, "application/octet-stream"),
            filename=f"{base_name}.{produced_format}",
            message="Diagram successfully generated from cluster resources using kubectl-diagrams.",
            command=" ".join(cmd),
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
            command=" ".join(cmd) or "kubectl-diagrams"
        )
    except Exception as e:
        return DiagramResult(
            success=False,
            error=f"Unexpected error: {str(e)}",
            command=" ".join(cmd) or "kubectl-diagrams"
        )