#! /bin/sh

PATH=../../bin:$PATH

# Clone the Bank of Anthos GitHub repository
git clone https://github.com/GoogleCloudPlatform/bank-of-anthos.git

# Generate the architecture diagram for Bank of Anthos manifests
kube-diagrams bank-of-anthos/kubernetes-manifests/* bank-of-anthos/extras/jwt/jwt-secret.yaml -o diagrams/bank-of-anthos.png

# Generate a custom diagram for Bank of Anthos manifests
kube-diagrams bank-of-anthos/kubernetes-manifests/* bank-of-anthos/extras/jwt/jwt-secret.yaml -c custom-diagram-1.kdc -c custom-edges.kdc -o diagrams/custom-diagram-1.png

# Generate another custom diagram for Bank of Anthos manifests
kube-diagrams bank-of-anthos/kubernetes-manifests/* bank-of-anthos/extras/jwt/jwt-secret.yaml -c custom-diagram-2.kdc -c custom-edges.kdc -o diagrams/custom-diagram-2.png
