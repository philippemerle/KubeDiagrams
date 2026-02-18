"""Validation of user inputs."""
import re
from typing import Optional, Tuple
from constants import MANIFEST_RE, KIND_RE


class ValidationError(Exception):
    """Exception error validation."""
    pass


class InputValidator:
    """Validator for user inputs."""

    SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'pdf', 'dot', 'dot_json']

    # Valid Pattern for url
    HELM_URL_PATTERN = re.compile(
        r'^(https?://|oci://|file://|[a-zA-Z0-9\-_]+/[a-zA-Z0-9\-_]+)'
    )

    @classmethod
    def validate_manifest(cls, content: str) -> Tuple[bool, Optional[str]]:
        """
        Validate a Kubernetes manifest content.

        Args:
            content: Manifest content

        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        if not content or not content.strip():
            return False, "Manifest content cannot be empty."

        # Verify minimum length
        if len(content.strip()) < 10:
            return False, "Manifest content is too short."

        # Verify it looks like a manifest K8s
        if not cls.looks_like_manifest(content):
            return False, "Content does not appear to be a valid Kubernetes manifest (missing apiVersion or kind)."

        return True, None

    @classmethod
    def validate_helmfile(cls, content: str) -> Tuple[bool, Optional[str]]:
        """
        Validate a Helmfile content.

        Args:
            content: Content of a Helmfile

        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        if not content or not content.strip():
            return False, "Helmfile content cannot be empty."

        if len(content.strip()) < 10:
            return False, "Helmfile content is too short."

        # Verify it looks like a Helmfile
        if not cls.looks_like_helmfile(content):
            return False, "Content does not appear to be a valid Helmfile (missing typical Helmfile keys)."

        return True, None

    @classmethod
    def validate_helm_chart_url(cls, url: str) -> Tuple[bool, Optional[str]]:
        """
        Validate a Helm chart URL.

        Args:
            url: URL of the Helm chart

        Returns:
            Tuple[bool, Optional[str]]: (est_valide, message_erreur)
        """
        if not url or not url.strip():
            return False, "Chart URL cannot be empty."

        url = url.strip()

        # Verify the helm url pattern
        if not cls.HELM_URL_PATTERN.match(url):
            return False, "Invalid Helm chart URL format. Must start with http://, https://, oci://, file://, or be a chart reference."

        return True, None

    @classmethod
    def validate_output_format(cls, format_str: str) -> Tuple[bool, Optional[str]]:
        """
        Validate output format.

        Args:
            format_str: output format

        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        if not format_str:
            return False, "Output format cannot be empty."

        format_str = format_str.lower().strip()

        if format_str not in cls.SUPPORTED_FORMATS:
            return False, f"Unsupported output format '{format_str}'. Supported formats: {', '.join(cls.SUPPORTED_FORMATS)}"

        return True, None

    @classmethod
    def validate_extra_args(cls, args: str) -> Tuple[bool, Optional[str]]:
        """
        Validate extra args.

        Args:
            args: extra_args

        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        if not args or not args.strip():
            return True, None  # Les args vides sont valides

        dangerous_chars = [';', '&', '|', '`', '$', '(', ')']
        for char in dangerous_chars:
            if char in args:
                return False, f"Extra args contain dangerous character '{char}'"

        return True, None

    @staticmethod
    def looks_like_manifest(text: str) -> bool:
        """
        Heuristic to detect a Kubernetes manifest.

        Args:
            text: content that will be checked

        Returns:
            bool: True if it looks like a manifest
        """
        if not text:
            return False
        t = text.strip()
        return bool(MANIFEST_RE.search(t) and KIND_RE.search(t))

    @staticmethod
    def looks_like_helmfile(text: str) -> bool:
        """
        Heuristic to detect a HelmFile.

        Args:
            text: Content that will be checked.

        Returns:
            bool: True if it looks like a Helmfile
        """
        if not text:
            return False
        t = text.lower()
        helmfile_keys = ["\nreleases:", "\nrepositories:", "\nhelmdefaults:", "\nenvironments:", "\ntemplates:"]
        return any(key in t for key in helmfile_keys)

    # TODO: Not used yet
    @classmethod
    def sanitize_filename(cls, filename: str) -> str:
        """
        Clean a filename to make it safe.

        Args:
            filename: Filename to clean

        Returns:
            str: Filename cleaned
        """
        safe_filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
        # Length limit
        if len(safe_filename) > 255:
            safe_filename = safe_filename[:255]
        return safe_filename
