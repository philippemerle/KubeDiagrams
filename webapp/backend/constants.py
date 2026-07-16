"""Constants of the backend"""
import re

# Different formats of mime_types
MIME_TYPES = {
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "gif": "image/gif",
    "svg": "image/svg+xml",
    "pdf": "application/pdf",
    "dot": "text/vnd.graphviz",
    "dot_json": "application/json",
    "drawio": "application/xml",
    "mermaid": "text/vnd.mermaid",
    "d2": "text/vnd.d2"
}
# no binary format
TEXT_FORMATS = {"svg", "dot", "dot_json", "drawio", "mermaid", "d2"}
# Manifest_detector
MANIFEST_RE = re.compile(r'^\s*apiVersion\s*:\s*.+$', re.MULTILINE)
KIND_RE = re.compile(r'^\s*kind\s*:\s*.+$', re.MULTILINE)
# Max log length
MAX_LOG_LENGTH = 999999
# file extensions
YAML_EXTENSIONS = ['.yaml', '.yml']
TGZ_EXTENSIONS = ['.tgz', '.tar.gz']

# Allowlist of CLI flags accepted through the free-text "extra args" field, per
# underlying tool. -o/--output, -f/--format and -c/--config are excluded even
# though the tools support them: -o/-f are already managed by the app itself
# (allowing them would let a request override the computed output path/format),
# and -c/--config (plus helm's --values/--set-file) let the tool read an
# arbitrary local file path, which would be a local file disclosure primitive.
EXTRA_ARGS_ALLOWED_FLAGS = {
    "kube-diagrams": {
        "--embed-all-icons", "-v", "--verbose", "-n", "--namespace", "--without-namespace",
    },
    "kubectl-diagrams": {
        "--embed-all-icons", "--version",
    },
    "helm-diagrams": {
        "--set", "--set-string", "--set-json", "--set-literal",
        "-g", "--generate-name", "--include-crds", "-l", "--labels",
        "--name-template", "--version", "--embed-all-icons",
    },
}
