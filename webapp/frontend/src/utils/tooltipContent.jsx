/**
 * Tooltip Content Definitions
 * Centralized place for all tooltip messages
 */

export const TOOLTIP_CONTENT = {
  // Output Formats
  outputFormat: {
    title: 'Output Format',
    description: 'Choose the diagram format to generate',
    formats: {
      png: 'PNG Image - Ideal for documents and presentations',
      svg: 'SVG Vector - Perfect quality at any scale',
      dot: 'DOT File - Graphviz text format for manual editing',
      dotjson: 'Interactive Viewer - Explore with zoom/pan/click',
    },
  },

  // Extra Arguments for Manifest/HelmFile (kube-diagrams)
  extraArgs: {
    title: 'Additional CLI Arguments',
    description: 'Advanced options to customize diagram generation (kube-diagrams)',
    examples: [
      '--embed-all-icons : Embed all icons into output',
      '-n, --namespace <name> : Visualize only resources in namespace',
      '-v, --verbose : Enable verbose output',
      '--without-namespace : Disable namespace cluster generation',
    ],
  },

  // Extra Arguments for Helm Chart (helm-diagrams)
  extraArgsHelm: {
    title: 'Additional CLI Arguments',
    description: 'Advanced options for Helm charts (helm-diagrams)',
    examples: [
      '--embed-all-icons : Embed all icons into output',
      '--include-crds : Include CRDs in templated output',
      '--set key=val : Set values (e.g., replicas=3)',
      '--values file.yaml : Specify values file',
      '--version 1.2.3 : Use specific chart version',
      '-g, --generate-name : Generate release name',
    ],
  },

  // Without Namespace
  withoutNamespace: {
    title: 'Without Namespace',
    description: 'Hide Kubernetes namespaces in the diagram for a simplified view',
    when: 'Useful when all objects are in the same namespace',
  },

  // Chart URL
  chartUrl: {
    title: 'Helm Chart URL',
    description: 'Full URL of the Helm chart to analyze',
    formats: [
      'HTTPS: https://charts.example.com/path/chart-name',
      'OCI: oci://registry.example.com/charts/chart-name',
    ],
    example: 'https://prometheus-community.github.io/helm-charts/prometheus',
  },

  // File Upload
  fileUpload: {
    title: 'Upload File',
    description: 'Import a YAML/YML file from your computer',
    formats: 'Accepted formats: .yaml, .yml',
  },

  // Submit Button
  submit: {
    title: 'Generate Diagram',
    description: 'Start diagram generation with current parameters',
    steps: 'Parsing → Validation → Generation → Rendering',
  },

  // Download Button
  download: {
    title: 'Download',
    description: 'Save the generated diagram to your computer',
  },

  // History Button
  history: {
    title: 'History',
    description: 'Access the 20 most recent generated diagrams',
    actions: 'Restore, delete, or clear history',
  },

  // Interactive Viewer
  viewer: {
    title: 'Interactive Viewer',
    description: 'Explore diagram with advanced features',
    features: ['Zoom and Pan', 'Click nodes for details', 'Measure distances', 'Customize styles'],
  },

  // Examples
  examples: {
    title: 'Examples',
    description: 'Load a pre-configured example to get started quickly',
  },
};

/**
 * Get tooltip content by key
 * @param {string} key - Dot-notation key (e.g., 'outputFormat.description')
 * @returns {string} - Tooltip content
 */
export function getTooltipContent(key) {
  const keys = key.split('.');
  let content = TOOLTIP_CONTENT;

  for (const k of keys) {
    content = content[k];
    if (!content) return '';
  }

  return content;
}

/**
 * Format output format tooltip
 * @param {string} format - Format name
 * @returns {JSX.Element}
 */
export function formatTooltip(format) {
  const formatKey = format.toLowerCase().replace('_', '');
  return (
    <div>
      <div className="font-semibold mb-1">{TOOLTIP_CONTENT.outputFormat.title}</div>
      <div className="text-xs text-slate-300">
        {TOOLTIP_CONTENT.outputFormat.formats[formatKey] || format}
      </div>
    </div>
  );
}

/**
 * Extra args tooltip for Manifest/HelmFile with examples (kube-diagrams)
 * @returns {JSX.Element}
 */
export function extraArgsTooltip() {
  return (
    <div className="min-w-[350px]">
      <div className="font-semibold mb-2">{TOOLTIP_CONTENT.extraArgs.title}</div>
      <div className="text-xs text-slate-300 mb-3">{TOOLTIP_CONTENT.extraArgs.description}</div>
      <div className="text-xs">
        <div className="font-medium mb-2">Examples:</div>
        <div className="grid grid-cols-1 gap-1">
          {TOOLTIP_CONTENT.extraArgs.examples.map((ex, i) => (
            <div key={i} className="text-slate-400 font-mono text-[10px]">
              • {ex}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Extra args tooltip for Helm Chart with examples (helm-diagrams)
 * @returns {JSX.Element}
 */
export function extraArgsHelmTooltip() {
  return (
    <div className="min-w-[380px]">
      <div className="font-semibold mb-2">{TOOLTIP_CONTENT.extraArgsHelm.title}</div>
      <div className="text-xs text-slate-300 mb-3">{TOOLTIP_CONTENT.extraArgsHelm.description}</div>
      <div className="text-xs">
        <div className="font-medium mb-2">Examples:</div>
        <div className="grid grid-cols-1 gap-1">
          {TOOLTIP_CONTENT.extraArgsHelm.examples.map((ex, i) => (
            <div key={i} className="text-slate-400 font-mono text-[10px]">
              • {ex}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Chart URL tooltip with format examples
 * @returns {JSX.Element}
 */
export function chartUrlTooltip() {
  return (
    <div className="min-w-[280px] max-w-[350px]">
      <div className="font-semibold mb-2">{TOOLTIP_CONTENT.chartUrl.title}</div>
      <div className="text-xs text-slate-300 mb-3">{TOOLTIP_CONTENT.chartUrl.description}</div>
      <div className="text-xs">
        <div className="font-medium mb-2">Formats:</div>
        {TOOLTIP_CONTENT.chartUrl.formats.map((format, i) => (
          <div key={i} className="text-slate-400 font-mono text-[10px] mb-1 break-words">
            • {format}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Output format tooltip
 * @returns {JSX.Element}
 */
export function outputFormatTooltip() {
  return (
    <div className="min-w-[240px] max-w-[300px]">
      <div className="text-xs text-slate-300 mb-2">Choose the diagram output format</div>
      <div className="text-[11px] space-y-0.5 text-slate-400">
        <div>
          <span className="font-medium text-slate-300">PNG:</span> Image file
        </div>
        <div>
          <span className="font-medium text-slate-300">SVG:</span> Vector, scalable
        </div>
        <div>
          <span className="font-medium text-slate-300">DOT:</span> Graphviz format
        </div>
        <div>
          <span className="font-medium text-slate-300">DOT_JSON:</span> Interactive
        </div>
      </div>
    </div>
  );
}

/**
 * Without namespace tooltip
 * @returns {JSX.Element}
 */
export function withoutNamespaceTooltip() {
  return (
    <div className="min-w-[260px]">
      <div className="text-xs text-slate-300">{TOOLTIP_CONTENT.withoutNamespace.description}</div>
    </div>
  );
}

export default TOOLTIP_CONTENT;
