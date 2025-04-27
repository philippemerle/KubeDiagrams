#! /bin/sh

BIN=../../bin

# Generate the Kubernetes architecture diagram for the LWS operator.
$BIN/helm-diagrams oci://registry.k8s.io/lws/charts/lws

# Generate the Kubernetes architecture diagram for each LWS example.
for file in `ls examples/*.yaml`
do
  $BIN/kube-diagrams -c KubeDiagrams.yml ${file}
done
