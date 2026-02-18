"""Temporary file management."""
import os
import tempfile
from typing import Optional
from contextlib import contextmanager

class FileManager:
    """Temporary file manager."""
    @staticmethod
    @contextmanager
    def create_temp_file(content: str, suffix: str = '.yaml', mode: str = 'w'):
        """
        Create a temporary file with the given content.
        Args:
            content: Content to be written in the file
            suffix: File suffix (extension)
            mode: File opening mode
        Yields:
            str: Temporary file path created
        """
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(mode=mode, delete=False, suffix=suffix) as f:
                if mode == 'w':
                    f.write(content)
                else:
                    f.write(content.encode('utf-8'))
                temp_file = f.name
            yield temp_file
        finally:
            if temp_file and os.path.exists(temp_file):
                try:
                    os.remove(temp_file)
                except OSError:
                    pass

    @staticmethod
    def cleanup_files(*file_paths: str) -> None:
        """
        Safely deletes the specified files.
        Args:
            *file_paths: Paths of the files to be deleted
        """
        for file_path in file_paths:
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except OSError:
                    pass

    @staticmethod
    def get_output_paths(base_path: str, output_format: str) -> tuple[str, str]:
        """
        Generates the output paths for a given format.
        Args:
            base_path: Base path (without extension)
            output_format: Requested output format
        Returns:
            tuple: (requested format_path, fallback png_path)
        """
        base_without_ext = os.path.splitext(base_path)[0]
        requested_output = f"{base_without_ext}.{output_format}"
        png_output = f"{base_without_ext}.png"
        return requested_output, png_output

    @staticmethod
    def find_output_file(requested_path: str, fallback_path: str) -> Optional[tuple[str, str]]:
        """
        Find the generated output file.
        Args:
            requested_path: File path in the requested format
            fallback_path: Fallback file path (PNG)
        Returns:
            tuple: (file_path, format) or None if no file found
        """
        if os.path.exists(requested_path):
            format_ext = os.path.splitext(requested_path)[1].lstrip('.')
            return requested_path, format_ext
        elif os.path.exists(fallback_path):
            return fallback_path, "png"
        return None

    @staticmethod
    def read_file_content(file_path: str, binary: bool = True) -> bytes | str:
        """
        Reads the contents of a file.
        Args:
            file_path: Path of the file to read
            binary: If True, reads in binary mode
        Returns:
            File content (bytes or str)
        """
        mode = "rb" if binary else "r"
        with open(file_path, mode) as f:
            return f.read()

    @staticmethod
    def get_base_name_from_path(file_path: str) -> str:
        """
        Extract the base name of a file path (without extension).
        Args:
            file_path: File path
        Returns:
            Base name without extension
        """
        return os.path.splitext(os.path.basename(file_path))[0]
