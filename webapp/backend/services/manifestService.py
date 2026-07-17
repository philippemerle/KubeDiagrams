"""Service for generating diagrams from Kubernetes manifests."""
import os
import subprocess

from constants import MIME_TYPES
from utils import get_app_logger, log_unexpected_error
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content, dot_to_dot_json, redact_temp_paths

logger = get_app_logger(__name__)


def generate_from_manifest(
    manifest_content: str,
    output_format: str = "png",
    extra_args: str = "",
    without_namespace: bool = False
) -> DiagramResult:
    """
    Generate a diagram from a Kubernetes manifest.

    Args:
        manifest_content: Content of the manifest
        output_format: Output format (png, svg, etc.)
        extra_args: Additional arguments for kube-diagrams
        without_namespace: Hide namespaces

    Returns:
        DiagramResult: Result of the generation
    """
    with FileManager.create_temp_file(manifest_content, suffix='.yaml') as tmp_manifest:
        base_name = FileManager.get_base_name_from_path(tmp_manifest)

        requested_output, png_output = FileManager.get_output_paths(tmp_manifest, output_format)

        dot_output = requested_output.replace(".dot_json", ".dot") if output_format == "dot_json" else None

        try:
            # Command
            cmd = ["kube-diagrams", tmp_manifest, "-o", dot_output or requested_output]
            if without_namespace:
                cmd.append("--without-namespace")
            if extra_args.strip():
                cmd.extend(parse_extra_args(extra_args, "kube-diagrams"))

            # Execution
            proc = subprocess.run(cmd, check=False, capture_output=True, text=True)
            stdout_output = proc.stdout or ""
            stderr_output = proc.stderr or ""

            # Error verification
            if proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output):
                FileManager.cleanup_files(requested_output, png_output, dot_output)
                return DiagramResult(
                    success=False,
                    error="KubeDiagrams failed. See command output below.",
                    command=redact_temp_paths(" ".join(cmd), tmp_manifest, requested_output, png_output, dot_output),
                    stdout=stdout_output,
                    stderr=stderr_output
                )

            if output_format == "dot_json":
                if not os.path.exists(dot_output):
                    return DiagramResult(
                        success=False,
                        error=f"Output file not found: {os.path.basename(dot_output)}",
                        command=redact_temp_paths(" ".join(cmd), tmp_manifest, requested_output, png_output, dot_output),
                        stdout=stdout_output,
                        stderr=stderr_output
                    )
                if not dot_to_dot_json(dot_output, requested_output):
                    FileManager.cleanup_files(dot_output)
                    return DiagramResult(
                        success=False,
                        error="dot -Tjson conversion failed (is graphviz installed?).",
                        command=redact_temp_paths(" ".join(cmd), tmp_manifest, requested_output, png_output, dot_output),
                        stdout=stdout_output,
                        stderr=stderr_output
                    )
                output_file, produced_format = requested_output, "dot_json"
            else:
                # Output file verification
                output_info = FileManager.find_output_file(requested_output, png_output)
                if not output_info:
                    return DiagramResult(
                        success=False,
                        error=f"Output file not found (looked for {os.path.basename(requested_output)} and {os.path.basename(png_output)}).",
                        command=redact_temp_paths(" ".join(cmd), tmp_manifest, requested_output, png_output, dot_output),
                        stdout=stdout_output,
                        stderr=stderr_output
                    )
                output_file, produced_format = output_info

            content = FileManager.read_file_content(output_file, binary=True)
            encoded = encode_content(content, produced_format)

            # Cleaning
            FileManager.cleanup_files(requested_output, png_output, dot_output)

            return DiagramResult(
                success=True,
                diagram=encoded,
                mime_type=MIME_TYPES.get(produced_format, "application/octet-stream"),
                filename=f"{base_name}.{produced_format}",
                message="Diagram successfully generated.",
                command=redact_temp_paths(" ".join(cmd), tmp_manifest, requested_output, png_output, dot_output),
                stdout=stdout_output,
                stderr=stderr_output
            )

        except Exception:
            FileManager.cleanup_files(requested_output, png_output, dot_output)
            return DiagramResult(
                success=False,
                error=log_unexpected_error(logger, "generating diagram from manifest"),
                command=redact_temp_paths(" ".join(cmd), tmp_manifest, requested_output, png_output, dot_output) if 'cmd' in locals() else None
            )

