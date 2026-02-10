/**
 * DiagramViewer Component
 * Universal component for rendering diagrams in all supported formats
 * Supports: DOT_JSON (interactive), PDF, DOT (code), SVG, PNG, JPG
 */

import { Code2, Copy } from 'lucide-react';
import PanZoomContainer from './PanZoomContainer.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { OUTPUT_FORMATS } from '../../utils/constants.js';

function DiagramViewer({
  diagram,
  outputFormat,
  mimeType,
  viewerKey,
  viewerRef,
  onViewerLoad,
  isLoading = false,
}) {
  // Show loading spinner while generating
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <LoadingSpinner size="lg" color="blue" text="Generating diagram..." />
      </div>
    );
  }

  if (!diagram) {
    return (
      <div className="flex items-center justify-center w-full h-48 text-gray-400">
        Generated diagram will appear here.
      </div>
    );
  }

  const ext = (outputFormat || '').toLowerCase();

  // DOT_JSON - Interactive viewer
  if (ext === OUTPUT_FORMATS.DOT_JSON) {
    return (
      <div className="w-full h-[70vh] border rounded overflow-hidden bg-white">
        <iframe
          key={viewerKey}
          ref={viewerRef}
          src="/interactive_viewer/index.html"
          title="KubeDiagrams Interactive Viewer"
          className="w-full h-full"
          onLoad={onViewerLoad}
        />
      </div>
    );
  }

  // PDF - Embedded viewer
  if (ext === OUTPUT_FORMATS.PDF) {
    return (
      <div className="w-full h-[82vh] border rounded overflow-hidden bg-white">
        <object
          data={`data:${mimeType};base64,${diagram}#zoom=page-fit&view=FitH`}
          type={mimeType}
          className="w-full h-full"
        >
          <p className="p-4 text-gray-600">Votre navigateur ne peut pas afficher le PDF ici.</p>
        </object>
      </div>
    );
  }

  // DOT - Source code viewer
  if (ext === OUTPUT_FORMATS.DOT) {
    return (
      <div className="w-full h-[70vh] bg-gray-900 rounded-md border overflow-hidden flex flex-col">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-green-400" />
            <span className="text-sm font-semibold text-gray-300">DOT Source Code (Graphviz)</span>
          </div>
          <button
            onClick={(e) => {
              navigator.clipboard.writeText(diagram);
              const btn = e.currentTarget;
              const originalText = btn.innerHTML;
              btn.innerHTML = '<span class="text-green-400">✓ Copied!</span>';
              setTimeout(() => {
                btn.innerHTML = originalText;
              }, 2000);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition flex items-center gap-1"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-sm text-gray-100 font-mono whitespace-pre">
            <code>{diagram}</code>
          </pre>
        </div>
        <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 text-xs text-gray-400">
          Tip: Use this DOT code with Graphviz tools (dot, neato, fdp, circo, twopi) or online
          visualizers like{' '}
          <a
            href="https://dreampuf.github.io/GraphvizOnline/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GraphvizOnline
          </a>
        </div>
      </div>
    );
  }

  // SVG/PNG/JPG/JPEG - Image viewer with pan & zoom
  return (
    <PanZoomContainer className="w-full h-[70vh] bg-gray-100 rounded-md border">
      {ext === OUTPUT_FORMATS.SVG ? (
        <div className="diagram-viewer" dangerouslySetInnerHTML={{ __html: diagram }} />
      ) : (
        <img
          src={`data:${mimeType};base64,${diagram}`}
          alt={`Generated ${outputFormat.toUpperCase()}`}
          className="block max-w-none"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      )}
    </PanZoomContainer>
  );
}

export default DiagramViewer;
