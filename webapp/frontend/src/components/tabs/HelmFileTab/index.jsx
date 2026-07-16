/**
 * HelmFile Tab Container
 * Main component that orchestrates HelmFile diagram generation
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { looksLikeManifest } from '../../../utils/validators.js';
import { generateHelmfileDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useFileUpload } from '../../../hooks/useFileUpload.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import { useHistorySync } from '../../../hooks/useHistorySync.js';
import { useScrollToOutput } from '../../../hooks/useScrollToOutput.js';
import HelmFileInput from './HelmFileInput.jsx';
import HelmFileOutput from './HelmFileOutput.jsx';
import ProgressBar from '../../common/ProgressBar.jsx';

function HelmFileTab({ historyContext }) {
  // Input states
  const [helmfileContent, setHelmfileContent] = useState('');
  const [extraArgs, setExtraArgs] = useState('');
  const [withoutNamespace, setWithoutNamespace] = useState(false);

  // Diagram generation hook
  const {
    outputFormat,
    handleOutputFormatChange,
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

  // Auto-scroll to output when diagram is ready
  const outputRef = useScrollToOutput(progressStep);

  // File upload handler
  const { createFileInputHandler } = useFileUpload();

  useHistorySync({
    diagramType: 'helmfile',
    historyContext,
    outputFormat,
    diagram,
    mimeType,
    filename,
    progressStep,
    restoreDiagram,
    buildInput: () => ({ helmfile: helmfileContent, outputFormat, extraArgs, withoutNamespace }),
    buildPreview: () => helmfileContent.substring(0, 100),
    restoreInput: (input) => {
      setHelmfileContent(input.helmfile || '');
      setExtraArgs(input.extraArgs || '');
      setWithoutNamespace(input.withoutNamespace || false);
    },
  });

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
        setOutputFormat={handleOutputFormatChange}
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

      <div ref={outputRef}>
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
    </div>
  );
}

HelmFileTab.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default HelmFileTab;
