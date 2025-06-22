#! /bin/sh

BIN=../../bin

# Download TeaStore github repo
git clone https://github.com/DescartesResearch/TeaStore.git downloads/TeaStore

# Generate diagrams from TeaStore manifests
for fidx in \
  all \
  clusterip \
  clusterip_v16 \
  rabbitmq \
  rabbitmq_v16 \
  ribbon-kieker \
  ribbon-kieker_v16 \
  ribbon \
  ribbon_v16
do
  $BIN/kube-diagrams downloads/TeaStore/examples/kubernetes/teastore-$fidx.yaml -o diagrams/teastore-manifests-$fidx.png
done

# Generate custom diagrams from TeaStore manifests
$BIN/kube-diagrams downloads/TeaStore/examples/kubernetes/teastore-clusterip.yaml -c custom_diagram_manifests.kd -o diagrams/teastore-manifests-clusterip-custom-diagram.png

# Generate diagrams from TeaStore Helm Chart
$BIN/helm-diagrams downloads/TeaStore/examples/helm -o diagrams/teastore-helm-chart.png

# Generate custom diagrams from TeaStore Helm Chart
$BIN/helm-diagrams downloads/TeaStore/examples/helm -c custom_diagram_helm_chart.kd -o diagrams/teastore-helm-chart-custom-diagram.png
