#! /bin/sh

PATH=../../bin:$PATH

# Generate the internal architecture diagram for both WordPress workloads
kube-diagrams ../wordpress/*.yaml -c inside-workloads.kdc -o diagrams/inside-wordpress.png
kube-diagrams ../wordpress/*.yaml -c inside-workloads.kdc -o diagrams/inside-wordpress.svg

# Generate the internal architecture diagram for the Cassandra workload
kube-diagrams ../cassandra/cassandra.yml -c inside-workloads.kdc -o diagrams/inside-cassandra.png
kube-diagrams ../cassandra/cassandra.yml -c inside-workloads.kdc -o diagrams/inside-cassandra.svg

# Generate the architecture diagram for a demo example
kube-diagrams manifests/demo1_with_srv.yaml -o diagrams/demo1_with_srv.png
kube-diagrams manifests/demo1_with_srv.yaml -o diagrams/demo1_with_srv.svg

# Generate the internal architecture diagram for a demo workload
kube-diagrams manifests/demo1_with_srv.yaml -c inside-workloads.kdc -o diagrams/inside-demo1_with_srv.png
kube-diagrams manifests/demo1_with_srv.yaml -c inside-workloads.kdc -o diagrams/inside-demo1_with_srv.svg
