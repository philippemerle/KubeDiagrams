/**
 * Helm Tab Container
 * Main component that orchestrates Helm chart diagram generation
 */

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { DEFAULTS } from '../../../utils/constants.js';
import { isValidChartUrl } from '../../../utils/validators.js';
import { generateHelmDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import HelmInput from './HelmInput.jsx';
import HelmOutput from './HelmOutput.jsx';
// import ProgressBar from '../../common/ProgressBar.jsx'; // Temporarily disabled

function HelmTab({ historyContext }) {
  // Input states
  const [chartUrl, setChartUrl] = useState('');
  const [outputFormat, setOutputFormat] = useState(DEFAULTS.OUTPUT_FORMAT);
  const [extraArgs, setExtraArgs] = useState('');
  const [inputError, setInputError] = useState('');

  // Diagram generation hook
  const {
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
    resetOutput,
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
      const historyId = `helm-${Date.now()}`;

      // Avoid adding the same diagram multiple times
      if (lastHistoryIdRef.current === historyId) {
        return;
      }

      const historyItem = {
        id: historyId,
        type: 'helm',
        outputFormat,
        diagram,
        mimeType,
        filename,
        timestamp: new Date().toISOString(),
        preview: chartUrl,
        input: {
          chart: chartUrl,
          outputFormat,
          extraArgs,
        },
      };

      historyContext.addToHistory(historyItem);
      lastHistoryIdRef.current = historyId;
    }
  }, [diagram, progressStep]); // Dépendances minimales pour éviter la boucle

  // Restore from history
  useEffect(() => {
    if (historyContext?.restoredItem && historyContext.restoredItem.type === 'helm') {
      const item = historyContext.restoredItem;

      // Restore all input states
      setChartUrl(item.input.chart);
      setOutputFormat(item.input.outputFormat);
      setExtraArgs(item.input.extraArgs || '');
      setInputError(''); // Clear any validation errors

      // Restore diagram output
      restoreDiagram(item);

      // Clear the restored item
      historyContext.clearRestoredItem();
    }
  }, [historyContext?.restoredItem, restoreDiagram]);

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

    // Valider seulement si l'URL n'est pas vide
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
        setOutputFormat={setOutputFormat}
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
  );
}

HelmTab.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    getHistoryItem: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default HelmTab;
