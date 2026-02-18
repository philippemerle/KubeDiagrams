"""Route for diagram generation from Helmfiles."""
from flask import Blueprint, request

from routes.utils import log_to_csv
from services import generate_from_helmfile
from utils import InputValidator, ResponseBuilder
from .utils import compact_for_log

helmfile_bp = Blueprint('helmfile', __name__)

@helmfile_bp.route('/api/generate-helmfile-diagram', methods=['POST'])
def generate_helmfile_diagram():
    """Diagram generation from a Helmfile."""
    data = request.get_json()
    helmfile_content = data.get("content", "")
    output_format = (data.get("outputFormat") or "png").lower()
    extra_args = data.get("extraArgs", "").strip()
    without_namespace = data.get("withoutNamespace", False)

    # Log to CSV only
    client_ip = request.remote_addr
    route = request.path
    params = f"format={output_format};helmfile={compact_for_log(helmfile_content)};extraArgs={compact_for_log(extra_args)};withoutNamespace={without_namespace}"
    log_to_csv(client_ip, route, params)

    # Helmfile validation
    is_valid, error_msg = InputValidator.validate_helmfile(helmfile_content)
    if not is_valid:
        return ResponseBuilder.validation_error("content", error_msg)

    # Verify it doesn't look like a Manifest
    if InputValidator.looks_like_manifest(helmfile_content):
        return ResponseBuilder.error(
            "This looks like a Manifest. Please use the Manifest tab for this content."
        )

    # Output format validation
    is_valid, error_msg = InputValidator.validate_output_format(output_format)
    if not is_valid:
        return ResponseBuilder.validation_error("outputFormat", error_msg)

    # Extra arguments validation
    is_valid, error_msg = InputValidator.validate_extra_args(extra_args)
    if not is_valid:
        return ResponseBuilder.validation_error("extraArgs", error_msg)

    # Diagram generation through service
    result = generate_from_helmfile(
        helmfile_content=helmfile_content,
        output_format=output_format,
        extra_args=extra_args,
        without_namespace=without_namespace
    )

    # Returning the response
    return ResponseBuilder.from_diagram_result(result)
