"""Service for generating diagrams from Helmfiles."""
import subprocess
import os

from constants import MIME_TYPES
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content

def generate_from_helmfile(
    helmfile_content: str,
    output_format: str = "png",
    extra_args: str = "",
    without_namespace: bool = False
) -> DiagramResult:
    """
    Generate a diagram from a Helmfile.

    Args:
        helmfile_content: Contents of the Helmfile
        output_format: Output format
        extra_args: Additional arguments
        without_namespace: Hide namespaces

    Returns:
        DiagramResult: Result of the generation
    """
    with FileManager.create_temp_file(helmfile_content, suffix=".yaml", mode='wb') as temp_helmfile_path:
        output_path = temp_helmfile_path + f".{output_format}"
        
        try:
            # Command helmfile template
            template_cmd = ["helmfile", "template", "-f", temp_helmfile_path]
            
            template_proc = subprocess.Popen(
                template_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            helm_output, helm_err = template_proc.communicate()

            if template_proc.returncode != 0 or has_fatal_error("", helm_err):
                FileManager.cleanup_files(output_path)
                return DiagramResult(
                    success=False,
                    error="Helmfile template failed. See command output below.",
                    command=" ".join(template_cmd),
                    stdout="",
                    stderr=helm_err or ""
                )

            # Command kube-diagrams
            cmd = ["kube-diagrams", "-", "-o", output_path]
            if without_namespace:
                cmd.append("--without-namespace")
            if extra_args.strip():
                cmd.extend(parse_extra_args(extra_args))

            kube_proc = subprocess.run(
                cmd,
                input=helm_output,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            stdout_output = kube_proc.stdout or ""
            stderr_output = kube_proc.stderr or ""

            if kube_proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output):
                FileManager.cleanup_files(output_path)
                return DiagramResult(
                    success=False,
                    error="kube-diagrams failed",
                    command=f"{' '.join(template_cmd)} | {' '.join(cmd)}",
                    stdout=stdout_output,
                    stderr=stderr_output
                )

            if not os.path.exists(output_path):
                return DiagramResult(
                    success=False,
                    error=f"Output file not found: {output_path}",
                    command=f"{' '.join(template_cmd)} | {' '.join(cmd)}",
                    stdout=stdout_output,
                    stderr=stderr_output
                )

            content = FileManager.read_file_content(output_path, binary=True)
            encoded = encode_content(content, output_format)

            # Cleaning
            FileManager.cleanup_files(output_path)

            return DiagramResult(
                success=True,
                diagram=encoded,
                mime_type=MIME_TYPES.get(output_format, "application/octet-stream"),
                filename=f"helmfile-diagram.{output_format}",
                message="Helmfile diagram successfully generated.",
                command=f"{' '.join(template_cmd)} | {' '.join(cmd)}",
                stdout=stdout_output,
                stderr=stderr_output
            )

        except ValueError as e:
            FileManager.cleanup_files(output_path)
            return DiagramResult(
                success=False,
                error=str(e),
                command=" ".join(cmd) if 'cmd' in locals() else None
            )
        except Exception as e:
            FileManager.cleanup_files(output_path)
            return DiagramResult(
                success=False,
                error=str(e),
                command=" ".join(cmd) if 'cmd' in locals() else None
            )