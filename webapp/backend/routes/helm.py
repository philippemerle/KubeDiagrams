"""Routes for generating diagrams from Helm charts."""
from flask import Blueprint, request

from .utils import log_to_csv
from services import generate_from_helm
from utils import InputValidator, ResponseBuilder

helm_bp = Blueprint('helm', __name__)

@helm_bp.route('/api/generate-helm-diagram', methods=['POST'])
def generate_helm_diagram():
    """Generate a diagram from a Helm chart."""
    data = request.get_json()
    chart_url = data.get("chart", "")
    output_format = (data.get("outputFormat") or "png").lower()
    extra_args = data.get('extraArgs', '')

    # Log to CSV only
    client_ip = request.remote_addr
    route = request.path
    params = f"format={output_format};chartUrl={chart_url};extraArgs={extra_args}"
    log_to_csv(client_ip, route, params)

    # Chart URL validation
    is_valid, error_msg = InputValidator.validate_helm_chart_url(chart_url)
    if not is_valid:
        return ResponseBuilder.validation_error("chart", error_msg)

    # Output format validation
    is_valid, error_msg = InputValidator.validate_output_format(output_format)
    if not is_valid:
        return ResponseBuilder.validation_error("outputFormat", error_msg)

    # Extra arguments validation
    is_valid, error_msg = InputValidator.validate_extra_args(extra_args)
    if not is_valid:
        return ResponseBuilder.validation_error("extraArgs", error_msg)

    # Diagram generation through service
    result = generate_from_helm(
        chart_url=chart_url,
        output_format=output_format,
        extra_args=extra_args
    )

    # Returning the response
    return ResponseBuilder.from_diagram_result(result)


