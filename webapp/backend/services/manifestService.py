"""Service for generating diagrams from Kubernetes manifests."""
import subprocess

from constants import MIME_TYPES
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content


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
        
        try:
            # Command
            cmd = ["kube-diagrams", tmp_manifest, "-o", requested_output]
            if without_namespace:
                cmd.append("--without-namespace")
            if extra_args.strip():
                cmd.extend(parse_extra_args(extra_args))

            # Execution
            proc = subprocess.run(cmd, check=False, capture_output=True, text=True)
            stdout_output = proc.stdout or ""
            stderr_output = proc.stderr or ""

            # Error verification
            if proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output):
                FileManager.cleanup_files(requested_output, png_output)
                return DiagramResult(
                    success=False,
                    error="KubeDiagrams failed. See command output below.",
                    command=" ".join(cmd),
                    stdout=stdout_output,
                    stderr=stderr_output
                )

            # Output file verification
            output_info = FileManager.find_output_file(requested_output, png_output)
            if not output_info:
                return DiagramResult(
                    success=False,
                    error=f"Output file not found (looked for {requested_output} and {png_output}).",
                    command=" ".join(cmd),
                    stdout=stdout_output,
                    stderr=stderr_output
                )

            output_file, produced_format = output_info
            content = FileManager.read_file_content(output_file, binary=True)
            encoded = encode_content(content, produced_format)

            # Cleaning
            FileManager.cleanup_files(requested_output, png_output)

            return DiagramResult(
                success=True,
                diagram=encoded,
                mime_type=MIME_TYPES.get(produced_format, "application/octet-stream"),
                filename=f"{base_name}.{produced_format}",
                message="Diagram successfully generated.",
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

