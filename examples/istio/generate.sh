#! /bin/sh

BIN=../../bin

# Generate the Kubernetes architecture diagram for each Istio's Helm Chart.
for chart in \
  base \
  istiod \
  gateway \
  cni \
  ztunnel \
  ambient \
  istiod-remote
do
  $BIN/helm-diagrams https://istio-release.storage.googleapis.com/charts/${chart}
done

helmfile template -f istio-all.yaml | kube-diagrams - -o istio-all-namespaces.png
helmfile template -f istio-all.yaml | kube-diagrams - -o istio-all.png --without-namespace
helmfile template -f istio-all.yaml | kube-diagrams - -o istio-all-helm-charts.png --without-namespace --config all-helm-charts.kd
helmfile template -f istio-all.yaml | kube-diagrams - -o istio-all-applications.png --without-namespace --config all-applications.kd
