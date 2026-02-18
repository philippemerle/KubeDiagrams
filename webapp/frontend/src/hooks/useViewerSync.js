/**
 * Custom hook for synchronizing DOT_JSON data with the interactive viewer iframe
 * Handles postMessage communication between the app and the viewer
 */

import { useEffect, useRef } from 'react';
import { OUTPUT_FORMATS, VIEWER_MESSAGE_TYPES } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Hook to sync DOT_JSON diagram with interactive viewer
 * @param {Object} params - Hook parameters
 * @param {string} params.diagram - The diagram data (JSON string or object)
 * @param {string} params.outputFormat - Current output format
 * @returns {Object} - viewerRef and handleViewerLoad function
 */
export function useViewerSync({ diagram, outputFormat }) {
  const viewerRef = useRef(null);
  const lastSentJsonRef = useRef(null);

  // Send DOT_JSON to viewer when diagram changes
  useEffect(() => {
    if ((outputFormat || '').toLowerCase() !== OUTPUT_FORMATS.DOT_JSON) return;
    if (!diagram || !diagram.trim()) return;

    try {
      const json = typeof diagram === 'string' ? JSON.parse(diagram) : diagram;
      lastSentJsonRef.current = json;

      if (viewerRef.current?.contentWindow) {
        viewerRef.current.contentWindow.postMessage(
          { type: VIEWER_MESSAGE_TYPES.DOT_JSON, payload: json },
          window.origin
        );
        logger.debug('DOT_JSON sent to viewer', { hasPayload: !!json });
      }
    } catch (e) {
      logger.error('Invalid DOT_JSON content', { error: e, diagram: typeof diagram });
    }
  }, [diagram, outputFormat]);

  // Re-send data when viewer iframe loads/reloads
  const handleViewerLoad = () => {
    if ((outputFormat || '').toLowerCase() !== OUTPUT_FORMATS.DOT_JSON) return;
    if (!viewerRef.current || !lastSentJsonRef.current) return;

    try {
      viewerRef.current.contentWindow.postMessage(
        { type: VIEWER_MESSAGE_TYPES.DOT_JSON, payload: lastSentJsonRef.current },
        window.origin
      );
      logger.debug('DOT_JSON re-sent to viewer on load');
    } catch (e) {
      logger.error('Failed to postMessage DOT_JSON to viewer on load', { error: e });
    }
  };

  return {
    viewerRef,
    handleViewerLoad,
  };
}
