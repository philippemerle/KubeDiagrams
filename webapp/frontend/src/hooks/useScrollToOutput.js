import { useRef, useEffect } from 'react';

/**
 * Scrolls automatically to the output section when the diagram generation
 * completes (success or error), so the user doesn't have to scroll manually.
 *
 * @param {string} progressStep - Current step from useDiagramGeneration
 * @returns {React.RefObject} ref to attach to the output section wrapper
 */
export function useScrollToOutput(progressStep) {
  const outputRef = useRef(null);

  useEffect(() => {
    if ((progressStep === 'completed' || progressStep === 'error') && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [progressStep]);

  return outputRef;
}
