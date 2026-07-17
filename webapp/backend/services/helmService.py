"""Service for generating diagrams from Helm charts."""
import subprocess
import os
import tempfile
import uuid
from urllib.parse import urlparse

from constants import MIME_TYPES
from utils import InputValidator, get_app_logger, log_unexpected_error
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content, dot_to_dot_json, get_safe_format_extension, redact_temp_paths

logger = get_app_logger(__name__)


def generate_from_helm(
    chart_url: str,
    output_format: str = "png",
    extra_args: str = ""
) -> DiagramResult:
    """
    Generate a diagram from a Helm chart.

    Args:
        chart_url: Helm chart URL
        output_format: Output format
        extra_args: Additional arguments

    Returns:
        DiagramResult: Result of the generation
    """
    safe_ext = get_safe_format_extension(output_format)

    if not InputValidator.is_valid_helm_url(chart_url):
        raise ValueError("Invalid Helm chart URL format.")

    # Friendly display name derived from the chart, sanitized. Used only for
    # the filename metadata returned to the client, never for a real path.
    parsed = urlparse(chart_url)
    display_name = os.path.basename(parsed.path).replace(".tgz", "").replace(".tar.gz", "")

    # OCI URLs use the last path segment as chart name
    if chart_url.startswith('oci://'):
        display_name = chart_url.rstrip('/').split('/')[-1]

    display_name = InputValidator.sanitize_filename(display_name) or "chart"

    # Actual server-side output path: fully random, no link to user input.
    output_base = os.path.join(tempfile.gettempdir(), f"helm-diagram-{uuid.uuid4().hex}")

    dot_output = f"{output_base}.dot" if output_format == "dot_json" else None
    requested_output = f"{output_base}.{safe_ext}"
    png_output = f"{output_base}.png"

    try:
        # Command uses helm-diagrams instead of helm
        cmd = ["helm-diagrams", chart_url, "-o", dot_output or requested_output]
        if extra_args.strip():
            cmd.extend(parse_extra_args(extra_args, "helm-diagrams"))

        # Run the command and capture output
        proc = subprocess.run(cmd, check=False, capture_output=True, text=True)
        stdout_output = proc.stdout or ""
        stderr_output = proc.stderr or ""

        has_error = proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output)
        
        # Second we verify if there was an error in the stderr output
        if "Error:" in stderr_output or "execution error" in stderr_output.lower():
            has_error = True

        if has_error:
            FileManager.cleanup_files(requested_output, png_output, dot_output)

            # logs for all errors
            error_details = []
            if "not found" in stderr_output.lower() or "404" in stderr_output:
                error_details.append("Chart not found. Please verify the repository URL and chart name.")
            if "could not download" in stderr_output.lower():
                error_details.append("Could not download the chart. Check the URL and your network connection.")
            if "authentication" in stderr_output.lower() or "unauthorized" in stderr_output.lower():
                error_details.append("Authentication required or access denied.")
            if "is not a valid chart repository" in stderr_output.lower():
                error_details.append("The URL is not a valid Helm chart repository.")
            if "repo not found" in stderr_output.lower():
                error_details.append("Repository not found. Make sure the URL points to a valid Helm repository.")
            if "execution error" in stderr_output.lower():
                error_details.append("Helm chart has configuration errors. Check the stderr output below for details.")
            if "you must provide" in stderr_output.lower():
                error_details.append("Missing required configuration values in the chart.")

            main_error = " ".join(error_details) if error_details else "helm-diagrams failed to generate the diagram."

            return DiagramResult(
                success=False,
                error=main_error,
                command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output),
                stdout=stdout_output,
                stderr=stderr_output
            )

        note = ""
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
            # Search for the output file
            output_info = FileManager.find_output_file(requested_output, png_output)
            if not output_info:
                return DiagramResult(
                    success=False,
                    error=f"Output file not found (looked for {os.path.basename(requested_output)} and {os.path.basename(png_output)}).",
                    command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output),
                    stdout=stdout_output,
                    stderr=stderr_output
                )
            output_file, produced_format = output_info
            if produced_format == "png" and output_format != "png":
                note = f"Requested format '{output_format}' is not available from helm-diagrams. Returned PNG instead."

        content = FileManager.read_file_content(output_file, binary=True)
        encoded = encode_content(content, produced_format)

        # Cleaning
        FileManager.cleanup_files(requested_output, png_output, dot_output)

        message = (note + " " if note else "") + "Helm diagram successfully generated."

        return DiagramResult(
            success=True,
            diagram=encoded,
            mime_type=MIME_TYPES.get(produced_format, "application/octet-stream"),
            filename=f"{display_name}.{produced_format}",
            message=message.strip(),
            command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output),
            stdout=stdout_output,
            stderr=stderr_output
        )

    except Exception:
        FileManager.cleanup_files(requested_output, png_output, dot_output)
        return DiagramResult(
            success=False,
            error=log_unexpected_error(logger, "generating diagram from Helm chart"),
            command=redact_temp_paths(" ".join(cmd), requested_output, png_output, dot_output) if 'cmd' in locals() else None
        )

