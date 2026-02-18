"""access logging for Flask application."""
import logging
from datetime import datetime
from flask import request, g
from typing import Optional
from config import Config

def is_valid_ip(ip: str) -> bool:
    """
    Check if the IP address is valid and not a placeholder.

    Args:
        ip: IP address string to validate

    Returns:
        bool: True if IP is valid, False otherwise
    """
    if not ip:
        return False

    ip = ip.strip()

    # List of invalid placeholder values (not real IPs)
    invalid_values = [
        '',
        '-',
        '(null)',
        'null',
        'None',
        'unknown',
    ]

    if ip.lower() in [v.lower() for v in invalid_values]:
        return False

    return True


def normalize_ip(ip: str) -> str:
    """
    Normalize IP address to IPv4 format when possible.
    Converts IPv6 localhost (::1) to IPv4 (127.0.0.1).

    Args:
        ip: IP address string

    Returns:
        str: Normalized IP address
    """
    if not ip:
        return '-'

    ip = ip.strip()

    # Convert IPv6 localhost to IPv4
    if ip == '::1':
        return '127.0.0.1'

    # Convert IPv6-mapped IPv4 addresses (::ffff:192.168.1.1 -> 192.168.1.1)
    if ip.startswith('::ffff:'):
        return ip[7:]

    return ip


def get_real_ip() -> str:
    """
    Get the real IP address of the client, handling proxies and load balancers.
    
    When using ProxyFix middleware (Config.BEHIND_PROXY=True), request.remote_addr
    is automatically set to the real client IP from X-Forwarded-For headers.

    For additional safety, we also check common proxy headers manually:
    1. X-Forwarded-For (most common with reverse proxies)
    2. X-Real-IP (nginx)
    3. CF-Connecting-IP (Cloudflare)
    4. True-Client-IP (Akamai and some CDNs)
    5. request.remote_addr (fallback / already fixed by ProxyFix)

    Returns:
        str: The real IP address of the client (normalized to IPv4 when possible)
    """
    # X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
    # The first one is the original client
    x_forwarded_for = request.headers.get('X-Forwarded-For')
    if x_forwarded_for:
        # Take the first IP in the chain (the original client)
        ip = x_forwarded_for.split(',')[0].strip()
        if is_valid_ip(ip):
            return normalize_ip(ip)

    # X-Real-IP is used by nginx
    x_real_ip = request.headers.get('X-Real-IP')
    if x_real_ip and is_valid_ip(x_real_ip):
        return normalize_ip(x_real_ip.strip())

    # Cloudflare specific header
    cf_connecting_ip = request.headers.get('CF-Connecting-IP')
    if cf_connecting_ip and is_valid_ip(cf_connecting_ip):
        return normalize_ip(cf_connecting_ip.strip())

    # Akamai and some CDNs
    true_client_ip = request.headers.get('True-Client-IP')
    if true_client_ip and is_valid_ip(true_client_ip):
        return normalize_ip(true_client_ip.strip())

    # X-Client-IP (some load balancers)
    x_client_ip = request.headers.get('X-Client-IP')
    if x_client_ip and is_valid_ip(x_client_ip):
        return normalize_ip(x_client_ip.strip())

    # Fallback to remote_addr (will be correct if ProxyFix is enabled)
    remote_addr = request.remote_addr
    if remote_addr and is_valid_ip(remote_addr):
        return normalize_ip(remote_addr)

    # Ultimate fallback
    return '-'


def get_all_ip_headers() -> dict:
    """
    Get all IP-related headers for debugging purposes.

    Returns:
        dict: Dictionary of all IP-related headers and their values
    """
    headers = {
        'remote_addr': request.remote_addr,
        'X-Forwarded-For': request.headers.get('X-Forwarded-For'),
        'X-Real-IP': request.headers.get('X-Real-IP'),
        'CF-Connecting-IP': request.headers.get('CF-Connecting-IP'),
        'True-Client-IP': request.headers.get('True-Client-IP'),
        'X-Client-IP': request.headers.get('X-Client-IP'),
        'X-Forwarded-Proto': request.headers.get('X-Forwarded-Proto'),
        'X-Forwarded-Host': request.headers.get('X-Forwarded-Host'),
    }
    return {k: v for k, v in headers.items() if v is not None}


