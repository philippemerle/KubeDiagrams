/**
 * Validation utilities for Kubernetes resources
 */

/**
 * Validates if a string is a valid Helm chart URL
 * Supports both HTTP(S) and OCI protocols
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidChartUrl(url) {
  if (!url) return false;
  const trimmed = url.trim();

  // Validation OCI : must have at least 4 segments after oci://
  if (trimmed.startsWith('oci://')) {
    const ociPattern = /^oci:\/\/([^/]+)\/(.+)\/(.+)\/([^/]+)$/;
    return ociPattern.test(trimmed);
  }

  // Validation HTTP(S) : must be a valid Helm repository
  try {
    const parsedUrl = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return false;

    // Hostname must be a real domain (not just "hello" or "world")
    const hostname = parsedUrl.hostname;
    // Must contain a dot (TLD) except for localhost or an IP
    const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (!hostname.includes('.') && hostname !== 'localhost' && !isIP) {
      return false;
    }

    const pathname = parsedUrl.pathname || '';
    // Should not point to a .tgz or .tar.gz file
    if (/\.(tgz|tar\.gz)$/i.test(pathname)) return false;

    // Must have at least 1 segment in the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.length >= 1;
  } catch {
    return false;
  }
}

/**
 * Heuristic to detect if content looks like a Helmfile
 * @param {string} content - The content to check
 * @returns {boolean} - True if it looks like a Helmfile
 */
export function looksLikeHelmfile(content) {
  try {
    const normalized = (content || '').toLowerCase();
    return (
      /\n\s*releases\s*:/.test(normalized) ||
      /\n\s*repositories\s*:/.test(normalized) ||
      /\n\s*environments\s*:/.test(normalized)
    );
  } catch {
    return false;
  }
}

/**
 * Heuristic to detect if content looks like a Kubernetes manifest
 * @param {string} content - The content to check
 * @returns {boolean} - True if it looks like a manifest
 */
export function looksLikeManifest(content) {
  const hasApiVersion = /\bapiVersion\s*:\s*\S+/.test(content);
  const hasKind = /\bkind\s*:\s*\S+/.test(content);
  return hasApiVersion && hasKind;
}
