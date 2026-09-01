(function () {
  'use strict';

  const RESOURCE_CATEGORIES = {
      'Workloads': ['Pod', 'Deployment', 'ReplicaSet', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob', 'ReplicationController', 'PodTemplate'],
      'Networking': ['Service', 'Ingress', 'IngressClass', 'NetworkPolicy', 'Endpoints', 'EndpointSlice', 'NetworkAttachmentDefinition'],
      'Storage': ['PersistentVolumeClaim', 'PersistentVolume', 'StorageClass', 'CSIDriver', 'CSINode', 'CSIStorageCapacity', 'VolumeAttachment'],
      'Configuration': ['ConfigMap', 'Secret'],
      'Access Control': ['ServiceAccount', 'Role', 'RoleBinding', 'ClusterRole', 'ClusterRoleBinding', 'PodSecurityPolicy', 'User', 'Group'],
      'Cluster & Ops': ['Node', 'Namespace', 'Event', 'HorizontalPodAutoscaler', 'VerticalPodAutoscaler', 'LimitRange', 'ResourceQuota', 'PodDisruptionBudget', 'PriorityClass', 'RuntimeClass', 'Lease'],
      'Extensions': ['CustomResourceDefinition', 'APIService', 'MutatingWebhookConfiguration', 'ValidatingWebhookConfiguration']
  };

  window.IV = window.IV || {};
  window.IV.resourceData = { RESOURCE_CATEGORIES };
})();