#! /bin/sh

BIN=../../bin

# Generate diagrams for External Secrets Operator's Helm Chart
$BIN/helm-diagrams https://charts.external-secrets.io/external-secrets -o diagrams/external-secrets-helm-chart.png

# Generate diagrams for Helm Charts using External Secrets Operator
$BIN/helm-diagrams https://hazelops.github.io/charts/web -c external-secrets.io.kdc -o diagrams/hazelops-web.png
$BIN/helm-diagrams https://muhammedgamal760.github.io/Helm/myapp -c external-secrets.io.kdc -o diagrams/helmingapp-myapp.png
$BIN/helm-diagrams https://kubediscovery.github.io/helm-repo/job-database -c external-secrets.io.kdc -o diagrams/create-databases-job-database.png
