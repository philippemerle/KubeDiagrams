/**
 * Cluster Input Component
 * Stateless presentational component for cluster resource selection and diagram options.
 * All state and handlers are provided by ClusterTab/index.jsx via useClusterData.
 */

import PropTypes from 'prop-types';
import { Info, Server, RefreshCw, Layers, Search } from 'lucide-react';
import SubmitButton from '../../common/SubmitButton.jsx';
import ManifestOptions from '../../options/ManifestOptions';

function ClusterInput({
  // Input state (from ClusterTab/index.jsx)
  namespace,
  resourceTypes,
  allNamespaces,
  outputFormat,
  setOutputFormat,
  extraArgs,
  setExtraArgs,
  withoutNamespace,
  setWithoutNamespace,
  errorMessage,
  isSubmitting,
  onSubmit,
  // Cluster data (from useClusterData via index.jsx)
  currentContext,
  namespaces,
  availableResourceTypes,
  loadingNamespaces,
  loadingResourceTypes,
  resourceTypeSearch,
  setResourceTypeSearch,
  filteredResourceTypes,
  commonVisible,
  otherVisible,
  fetchContext,
  fetchNamespaces,
  handleRefreshResourceTypes,
  handleResourceTypeToggle,
  handleSelectCommon,
  handleSelectAll,
  handleClearSelection,
  handleAllNamespacesToggle,
  handleNamespaceChange,
}) {
  return (
    <div className="w-full flex flex-col bg-[var(--color-panel)] p-6 rounded-lg shadow-lg space-y-4">
      <div className="flex items-center gap-2">
        <Server className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Cluster Resources</h2>
      </div>

      {currentContext && (
        <p className="text-xs text-gray-400 -mt-2">
          Context:{' '}
          <code className="text-green-400 bg-gray-800 px-1.5 py-0.5 rounded">{currentContext}</code>
        </p>
      )}

      <div className="space-y-4">
        {/* All Namespaces Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allNamespaces"
            checked={allNamespaces}
            onChange={(e) => handleAllNamespacesToggle(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600"
          />
          <label htmlFor="allNamespaces" className="text-sm font-medium text-white">
            All Namespaces
          </label>
        </div>

        {/* Namespace Selection */}
        {!allNamespaces && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-white">Namespace</label>
              <button
                type="button"
                onClick={() => {
                  fetchNamespaces();
                  fetchContext();
                }}
                disabled={loadingNamespaces}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${loadingNamespaces ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            <select
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              value={namespace}
              onChange={(e) => handleNamespaceChange(e.target.value)}
              disabled={loadingNamespaces || namespaces.length === 0}
            >
              <option value="">
                {namespaces.length === 0
                  ? 'No namespaces available - check cluster connection'
                  : 'Select a namespace'}
              </option>
              {namespaces.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>
            {namespaces.length === 0 && !loadingNamespaces && (
              <p className="text-xs text-yellow-400 mt-1">
                No namespaces found. Please ensure your Kubernetes cluster is running (e.g.,{' '}
                <code className="bg-gray-800 px-1 rounded">minikube start</code>) and click the
                Refresh button.
              </p>
            )}
            {namespaces.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Select the namespace to retrieve resources from.
              </p>
            )}
          </div>
        )}

        {/* Resource Types Selection */}
        <div>
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-white">
                <Layers className="inline w-4 h-4 mr-1" />
                Resource Types
              </label>
              <button
                type="button"
                onClick={handleRefreshResourceTypes}
                disabled={loadingResourceTypes}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 disabled:opacity-40"
              >
                <RefreshCw className={`w-3 h-3 ${loadingResourceTypes ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <button
                type="button"
                onClick={handleSelectCommon}
                disabled={loadingResourceTypes || availableResourceTypes.length === 0}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-40"
              >
                Select Common
              </button>
              <span className="text-gray-500">|</span>
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={loadingResourceTypes || availableResourceTypes.length === 0}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-40"
              >
                Select All
              </button>
              <span className="text-gray-500">|</span>
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-red-400 hover:text-red-300"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Scope hint */}
          {availableResourceTypes.length > 0 && (
            <p className="text-xs text-gray-500 mb-2">
              {resourceTypeSearch
                ? `${filteredResourceTypes.length} of ${availableResourceTypes.length} types`
                : `${availableResourceTypes.length} types known by the cluster`}
              {namespace && !allNamespaces && !resourceTypeSearch && (
                <span>
                  {' '}
                  — resources tagged <span className="text-purple-400 font-medium">
                    cluster
                  </span>{' '}
                  are not bound to a namespace but can still be included (e.g. nodes for pod
                  placement).
                </span>
              )}
            </p>
          )}

          {availableResourceTypes.length > 0 && (
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={resourceTypeSearch}
                onChange={(e) => setResourceTypeSearch(e.target.value)}
                placeholder="Search resource types…"
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded bg-gray-700 text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
            {loadingResourceTypes ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">Loading resource types from cluster…</span>
              </div>
            ) : filteredResourceTypes.length === 0 && resourceTypeSearch ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">
                  No resource types match{' '}
                  <strong className="text-white">"{resourceTypeSearch}"</strong>.
                </p>
              </div>
            ) : availableResourceTypes.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">
                  No resource types available. Please check your cluster connection.
                </p>
                <button
                  type="button"
                  onClick={handleRefreshResourceTypes}
                  className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                >
                  <RefreshCw className="inline w-3 h-3 mr-1" />
                  Retry
                </button>
              </div>
            ) : (
              <>
                {commonVisible.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                      Common Resources
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {commonVisible.map((rt) => (
                        <ResourceTypeItem
                          key={rt.name}
                          rt={rt}
                          checked={resourceTypes.includes(rt.name)}
                          onToggle={handleResourceTypeToggle}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {otherVisible.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                      Other Resources
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {otherVisible.map((rt) => (
                        <ResourceTypeItem
                          key={rt.name}
                          rt={rt}
                          checked={resourceTypes.includes(rt.name)}
                          onToggle={handleResourceTypeToggle}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <p
            className={`text-xs mt-1 ${resourceTypes.length === 0 ? 'text-yellow-400' : 'text-gray-400'}`}
          >
            {resourceTypes.length > 0
              ? `${resourceTypes.length} type${resourceTypes.length > 1 ? 's' : ''} selected`
              : 'No types selected — please select at least one resource type.'}
          </p>
        </div>
      </div>

      <ManifestOptions
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        extraArgs={extraArgs}
        setExtraArgs={setExtraArgs}
        withoutNamespace={withoutNamespace}
        setWithoutNamespace={setWithoutNamespace}
      />

      <SubmitButton
        onClick={onSubmit}
        className="w-full mt-2"
        disabled={isSubmitting || (!allNamespaces && !namespace) || resourceTypes.length === 0}
      >
        {isSubmitting ? 'Generating…' : 'Generate Cluster Diagram'}
      </SubmitButton>

      {/* Help Message */}
      {!isSubmitting && (
        <div
          className={`border rounded-lg p-4 ${
            namespaces.length === 0
              ? 'bg-yellow-900/20 border-yellow-500/50'
              : 'bg-blue-900/30 border-blue-500/50'
          }`}
        >
          <p
            className={`text-sm flex items-start gap-2 ${
              namespaces.length === 0 ? 'text-yellow-300' : 'text-blue-300'
            }`}
          >
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {namespaces.length === 0 ? (
                <>
                  <strong>No cluster detected.</strong> Start your cluster, then click{' '}
                  <strong>Refresh</strong>:
                  <br />• minikube: <code className="bg-gray-800 px-1 rounded">minikube start</code>
                  <br />• kind:{' '}
                  <code className="bg-gray-800 px-1 rounded">kind create cluster</code>
                  <br />• k3d: <code className="bg-gray-800 px-1 rounded">k3d cluster create</code>
                  <br />
                  Make sure <code className="bg-gray-800 px-1 rounded">kubectl</code> is installed
                  and your kubeconfig points to the right context.
                </>
              ) : (
                <>
                  Retrieves resources from your cluster via kubectl and generates a diagram. Make
                  sure kubectl is configured with the correct context (
                  <code className="bg-gray-800 px-1 rounded">kubectl config current-context</code>
                  ).
                </>
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

function ResourceTypeItem({ rt, checked, onToggle }) {
  return (
    <label className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-gray-700 p-2 rounded">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(rt.name)}
        className="w-4 h-4 rounded bg-gray-700 border-gray-600 shrink-0"
      />
      <span className="flex items-center gap-1 min-w-0">
        <span className="truncate" title={rt.name}>
          {rt.name}
          {rt.shortNames?.length > 0 && (
            <span className="text-xs text-gray-500 ml-1">({rt.shortNames.join(', ')})</span>
          )}
        </span>
        {!rt.namespaced && (
          <span
            className="text-xs text-purple-400 shrink-0"
            title="Cluster-scoped — not bound to a single namespace"
          >
            cluster
          </span>
        )}
      </span>
    </label>
  );
}

ResourceTypeItem.propTypes = {
  rt: PropTypes.shape({
    name: PropTypes.string.isRequired,
    shortNames: PropTypes.arrayOf(PropTypes.string),
    namespaced: PropTypes.bool.isRequired,
  }).isRequired,
  checked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

ClusterInput.propTypes = {
  namespace: PropTypes.string.isRequired,
  resourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  allNamespaces: PropTypes.bool.isRequired,
  outputFormat: PropTypes.string.isRequired,
  setOutputFormat: PropTypes.func.isRequired,
  extraArgs: PropTypes.string.isRequired,
  setExtraArgs: PropTypes.func.isRequired,
  withoutNamespace: PropTypes.bool.isRequired,
  setWithoutNamespace: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  isSubmitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  currentContext: PropTypes.string.isRequired,
  namespaces: PropTypes.arrayOf(PropTypes.string).isRequired,
  availableResourceTypes: PropTypes.array.isRequired,
  loadingNamespaces: PropTypes.bool.isRequired,
  loadingResourceTypes: PropTypes.bool.isRequired,
  resourceTypeSearch: PropTypes.string.isRequired,
  setResourceTypeSearch: PropTypes.func.isRequired,
  filteredResourceTypes: PropTypes.array.isRequired,
  commonVisible: PropTypes.array.isRequired,
  otherVisible: PropTypes.array.isRequired,
  fetchContext: PropTypes.func.isRequired,
  fetchNamespaces: PropTypes.func.isRequired,
  handleRefreshResourceTypes: PropTypes.func.isRequired,
  handleResourceTypeToggle: PropTypes.func.isRequired,
  handleSelectCommon: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleClearSelection: PropTypes.func.isRequired,
  handleAllNamespacesToggle: PropTypes.func.isRequired,
  handleNamespaceChange: PropTypes.func.isRequired,
};

export default ClusterInput;
