#! /bin/sh

BIN=../../bin

# Download Online Boutique manifests
MANIFESTS=downloads/online-boutique-manifests.yaml
curl https://raw.githubusercontent.com/GoogleCloudPlatform/microservices-demo/refs/heads/main/release/kubernetes-manifests.yaml > $MANIFESTS

# Generate diagrams from Online Boutique manifests
$BIN/kube-diagrams $MANIFESTS -o diagrams/online-boutique-manifests.png
$BIN/kube-diagrams $MANIFESTS -o diagrams/online-boutique-manifests.svg
$BIN/kube-diagrams $MANIFESTS -o diagrams/online-boutique-manifests.dot_json

# Generate custom diagrams from Online Boutique manifests
$BIN/kube-diagrams $MANIFESTS -c custom_diagram.kd -o diagrams/online-boutique-manifests-custom-diagram.png
$BIN/kube-diagrams $MANIFESTS -c custom_diagram.kd -o diagrams/online-boutique-manifests-custom-diagram.svg
$BIN/kube-diagrams $MANIFESTS -c custom_diagram.kd -o diagrams/online-boutique-manifests-custom-diagram.dot_json

# Generate diagrams from Online Boutique Helm Chart
CHART=oci://us-docker.pkg.dev/online-boutique-ci/charts/onlineboutique
$BIN/helm-diagrams $CHART -o diagrams/online-boutique-helm-chart.png
$BIN/helm-diagrams $CHART -o diagrams/online-boutique-helm-chart.svg
$BIN/helm-diagrams $CHART -o diagrams/online-boutique-helm-chart.dot_json
# diagrams with network policies
$BIN/helm-diagrams $CHART --set networkPolicies.create=true -o diagrams/online-boutique-helm-chart-with-network-policies.png
$BIN/helm-diagrams $CHART --set networkPolicies.create=true -o diagrams/online-boutique-helm-chart-with-network-policies.svg
$BIN/helm-diagrams $CHART --set networkPolicies.create=true -o diagrams/online-boutique-helm-chart-with-network-policies.dot_json
# TODO: diagrams with virtual services
#$BIN/helm-diagrams $CHART --set frontend.virtualService.create=true -o diagrams/online-boutique-helm-chart-with-virtual-services.png
#$BIN/helm-diagrams $CHART --set frontend.virtualService=true -o diagrams/online-boutique-helm-chart-with-virtual-services.svg
#$BIN/helm-diagrams $CHART --set frontend.virtualService.create=true -o diagrams/online-boutique-helm-chart-with-virtual-services.dot_json

# Generate custom diagrams from Online Boutique Helm Chart
$BIN/helm-diagrams $CHART -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram.png
$BIN/helm-diagrams $CHART -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram.svg
$BIN/helm-diagrams $CHART -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram.dot_json
# diagrams with network policies
$BIN/helm-diagrams $CHART --set networkPolicies.create=true -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram-with-network-policies.png
$BIN/helm-diagrams $CHART --set networkPolicies.create=true -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram-with-network-policies.svg
$BIN/helm-diagrams $CHART --set networkPolicies.create=true -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram-with-network-policies.dot_json
# TODO: diagrams with virtual services
#$BIN/helm-diagrams $CHART --set frontend.virtualService.create=true -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram-with-virtual-services.png
#$BIN/helm-diagrams $CHART --set frontend.virtualService=true -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram-with-virtual-services.svg
#$BIN/helm-diagrams $CHART --set frontend.virtualService.create=true -c custom_diagram.kd -o diagrams/online-boutique-helm-chart-custom-diagram-with-virtual-services.dot_json
