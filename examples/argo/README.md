# Argo Example

This example is dedicated to **[Argo](https://argoproj.github.io/)** projects including **[Argo Workflows](https://argoproj.github.io/workflows/)**, **[Argo CD](https://argoproj.github.io/cd/)**, **[Argo Rollouts](https://argoproj.github.io/rollouts/)**, and **[Argo Events](https://argoproj.github.io/events/)**.

## Instructions

Generate the Kubernetes architecture diagrams for **[Argo](https://argoproj.github.io/)** projects:

```sh
$ generate.sh
```

## Generated architecture diagrams

### [Argo Workflows](https://argoproj.github.io/workflows/)

Architecture diagram for [Argo Workflows Helm Chart](https://artifacthub.io/packages/helm/argo/argo-workflows):

![diagrams/argo-workflows.png](diagrams/argo-workflows.png)

Architecture diagram for [Argo Workflows Quick Start Minimal Manifest](https://github.com/argoproj/argo-workflows/blob/main/manifests/quick-start-minimal.yaml):

![diagrams/argoproj-argo-workflows-manifests-quick-start-minimal.png](diagrams/argoproj-argo-workflows-manifests-quick-start-minimal.png)

Architecture diagram for [Argo Workflows Hello World Example](https://raw.githubusercontent.com/argoproj/argo-workflows/main/examples/hello-world.yaml):

![diagrams/argoproj-argo-workflows-examples-hello-world.png](diagrams/argoproj-argo-workflows-examples-hello-world.png)

### [Argo CD](https://argoproj.github.io/cd/)

Architecture diagram for [Argo CD Helm Chart](https://artifacthub.io/packages/helm/argo/argo-cd):

![diagrams/argo-cd.png](diagrams/argo-cd.png)

Architecture diagram for [Argo CD Quick Start Install Manifest](https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml):

![diagrams/argo-cd-manifests-install.png](diagrams/argo-cd-manifests-install.png)

Architecture diagram for [Argo CD Quick Start Install Manifest](https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml) without namespace:

![diagrams/argo-cd-manifests-install-without-namespace.png](diagrams/argo-cd-manifests-install-without-namespace.png)

Architecture diagram for [Argo CD Quick Start Install Manifest where missed metadata labels were added](https://github.com/argoproj/argo-cd/pull/23313):

![diagrams/argo-cd-manifests-install-corrected.png](diagrams/argo-cd-manifests-install-corrected.png)

Architecture diagram for [Argo CD HA Install Manifest](https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/ha/install.yaml):

![diagrams/argo-cd-manifests-ha-install.png](diagrams/argo-cd-manifests-ha-install.png)

Architecture diagram for [Argo CD HA Install Manifest](https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/ha/install.yaml) without namespace:

![diagrams/argo-cd-manifests-install-without-namespace-corrected.png](diagrams/argo-cd-manifests-install-without-namespace-corrected.png)

Architecture diagram for [Argo CD Example Apps apps](https://github.com/argoproj/argocd-example-apps/tree/master/apps):

![diagrams/argoproj-argocd-example-apps-apps.png](diagrams/argoproj-argocd-example-apps-apps.png)

Architecture diagram for [Argo CD Example Apps pre-post-sync](https://github.com/argoproj/argocd-example-apps/tree/master/pre-post-sync):

![diagrams/argoproj-argocd-example-apps-pre-post-sync.png](diagrams/argoproj-argocd-example-apps-pre-post-sync.png)

Architecture diagram for [Argo CD Example Apps sync-waves](https://github.com/argoproj/argocd-example-apps/tree/master/sync-waves):

![diagrams/argoproj-argocd-example-apps-sync-waves.png](diagrams/argoproj-argocd-example-apps-sync-waves.png)

### [Argo Rollouts](https://argoproj.github.io/rollouts/)

Architecture diagram for [Argo Rollouts Helm Chart](https://artifacthub.io/packages/helm/argo/argo-rollouts):

![diagrams/argo-rollouts.png](diagrams/argo-rollouts.png)

Architecture diagram for [Argo CD Example Apps blue-green](https://github.com/argoproj/argocd-example-apps/tree/master/blue-green):

![diagrams/argoproj-argocd-example-apps-blue-green.png](diagrams/argoproj-argocd-example-apps-blue-green.png)

### [Argo Events](https://argoproj.github.io/events/)

Architecture diagram for [Argo Events Helm Chart](https://artifacthub.io/packages/helm/argo/argo-events):

![diagrams/argo-events.png](diagrams/argo-events.png)

Architecture diagram for [Argo Events Install Manifest](https://github.com/argoproj/argo-events/blob/master/manifests/install.yaml):

![diagrams/argoproj-argo-events-manifests-install.png](diagrams/argoproj-argo-events-manifests-install.png)

Architecture diagram for [Argo Events Examples](https://github.com/argoproj/argo-events/tree/master/examples):

![diagrams/argoproj-argo-events-examples.png](diagrams/argoproj-argo-events-examples.png)
