"""Constantes of the backend"""
import re
# Different format of mime_types
MIME_TYPES = {
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "gif": "image/gif",
    "svg": "image/svg+xml",
    "pdf": "application/pdf",
    "dot": "text/vnd.graphviz",
    "dot_json": "application/json"
}
# no binary format
TEXT_FORMATS = {"svg", "dot", "dot_json"}
# Manifest_detector
MANIFEST_RE = re.compile(r'^\s*apiVersion\s*:\s*.+$', re.MULTILINE)
KIND_RE = re.compile(r'^\s*kind\s*:\s*.+$', re.MULTILINE)
# Max log length
MAX_LOG_LENGTH = 999999
# file extensions
YAML_EXTENSIONS = ['.yaml', '.yml']
TGZ_EXTENSIONS = ['.tgz', '.tar.gz']
