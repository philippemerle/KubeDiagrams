import { useEffect, useRef } from 'react';

/**
 * @param {Object} config
 * @param {string} config.diagramType - History item type (manifest, helm, helmfile, cluster)
 * @param {Object} config.historyContext - { addToHistory, restoredItem, clearRestoredItem }
 * @param {string} config.outputFormat
 * @param {string} config.diagram
 * @param {string} config.mimeType
 * @param {string} config.filename
 * @param {string} config.progressStep
 * @param {Function} config.restoreDiagram - From useDiagramGeneration
 * @param {Function} config.buildInput - () => object, snapshot of the tab's current input fields
 * @param {Function} [config.buildPreview] - () => string, short preview text shown in the panel
 * @param {Function} config.restoreInput - (input: object) => void, applies restored input fields back to state
 */
export function useHistorySync({
  diagramType,
  historyContext,
  outputFormat,
  diagram,
  mimeType,
  filename,
  progressStep,
  restoreDiagram,
  buildInput,
  buildPreview,
  restoreInput,
}) {
  const lastHistoryIdRef = useRef(null);
  // Set right before restoreDiagram() sets diagram+progressStep to 'completed',
  // so the save effect below doesn't mistake a restore for a new generation
  // and re-save the same diagram as a near-duplicate entry.
  const isRestoringRef = useRef(false);

  // Save to history when a diagram is successfully generated
  useEffect(() => {
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }
    if (diagram && progressStep === 'completed' && historyContext) {
      const historyId = `${diagramType}-${Date.now()}`;

      // Avoid adding the same diagram multiple times
      if (lastHistoryIdRef.current === historyId) {
        return;
      }

      historyContext.addToHistory({
        id: historyId,
        type: diagramType,
        outputFormat,
        diagram,
        mimeType,
        filename,
        timestamp: new Date().toISOString(),
        preview: buildPreview ? buildPreview() : '',
        input: buildInput(),
      });
      lastHistoryIdRef.current = historyId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- minimal deps, avoids a save loop
  }, [diagram, progressStep]);

  // Restore from history
  useEffect(() => {
    if (historyContext?.restoredItem && historyContext.restoredItem.type === diagramType) {
      const item = historyContext.restoredItem;
      restoreInput(item.input || {});
      isRestoringRef.current = true;
      restoreDiagram(item);
      historyContext.clearRestoredItem();
    }
  }, [historyContext?.restoredItem, restoreDiagram]);
}
