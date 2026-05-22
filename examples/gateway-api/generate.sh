#!/bin/bash

generate_diagram()
{
  ../../bin/kube-diagrams -c KubeDiagrams.yaml $@
}

for manifest in `ls manifests/*.yaml manifests/standard/*.yaml`
do
  filename=`basename ${manifest}`
  generate_diagram -o diagrams/${filename/.yaml/.png} ${manifest}
done

for example in \
  backendtlspolicy \
  cross-namespace-routing \
  grpc-routing \
  http-cors \
  http-redirect-rewrite \
  http-request-mirroring \
  http-route-attachment \
  http-routing \
  listenerset \
  multicluster \
  simple-http-https \
  simple-gateway \
  tls-routing \
  traffic-splitting
do
  generate_diagram -o diagrams/${example}.png manifests/standard/${example}/*.yaml
done
