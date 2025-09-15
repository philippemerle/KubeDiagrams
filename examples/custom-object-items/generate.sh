#! /bin/sh

BIN=../../bin

MANIFESTS=config/custom-object-items.yaml

# Generate diagrams with custom object items
$BIN/kube-diagrams -n myapp $MANIFESTS -c config/custom-object-items.kd -o diagrams/custom-object-items.png -v
#$BIN/kube-diagrams -n myapp $MANIFESTS -c config/custom-object-items.kd -o diagrams/custom-object-items.svg --embed-all-icons
#$BIN/kube-diagrams -n myapp $MANIFESTS -c config/custom-object-items.kd -o diagrams/custom-object-items.dot_json --embed-all-icons
