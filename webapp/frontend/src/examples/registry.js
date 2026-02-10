import { EXAMPLE_TYPES } from '../utils/constants.js';
import logger from '../utils/logger.js';

const MANIFEST_EXAMPLES = [
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'WordPress and MySQL with Persistent Volumes',
    filePath: '/examples/manifests/wordpress.yaml',
  },
  {
    id: 'cassandra',
    name: 'Cassandra',
    description: 'Apache Cassandra Cluster',
    filePath: '/examples/manifests/cassandra.yaml',
  },
  {
    id: 'redis-statefulset',
    name: 'Redis StatefulSet',
    description: 'Redis StatefulSet with persistent storage',
    filePath: '/examples/manifests/redis-statefulset.yaml',
  },
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    description: 'Frontend, backend and database with ConfigMap',
    filePath: '/examples/manifests/microservices.yaml',
  },
];

const HELM_CHART_EXAMPLES = [
  {
    id: 'kube-prometheus-stack',
    name: 'Kube Prometheus Stack',
    description: 'Monitoring and alerting toolkit',
    url: 'https://prometheus-community.github.io/helm-charts/kube-prometheus-stack',
  },
  {
    id: 'cert-manager',
    name: 'Cert-Manager',
    description: 'Certificate management for Kubernetes',
    url: 'https://charts.jetstack.io/cert-manager',
  },
  {
    id: 'nginx-ingress',
    name: 'NGINX Ingress Controller',
    description: 'Ingress controller for Kubernetes',
    url: 'https://kubernetes.github.io/ingress-nginx/ingress-nginx',
  },
  {
    id: 'argo-cd',
    name: 'Argo CD (OCI)',
    description: 'GitOps continuous delivery tool',
    url: 'oci://ghcr.io/argoproj/argo-helm/argo-cd',
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Leading tool for querying and visualizing time series and metrics',
    url: 'https://grafana.github.io/helm-charts/grafana',
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    description: 'Monitoring system and time series database',
    url: 'https://prometheus-community.github.io/helm-charts/prometheus',
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'Advanced key-value store',
    url: 'https://charts.bitnami.com/bitnami/redis',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Object-relational database',
    url: 'https://charts.bitnami.com/bitnami/postgresql',
  },
  {
    id: 'traefik',
    name: 'Traefik',
    description: 'Traefik based Kubernetes ingress controller',
    url: 'https://traefik.github.io/charts/traefik',
  },
  {
    id: 'kubernetes-dashboard',
    name: 'Kubernetes Dashboard',
    description: 'General-purpose web UI for Kubernetes clusters',
    url: 'https://kubernetes.github.io/dashboard/kubernetes-dashboard',
  },
  {
    id: 'metrics-server',
    name: 'Metrics Server',
    description:
      'Scalable, efficient source of container resource metrics for Kubernetes built-in autoscaling pipelines',
    url: 'https://kubernetes-sigs.github.io/metrics-server/metrics-server',
  },
  {
    id: 'vault',
    name: 'Vault',
    description: 'Official HashiCorp Vault Chart',
    url: 'https://helm.releases.hashicorp.com/vault',
  },
  {
    id: 'keycloak',
    name: 'Keycloak',
    description: 'High performance Java-based identity and access management solution',
    url: 'https://charts.bitnami.com/bitnami/keycloak',
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    description: 'Build great things at any scale!',
    url: 'https://charts.jenkins.io/jenkins',
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    description: 'General-purpose message broker',
    url: 'https://charts.bitnami.com/bitnami/rabbitmq',
  },
  {
    id: 'external-dns',
    name: 'ExternalDNS',
    description:
      'Configures public DNS servers with information about exposed Kubernetes services to make them discoverable',
    url: 'https://charts.bitnami.com/bitnami/external-dns',
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    description: 'Distributed streaming platform designed to build real-time pipelines',
    url: 'https://charts.bitnami.com/bitnami/kafka',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Fast, reliable, scalable, and easy to use open source relational database system',
    url: 'https://charts.bitnami.com/bitnami/mysql',
  },
  {
    id: 'external-secrets',
    name: 'External Secrets',
    description: 'External secrets management for Kubernetes',
    url: 'https://charts.external-secrets.io/external-secrets',
  },
  {
    id: 'gitlab-runner',
    name: 'GitLab Runner',
    description: 'GitLab Runner',
    url: 'http://charts.gitlab.io/gitlab-runner',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'GitLab - DevOps platform',
    url: 'http://charts.gitlab.io/gitlab',
    cliArgs: '--set certmanager-issuer.email=someone@acme.com',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Relational open source NoSQL database',
    url: 'https://charts.bitnami.com/bitnami/mongodb',
  },
  {
    id: 'external-dns-2',
    name: 'ExternalDNS',
    description: 'Synchronizes exposed Kubernetes Services and Ingresses with DNS providers',
    url: 'https://kubernetes-sigs.github.io/external-dns/external-dns',
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    description: 'Official Elastic helm chart for Elasticsearch',
    url: 'https://helm.elastic.co/elasticsearch',
  },
];

const HELMFILE_EXAMPLES = [
  {
    id: 'monitoring-stack',
    name: 'Monitoring Stack',
    description: 'Prometheus and Grafana monitoring setup',
    filePath: '/examples/helmfiles/monitoring-stack.yaml',
  },
];

const contentCache = new Map();

async function fetchFileContent(filePath) {
  if (contentCache.has(filePath)) {
    return contentCache.get(filePath);
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load example: ${response.statusText}`);
    }
    const content = await response.text();
    contentCache.set(filePath, content);

    return content;
  } catch (error) {
    logger.error(`Error loading example from ${filePath}`, { error, filePath });
    throw error;
  }
}

export function getExamplesByType(type) {
  switch (type) {
    case EXAMPLE_TYPES.MANIFEST:
      return MANIFEST_EXAMPLES;
    case EXAMPLE_TYPES.HELM_CHART:
      return HELM_CHART_EXAMPLES;
    case EXAMPLE_TYPES.HELMFILE:
      return HELMFILE_EXAMPLES;
    default:
      return [];
  }
}

export function getExampleById(type, id) {
  const examples = getExamplesByType(type);
  return examples.find((ex) => ex.id === id) || null;
}

export async function loadExampleContent(type, id) {
  const example = getExampleById(type, id);

  if (!example) {
    throw new Error(`Example not found: ${type}/${id}`);
  }

  // For HelmChart, we return an object with the URL and optional CLI args
  if (type === EXAMPLE_TYPES.HELM_CHART) {
    return {
      url: example.url,
      cliArgs: example.cliArgs || '',
    };
  }

  // For other types, we charge the content from the file
  if (example.filePath) {
    return await fetchFileContent(example.filePath);
  }

  return example.content || '';
}
