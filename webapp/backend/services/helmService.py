"""Service for generating diagrams from Helm charts."""
import subprocess
import os
from urllib.parse import urlparse

from constants import MIME_TYPES
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content


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
    # Extraction du nom de base
    parsed = urlparse(chart_url)
    base_name = os.path.basename(parsed.path).replace(".tgz", "").replace(".tar.gz", "")
    
    # Pour les URLs OCI
    if chart_url.startswith('oci://'):
        base_name = chart_url.rstrip('/').split('/')[-1]

    requested_output = os.path.abspath(f"{base_name}.{output_format}")
    png_output = os.path.abspath(f"{base_name}.png")

    try:
        # Command uses helm-diagrams instead of helm
        cmd = ["helm-diagrams", chart_url, "-o", f"{base_name}.{output_format}"]
        if extra_args.strip():
            cmd.extend(parse_extra_args(extra_args))

        # Execution
        proc = subprocess.run(cmd, check=False, capture_output=True, text=True)
        stdout_output = proc.stdout or ""
        stderr_output = proc.stderr or ""

        # First we verify if there was an error before file exist
        has_error = proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output)
        
        # Second we verify if there was an error in the stderr output
        if "Error:" in stderr_output or "execution error" in stderr_output.lower():
            has_error = True

        if has_error:
            FileManager.cleanup_files(requested_output, png_output)
            
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
                command=" ".join(cmd),
                stdout=stdout_output,
                stderr=stderr_output
            )

        # Search for the output file
        output_info = FileManager.find_output_file(requested_output, png_output)
        if not output_info:
            return DiagramResult(
                success=False,
                error=f"Output file not found (looked for {os.path.basename(requested_output)} and {os.path.basename(png_output)}).",
                command=" ".join(cmd),
                stdout=stdout_output,
                stderr=stderr_output
            )

        output_file, produced_format = output_info

        note = ""
        if produced_format == "png" and output_format != "png":
            note = f"Requested format '{output_format}' is not available from helm-diagrams. Returned PNG instead."

        content = FileManager.read_file_content(output_file, binary=True)
        encoded = encode_content(content, produced_format)

        # Cleaning
        FileManager.cleanup_files(requested_output, png_output)

        message = (note + " " if note else "") + "Helm diagram successfully generated."

        return DiagramResult(
            success=True,
            diagram=encoded,
            mime_type=MIME_TYPES.get(produced_format, "application/octet-stream"),
            filename=f"{base_name}.{produced_format}",
            message=message.strip(),
            command=" ".join(cmd),
            stdout=stdout_output,
            stderr=stderr_output
        )

    except ValueError as e:
        FileManager.cleanup_files(requested_output, png_output)
        return DiagramResult(
            success=False,
            error=str(e),
            command=" ".join(cmd) if 'cmd' in locals() else None
        )
    except Exception as e:
        FileManager.cleanup_files(requested_output, png_output)
        return DiagramResult(
            success=False,
            error=f"Internal error: {e}",
            command=" ".join(cmd) if 'cmd' in locals() else None
        )

