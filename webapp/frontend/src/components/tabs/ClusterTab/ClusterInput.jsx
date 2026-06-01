/**
 * Cluster Input Component
 * Handles cluster resource selection and diagram generation options
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Info, Server, RefreshCw, Layers } from 'lucide-react';
import { toast } from 'sonner';
import SubmitButton from '../../common/SubmitButton.jsx';
import ManifestOptions from '../../options/ManifestOptions';
import { getClusterNamespaces, getClusterResourceTypes } from '../../../services/diagramApi.js';

function ClusterInput({
  namespace,
  setNamespace,
  resourceTypes,
  setResourceTypes,
  allNamespaces,
  setAllNamespaces,
  outputFormat,
  setOutputFormat,
  extraArgs,
  setExtraArgs,
  withoutNamespace,
  setWithoutNamespace,
  errorMessage,
  setErrorMessage,
  isSubmitting,
  onSubmit,
}) {
  const [namespaces, setNamespaces] = useState([]);
  const [availableResourceTypes, setAvailableResourceTypes] = useState([]);
  const [loadingNamespaces, setLoadingNamespaces] = useState(false);
  const [loadingResourceTypes, setLoadingResourceTypes] = useState(false);

  // Fetch namespaces
  useEffect(() => {
    fetchNamespaces();
  }, []);

  // Fetch resource types when namespace changes
  useEffect(() => {
    if (namespace || allNamespaces) {
      fetchResourceTypes();
    }
  }, [namespace, allNamespaces]);

  const fetchNamespaces = async () => {
    setLoadingNamespaces(true);
    try {
      const response = await getClusterNamespaces();
      if (response.ok && response.data?.namespaces) {
        setNamespaces(response.data.namespaces);
      } else {
        const errorMsg = response.data?.error || 'Unknown error';

        if (
          errorMsg.includes('Unable to connect') ||
          errorMsg.includes('not running') ||
          errorMsg.includes('not accessible')
        ) {
          toast.error('Cluster not accessible', {
            description: errorMsg,
            duration: 10000,
            action: {
              label: 'Help',
              onClick: () => {
                // Could open a modal with troubleshooting steps
                alert(
                  'Please ensure your Kubernetes cluster is running:\n\n' +
                    '- For minikube: run "minikube start"\n' +
                    'Then refresh this page and try again.\n\n' +
                    'See TROUBLESHOOTING_CLUSTER.md for more details.'
                );
              },
            },
          });
        } else {
          toast.error('Failed to fetch namespaces', {
            description: errorMsg,
            duration: 8000,
          });
        }
      }
    } catch (error) {
      toast.error('Network error', {
        description: 'Could not connect to the backend. Please ensure the backend is running.',
        duration: 5000,
      });
    } finally {
      setLoadingNamespaces(false);
    }
  };

  const fetchResourceTypes = async () => {
    setLoadingResourceTypes(true);
    try {
      // Pass the current namespace to get resources specific to it
      const response = await getClusterResourceTypes(allNamespaces ? null : namespace);
      if (response.ok && response.data?.resourceTypes) {
        setAvailableResourceTypes(response.data.resourceTypes);
      } else {
        const errorMsg = response.data?.error || 'Unknown error';

        // Only show error if it's not a connection error (already shown for namespaces)
        if (!errorMsg.includes('Unable to connect') && !errorMsg.includes('not running')) {
          toast.error('Failed to fetch resource types', {
            description: errorMsg,
            duration: 5000,
          });
        }
      }
    } catch (error) {
      // Silent fail to avoid duplicate error toasts
      console.error('Failed to fetch resource types:', error);
    } finally {
      setLoadingResourceTypes(false);
    }
  };

  const handleResourceTypeToggle = (type) => {
    setResourceTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSelectAllCommon = () => {
    // Select all common resource types from the dynamic list
    const commonTypes = availableResourceTypes.filter((rt) => rt.isCommon).map((rt) => rt.name);
    setResourceTypes(commonTypes);
  };

  const handleClearSelection = () => {
    setResourceTypes([]);
  };

  const handleAllNamespacesToggle = (checked) => {
    setAllNamespaces(checked);
    if (checked) {
      setNamespace('');
    }
  };

  return (
    <div className="w-full flex flex-col bg-[var(--color-panel)] p-6 rounded-lg shadow-lg space-y-4">
      <div className="flex items-center gap-2">
        <Server className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Cluster Resources</h2>
      </div>

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
                onClick={fetchNamespaces}
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
              onChange={(e) => {
                setNamespace(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">
              <Layers className="inline w-4 h-4 mr-1" />
              Resource Types
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAllCommon}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Select Common
              </button>
              <span className="text-gray-500">|</span>
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
            {loadingResourceTypes ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">
                  Loading resource types
                  {namespace
                    ? ` for namespace "${namespace}"`
                    : allNamespaces
                      ? ' from all namespaces'
                      : ''}
                  ...
                </span>
              </div>
            ) : availableResourceTypes.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">
                  {!namespace && !allNamespaces
                    ? 'Please select a namespace first to load available resource types.'
                    : 'No resource types available. Please check your cluster connection.'}
                </p>
                {(namespace || allNamespaces) && (
                  <button
                    type="button"
                    onClick={fetchResourceTypes}
                    className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                  >
                    <RefreshCw className="inline w-3 h-3 mr-1" />
                    Retry
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Common Resource Types */}
                {availableResourceTypes.filter((rt) => rt.isCommon).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                      Common Resources
                      {namespace && (
                        <span className="text-gray-500 font-normal ml-1">({namespace})</span>
                      )}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableResourceTypes
                        .filter((rt) => rt.isCommon)
                        .map((rt) => (
                          <label
                            key={rt.name}
                            className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-gray-700 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={resourceTypes.includes(rt.name)}
                              onChange={() => handleResourceTypeToggle(rt.name)}
                              className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                            />
                            <span className="truncate" title={rt.name}>
                              {rt.name}
                              {rt.shortNames && rt.shortNames.length > 0 && (
                                <span className="text-xs text-gray-500 ml-1">
                                  ({rt.shortNames.join(', ')})
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

                {/* Other Resource Types */}
                {availableResourceTypes.filter((rt) => !rt.isCommon).length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                      Other Resources
                      {namespace && (
                        <span className="text-gray-500 font-normal ml-1">({namespace})</span>
                      )}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableResourceTypes
                        .filter((rt) => !rt.isCommon)
                        .map((rt) => (
                          <label
                            key={rt.name}
                            className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-gray-700 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={resourceTypes.includes(rt.name)}
                              onChange={() => handleResourceTypeToggle(rt.name)}
                              className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                            />
                            <span className="truncate" title={rt.name}>
                              {rt.name}
                              {rt.shortNames && rt.shortNames.length > 0 && (
                                <span className="text-xs text-gray-500 ml-1">
                                  ({rt.shortNames.join(', ')})
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Select resource types to include in the diagram. Leave empty for default selection.
            {(namespace || allNamespaces) && (
              <button
                type="button"
                onClick={fetchResourceTypes}
                className="text-blue-400 hover:text-blue-300 ml-2"
                disabled={loadingResourceTypes}
                title="Refresh resource types"
              >
                <RefreshCw
                  className={`inline w-3 h-3 ${loadingResourceTypes ? 'animate-spin' : ''}`}
                />
              </button>
            )}
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
        disabled={isSubmitting || (!allNamespaces && !namespace)}
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
                  <strong>Cluster not connected.</strong> Please start your Kubernetes cluster:
                  <br />- For minikube:{' '}
                  <code className="bg-gray-800 px-1 rounded">minikube start</code>
                  <br /> Then click the Refresh button above. See{' '}
                  <strong>TROUBLESHOOTING_CLUSTER.md</strong> for more help.
                </>
              ) : (
                <>
                  This will retrieve resources from your Kubernetes cluster using kubectl and
                  generate a diagram. Make sure you have proper cluster access configured via
                  kubeconfig.
                </>
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

ClusterInput.propTypes = {
  namespace: PropTypes.string.isRequired,
  setNamespace: PropTypes.func.isRequired,
  resourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  setResourceTypes: PropTypes.func.isRequired,
  allNamespaces: PropTypes.bool.isRequired,
  setAllNamespaces: PropTypes.func.isRequired,
  outputFormat: PropTypes.string.isRequired,
  setOutputFormat: PropTypes.func.isRequired,
  extraArgs: PropTypes.string.isRequired,
  setExtraArgs: PropTypes.func.isRequired,
  withoutNamespace: PropTypes.bool.isRequired,
  setWithoutNamespace: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ClusterInput;
