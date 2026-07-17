import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  getClusterContexts,
  getClusterNamespaces,
  getClusterResourceTypes,
} from '../services/diagramApi.js';

/**
 * Manages cluster connectivity state: available kubectl contexts, namespaces,
 * resource types, and the selected context. Handles all fetch logic,
 * auto-selection, and resource-type selection handlers.
 *
 * @param {Object} params
 * @param {string[]} params.resourceTypes - Currently selected resource type names
 * @param {Function} params.setResourceTypes
 * @param {string} params.namespace - Currently selected namespace
 * @param {Function} params.setNamespace
 * @param {boolean} params.allNamespaces
 * @param {Function} params.setAllNamespaces
 * @param {Function} params.setErrorMessage - Called with '' when namespace changes
 */
export function useClusterData({
  resourceTypes,
  setResourceTypes,
  namespace,
  setNamespace,
  allNamespaces,
  setAllNamespaces,
  setErrorMessage,
}) {
  const [contexts, setContexts] = useState([]);
  const [selectedContext, setSelectedContext] = useState('');
  const [loadingContexts, setLoadingContexts] = useState(false);
  const [namespaces, setNamespaces] = useState([]);
  const [availableResourceTypes, setAvailableResourceTypes] = useState([]);
  const [loadingNamespaces, setLoadingNamespaces] = useState(false);
  const [loadingResourceTypes, setLoadingResourceTypes] = useState(false);
  const [resourceTypeSearch, setResourceTypeSearch] = useState('');
  const resourceTypesAutoSelectedRef = useRef(false);

  useEffect(() => {
    fetchContexts();
    fetchNamespaces();
    fetchResourceTypes();
  }, []);

  // Auto-select common resources the first time the list loads
  useEffect(() => {
    if (availableResourceTypes.length > 0 && !resourceTypesAutoSelectedRef.current) {
      resourceTypesAutoSelectedRef.current = true;
      if (resourceTypes.length === 0) {
        setResourceTypes(availableResourceTypes.filter((rt) => rt.isCommon).map((rt) => rt.name));
      }
    }
  }, [availableResourceTypes, resourceTypes, setResourceTypes]);

  const fetchContexts = async () => {
    setLoadingContexts(true);
    try {
      const response = await getClusterContexts();
      if (response.ok && response.data?.contexts) {
        setContexts(response.data.contexts);
        setSelectedContext((prev) => {
          if (prev && response.data.contexts.some((c) => c.name === prev)) return prev;
          const current = response.data.contexts.find((c) => c.current);
          return current?.name || response.data.contexts[0]?.name || '';
        });
      }
    } catch {
      // Silent — context list is informational, not blocking
    } finally {
      setLoadingContexts(false);
    }
  };

  const fetchNamespaces = async (contextOverride) => {
    const context = contextOverride !== undefined ? contextOverride : selectedContext;
    setLoadingNamespaces(true);
    try {
      const response = await getClusterNamespaces(context);
      if (response.ok && response.data?.namespaces) {
        setNamespaces(response.data.namespaces);
      } else {
        const errorMsg = response.data?.error || 'Unknown error';
        if (
          errorMsg.includes('Unable to connect') ||
          errorMsg.includes('not running') ||
          errorMsg.includes('not accessible') ||
          errorMsg.includes('timed out') ||
          errorMsg.includes('refused')
        ) {
          toast.error('Cluster not reachable', {
            description:
              'kubectl cannot connect to your cluster. ' +
              'Start it first (e.g. minikube start, kind create cluster, k3d cluster create) ' +
              'then click Refresh.',
            duration: 10000,
          });
        } else {
          toast.error('Failed to fetch namespaces', { description: errorMsg, duration: 8000 });
        }
      }
    } catch {
      toast.error('Network error', {
        description: 'Could not connect to the backend. Please ensure the backend is running.',
        duration: 5000,
      });
    } finally {
      setLoadingNamespaces(false);
    }
  };

  const fetchResourceTypes = async (contextOverride) => {
    const context = contextOverride !== undefined ? contextOverride : selectedContext;
    setLoadingResourceTypes(true);
    try {
      const response = await getClusterResourceTypes(context);
      if (response.ok && response.data?.resourceTypes) {
        setAvailableResourceTypes(response.data.resourceTypes);
      } else {
        const errorMsg = response.data?.error || 'Unknown error';
        // Suppress duplicate connectivity toasts — already shown by fetchNamespaces
        if (
          !errorMsg.includes('Unable to connect') &&
          !errorMsg.includes('not running') &&
          !errorMsg.includes('timed out')
        ) {
          toast.error('Failed to fetch resource types', { description: errorMsg, duration: 5000 });
        }
      }
    } catch {
      toast.error('Network error', {
        description: 'Could not reach the backend. Please ensure the backend is running.',
        duration: 5000,
      });
    } finally {
      setLoadingResourceTypes(false);
    }
  };

  const handleContextChange = (newContext) => {
    setSelectedContext(newContext);
    setNamespace('');
    setResourceTypes([]);
    resourceTypesAutoSelectedRef.current = false;
    fetchNamespaces(newContext);
    fetchResourceTypes(newContext);
  };

  const handleResourceTypeToggle = (type) => {
    setResourceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSelectCommon = () => {
    const commons = availableResourceTypes.filter((rt) => rt.isCommon);
    // With a specific namespace, default to namespaced commons only — cluster-scoped
    // resources (nodes, storageclasses…) can still be added manually.
    const selected = namespace && !allNamespaces ? commons.filter((rt) => rt.namespaced) : commons;
    setResourceTypes(selected.map((rt) => rt.name));
  };

  const handleSelectAll = () => {
    setResourceTypes(availableResourceTypes.map((rt) => rt.name));
  };

  const handleClearSelection = () => {
    setResourceTypes([]);
  };

  const handleRefreshResourceTypes = () => {
    setResourceTypeSearch('');
    fetchResourceTypes();
  };

  const handleAllNamespacesToggle = (checked) => {
    setAllNamespaces(checked);
    if (checked) {
      setNamespace('');
      // Restore cluster-scoped commons removed when switching to a specific namespace
      if (availableResourceTypes.length > 0) {
        const clusterScopedCommons = availableResourceTypes
          .filter((rt) => rt.isCommon && !rt.namespaced)
          .map((rt) => rt.name);
        setResourceTypes((prev) => {
          const existing = new Set(prev);
          const toAdd = clusterScopedCommons.filter((name) => !existing.has(name));
          return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
        });
      }
    }
  };

  const handleNamespaceChange = (newNamespace) => {
    setNamespace(newNamespace);
    if (setErrorMessage) setErrorMessage('');
    // Switching to a specific namespace: remove cluster-scoped resources from the current
    // selection — they are not bound to a namespace.
    if (newNamespace && availableResourceTypes.length > 0) {
      const namespacedNames = new Set(
        availableResourceTypes.filter((rt) => rt.namespaced).map((rt) => rt.name)
      );
      setResourceTypes((prev) => prev.filter((name) => namespacedNames.has(name)));
    }
  };

  // Derived display state
  const filteredResourceTypes = resourceTypeSearch
    ? availableResourceTypes.filter((rt) =>
        rt.name.toLowerCase().includes(resourceTypeSearch.toLowerCase())
      )
    : availableResourceTypes;

  const isNamespaceContext = Boolean(namespace && !allNamespaces);
  const commonVisible = filteredResourceTypes.filter(
    (rt) => rt.isCommon && (!isNamespaceContext || rt.namespaced)
  );
  const otherVisible = filteredResourceTypes
    .filter((rt) => !rt.isCommon || (isNamespaceContext && !rt.namespaced))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    // Data
    contexts,
    selectedContext,
    namespaces,
    availableResourceTypes,
    // Loading flags
    loadingContexts,
    loadingNamespaces,
    loadingResourceTypes,
    // Search / filtered views
    resourceTypeSearch,
    setResourceTypeSearch,
    filteredResourceTypes,
    commonVisible,
    otherVisible,
    // Fetch actions
    fetchContexts,
    fetchNamespaces,
    handleRefreshResourceTypes,
    // Selection handlers
    handleContextChange,
    handleResourceTypeToggle,
    handleSelectCommon,
    handleSelectAll,
    handleClearSelection,
    handleAllNamespacesToggle,
    handleNamespaceChange,
  };
}
