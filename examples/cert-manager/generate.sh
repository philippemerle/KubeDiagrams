#! /bin/sh

BIN=../../bin

# Generate diagram from cert-manager Helm Chart
$BIN/helm-diagrams https://charts.jetstack.io/cert-manager --namespace cert-manager -o diagrams/cert-manager-helm-chart.png

# Generate diagram from cert-manager Helm Chart with CRDs
$BIN/helm-diagrams https://charts.jetstack.io/cert-manager --namespace cert-manager --set crds.enabled=true -o diagrams/cert-manager-with-crds-helm-chart.png

# Generate diagram from Rancher Helm Chart using cert-manager
$BIN/helm-diagrams https://releases.rancher.com/server-charts/latest/rancher --set hostname=rancher.my.org -c cert-manager.io.kd -o diagrams/rancher.png

# Generate diagram from FQDN Controller Helm Chart using cert-manager
$BIN/helm-diagrams https://konsole-is.github.io/fqdn-controller/charts/fqdn-controller -c cert-manager.io.kd -o diagrams/fqdn-controller.png

# Generate diagram from Mozilla securitywiki Helm Chart using cert-manager
$BIN/kube-diagrams manifests/mozilla-securitywiki.yaml --without-namespace -c cert-manager.io.kd -o diagrams/mozilla-securitywiki.png

# Generate diagram for ClusterIssuer resources
$BIN/kube-diagrams manifests/cluster-issuers.yaml -c cert-manager.io.kd -o diagrams/cluster-issuers.png
