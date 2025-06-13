#! /bin/sh

BIN=../../bin

# Download Argo Workflows Quick Start manifests
curl https://raw.githubusercontent.com/argoproj/argo-workflows/refs/heads/main/manifests/quick-start-minimal.yaml > downloads/argoproj-argo-workflows-manifests-quick-start-minimal.yaml

# Download Argo Workflows examples
curl https://raw.githubusercontent.com/argoproj/argo-workflows/main/examples/hello-world.yaml > downloads/argoproj-argo-workflows-examples-hello-world.yaml

# Download install manifests for Argo CD
curl https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml > downloads/argo-cd-manifests-install.yaml
curl https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/ha/install.yaml > downloads/argo-cd-manifests-ha-install.yaml

# Clone GitHub argoproj/argocd-example-apps repository
git clone https://github.com/argoproj/argocd-example-apps.git downloads/argocd-example-apps

# Download Argo Events Quick Start manifests
curl https://raw.githubusercontent.com/argoproj/argo-events/refs/heads/master/manifests/install.yaml > downloads/argoproj-argo-events-manifests-install.yaml

# Clone Argo Events GitHub repository
git clone https://github.com/argoproj/argo-events.git downloads/argo-events

# Generate the Kubernetes architecture diagrams for Argo Helm Charts
$BIN/helm-diagrams https://argoproj.github.io/argo-helm/argo-cd
mv argo-cd.png diagrams/
$BIN/helm-diagrams https://argoproj.github.io/argo-helm/argo-workflows
mv argo-workflows.png diagrams/
$BIN/helm-diagrams https://argoproj.github.io/argo-helm/argo-rollouts
mv argo-rollouts.png diagrams/
$BIN/helm-diagrams https://argoproj.github.io/argo-helm/argo-events
mv argo-events.png diagrams/

# Generate the Kubernetes architecture diagrams for Argo Workflows
$BIN/kube-diagrams downloads/argoproj-argo-workflows-manifests-quick-start-minimal.yaml -o diagrams/argoproj-argo-workflows-manifests-quick-start-minimal.png
$BIN/kube-diagrams -c KubeDiagrams.yaml downloads/argoproj-argo-workflows-examples-hello-world.yaml -o diagrams/argoproj-argo-workflows-examples-hello-world.png

# Generate the Kubernetes architecture diagrams for Argo CD
$BIN/kube-diagrams -c argo-cd.kd downloads/argo-cd-manifests-install.yaml -o diagrams/argo-cd-manifests-install.png
$BIN/kube-diagrams -c argo-cd.kd downloads/argo-cd-manifests-install.yaml --without-namespace -o diagrams/argo-cd-manifests-install-without-namespace.png
$BIN/kube-diagrams -c argo-cd.kd argo-cd-manifests-install-corrected.yaml -o diagrams/argo-cd-manifests-install-corrected.png
$BIN/kube-diagrams -c argo-cd.kd argo-cd-manifests-install-corrected.yaml --without-namespace -o diagrams/argo-cd-manifests-install-without-namespace-corrected.png
$BIN/kube-diagrams -c argo-cd.kd downloads/argo-cd-manifests-ha-install.yaml -o diagrams/argo-cd-manifests-ha-install.png

# Generate the Kubernetes architecture diagram for Argo CD Example Apps
helm template downloads/argocd-example-apps/apps | $BIN/kube-diagrams - -c KubeDiagrams.yaml -o diagrams/argoproj-argocd-example-apps-apps.png
helm template blue-green downloads/argocd-example-apps/blue-green | $BIN/kube-diagrams - -c KubeDiagrams.yaml -o diagrams/argoproj-argocd-example-apps-blue-green.png
kubectl kustomize downloads/argocd-example-apps/pre-post-sync | $BIN/kube-diagrams - -c KubeDiagrams.yaml -o diagrams/argoproj-argocd-example-apps-pre-post-sync.png
kubectl kustomize downloads/argocd-example-apps/sock-shop | $BIN/kube-diagrams - -o diagrams/argoproj-argocd-example-apps-sock-shop.png
$BIN/kube-diagrams downloads/argocd-example-apps/sync-waves/manifests.yaml -c KubeDiagrams.yaml -o diagrams/argoproj-argocd-example-apps-sync-waves.png

# Generate the Kubernetes architecture diagrams for Argo Events
$BIN/kube-diagrams downloads/argoproj-argo-events-manifests-install.yaml -o diagrams/argoproj-argo-events-manifests-install.png
$BIN/kube-diagrams -o diagrams/argoproj-argo-events-examples -c KubeDiagrams.yaml --without-namespace downloads/argo-events/examples/*/*.yaml
