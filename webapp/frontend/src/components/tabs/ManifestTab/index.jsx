/**
 * Manifest Tab Container
 * Main component that orchestrates Manifest diagram generation
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { looksLikeHelmfile } from '../../../utils/validators.js';
import { generateManifestDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useFileUpload } from '../../../hooks/useFileUpload.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import { useHistorySync } from '../../../hooks/useHistorySync.js';
import { useScrollToOutput } from '../../../hooks/useScrollToOutput.js';
import ManifestInput from './ManifestInput.jsx';
import ManifestOutput from './ManifestOutput.jsx';
// import ProgressBar from '../../common/ProgressBar.jsx'; // Temporarily disabled

function ManifestTab({ historyContext }) {
  // Input states
  const [manifestContent, setManifestContent] = useState('');
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

  // Auto-scroll to output when diagram is ready
  const outputRef = useScrollToOutput(progressStep);

  // File upload handler
  const { createFileInputHandler } = useFileUpload();

  useHistorySync({
    diagramType: 'manifest',
    historyContext,
    outputFormat,
    diagram,
    mimeType,
    filename,
    progressStep,
    restoreDiagram,
    buildInput: () => ({ manifest: manifestContent, outputFormat, extraArgs, withoutNamespace }),
    buildPreview: () => manifestContent.substring(0, 100),
    restoreInput: (input) => {
      setManifestContent(input.manifest || '');
      setExtraArgs(input.extraArgs || '');
      setWithoutNamespace(input.withoutNamespace || false);
    },
  });

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
        setOutputFormat={handleOutputFormatChange}
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

      <div ref={outputRef}>
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
    </div>
  );
}

ManifestTab.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default ManifestTab;
