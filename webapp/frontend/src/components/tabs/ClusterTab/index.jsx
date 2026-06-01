/**
 * Cluster Tab Container
 * Main component that orchestrates live cluster diagram generation
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DEFAULTS } from '../../../utils/constants.js';
import { generateClusterDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import ClusterInput from './ClusterInput.jsx';
import ClusterOutput from './ClusterOutput.jsx';
import CommandDetails from '../../common/CommandDetails.jsx';

function ClusterTab({ historyContext }) {
  // Input states
  const [namespace, setNamespace] = useState('');
  const [resourceTypes, setResourceTypes] = useState([]);
  const [allNamespaces, setAllNamespaces] = useState(false);
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
    setErrorMessage,
    isSubmitting,
    viewerKey,
    progressStep,
    handleSubmit: generateDiagram,
    resetOutput,
  } = useDiagramGeneration({
    apiFunction: generateClusterDiagram,
    validateInput: (params) => {
      // Validation: either a namespace or allNamespaces must be selected
      if (!params.allNamespaces && !params.namespace) {
        return 'Please select a namespace or check "All Namespaces".';
      }
      return null;
    },
    diagramType: 'cluster',
  });

  // Track previous outputFormat to detect changes
  const prevOutputFormatRef = useRef(outputFormat);

  // Reset output when output format changes (not on initial render)
  useEffect(() => {
    if (prevOutputFormatRef.current !== outputFormat && diagram) {
      resetOutput();
    }
    prevOutputFormatRef.current = outputFormat;
  }, [outputFormat, diagram, resetOutput]);

  // Viewer synchronization hook for DOT_JSON format
  const { viewerRef, handleViewerLoad } = useViewerSync({
    diagram,
    outputFormat,
  });

  // Auto-scroll to output when diagram is ready

  // History restoration
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (historyContext?.restoredItem && !hasRestoredRef.current) {
      const item = historyContext.restoredItem;
      if (item.type === 'cluster') {
        setNamespace(item.input?.namespace || '');
        setResourceTypes(item.input?.resourceTypes || []);
        setAllNamespaces(item.input?.allNamespaces || false);
        setOutputFormat(item.outputFormat || DEFAULTS.OUTPUT_FORMAT);
        setExtraArgs(item.extraArgs || '');
        setWithoutNamespace(item.withoutNamespace || false);
        hasRestoredRef.current = true;
      }
    }
  }, [historyContext?.restoredItem]);

  // History tracking
  useEffect(() => {
    if (diagram && historyContext?.addToHistory) {
      historyContext.addToHistory({
        type: 'cluster',
        input: { namespace, resourceTypes, allNamespaces },
        outputFormat,
        extraArgs,
        withoutNamespace,
        result: {
          diagram,
          mimeType,
          filename,
          message,
          command,
          stdout,
          stderr,
        },
        timestamp: Date.now(),
      });
    }
  }, [diagram]);

  // Handle diagram generation with proper parameters
  const handleGenerate = useCallback(() => {
    generateDiagram({
      namespace,
      resourceTypes,
      allNamespaces,
      outputFormat,
      extraArgs,
      withoutNamespace,
    });
  }, [
    generateDiagram,
    namespace,
    resourceTypes,
    allNamespaces,
    outputFormat,
    extraArgs,
    withoutNamespace,
  ]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Input and Output Section */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Input Section  */}
        <div className="lg:w-1/4">
          <ClusterInput
            namespace={namespace}
            setNamespace={setNamespace}
            resourceTypes={resourceTypes}
            setResourceTypes={setResourceTypes}
            allNamespaces={allNamespaces}
            setAllNamespaces={setAllNamespaces}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            extraArgs={extraArgs}
            setExtraArgs={setExtraArgs}
            withoutNamespace={withoutNamespace}
            setWithoutNamespace={setWithoutNamespace}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            isSubmitting={isSubmitting}
            onSubmit={handleGenerate}
          />
        </div>

        {/* Output Section  */}
        <div className="lg:w-3/4">
          <ClusterOutput
            diagram={diagram}
            mimeType={mimeType}
            filename={filename}
            outputFormat={outputFormat}
            errorMessage={errorMessage}
            viewerKey={viewerKey}
            viewerRef={viewerRef}
            onViewerLoad={handleViewerLoad}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Command Details Section - Full width below */}
      {(command || stdout || stderr || message) && (
        <CommandDetails command={command} stdout={stdout} stderr={stderr} message={message} />
      )}
    </div>
  );
}

ClusterTab.propTypes = {
  historyContext: PropTypes.shape({
    restoredItem: PropTypes.object,
    addToHistory: PropTypes.func,
  }),
};

export default ClusterTab;
