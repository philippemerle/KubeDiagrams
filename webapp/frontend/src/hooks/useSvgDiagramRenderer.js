import { useEffect, useRef, useState } from 'react';

function fixSvgIntrinsicSize(svgEl) {
  const viewBox = svgEl?.getAttribute('viewBox');
  if (!svgEl || !viewBox) return;
  const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
  svgEl.setAttribute('width', vbWidth);
  svgEl.setAttribute('height', vbHeight);
  svgEl.style.maxWidth = '';
}

/**
 * @param {Function} renderFn - (content) => Promise<{ svg: string, bindFunctions?: Function }>
 * @param {string} content - Diagram source to render
 * @param {Object} [options]
 * @param {string} [options.formatLabel] - Used in the default error message (e.g. "D2")
 * @param {boolean} [options.showSpinner] - Whether to expose a loading state while rendering
 * @returns {{ containerRef: React.RefObject, error: string|null, isRendering: boolean }}
 */
export function useSvgDiagramRenderer(
  renderFn,
  content,
  { formatLabel = '', showSpinner = false } = {}
) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [isRendering, setIsRendering] = useState(showSpinner);

  useEffect(() => {
    let cancelled = false;

    renderFn(content)
      .then(({ svg, bindFunctions }) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
        fixSvgIntrinsicSize(containerRef.current.querySelector('svg'));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || `Failed to render ${formatLabel} diagram.`);
      })
      .finally(() => {
        if (!cancelled) setIsRendering(false);
      });

    return () => {
      cancelled = true;
    };
  }, [content]);

  return { containerRef, error, isRendering };
}
