/**
 * DiagramViewer Component
 * Universal component for rendering diagrams in all supported formats
 * Supports: DOT_JSON (interactive), PDF, DOT, SVG, PNG, JPG, DRAWIO
 */

import { useRef, useState, useEffect } from 'react';
import mermaid from 'mermaid';
import PanZoomContainer from './PanZoomContainer.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { OUTPUT_FORMATS } from '../../utils/constants.js';
import { renderDotToSvg } from '../../services/diagramApi.js';

// Mermaid configuration for consistent styling across the app
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: { edgeLabelBackground: '#4b5563', nodeTextColor: '#f9fafb' },
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

function fixSvgIntrinsicSize(svgEl) {
  const viewBox = svgEl?.getAttribute('viewBox');
  if (!svgEl || !viewBox) return;
  const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
  svgEl.setAttribute('width', vbWidth);
  svgEl.setAttribute('height', vbHeight);
  svgEl.style.maxWidth = '';
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
      if (!event.origin.includes('diagrams.net')) return;
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

/**
MermaidViewer Component
Renders Mermaid diagrams using the mermaid library.
Handles errors and displays them in the UI. 
*/
function MermaidViewer({ content }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    renderMermaid(content)
      .then(({ svg, bindFunctions }) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
        fixSvgIntrinsicSize(containerRef.current.querySelector('svg'));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || 'Failed to render Mermaid diagram.');
      });

    return () => {
      cancelled = true;
    };
  }, [content]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-48 text-red-500 text-sm p-4 text-center">
        Mermaid rendering error: {error}
      </div>
    );
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
    return d2.render(result.diagram, result.renderOptions);
  });
  // Keep the queue alive even if this task fails, so later renders aren't stuck
  d2Queue = task.then(
    () => {},
    () => {}
  );
  return task;
}

function D2Viewer({ content }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    let cancelled = false;

    renderD2(content)
      .then((svg) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        fixSvgIntrinsicSize(containerRef.current.querySelector('svg'));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || 'Failed to render D2 diagram.');
      })
      .finally(() => {
        if (!cancelled) setIsRendering(false);
      });

    return () => {
      cancelled = true;
    };
  }, [content]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-48 text-red-500 text-sm p-4 text-center">
        D2 rendering error: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh]">
      <PanZoomContainer className="w-full h-full bg-white rounded-md border">
        <div ref={containerRef} className="diagram-viewer" />
      </PanZoomContainer>
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-md pointer-events-none">
          <LoadingSpinner size="lg" color="blue" text="Rendering D2 diagram..." />
        </div>
      )}
    </div>
  );
}

/**
DotViewer Component
*/
function DotViewer({ content }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    let cancelled = false;

    renderDotToSvg(content)
      .then((response) => {
        if (cancelled) return;
        if (!response.ok || !response.data?.svg) {
          setError(response.data?.error || 'Failed to render DOT diagram.');
          return;
        }
        if (!containerRef.current) return;
        containerRef.current.innerHTML = response.data.svg;
        fixSvgIntrinsicSize(containerRef.current.querySelector('svg'));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || 'Failed to render DOT diagram.');
      })
      .finally(() => {
        if (!cancelled) setIsRendering(false);
      });

    return () => {
      cancelled = true;
    };
  }, [content]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-48 text-red-500 text-sm p-4 text-center">
        DOT rendering error: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh]">
      <PanZoomContainer className="w-full h-full bg-white rounded-md border">
        <div ref={containerRef} className="diagram-viewer" />
      </PanZoomContainer>
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-md pointer-events-none">
          <LoadingSpinner size="lg" color="blue" text="Rendering DOT diagram..." />
        </div>
      )}
    </div>
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
