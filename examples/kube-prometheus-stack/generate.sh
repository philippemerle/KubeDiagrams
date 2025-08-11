#! /bin/sh

PATH=../../bin:$PATH

# Generate the Kubernetes architecture diagram for the Kube Prometheus Stack Helm Chart
helm-diagrams -c monitoring.coreos.com.kdc https://prometheus-community.github.io/helm-charts/kube-prometheus-stack

# Generate corrected architecture diagram for Kube Prometheus Stack Helm Chart
kube-diagrams --without-namespace -c monitoring.coreos.com.kdc -c KubeDiagrams.yaml kube-prometheus-stack-corrected.yaml

# Get cluster state with Kube Prometheus Stack deployed
# kubectl get pods,services,servicemonitors,prometheus,alertmanagers,podmonitors,nodes --all-namespaces -o yaml > kube-prometheus-stack-deployed-on-minikube.yaml

# Generate the architecture diagram for a Kube Prometheus Stack deployed on minikube
kube-diagrams kube-prometheus-stack-deployed-on-minikube.yaml -c monitoring.coreos.com.kdc -c disable-clusters.kdc --without-namespace