def get_user_agent() -> str:
    """
    Get the User-Agent header.
    
    Returns:
        str: User-Agent string or '-' if not present
    """
    return request.headers.get('User-Agent', '-')


def get_referer() -> str:
    """
    Get the Referer header.
    
    Returns:
        str: Referer URL or '-' if not present
    """
    return request.headers.get('Referer', '-')


def format_apache_log(
    ip: str,
    method: str,
    path: str,
    protocol: str,
    status_code: int,
    response_size: int,
    referer: str,
    user_agent: str,
    request_time: Optional[float] = None
) -> str:
    """
    Format log entry in Apache Combined Log Format with additional info.
    
    Apache Combined Log Format:
    IP - - [datetime] "METHOD PATH PROTOCOL" STATUS SIZE "REFERER" "USER-AGENT"
    
    We add request time at the end for performance monitoring.
    
    Args:
        ip: Client IP address
        method: HTTP method (GET, POST, etc.)
        path: Request path
        protocol: HTTP protocol version
        status_code: HTTP status code
        response_size: Response size in bytes
        referer: Referer header
        user_agent: User-Agent header
        request_time: Request processing time in milliseconds (optional)
        
    Returns:
        str: Formatted log entry
    """
    # Format datetime in Apache format: [10/Oct/2000:13:55:36 +0000]
    now = datetime.now()
    timestamp = now.strftime('[%d/%b/%Y:%H:%M:%S +0000]')
    
    # Escape quotes in referer and user-agent
    referer = referer.replace('"', '\\"')
    user_agent = user_agent.replace('"', '\\"')
    
    # Format: IP - - [datetime] "METHOD PATH PROTOCOL" STATUS SIZE "REFERER" "USER-AGENT"
    log_line = (
        f'{ip} - - {timestamp} '
        f'"{method} {path} {protocol}" '
        f'{status_code} {response_size} '
        f'"{referer}" "{user_agent}"'
    )
    
    # Add request time if available
    if request_time is not None:
        log_line += f' {request_time:.2f}ms'
    
    return log_line


def log_request(status_code: int, response_size: int = 0):
    """
    Log an HTTP request in Apache Combined Log Format.
    
    Args:
        status_code: HTTP status code
        response_size: Response size in bytes (default: 0)
    """
    try:
        ip = get_real_ip()
        method = request.method
        path = request.path
        protocol = request.environ.get('SERVER_PROTOCOL', 'HTTP/1.1')
        referer = get_referer()
        user_agent = get_user_agent()
        
        # Calculate request time if available
        request_time = None
        if hasattr(g, 'request_start_time'):
            from time import time
            request_time = (time() - g.request_start_time) * 1000  # Convert to ms
        
        # Format and log
        log_line = format_apache_log(
            ip=ip,
            method=method,
            path=path,
            protocol=protocol,
            status_code=status_code,
            response_size=response_size,
            referer=referer,
            user_agent=user_agent,
            request_time=request_time
        )
        
        logger = logging.getLogger(Config.LOGGER_NAME)
        logger.info(log_line)
        
    except Exception as e:
        # Don't let logging errors break the application
        error_logger = logging.getLogger('app')
        error_logger.error(f"Error logging request: {e}")


def log_request_compact(status_code: int, params_summary: str = ""):
    """
    Log an HTTP request with a compact parameter summary (for backward compatibility).
    This can be used for detailed parameter logging alongside the Apache-style log.
    
    Args:
        status_code: HTTP status code
        params_summary: Compact summary of request parameters
    """
    try:
        ip = get_real_ip()
        path = request.path
        
        # Compact format: IP ; PATH ; PARAMS
        log_line = f"{ip} ; {path} ; {params_summary}"
        
        logger = logging.getLogger(Config.LOGGER_NAME)
        logger.info(log_line)
        
    except Exception as e:
        error_logger = logging.getLogger('app')
        error_logger.error(f"Error logging request: {e}")
