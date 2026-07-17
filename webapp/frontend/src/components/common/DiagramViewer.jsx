/**
 * DiagramViewer Component
 * Universal component for rendering diagrams in all supported formats
 * Supports: DOT_JSON (interactive), PDF, DOT, SVG, PNG, JPG, DRAWIO
 */

import { useRef, useEffect } from 'react';
import mermaid from 'mermaid';
import PanZoomContainer from './PanZoomContainer.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { OUTPUT_FORMATS } from '../../utils/constants.js';
import { renderDotToSvg } from '../../services/diagramApi.js';
import { useSvgDiagramRenderer } from '../../hooks/useSvgDiagramRenderer.js';

// Mermaid configuration for consistent styling across the app
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: { edgeLabelBackground: '#4b5563', nodeTextColor: '#f9fafb' },
  // Default maxTextSize (50000) is too low for real cluster/namespace diagrams
  maxTextSize: 1000000,
  maxEdges: 2000,
});

let mermaidRenderId = 0;

let mermaidQueue = Promise.resolve();

function renderMermaid(content) {
  const id = `mermaid-diagram-${++mermaidRenderId}`;
  const task = mermaidQueue.then(() => mermaid.render(id, content));
  mermaidQueue = task.then(
    () => {},
    () => {}
  );
  return task;
}

/**
 * Embedded draw.io viewer using embed.diagrams.net with postMessage protocol.
 * When the iframe signals {event: "init"}, we send {action: "load", xml: content}.
 */
function DrawioViewer({ content }) {
  const iframeRef = useRef(null);
  const contentRef = useRef(content);

  // Keep ref in sync so the message handler always reads the latest content
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Listen for draw.io init event and send the XML content
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://embed.diagrams.net') return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'init') {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ action: 'load', xml: contentRef.current, fit: 1 }),
            'https://embed.diagrams.net'
          );
        }
      } catch {
        // ignore JSON parse errors from unrelated messages
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // When content changes on an already-loaded iframe, push the new diagram
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ action: 'load', xml: content, fit: 1 }),
        'https://embed.diagrams.net'
      );
    }
  }, [content]);

  return (
    <div className="w-full h-[82vh] border rounded overflow-hidden bg-white">
      <iframe
        ref={iframeRef}
        src="https://embed.diagrams.net/?embed=1&spin=1&proto=json&noSaveBtn=1&noExitBtn=1&libraries=1"
        title="KubeDiagrams Draw.io Viewer"
        className="w-full h-full"
        allowFullScreen
      />
    </div>
  );
}

function DiagramRenderError({ formatLabel, message }) {
  return (
    <div className="flex items-center justify-center w-full h-48 text-red-500 text-sm p-4 text-center">
      {formatLabel} rendering error: {message}
    </div>
  );
}

function SvgDiagramFrame({ containerRef, isRendering, loadingText }) {
  return (
    <div className="relative w-full h-[70vh]">
      <PanZoomContainer className="w-full h-full bg-white rounded-md border">
        <div ref={containerRef} className="diagram-viewer" />
      </PanZoomContainer>
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-md pointer-events-none">
          <LoadingSpinner size="lg" color="blue" text={loadingText} />
        </div>
      )}
    </div>
  );
}

function MermaidViewer({ content }) {
  const { containerRef, error } = useSvgDiagramRenderer(renderMermaid, content, {
    formatLabel: 'Mermaid',
  });

  if (error) {
    return <DiagramRenderError formatLabel="Mermaid" message={error} />;
  }

  return (
    <PanZoomContainer className="w-full h-[70vh] bg-white rounded-md border">
      <div ref={containerRef} className="diagram-viewer" />
    </PanZoomContainer>
  );
}

let d2InstancePromise = null;

let d2Queue = Promise.resolve();

function renderD2(content) {
  const task = d2Queue.then(async () => {
    if (!d2InstancePromise) {
      d2InstancePromise = import('@terrastruct/d2').then(({ D2 }) => new D2());
    }
    const d2 = await d2InstancePromise;
    const result = await d2.compile(content);
    const svg = await d2.render(result.diagram, result.renderOptions);
    return { svg };
  });
  // Keep the queue alive even if this task fails, so later renders aren't stuck
  d2Queue = task.then(
    () => {},
    () => {}
  );
  return task;
}

function D2Viewer({ content }) {
  const { containerRef, error, isRendering } = useSvgDiagramRenderer(renderD2, content, {
    formatLabel: 'D2',
    showSpinner: true,
  });

  if (error) {
    return <DiagramRenderError formatLabel="D2" message={error} />;
  }

  return (
    <SvgDiagramFrame
      containerRef={containerRef}
      isRendering={isRendering}
      loadingText="Rendering D2 diagram..."
    />
  );
}

/**
 * DotViewer Component
 */
async function renderDot(content) {
  const response = await renderDotToSvg(content);
  if (!response.ok || !response.data?.svg) {
    throw new Error(response.data?.error || 'Failed to render DOT diagram.');
  }
  return { svg: response.data.svg };
}

function DotViewer({ content }) {
  const { containerRef, error, isRendering } = useSvgDiagramRenderer(renderDot, content, {
    formatLabel: 'DOT',
    showSpinner: true,
  });

  if (error) {
    return <DiagramRenderError formatLabel="DOT" message={error} />;
  }

  return (
    <SvgDiagramFrame
      containerRef={containerRef}
      isRendering={isRendering}
      loadingText="Rendering DOT diagram..."
    />
  );
}

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

  // DRAWIO - Draw.io embedded viewer
  if (ext === OUTPUT_FORMATS.DRAWIO) {
    return <DrawioViewer key={viewerKey} content={diagram} />;
  }

  // MERMAID - Client-side rendered viewer
  if (ext === OUTPUT_FORMATS.MERMAID) {
    return <MermaidViewer key={viewerKey} content={diagram} />;
  }

  // D2 - Client-side rendered viewer
  if (ext === OUTPUT_FORMATS.D2) {
    return <D2Viewer key={viewerKey} content={diagram} />;
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

  // DOT - Server-rendered viewer (graphviz is already a mandatory backend
  // dependency, so rendering there avoids adding a client-side WASM lib for
  // yet another format)
  if (ext === OUTPUT_FORMATS.DOT) {
    return <DotViewer key={viewerKey} content={diagram} />;
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
