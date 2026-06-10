"""Utilities for diagram generation services."""
import base64
import shlex

from constants import TEXT_FORMATS

def has_fatal_error(stdout_txt: str, stderr_txt: str) -> bool:
    """
    Check whether subprocess output contains a fatal error marker.

    Args:
        stdout_txt: Standard output text
        stderr_txt: Standard error text

    Returns:
        bool: True if a fatal error was detected
    """
    return ("error:" in (stdout_txt or "").lower()) or ("error:" in (stderr_txt or "").lower())


def parse_extra_args(extra_args: str) -> list[str]:
    """
    Parse a string of extra CLI arguments using shell-like tokenization.

    Args:
        extra_args: Space-separated argument string (may include quoted tokens)

    Returns:
        list[str]: Parsed argument tokens

    Raises:
        ValueError: If the argument string has invalid shell syntax
    """
    if not extra_args or not extra_args.strip():
        return []
    try:
        return shlex.split(extra_args.strip())
    except Exception as e:
        raise ValueError(f"Invalid extraArgs: {e}")


def encode_content(content: bytes, output_format: str) -> str:
    """
    Encode diagram content for JSON transport.

    Text-based formats (SVG, DOT, DOT_JSON, DRAWIO) are decoded as UTF-8.
    Binary formats (PNG, JPG, PDF) are base64-encoded.

    Args:
        content: Raw file content
        output_format: Output format string (e.g. 'png', 'svg')

    Returns:
        str: Encoded content ready for the API response
    """
    if output_format in TEXT_FORMATS:
        return content.decode("utf-8")
    return base64.b64encode(content).decode("utf-8")