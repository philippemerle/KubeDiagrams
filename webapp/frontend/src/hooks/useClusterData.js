import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  getClusterContext,
  getClusterNamespaces,
  getClusterResourceTypes,
} from '../services/diagramApi.js';

/**
 * Manages cluster connectivity state: namespaces, resource types, and active context.
 * Handles all fetch logic, auto-selection, and resource-type selection handlers.
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
  const [currentContext, setCurrentContext] = useState('');
  const [namespaces, setNamespaces] = useState([]);
  const [availableResourceTypes, setAvailableResourceTypes] = useState([]);
  const [loadingNamespaces, setLoadingNamespaces] = useState(false);
  const [loadingResourceTypes, setLoadingResourceTypes] = useState(false);
  const [resourceTypeSearch, setResourceTypeSearch] = useState('');
  const resourceTypesAutoSelectedRef = useRef(false);

  useEffect(() => {
    fetchContext();
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

  const fetchContext = async () => {
    try {
      const response = await getClusterContext();
      if (response.ok && response.data?.context) {
        setCurrentContext(response.data.context);
      }
    } catch {
      // Silent — context is informational, not blocking
    }
  };

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

  const fetchResourceTypes = async () => {
    setLoadingResourceTypes(true);
    try {
      const response = await getClusterResourceTypes();
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

  const handleResourceTypeToggle = (type) => {
    setResourceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSelectCommon = () => {
    const commons = availableResourceTypes.filter((rt) => rt.isCommon);
    // With a specific namespace, default to namespaced commons only — cluster-scoped
    // resources (nodes, storageclasses…) can still be added manually.
    const selected =
      namespace && !allNamespaces ? commons.filter((rt) => rt.namespaced) : commons;
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
  const otherVisible = filteredResourceTypes.filter(
    (rt) => !rt.isCommon || (isNamespaceContext && !rt.namespaced)
  );

  return {
    // Data
    currentContext,
    namespaces,
    availableResourceTypes,
    // Loading flags
    loadingNamespaces,
    loadingResourceTypes,
    // Search / filtered views
    resourceTypeSearch,
    setResourceTypeSearch,
    filteredResourceTypes,
    commonVisible,
    otherVisible,
    // Fetch actions
    fetchContext,
    fetchNamespaces,
    handleRefreshResourceTypes,
    // Selection handlers
    handleResourceTypeToggle,
    handleSelectCommon,
    handleSelectAll,
    handleClearSelection,
    handleAllNamespacesToggle,
    handleNamespaceChange,
  };
}