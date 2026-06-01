"""Routes for diagram generation from live Kubernetes cluster."""
from flask import Blueprint, request

from .utils import log_to_csv, compact_for_log
from services import (
    generate_from_cluster,
    get_namespaces,
    get_resource_types,
)
from utils import InputValidator, ResponseBuilder

cluster_bp = Blueprint('cluster', __name__)


@cluster_bp.route('/api/cluster/namespaces', methods=['GET'])
def list_namespaces():
    try:
        namespaces = get_namespaces()
        return ResponseBuilder.success({
            "namespaces": namespaces,
            "count": len(namespaces)
        })
    except RuntimeError as e:
        return ResponseBuilder.error(str(e))
    except Exception as e:
        return ResponseBuilder.error(f"Unexpected error: {str(e)}")


@cluster_bp.route('/api/cluster/resource-types', methods=['GET'])
def list_resource_types():
    namespace = request.args.get('namespace')
    try:
        resource_types = get_resource_types(namespace=namespace)
        return ResponseBuilder.success({
            "resourceTypes": resource_types,
            "count": len(resource_types)
        })
    except RuntimeError as e:
        return ResponseBuilder.error(str(e))
    except Exception as e:
        return ResponseBuilder.error(f"Unexpected error: {str(e)}")


@cluster_bp.route('/api/cluster/generate', methods=['POST'])
def generate_cluster_diagram():
    """Generate a diagram from live Kubernetes cluster resources using kubectl-diagrams."""
    data = request.get_json()

    namespace = data.get('namespace')
    resource_types = data.get('resourceTypes', [])
    all_namespaces = data.get('allNamespaces', False)
    output_format = (data.get('outputFormat') or 'png').lower()
    extra_args = data.get('extraArgs', '')
    without_namespace = data.get('withoutNamespace', False)

    # Log to CSV
    client_ip = request.remote_addr
    route = request.path
    params = (
        f"namespace={namespace};"
        f"resourceTypes={','.join(resource_types) if resource_types else 'default'};"
        f"allNamespaces={all_namespaces};"
        f"format={output_format};"
        f"extraArgs={compact_for_log(extra_args)};"
        f"withoutNamespace={without_namespace}"
    )
    log_to_csv(client_ip, route, params)

    # Validate namespace if provided
    if namespace and not InputValidator.validate_k8s_name(namespace):
        return ResponseBuilder.validation_error("namespace", "Invalid namespace name")

    # Output format validation
    is_valid, error_msg = InputValidator.validate_output_format(output_format)
    if not is_valid:
        return ResponseBuilder.validation_error("outputFormat", error_msg)

    # Extra arguments validation
    is_valid, error_msg = InputValidator.validate_extra_args(extra_args)
    if not is_valid:
        return ResponseBuilder.validation_error("extraArgs", error_msg)

    # Generate diagram using kubectl-diagrams
    result = generate_from_cluster(
        namespace=namespace,
        resource_types=resource_types if resource_types else None,
        all_namespaces=all_namespaces,
        output_format=output_format,
        extra_args=extra_args,
        without_namespace=without_namespace
    )
    
    if result.success:
        return ResponseBuilder.success(result.to_dict())
    else:
        return ResponseBuilder.error(
            result.error,
            details={
                "command": result.command,
                "stdout": result.stdout,
                "stderr": result.stderr
            }
        )

