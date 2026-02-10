"""Functions utils for routes."""
from constants import MAX_LOG_LENGTH


def compact_for_log(value: str, maxlen: int = MAX_LOG_LENGTH) -> str:
    """
    Compress a string for the logs (escape n/ r).

    Args:
        value: Value to be compressed
        maxlen: Maximum length

    Returns:
        str: Compacted String
    """
    if value is None:
        return ""
    s = str(value).replace("\n", "\\n").replace("\r", "\\r")
    if len(s) <= maxlen:
        return s
    return s[:maxlen] + f"...<+{len(s)-maxlen} chars>"


def log_to_csv(client_ip: str, route: str, params: str):
    """
    Legacy function kept for backward compatibility.

    Note: Logging is now handled centrally in app.py using Apache Combined Log Format
    which is compatible with GoAccess and other log analysis tools.

    Args:
        client_ip: Not used (IP obtained from request)
        route: Not used (obtained from request)
        params: Not used (logging is done in after_request)
    """
    # No-op: logging is handled by app.py after_request in Apache Combined Log Format
    pass
