"""Service for generating diagrams from live Kubernetes cluster resources."""
import subprocess
import json
import os
import uuid
from typing import List, Optional, Dict, Any

from constants import MIME_TYPES
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content


def get_namespaces() -> List[str]:
    try:
        cmd = ["kubectl", "get", "namespaces", "-o", "json"]
        proc = subprocess.run(cmd, check=True, capture_output=True, text=True, timeout=20)

        result = json.loads(proc.stdout)
        namespaces = [item["metadata"]["name"] for item in result.get("items", [])]

        return sorted(namespaces)
    # Gestion d'erreurs ici
    except FileNotFoundError:
        raise RuntimeError(
            "kubectl is not installed or not in PATH. "
            "Please install kubectl to use this feature."
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError(
            "Connection to Kubernetes cluster timed out. "
            "Please check your cluster connectivity and try again."
        )
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.strip() if e.stderr else str(e)

        # Check for common error patterns
        if "connect: no route to host" in error_msg or "dial tcp" in error_msg:
            raise RuntimeError(
                "Unable to connect to Kubernetes cluster. "
                "Please ensure your cluster is running (e.g., 'minikube start') "
                "and kubectl is configured correctly."
            )
        elif "Unable to connect to the server" in error_msg:
            raise RuntimeError(
                "Kubernetes cluster is not accessible. "
                "Please start your cluster (e.g., 'minikube start', 'kind create cluster') "
                "or check your kubeconfig configuration."
            )
        elif "connection refused" in error_msg.lower():
            raise RuntimeError(
                "Connection to Kubernetes cluster was refused. "
                "Please verify your cluster is running and accessible."
            )
        else:
            raise RuntimeError(
                f"Failed to retrieve namespaces from cluster. "
                f"Error: {error_msg[:200]}"
            )
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Failed to parse kubectl output: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Unexpected error getting namespaces: {str(e)}")


def get_resource_types(namespace: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Get resource types that actually exist in the namespace/cluster.
    Includes CRDs (Custom Resource Definitions) and all available resource types.
    Only returns resources that have at least one instance to avoid empty diagrams.
    """
    try:
        # Common resource types to prioritize in display
        common_types = {
            'pods', 'services', 'deployments', 'replicasets', 'statefulsets',
            'daemonsets', 'configmaps', 'secrets', 'ingresses',
            'persistentvolumeclaims', 'persistentvolumes', 'nodes',
            'namespaces', 'serviceaccounts', 'roles', 'rolebindings',
            'clusterroles', 'clusterrolebindings', 'jobs', 'cronjobs',
            'horizontalpodautoscalers', 'networkpolicies', 'storageclasses',
            'endpoints', 'events', 'limitranges', 'resourcequotas'
        }

        # Without namespace, return only common types (no verification needed)
        if not namespace:
            return [
                {"name": name, "shortNames": [], "isCommon": True}
                for name in sorted(common_types)
            ]

        # Get ALL namespaced resources (including CRDs)
        namespaced_cmd = ["kubectl", "api-resources", "--verbs=list", "--namespaced=true", "-o", "name"]
        namespaced_proc = subprocess.run(namespaced_cmd, check=True, capture_output=True, text=True, timeout=20)
        all_namespaced_resources = [r.strip() for r in namespaced_proc.stdout.strip().split('\n') if r.strip()]

        # Check which resources actually exist in the namespace
        existing_resources = []
        seen_simple_names = set()

        # print(f"[DEBUG] Checking {len(all_namespaced_resources)} resource types in namespace '{namespace}'...")

        for resource_name in all_namespaced_resources:
            # Extract simple name (e.g., "deployments" from "deployments.apps")
            simple_name = resource_name.split('.')[0] if '.' in resource_name else resource_name

            # Skip if already checked
            if simple_name in seen_simple_names:
                continue

            check_cmd = ["kubectl", "get", resource_name, "-n", namespace, "--no-headers", "--ignore-not-found"]

            try:
                check_proc = subprocess.run(
                    check_cmd,
                    check=False,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.DEVNULL,  # Ignore errors
                    text=True,
                    timeout=2  # Short timeout per resource
                )

                # If there's output and command succeeded, this resource exists
                if check_proc.returncode == 0 and check_proc.stdout.strip():
                    is_common = simple_name in common_types
                    existing_resources.append({
                        "name": simple_name,
                        "shortNames": [],
                        "isCommon": is_common
                    })
                    seen_simple_names.add(simple_name)

            except (subprocess.TimeoutExpired, Exception):
                # Skip problematic resources
                continue

        # Sort: common types first, then alphabetically
        existing_resources.sort(key=lambda x: (not x['isCommon'], x['name']))

        # print(f"[DEBUG] Found {len(existing_resources)} existing resources in namespace '{namespace}'")

        return existing_resources

    except FileNotFoundError:
        raise RuntimeError(
            "kubectl is not installed or not in PATH. "
            "Please install kubectl to use this feature."
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError(
            "Connection to Kubernetes cluster timed out while fetching resource types."
        )
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.strip() if e.stderr else str(e)

        if "connect: no route to host" in error_msg or "dial tcp" in error_msg or "Unable to connect" in error_msg:
            raise RuntimeError(
                "Unable to connect to Kubernetes cluster. "
                "Please ensure your cluster is running and accessible."
            )
        else:
            raise RuntimeError(f"Failed to get resource types: {error_msg[:200]}")
    except Exception as e:
        raise RuntimeError(f"Unexpected error getting resource types: {str(e)}")


# Use kubectl-diagrams directly (combines kubectl get + kube-diagrams in one command)
def generate_from_cluster(
    namespace: Optional[str] = None,
    resource_types: Optional[List[str]] = None,
    all_namespaces: bool = False,
    output_format: str = "png",
    extra_args: str = "",
    without_namespace: bool = False
) -> DiagramResult:
    """
    Generate diagram using kubectl-diagrams plugin directly.
    This is more efficient than calling kubectl get + kube-diagrams separately.
    """
    try:
        # Prepare resource types
        if not resource_types or len(resource_types) == 0:
            # Default resource types
            resource_types = ['pods', 'services', 'deployments', 'replicasets',
                            'statefulsets', 'daemonsets', 'configmaps', 'secrets',
                            'ingresses', 'persistentvolumeclaims']

        # Join resource types as comma-separated list
        resources_arg = ','.join(resource_types)

        # Generate unique output filename
        base_name = f"cluster-diagram-{uuid.uuid4().hex[:8]}"
        output_dir = "/tmp"
        output_file = f"{output_dir}/{base_name}.{output_format}"

        # Build kubectl-diagrams command
        cmd = ["kubectl-diagrams", resources_arg]

        # Add namespace option
        if all_namespaces:
            cmd.append("--all-namespaces")
        elif namespace:
            cmd.extend(["-n", namespace])

        # Add output file
        cmd.extend(["-o", output_file])

        # Add format
        if output_format != "png":
            cmd.extend(["-f", output_format])

        # Add without-namespace option
        if without_namespace:
            cmd.append("--without-namespace")

        # Add extra args if provided
        if extra_args.strip():
            cmd.extend(parse_extra_args(extra_args))

        # Execute command
        proc = subprocess.run(cmd, check=False, capture_output=True, text=True, timeout=60)
        stdout_output = proc.stdout or ""
        stderr_output = proc.stderr or ""

        # Check for errors
        if proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output):
            # Check if it's a connection error
            if "Unable to connect" in stderr_output or "connect: no route to host" in stderr_output:
                return DiagramResult(
                    success=False,
                    error="Unable to connect to Kubernetes cluster. Please ensure your cluster is running.",
                    command=" ".join(cmd),
                    stdout=stdout_output,
                    stderr=stderr_output
                )

            return DiagramResult(
                success=False,
                error="kubectl-diagrams failed. See command output below.",
                command=" ".join(cmd),
                stdout=stdout_output,
                stderr=stderr_output
            )

        # Check if output file exists
        if not os.path.exists(output_file):
            # Try with .png extension if original format didn't work
            png_output = f"{output_dir}/{base_name}.png"
            if os.path.exists(png_output):
                output_file = png_output
                produced_format = "png"
            else:
                return DiagramResult(
                    success=False,
                    error=f"Output file not found: {output_file}",
                    command=" ".join(cmd),
                    stdout=stdout_output,
                    stderr=stderr_output
                )
        else:
            produced_format = output_format

        # Read the file
        content = FileManager.read_file_content(output_file, binary=True)
        encoded = encode_content(content, produced_format)

        # Clean up
        try:
            os.remove(output_file)
        except:
            pass

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
            error="kubectl-diagrams is not installed or not in PATH. Please install kubectl-diagrams plugin.",
            command="kubectl-diagrams"
        )
    except subprocess.TimeoutExpired:
        return DiagramResult(
            success=False,
            error="Command timed out. The cluster might be slow or unresponsive.",
            command=" ".join(cmd) if 'cmd' in locals() else "kubectl-diagrams"
        )
    except Exception as e:
        return DiagramResult(
            success=False,
            error=f"Unexpected error: {str(e)}",
            command=" ".join(cmd) if 'cmd' in locals() else "kubectl-diagrams"
        )




