"""Route for diagram generation from Kubernetes manifests."""
from flask import Blueprint, request

from services import generate_from_manifest
from utils import InputValidator, ResponseBuilder
from .utils import compact_for_log, log_to_csv

manifest_bp = Blueprint('manifest', __name__)

@manifest_bp.route('/api/generate-diagram', methods=['POST'])
def generate_diagram():
    """Diagram generation from a Kubernetes manifest."""
    data = request.get_json()
    manifest_content = data.get('manifest', '')
    output_format = (data.get('outputFormat') or 'png').lower()
    extra_args = data.get('extraArgs', '')
    without_namespace = data.get('withoutNamespace', False)

    # Log to CSV only
    client_ip = request.remote_addr
    route = request.path
    params = (
        f"format={output_format};"
        f"extraArgs={compact_for_log(extra_args)};"
        f"withoutNamespace={without_namespace};"
        f"manifest={compact_for_log(manifest_content)}"
    )
    log_to_csv(client_ip, route, params)

    # Manifest validation
    is_valid, error_msg = InputValidator.validate_manifest(manifest_content)
    if not is_valid:
        return ResponseBuilder.validation_error("manifest", error_msg)

    # Verify it doesn't look like a Helmfile
    if InputValidator.looks_like_helmfile(manifest_content):
        return ResponseBuilder.error(
            "This looks like a Helmfile. Please use the HelmFile tab for this content."
        )

    # Output format validation
    is_valid, error_msg = InputValidator.validate_output_format(output_format)
    if not is_valid:
        return ResponseBuilder.validation_error("outputFormat", error_msg)

    # Extra arguments validation
    is_valid, error_msg = InputValidator.validate_extra_args(extra_args)
    if not is_valid:
        return ResponseBuilder.validation_error("extraArgs", error_msg)

    # Generate diagram through service
    result = generate_from_manifest(
        manifest_content=manifest_content,
        output_format=output_format,
        extra_args=extra_args,
        without_namespace=without_namespace
    )

    # Returning the response
    return ResponseBuilder.from_diagram_result(result)
