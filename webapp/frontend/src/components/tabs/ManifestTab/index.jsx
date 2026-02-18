/**
 * Manifest Tab Container
 * Main component that orchestrates Manifest diagram generation
 */

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { DEFAULTS } from '../../../utils/constants.js';
import { looksLikeHelmfile } from '../../../utils/validators.js';
import { generateManifestDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useFileUpload } from '../../../hooks/useFileUpload.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import ManifestInput from './ManifestInput.jsx';
import ManifestOutput from './ManifestOutput.jsx';
// import ProgressBar from '../../common/ProgressBar.jsx'; // Temporarily disabled

function ManifestTab({ historyContext }) {
  // Input states
  const [manifestContent, setManifestContent] = useState('');
  const [outputFormat, setOutputFormat] = useState(DEFAULTS.OUTPUT_FORMAT);
  const [extraArgs, setExtraArgs] = useState('');
  const [withoutNamespace, setWithoutNamespace] = useState(false);

  // Diagram generation hook
  const {
    diagram,
    command,
    message,
    mimeType,
    filename,
    stdout,
    stderr,
    errorMessage,
    isSubmitting,
    viewerKey,
    progressStep,
    handleSubmit: handleDiagramSubmit,
    setErrorMessage,
    resetOutput,
    restoreDiagram,
  } = useDiagramGeneration({
    apiFunction: generateManifestDiagram,
    validateInput: () => {
      if (!manifestContent.trim()) {
        return 'Manifest content is required.';
      }
      if (looksLikeHelmfile(manifestContent)) {
        return 'This looks like a Helmfile. Please use the HelmFile tab for this content.';
      }
      return null;
    },
    diagramType: 'manifest',
  });

  // dot_json viewer sync
  const { viewerRef, handleViewerLoad } = useViewerSync({ diagram, outputFormat });

  // File upload handler
  const { createFileInputHandler } = useFileUpload();

  // Track previous outputFormat to detect changes
  const prevOutputFormatRef = useRef(outputFormat);
  const lastHistoryIdRef = useRef(null);

  // Reset output when output format changes (not on initial render)
  useEffect(() => {
    if (prevOutputFormatRef.current !== outputFormat && diagram) {
      resetOutput();
    }
    prevOutputFormatRef.current = outputFormat;
  }, [outputFormat, diagram, resetOutput]);

  // Save to history when diagram is successfully generated
  useEffect(() => {
    if (diagram && progressStep === 'completed' && historyContext) {
      const historyId = `manifest-${Date.now()}`;

      // Avoid adding the same diagram multiple times
      if (lastHistoryIdRef.current === historyId) {
        return;
      }

      const historyItem = {
        id: historyId,
        type: 'manifest',
        outputFormat,
        diagram,
        mimeType,
        filename,
        timestamp: new Date().toISOString(),
        preview: manifestContent.substring(0, 100),
        input: {
          manifest: manifestContent,
          outputFormat,
          extraArgs,
          withoutNamespace,
        },
      };

      historyContext.addToHistory(historyItem);
      lastHistoryIdRef.current = historyId;
    }
  }, [diagram, progressStep]); // Dépendances minimales pour éviter la boucle

  // Restore from history
  useEffect(() => {
    if (historyContext?.restoredItem && historyContext.restoredItem.type === 'manifest') {
      const item = historyContext.restoredItem;

      // Restore all input states
      setManifestContent(item.input.manifest);
      setOutputFormat(item.input.outputFormat);
      setExtraArgs(item.input.extraArgs || '');
      setWithoutNamespace(item.input.withoutNamespace || false);

      // Restore diagram output using the hook function
      restoreDiagram(item);

      // Clear the restored item
      historyContext.clearRestoredItem();
    }
  }, [historyContext?.restoredItem, restoreDiagram]);

  const handleSubmit = () => {
    handleDiagramSubmit({
      manifest: manifestContent,
      outputFormat,
      extraArgs,
      withoutNamespace,
    });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <ManifestInput
        manifestContent={manifestContent}
        setManifestContent={setManifestContent}
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        extraArgs={extraArgs}
        setExtraArgs={setExtraArgs}
        withoutNamespace={withoutNamespace}
        setWithoutNamespace={setWithoutNamespace}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onFileUpload={createFileInputHandler(setManifestContent, setErrorMessage)}
      />

      {/* Progress Bar - Temporarily disabled */}
      {/* <ProgressBar
        currentStep={progressStep}
        isVisible={progressStep !== 'idle'}
      /> */}

      <ManifestOutput
        errorMessage={errorMessage}
        diagram={diagram}
        outputFormat={outputFormat}
        mimeType={mimeType}
        filename={filename}
        command={command}
        stdout={stdout}
        stderr={stderr}
        message={message}
        viewerKey={viewerKey}
        viewerRef={viewerRef}
        onViewerLoad={handleViewerLoad}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

ManifestTab.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    getHistoryItem: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default ManifestTab;
