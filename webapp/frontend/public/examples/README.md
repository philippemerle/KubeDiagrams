# Examples Directory

This directory contains YAML example files for KubeDiagrams.

## Structure

```
examples/
├── manifests/       # Kubernetes manifest examples
│   ├── cassandra.yaml
│   ├── microservices.yaml
│   └── redis-statefulset.yaml
└── helmfiles/       # Helmfile examples
    └── monitoring-stack.yaml
```

## How to Add New Examples

### For Manifest Examples

1. Create a new YAML file in `manifests/` directory
2. Add the example configuration in `src/examples/registry.js`:

```javascript
const MANIFEST_EXAMPLES = [
  // ...existing examples
  {
    id: 'my-example',
    name: 'My Example',
    description: 'Description of my example',
    filePath: '/examples/manifests/my-example.yaml'
  }
];
```

### For Helmfile Examples

1. Create a new YAML file in `helmfiles/` directory
2. Add the example configuration in `src/examples/registry.js`:

```javascript
const HELMFILE_EXAMPLES = [
  // ...existing examples
  {
    id: 'my-helmfile',
    name: 'My Helmfile',
    description: 'Description of my helmfile',
    filePath: '/examples/helmfiles/my-helmfile.yaml'
  }
];
```

### For Helm Chart Examples

Helm chart examples don't need files, just URLs:

```javascript
const HELM_CHART_EXAMPLES = [
  // ...existing examples
  {
    id: 'my-chart',
    name: 'My Chart',
    description: 'Description of my chart',
    url: 'https://charts.example.com/my-chart'
  }
];
```


