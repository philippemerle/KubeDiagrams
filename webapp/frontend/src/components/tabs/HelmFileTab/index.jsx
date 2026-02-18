/**
 * HelmFile Tab Container
 * Main component that orchestrates HelmFile diagram generation
 */

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { DEFAULTS } from '../../../utils/constants.js';
import { looksLikeManifest } from '../../../utils/validators.js';
import { generateHelmfileDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useFileUpload } from '../../../hooks/useFileUpload.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import HelmFileInput from './HelmFileInput.jsx';
import HelmFileOutput from './HelmFileOutput.jsx';
import ProgressBar from '../../common/ProgressBar.jsx';

function HelmFileTab({ historyContext }) {
  // Input states
  const [helmfileContent, setHelmfileContent] = useState('');
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
    apiFunction: generateHelmfileDiagram,
    validateInput: () => {
      if (looksLikeManifest(helmfileContent)) {
        return 'This looks like a Manifest. Please use the Manifest tab for this content.';
      }
      return null;
    },
    diagramType: 'helmfile',
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
      const historyId = `helmfile-${Date.now()}`;

      // Avoid adding the same diagram multiple times
      if (lastHistoryIdRef.current === historyId) {
        return;
      }

      const historyItem = {
        id: historyId,
        type: 'helmfile',
        outputFormat,
        diagram,
        mimeType,
        filename,
        timestamp: new Date().toISOString(),
        preview: helmfileContent.substring(0, 100),
        input: {
          helmfile: helmfileContent,
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
    if (historyContext?.restoredItem && historyContext.restoredItem.type === 'helmfile') {
      const item = historyContext.restoredItem;

      // Restore all input states
      setHelmfileContent(item.input.helmfile);
      setOutputFormat(item.input.outputFormat);
      setExtraArgs(item.input.extraArgs || '');
      setWithoutNamespace(item.input.withoutNamespace || false);

      // Restore diagram output
      restoreDiagram(item);

      // Clear the restored item
      historyContext.clearRestoredItem();
    }
  }, [historyContext?.restoredItem, restoreDiagram]);

  const handleSubmit = () => {
    handleDiagramSubmit({
      helmfile: helmfileContent,
      outputFormat,
      extraArgs,
      withoutNamespace,
    });
  };

  return (
    <div className="flex w-full gap-6 flex-col">
      <HelmFileInput
        helmfileContent={helmfileContent}
        setHelmfileContent={setHelmfileContent}
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
        onFileUpload={createFileInputHandler(setHelmfileContent, setErrorMessage)}
      />

      {/* Progress Bar - Temporarily disabled */}
      {/* <ProgressBar
        currentStep={progressStep}
        isVisible={progressStep !== 'idle'}
      /> */}

      <HelmFileOutput
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

HelmFileTab.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    getHistoryItem: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default HelmFileTab;
