/**
 * Custom hook for diagram generation logic
 * Centralizes the common state management and submission flow for all diagram types
 */

import { useState, useCallback } from 'react';
import { OUTPUT_FORMATS } from '../utils/constants.js';
import logger from '../utils/logger.js';
import { hasFatalErrors } from '../services/diagramApi.js';
import toastUtil from '../utils/toast.js';

/**
 * Hook to manage diagram generation state and logic
 * @param {Object} config - Hook configuration
 * @param {Function} config.apiFunction - The API function to call (generateManifestDiagram, generateHelmDiagram, etc.)
 * @param {Function} config.validateInput - Optional validation function before submission
 * @param {string} config.diagramType - Type of diagram for logging (manifest, helm, helmfile)
 * @returns {Object} - State and handlers for diagram generation
 */
export function useDiagramGeneration({ apiFunction, validateInput, diagramType = 'diagram' }) {
  // Output states
  const [diagram, setDiagram] = useState('');
  const [command, setCommand] = useState('');
  const [message, setMessage] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [filename, setFilename] = useState('');
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');

  // Error and loading states
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Progress tracking
  const [progressStep, setProgressStep] = useState('idle'); // idle, parsing, validation, generation, rendering, completed, error

  // Viewer control
  const [viewerKey, setViewerKey] = useState(0);

  /**
   * Reset all output states
   */
  const resetOutput = useCallback(() => {
    setDiagram('');
    setCommand('');
    setMessage('');
    setMimeType('');
    setFilename('');
    setStdout('');
    setStderr('');
    setErrorMessage('');
    setProgressStep('idle');
  }, []);

  /**
   * Handle diagram generation submission
   * @param {Object} params - Parameters to pass to the API function
   * @param {Object} options - Additional options
   * @param {Function} options.onSuccess - Optional callback on success
   * @param {Function} options.onError - Optional callback on error
   */
  const handleSubmit = useCallback(
    async (params, options = {}) => {
      if (isSubmitting) {
        logger.debug('Submission already in progress, ignoring duplicate call');
        return;
      }

      setErrorMessage('');

      // Run custom validation if provided
      if (validateInput) {
        const validationError = validateInput(params);
        if (validationError) {
          resetOutput(); // Clear previous diagram/outputs
          setErrorMessage(validationError);
          toastUtil.error(validationError);
          logger.warn('Validation failed', { diagramType, error: validationError });
          if (options.onError) {
            options.onError(validationError);
          }
          return;
        }
      }

      resetOutput();
      setIsSubmitting(true);
      setProgressStep('parsing');

      try {
        logger.debug(`Generating ${diagramType} diagram`, { params });

        // Simulate parsing step
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgressStep('validation');

        // Simulate validation step
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgressStep('generation');

        const response = await apiFunction(params);

        // Move to rendering step
        setProgressStep('rendering');
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!response.ok) {
          const error = response.data?.error || 'Backend error while generating diagram.';
          setErrorMessage(error);
          setCommand(response.data?.command || '');
          setStdout(response.data?.stdout || '');
          setStderr(response.data?.stderr || '');
          setProgressStep('error');
          toastUtil.error(`Error: ${error}`);

          logger.warn(`${diagramType} generation failed`, {
            error,
            status: response.status,
          });

          if (options.onError) {
            options.onError(error);
          }
          return;
        }

        const data = response.data;
        const hasFatal = hasFatalErrors(data?.stdout, data?.stderr);

        if (hasFatal) {
          logger.warn(`${diagramType} has errors detected in output`, {
            stdout: data?.stdout?.substring(0, 200),
            stderr: data?.stderr?.substring(0, 200),
          });
          setErrorMessage('Diagram generated with errors. Check stderr for details.');
          setProgressStep('error');
          toastUtil.warning('Diagram generated with errors');
        } else {
          setProgressStep('completed');
          toastUtil.success('Diagram generated successfully');
        }

        // Set all output data
        setCommand(data.command || '');
        setDiagram(hasFatal ? '' : data.diagram || '');
        setMessage(data.message || '');
        setMimeType(data.mimeType || '');
        setFilename(data.filename || '');
        setStdout(data.stdout || '');
        setStderr(data.stderr || '');

        // Increment viewer key for DOT_JSON to force iframe reload
        if (!hasFatal && (params.outputFormat || '').toLowerCase() === OUTPUT_FORMATS.DOT_JSON) {
          setViewerKey((k) => k + 1);
        }

        logger.info(`${diagramType} diagram generated successfully`, {
          outputFormat: params.outputFormat,
          filename: data.filename,
          hasDiagram: !!data.diagram,
        });

        if (options.onSuccess) {
          options.onSuccess(data);
        }
      } catch (err) {
        const error = 'Network or server error while generating the diagram.';
        logger.error(`Error generating ${diagramType} diagram`, {
          error: err,
          params,
        });
        setErrorMessage(error);
        setProgressStep('error');
        toastUtil.error('Network or server error');

        if (options.onError) {
          options.onError(error);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, apiFunction, validateInput, diagramType, resetOutput]
  );

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setErrorMessage('');
  }, []);

  /**
   * Restore diagram from history
   * @param {Object} historyItem - History item with diagram and metadata
   */
  const restoreDiagram = useCallback((historyItem) => {
    setDiagram(historyItem.diagram || '');
    setCommand('');
    setMessage(historyItem.message || '');
    setMimeType(historyItem.mimeType || '');
    setFilename(historyItem.filename || '');
    setStdout('');
    setStderr('');
    setErrorMessage('');
    setProgressStep('completed');
    setViewerKey((k) => k + 1); // Force iframe reload if needed
  }, []);

  return {
    // Output states
    diagram,
    command,
    message,
    mimeType,
    filename,
    stdout,
    stderr,

    // Control states
    errorMessage,
    isSubmitting,
    viewerKey,
    progressStep,

    // Actions
    handleSubmit,
    resetOutput,
    clearError,
    setErrorMessage,
    restoreDiagram,
  };
}
