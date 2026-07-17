/**
 * Cluster Tab Container
 * Main component that orchestrates live cluster diagram generation
 */
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { generateClusterDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import { useHistorySync } from '../../../hooks/useHistorySync.js';
import { useClusterData } from '../../../hooks/useClusterData.js';
import { useScrollToOutput } from '../../../hooks/useScrollToOutput.js';
import ClusterInput from './ClusterInput.jsx';
import ClusterOutput from './ClusterOutput.jsx';
import CommandDetails from '../../common/CommandDetails.jsx';

function ClusterTab({ historyContext }) {
  // Input states
  const [namespace, setNamespace] = useState('');
  const [resourceTypes, setResourceTypes] = useState([]);
  const [allNamespaces, setAllNamespaces] = useState(false);
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
    setErrorMessage,
    isSubmitting,
    viewerKey,
    progressStep,
    handleSubmit: generateDiagram,
    restoreDiagram,
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

  // Viewer synchronization hook for DOT_JSON format
  const { viewerRef, handleViewerLoad } = useViewerSync({ diagram, outputFormat });

  // Cluster connectivity: contexts, namespaces, resource types, and all related handlers
  const {
    contexts,
    selectedContext,
    loadingContexts,
    namespaces,
    availableResourceTypes,
    loadingNamespaces,
    loadingResourceTypes,
    resourceTypeSearch,
    setResourceTypeSearch,
    filteredResourceTypes,
    commonVisible,
    otherVisible,
    fetchContexts,
    fetchNamespaces,
    handleRefreshResourceTypes,
    handleContextChange,
    handleResourceTypeToggle,
    handleSelectCommon,
    handleSelectAll,
    handleClearSelection,
    handleAllNamespacesToggle,
    handleNamespaceChange,
  } = useClusterData({
    resourceTypes,
    setResourceTypes,
    namespace,
    setNamespace,
    allNamespaces,
    setAllNamespaces,
    setErrorMessage,
  });

  // Auto-scroll to output when diagram is ready
  const outputRef = useScrollToOutput(progressStep);

  useHistorySync({
    diagramType: 'cluster',
    historyContext,
    outputFormat,
    diagram,
    mimeType,
    filename,
    progressStep,
    restoreDiagram,
    buildInput: () => ({
      namespace,
      resourceTypes,
      allNamespaces,
      extraArgs,
      withoutNamespace,
      context: selectedContext,
    }),
    buildPreview: () => (allNamespaces ? 'All namespaces' : namespace || 'No namespace selected'),
    restoreInput: (input) => {
      setNamespace(input.namespace || '');
      setResourceTypes(input.resourceTypes || []);
      setAllNamespaces(input.allNamespaces || false);
      setExtraArgs(input.extraArgs || '');
      setWithoutNamespace(input.withoutNamespace || false);
      if (input.context) handleContextChange(input.context);
    },
  });

  // Handle diagram generation with proper parameters
  const handleGenerate = useCallback(() => {
    generateDiagram({
      namespace,
      resourceTypes,
      allNamespaces,
      outputFormat,
      extraArgs,
      withoutNamespace,
      context: selectedContext,
    });
  }, [
    generateDiagram,
    namespace,
    resourceTypes,
    allNamespaces,
    outputFormat,
    extraArgs,
    selectedContext,
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
            resourceTypes={resourceTypes}
            allNamespaces={allNamespaces}
            outputFormat={outputFormat}
            setOutputFormat={handleOutputFormatChange}
            extraArgs={extraArgs}
            setExtraArgs={setExtraArgs}
            withoutNamespace={withoutNamespace}
            setWithoutNamespace={setWithoutNamespace}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onSubmit={handleGenerate}
            contexts={contexts}
            selectedContext={selectedContext}
            loadingContexts={loadingContexts}
            namespaces={namespaces}
            availableResourceTypes={availableResourceTypes}
            loadingNamespaces={loadingNamespaces}
            loadingResourceTypes={loadingResourceTypes}
            resourceTypeSearch={resourceTypeSearch}
            setResourceTypeSearch={setResourceTypeSearch}
            filteredResourceTypes={filteredResourceTypes}
            commonVisible={commonVisible}
            otherVisible={otherVisible}
            fetchContexts={fetchContexts}
            fetchNamespaces={fetchNamespaces}
            handleRefreshResourceTypes={handleRefreshResourceTypes}
            handleContextChange={handleContextChange}
            handleResourceTypeToggle={handleResourceTypeToggle}
            handleSelectCommon={handleSelectCommon}
            handleSelectAll={handleSelectAll}
            handleClearSelection={handleClearSelection}
            handleAllNamespacesToggle={handleAllNamespacesToggle}
            handleNamespaceChange={handleNamespaceChange}
          />
        </div>

        {/* Output Section  */}
        <div className="lg:w-3/4" ref={outputRef}>
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
        <CommandDetails
          command={command}
          stdout={stdout}
          stderr={stderr}
          message={message}
          titleClassName="text-white"
        />
      )}
    </div>
  );
}

ClusterTab.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default ClusterTab;
