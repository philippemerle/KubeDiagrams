#! /bin/sh

PATH=../../bin:$PATH

# Download OpenTelemetry Demo Manifest
curl https://raw.githubusercontent.com/open-telemetry/opentelemetry-demo/refs/heads/main/kubernetes/opentelemetry-demo.yaml -o downloads/opentelemetry-demo.yaml

# Generate the architecture diagram for OpenTelemetry Demo Manifest
kube-diagrams downloads/opentelemetry-demo.yaml -c default_namespace.kdc -o diagrams/opentelemetry-demo-manifest.png

# Generate the custom diagram for OpenTelemetry Demo Manifest
kube-diagrams downloads/opentelemetry-demo.yaml -c custom_diagram.kdc --without-namespace -o diagrams/opentelemetry-demo-manifest-custom-diagram.png

# Generate the architecture diagram for OpenTelemetry Demo Helm Chart
helm-diagrams https://open-telemetry.github.io/opentelemetry-helm-charts/opentelemetry-demo -o diagrams/opentelemetry-demo-helm-chart.png
