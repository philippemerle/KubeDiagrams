/**
 * Helm Tab Container
 * Main component that orchestrates Helm chart diagram generation
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isValidChartUrl } from '../../../utils/validators.js';
import { generateHelmDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import { useHistorySync } from '../../../hooks/useHistorySync.js';
import { useScrollToOutput } from '../../../hooks/useScrollToOutput.js';
import HelmInput from './HelmInput.jsx';
import HelmOutput from './HelmOutput.jsx';
// import ProgressBar from '../../common/ProgressBar.jsx'; // Temporarily disabled

function HelmTab({ historyContext }) {
  // Input states
  const [chartUrl, setChartUrl] = useState('');
  const [extraArgs, setExtraArgs] = useState('');
  const [inputError, setInputError] = useState('');

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
    errorMessage: backendError,
    isSubmitting,
    viewerKey,
    progressStep,
    handleSubmit: handleDiagramSubmit,
    setErrorMessage: setBackendError,
    restoreDiagram,
  } = useDiagramGeneration({
    apiFunction: generateHelmDiagram,
    validateInput: (params) => {
      if (!isValidChartUrl(params.chart)) {
        return 'Invalid chart URL. Expected format: https://<repo-host>/<path>/<chart-name> or oci://...';
      }
      return null;
    },
    diagramType: 'helm',
  });

  // dot_json viewer sync
  const { viewerRef, handleViewerLoad } = useViewerSync({ diagram, outputFormat });

  // Auto-scroll to output when diagram is ready
  const outputRef = useScrollToOutput(progressStep);

  useHistorySync({
    diagramType: 'helm',
    historyContext,
    outputFormat,
    diagram,
    mimeType,
    filename,
    progressStep,
    restoreDiagram,
    buildInput: () => ({ chart: chartUrl, outputFormat, extraArgs }),
    buildPreview: () => chartUrl,
    restoreInput: (input) => {
      setChartUrl(input.chart || '');
      setExtraArgs(input.extraArgs || '');
      setInputError(''); // Clear any validation errors
    },
  });

  // Validate chart URL on change
  useEffect(() => {
    if (chartUrl && chartUrl.trim()) {
      const isValid = isValidChartUrl(chartUrl);
      setInputError(
        isValid
          ? ''
          : 'Invalid chart URL. Expected format: https://<repo-host>/<path>/<chart-name> or oci://...'
      );
    } else {
      setInputError('');
    }
  }, [chartUrl]);

  const handleUrlChange = (e) => {
    const v = e.target.value;
    setChartUrl(v);
    setBackendError('');

    // Validate only if URL is not empty
    if (v && v.trim()) {
      setInputError(
        isValidChartUrl(v)
          ? ''
          : 'Invalid chart URL. Expected format: https://<repo-host>/<path>/<chart-name> or oci://...'
      );
    } else {
      setInputError('');
    }
  };

  const handleSubmit = () => {
    setInputError('');
    handleDiagramSubmit({
      chart: chartUrl.trim(),
      outputFormat,
      extraArgs,
    });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <HelmInput
        chartUrl={chartUrl}
        setChartUrl={setChartUrl}
        outputFormat={outputFormat}
        setOutputFormat={handleOutputFormatChange}
        extraArgs={extraArgs}
        setExtraArgs={setExtraArgs}
        inputError={inputError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onUrlChange={handleUrlChange}
      />

      {/* Progress Bar - Temporarily disabled */}
      {/* <ProgressBar
        currentStep={progressStep}
        isVisible={progressStep !== 'idle'}
      /> */}

      <div ref={outputRef}>
        <HelmOutput
          backendError={backendError}
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

HelmTab.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default HelmTab;
