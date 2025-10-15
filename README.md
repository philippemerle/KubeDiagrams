# KubeDiagrams

[![license](https://img.shields.io/github/license/philippemerle/KubeDiagrams)](https://github.com/philippemerle/KubeDiagrams/blob/main/LICENSE)
![python version](https://img.shields.io/badge/python-%3E%3D%203.9-blue?logo=python)
[![Socket Badge](https://socket.dev/api/badge/pypi/package/KubeDiagrams/0.4.0?artifact_id=tar-gz)](https://socket.dev/pypi/package/KubeDiagrams/overview/0.4.0/tar-gz)
[![pypi version](https://badge.fury.io/py/KubeDiagrams.svg)](https://badge.fury.io/py/KubeDiagrams)
[![PyPI Downloads](https://static.pepy.tech/badge/kubediagrams)](https://pepy.tech/projects/kubediagrams)
[![Docker Stars](https://img.shields.io/docker/stars/philippemerle/kubediagrams)](https://hub.docker.com/r/philippemerle/kubediagrams)
[![Docker Image Version](https://img.shields.io/docker/v/philippemerle/kubediagrams)](https://hub.docker.com/r/philippemerle/kubediagrams)
[![Docker Pulls](https://img.shields.io/docker/pulls/philippemerle/kubediagrams)](https://hub.docker.com/r/philippemerle/kubediagrams)
![contributors](https://img.shields.io/github/contributors/philippemerle/KubeDiagrams)

<a href="https://trendshift.io/repositories/14300" target="_blank"><img src="https://trendshift.io/api/badge/repositories/14300" alt="philippemerle%2FKubeDiagrams | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

![KubeDiagrams Logo](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/images/KubeDiagrams.png)

Generate Kubernetes architecture diagrams from Kubernetes manifest files, kustomization files, Helm charts, helmfile descriptors, and actual cluster state.

There are several tools to generate Kubernetes architecture diagrams, see **[here](https://github.com/philippemerle/Awesome-Kubernetes-Architecture-Diagrams)** for a detailed list.
Compared to these existing tools, the main originalities of **KubeDiagrams** are the support of:

* **[most of all Kubernetes built-in resources](https://github.com/philippemerle/KubeDiagrams#kubernetes-built-in-resources)**,
* **[any Kubernetes custom resources](https://github.com/philippemerle/KubeDiagrams#kubernetes-custom-resources)**,
* **[customizable resource clustering](https://github.com/philippemerle/KubeDiagrams#kubernetes-resources-clustering)**,
* **[any Kubernetes resource relationships](https://github.com/philippemerle/KubeDiagrams#kubernetes-resource-relationships)**,
* **[declarative custom diagrams](https://github.com/philippemerle/KubeDiagrams#declarative-custom-diagrams)**,
* **[an interactive diagram viewer](https://github.com/philippemerle/KubeDiagrams#kubediagrams-interactive-viewer)**,
* **main input formats** such as Kubernetes manifest files, customization files, Helm charts, helmfile descriptors, and actual cluster state,
* **main output formats** such as DOT, GIF, JPEG, PDF, PNG, SVG, and TIFF,
* **[a very large set of examples](https://github.com/philippemerle/KubeDiagrams#examples)**.

**KubeDiagrams** is available as a [Python package in PyPI](https://pypi.org/project/KubeDiagrams), a [container image in DockerHub](https://hub.docker.com/r/philippemerle/kubediagrams), a `kubectl` plugin, a Nix flake, and a GitHub Action, see [here](https://github.com/philippemerle/KubeDiagrams#getting-started) for more details.

Read **[Real-World Use Cases](https://github.com/philippemerle/KubeDiagrams#real-world-use-cases)** and **[What do they say about it](https://github.com/philippemerle/KubeDiagrams#what-do-they-say-about-it)** to discover how **KubeDiagrams** is really used and appreciated.

Try it on your own Kubernetes manifests, Helm charts, helmfiles, and actual cluster state!

## Examples

Architecture diagram for **[official Kubernetes WordPress tutorial](https://kubernetes.io/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)** manifests:
![WordPress Manifests](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/wordpress/wordpress.png)

Architecture diagram for **[official Kubernetes ZooKeeper tutorial](https://kubernetes.io/docs/tutorials/stateful-application/zookeeper/)** manifests:
![ZooKeeper Manifest](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/zookeeper/zookeeper.png)

Architecture diagram of a deployed **[Cassandra](https://kubernetes.io/docs/tutorials/stateful-application/cassandra/)** instance:
![Deployed Cassandra Instance](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/cassandra/default.png)

Architecture diagram for **[Train Ticket：A Benchmark Microservice System](https://github.com/FudanSELab/train-ticket/)**:
![train-ticket.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/train-ticket/train-ticket.png)

Architecture diagram of the Minikube Ingress Addon:
![Minikube Ingress Addon](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/minikube/minikube-ingress-nginx.png)

Architecture diagram for the **[Kube Prometheus Stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)** chart:
![kube-prometheus-stack.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/kube-prometheus-stack/kube-prometheus-stack.png)

Architecture diagram for **[free5gc-k8s](https://github.com/niloysh/free5gc-k8s)** manifests:
![free5gc-k8s-diagram.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/free5gc-k8s/free5gc-k8s-diagram.png)

Architecture diagram for **[open5gs-k8s](https://github.com/niloysh/open5gs-k8s)** manifests:
![open5gs-k8s-diagram.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/open5gs-k8s/open5gs-k8s-diagram.png)

Architecture diagram for the **[Towards5GS-helm](https://github.com/Orange-OpenSource/towards5gs-helm)** chart:
![towards5gs_free5gc.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/towards5gs-helm/towards5gs_free5gc.png)

Architecture diagram for a deployed **CronJob** instance:
![cronjob-deployed.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/miscellaneous/cronjob-deployed.png)

Architecture diagram for **NetworkPolicy** resources: ![network_policies.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/miscellaneous/network_policies.png)

Architecture diagram for an **Argo CD** example:
![argoproj-argocd-example-apps-apps.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/argo/diagrams/argoproj-argocd-example-apps-apps.png)

Architecture diagram for an **Argo Events** example:
![argoproj-argo-events-examples.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/argo/diagrams/argoproj-argo-events-examples.png)

Many other architecture diagrams are available into [examples/](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/).

### Business Applications

1. [Bank of Anthos](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/bank-of-anthos/)
1. [DeathStarBench](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/deathstarbench/)
1. [Official Kubernetes WordPress tutorial](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/wordpress/)
1. [Official Kubernetes ZooKeeper tutorial](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/zookeeper/)
1. [Official Kubernetes Cassandra tutorial](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/cassandra/)
1. [Online Boutique](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/online-boutique/)
1. [OpenTelemetry Demo](https://github.com/philippemerle/KubeDiagrams/tree/main/examples/opentelemetry-demo)
1. [TeaStore](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/teastore/)
1. [Train Ticket](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/train-ticket/)

### 5G Core Network Functions

1. [free5gc-k8s](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/free5gc-k8s/)
1. [docker-open5gs](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/docker-open5gs/)
1. [Gradiant 5G Charts](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/gradiant-5g-charts)
1. [open5gs-k8s](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/open5gs-k8s/)
1. [OpenAirInterface 5G Core Network](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/oai-5g-cn/)
1. [Towards5GS-helm](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/towards5gs-helm/)

### Kubernetes Operators

1. [Argo](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/argo/)
1. [cert-manager](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/cert-manager/)
1. [Istio](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/istio/)
1. [Kube Prometheus Stack](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/kube-prometheus-stack/)
1. [LeaderWorkerSet API](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/lws/)

### Kubernetes Control Planes

1. [k0s architecture diagrams](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/k0s/)
1. [minikube architecture diagrams](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/minikube/)

### Other examples

1. [Custom Object Items](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/custom-object-items/)
1. [Some Helm charts](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/helm-charts/)
1. [helmfile](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/helmfile/)
1. [Inside workloads](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/inside-workloads/)
1. [Miscellaneous examples](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/miscellaneous/)

## Prerequisites

Following software must be installed:

- [Python](https://www.python.org) 3.9 or higher
- `dot` command ([Graphviz](https://www.graphviz.org/))

## Getting Started

### From PyPI

Following command installs **KubeDiagrams** and all its Python dependencies, i.e., [PyYAML](https://pyyaml.org) and [Diagrams](https://diagrams.mingrammer.com/).

```ssh
# using pip (pip3)
pip install KubeDiagrams
```

### From Nix

Alternatively, you can install via Nix:

```sh
nix shell github:philippemerle/KubeDiagrams
```

### From Docker Hub

**KubeDiagrams** container images are available in [Docker Hub](https://hub.docker.com/r/philippemerle/kubediagrams).
You can download the latest container image via:

```sh
docker pull philippemerle/kubediagrams
```

### From source

You can start directly from source:

```sh
# clone the KubeDiagrams repository
git clone https://github.com/philippemerle/KubeDiagrams.git

# install required Python packages
pip install PyYAML diagrams

# make KubeDiagrams commands available into $PATH
PATH=$(pwd)/KubeDiagrams/bin:$PATH
```

### From Windows

To use **KubeDiagrams** from Windows operating system, only the container image is supported currently.

> [!NOTE]
>
> Any contribution would be welcome to translate KubeDiagrams' Unix-based scripts to Windows-based scripts.

## Usage

**KubeDiagrams** provides two commands: `kube-diagrams` and `helm-diagrams`.

### `kube-diagrams`

`kube-diagrams` generates a Kubernetes architecture diagram from one or several Kubernetes manifest files.

```sh
kube-diagrams -h
usage: kube-diagrams [-h] [-o OUTPUT] [-f FORMAT] [-c CONFIG] [-v] [--without-namespace] filename [filename ...]

Generate Kubernetes architecture diagrams from Kubernetes manifest files

positional arguments:
  filename              the Kubernetes manifest filename to process

options:
  -h, --help            show this help message and exit
  -o, --output OUTPUT   output diagram filename
  -f, --format FORMAT   output format, allowed formats are dot, dot_json, gif, jp2, jpe, jpeg, jpg, pdf, png, svg, tif, tiff, set to png by default
  --embed-all-icons     embed all icons into svg or dot_json output diagrams
  -c, --config CONFIG   custom kube-diagrams configuration file
  -n, --namespace NAMESPACE
                        visualize only the resources inside a given namespace
  -v, --verbose         verbosity, set to false by default
  --without-namespace   disable namespace cluster generation
```

Examples:

```sh
# generate a diagram from a manifest
kube-diagrams -o cassandra.png examples/cassandra/cassandra.yml

# generate a diagram from a kustomize folder
kubectl kustomize path_to_a_kustomize_folder | kube-diagrams - -o diagram.png

# generate a diagram from a helmfile descriptor
helmfile template -f helmfile.yaml | kube-diagrams - -o diagram.png

# generate a diagram from the actual default namespace state
kubectl get all -o yaml | kube-diagrams -o default-namespace.png -

# generate a diagram of all workload and service resources from all namespaces
kubectl get all --all-namespaces -o yaml | kube-diagrams -o all-namespaces.png -
```

#### 🧩 `kubectl` Plugin Support

You can use KubeDiagrams as a `kubectl` plugin as well for a more integrated Kubernetes workflow. This allows you to run commands like:

```sh
kubectl diagrams all -o diagram.png
```

To enable this, simply symlink or copy the [`kubectl-diagrams`](./bin/kubectl-diagrams) script onto your `$PATH`:

```sh
ln -s $(which kubectl-diagrams) /usr/local/bin/kubectl-diagrams
```

> [!NOTE]
>
> You will also already need `kube-diagrams` on your `$PATH` as well for this to work.

You can alternatively install it via Nix:

```sh
nix shell github:philippemerle/KubeDiagrams#kubectl-diagrams
```

### `helm-diagrams`

`helm-diagrams` generates a Kubernetes architecture diagram from an Helm chart.

```sh
Usage: helm-diagrams <helm-chart-url> [OPTIONS] [FLAGS]

A script to generate a diagram of an Helm chart using kube-diagrams.

Options:
  -o, --output <file>          Specify the output file for the diagram
  -f, --format <format>        Specify the output format (e.g., png, svg)
  --embed-all-icons            Embed all icons into svg or dot_json output diagrams
  -c, --config <file>          Specify the custom kube-diagrams configuration file
  -h, --help                   Display this help message

Any flag supported by helm template, e.g.:
  -g, --generate-name          Generate the name (and omit the NAME parameter)
  --include-crds               Include CRDs in the templated output
  -l, --labels stringToString  Labels that would be added to release metadata. Should be divided by comma. (default [])
  --name-template string       Specify template used to name the release
  --set stringArray            Set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
  --set-file stringArray       Set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
  --set-json stringArray       Set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)
  --set-literal stringArray    Set a literal STRING value on the command line
  --set-string stringArray     Set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
  -f, --values strings         Specify values in a YAML file or a URL (can specify multiple)
  --version string             Specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used

Examples:
  helm-diagrams https://charts.jetstack.io/cert-manager -o diagram.png
  helm-diagrams https://charts.jetstack.io/cert-manager --set crds.enabled=true -o cert-manager.png
  helm-diagrams oci://ghcr.io/argoproj/argo-helm/argo-cd -f svg
  helm-diagrams --help
```

> [!NOTE]
>
> `helm-diagrams` requires that the `helm` command was installed.

Examples:

```ssh
# generate a diagram for the Helm chart 'cert-manager' available in HTTP repository 'charts.jetstack.io'
helm-diagrams https://charts.jetstack.io/cert-manager

# generate a diagram for the Helm chart 'argo-cd' available in OCI repository 'ghcr.io'
helm-diagrams oci://ghcr.io/argoproj/argo-helm/argo-cd

# generate a diagram for the Helm chart 'some-chart' available locally
helm-diagrams some-path/some-chart
```

### With Docker/Podman

**KubeDiagrams** images are available in [Docker Hub](https://hub.docker.com/r/philippemerle/kubediagrams).

```ssh
# For usage with Podman, replace 'docker' by 'podman' in the following lines.

# generate a diagram from a manifest
docker run -v "$(pwd)":/work philippemerle/kubediagrams kube-diagrams -o cassandra.png examples/cassandra/cassandra.yml

# generate a diagram from a kustomize folder
kubectl kustomize path_to_a_kustomize_folder | docker run -v "$(pwd)":/work -i philippemerle/kubediagrams kube-diagrams - -o diagram.png

# generate a diagram from a helmfile descriptor
helmfile template -f helmfile.yaml | docker run -v "$(pwd)":/work -i philippemerle/kubediagrams kube-diagrams - -o diagram.png

# generate a diagram from the actual default namespace state
kubectl get all -o yaml | docker run -v "$(pwd)":/work -i philippemerle/kubediagrams kube-diagrams -o default-namespace.png -

# generate a diagram of all workload and service resources from all namespaces
kubectl get all --all-namespaces -o yaml | docker run -v "$(pwd)":/work -i philippemerle/kubediagrams kube-diagrams -o all-namespaces.png -

# generate a diagram for the Helm chart 'cert-manager' available in HTTP repository 'charts.jetstack.io'
docker run -v "$(pwd)":/work philippemerle/kubediagrams helm-diagrams https://charts.jetstack.io/cert-manager

# generate a diagram for the Helm chart 'argo-cd' available in OCI repository 'ghcr.io'
docker run -v "$(pwd)":/work philippemerle/kubediagrams helm-diagrams oci://ghcr.io/argoproj/argo-helm/argo-cd
```

### GitHub Action

You can use **KubeDiagrams** (and Helm Diagrams) in your GitHub Action workflows.

```yaml
name: "Your GitHub Action Name"
on:
  workflow_dispatch: # add your specific triggers (https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: "Generate diagram from Kubernetes manifest"
        uses: philippemerle/KubeDiagrams@main
        with:
          type: "kubernetes"
          args: "-o examples/cassandra/cassandra.png examples/cassandra/cassandra.yml"

      - name: "Generate diagram from Helm chart"
        uses: philippemerle/KubeDiagrams@main
        with:
          type: "helm"
          args: "https://charts.jetstack.io/cert-manager"
```

Action `philippemerle/KubeDiagrams@main` is available [here](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/action.yml).

## Features

### Kubernetes built-in resources

**KubeDiagrams** supported the following 47 Kubernetes resource types:

|               Kind               |            ApiGroup            |           Versions            |                                                                          Icon                                                                          |
| :------------------------------: | :----------------------------: | :---------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------: |
|           `APIService`           |    `apiregistration.k8s.io`    |        `v1beta1` `v1`         |                  ![APIService](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/apiservice.png)                  |
|          `ClusterRole`           |  `rbac.authorization.k8s.io`   |        `v1beta1` `v1`         |          ![ClusterRole](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/c-role-128.png)           |
|       `ClusterRoleBinding`       |  `rbac.authorization.k8s.io`   |        `v1beta1` `v1`         |        ![ClusterRoleBinding](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/crb-128.png)         |
|           `ConfigMap`            |                                |             `v1`              |             ![ConfigMap](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/cm-128.png)              |
|            `CronJob`             |            `batch`             |        `v1beta1` `v1`         |            ![CronJob](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/cronjob-128.png)            |
|           `CSIDriver`            |        `storage.k8s.io`        |        `v1beta1` `v1`         |                   ![CSIDriver](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/csidriver.png)                   |
|            `CSINode`             |        `storage.k8s.io`        |             `v1`              |                     ![CSINode](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/csinode.png)                     |
|       `CSIStorageCapacity`       |        `storage.k8s.io`        |             `v1`              |                ![CSIStorageCapacity](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/csisc.png)                 |
|    `CustomResourceDefinition`    |     `apiextensions.k8s.io`     |        `v1beta1` `v1`         |     ![CustomResourceDefinition](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/crd-128.png)      |
|           `DaemonSet`            |    `apps` `extensions`         |   `v1beta1` `v1beta2` `v1`    |             ![DaemonSet](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ds-128.png)              |
|           `Deployment`           |         `apps` `extensions`    |   `v1beta1` `v1beta2` `v1`    |           ![Deployment](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/deploy-128.png)           |
|           `Endpoints`            |                                |             `v1`              |             ![Endpoints](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ep-128.png)              |
|         `EndpointSlice`          |       `discovery.k8s.io`       |             `v1`              |                    ![EndpointSlice](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/eps.png)                    |
|             `Group`              |  `rbac.authorization.k8s.io`   |             `v1`              |              ![Group](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/group-128.png)              |
|    `HorizontalPodAutoscaler`     |         `autoscaling`          | `v1` `v2beta1` `v2beta2` `v2` |      ![HorizontalPodAutoscaler](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/hpa-128.png)      |
|            `Ingress`             | `networking.k8s.io` `extensions` |        `v1beta1` `v1`         |              ![Ingress](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ing-128.png)              |
|          `IngressClass`          |      `networking.k8s.io`       |        `v1beta1` `v1`         |                     ![IngressClass](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/ic.png)                     |
|              `Job`               |            `batch`             |        `v1beta1` `v1`         |                ![Job](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/job-128.png)                |
|             `Lease`              |     `coordination.k8s.io`      |             `v1`              |                       ![Lease](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/lease.png)                       |
|           `LimitRange`           |                                |             `v1`              |           ![LimitRange](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/limits-128.png)           |
|  `MutatingWebhookConfiguration`  | `admissionregistration.k8s.io` |        `v1beta1` `v1`         |            ![MutatingWebhookConfiguration](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/mwc.png)             |
|           `Namespace`            |                                |             `v1`              |             ![Namespace](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ns-128.png)              |
|  `NetworkAttachmentDefinition`   |       `k8s.cni.cncf.io`        |             `v1`              | ![NetworkAttachmentDefinition](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/azure/network/network-interfaces.png) |
|         `NetworkPolicy`          |      `networking.k8s.io`       |             `v1`              |         ![NetworkPolicy](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/netpol-128.png)          |
|              `Node`              |                                |             `v1`              |       ![Node](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/infrastructure_components/labeled/node-128.png)       |
|        `PersistentVolume`        |                                |             `v1`              |          ![PersistentVolume](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pv-128.png)          |
|     `PersistentVolumeClaim`      |                                |             `v1`              |       ![PersistentVolumeClaim](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pvc-128.png)       |
|              `Pod`               |                                |             `v1`              |                ![Pod](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pod-128.png)                |
|      `PodDisruptionBudget`       |            `policy`            |        `v1beta1` `v1`         |                 ![PodDisruptionBudget](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/pdb.png)                 |
|       `PodSecurityPolicy`        |     `policy` `extensions`      |        `v1beta1` `v1`         |         ![PodSecurityPolicy](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/psp-128.png)         |
|          `PodTemplate`           |                                |             `v1`              |                 ![PodTemplate](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/podtemplate.png)                 |
|         `PriorityClass`          |      `scheduling.k8s.io`       |        `v1beta1` `v1`         |                    ![PriorityClass](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/pc.png)                     |
|           `ReplicaSet`           |             `apps`             |             `v1`              |             ![ReplicaSet](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/rs-128.png)             |
|     `ReplicationController`      |                                |             `v1`              |                ![ReplicationController](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/rc.png)                 |
|         `ResourceQuota`          |                                |             `v1`              |          ![ResourceQuota](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/quota-128.png)          |
|              `Role`              |  `rbac.authorization.k8s.io`   |        `v1beta1` `v1`         |               ![Role](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/role-128.png)               |
|          `RoleBinding`           |  `rbac.authorization.k8s.io`   |        `v1beta1` `v1`         |            ![RoleBinding](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/rb-128.png)             |
|          `RuntimeClass`          |         `node.k8s.io`          |             `v1`              |                ![RuntimeClass](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/runtimeclass.png)                |
|             `Secret`             |                                |             `v1`              |             ![Secret](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/secret-128.png)             |
|            `Service`             |                                |             `v1`              |              ![Service](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/svc-128.png)              |
|         `ServiceAccount`         |                                |             `v1`              |           ![ServiceAccount](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sa-128.png)           |
|          `StatefulSet`           |             `apps`             |   `v1beta1` `v1beta2` `v1`    |            ![StatefulSet](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sts-128.png)            |
|          `StorageClass`          |        `storage.k8s.io`        |        `v1beta1` `v1`         |            ![StorageClass](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sc-128.png)            |
|              `User`              |  `rbac.authorization.k8s.io`   |             `v1`              |               ![User](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/user-128.png)               |
| `ValidatingWebhookConfiguration` | `admissionregistration.k8s.io` |        `v1beta1` `v1`         |           ![ValidatingWebhookConfiguration](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/vwc.png)            |
|     `VerticalPodAutoscaler`      |      `autoscaling.k8s.io`      |             `v1`              |                ![VerticalPodAutoscaler](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/vpa.png)                |
|        `VolumeAttachment`        |        `storage.k8s.io`        |             `v1`              |         ![VolumeAttachment](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/vol-128.png)          |

**Note**: The mapping between these supported Kubernetes resources and architecture diagrams is defined into [bin/kube-diagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/bin/kube-diagrams.yaml#L103).

Currently, there are 16 unsupported Kubernetes resource types:

|             Kind             |            ApiGroup            |
| :--------------------------: | :----------------------------: |
|          `Binding`           |                                |
|      `ComponentStatus`       |                                |
|           `Event`            |                                |
|     `ControllerRevision`     |             `apps`             |
|        `TokenReview`         |    `authentication.k8s.io`     |
|  `LocalSubjectAccessReview`  |     `authorization.k8s.io`     |
|  `SelfSubjectAccessReview`   |     `authorization.k8s.io`     |
|     `SelfSubjectReview`      |     `authorization.k8s.io`     |
|   `SelfSubjectRulesReview`   |     `authorization.k8s.io`     |
|    `SubjectAccessReview`     |     `authorization.k8s.io`     |
| `CertificateSigningRequest`  |     `certificates.k8s.io`      |
|           `Event`            |        `events.k8s.io`         |
|         `FlowSchema`         | `flowcontrol.apiserver.k8s.io` |
| `PriorityLevelConfiguration` | `flowcontrol.apiserver.k8s.io` |
|        `NodeMetrics`         |        `metrics.k8s.io`        |
|         `PodMetrics`         |        `metrics.k8s.io`        |

### Kubernetes custom resources

The mapping for any Kubernetes custom resources can be also defined into **KubeDiagrams** configuration files as illustrated in [examples/k0s/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/k0s/KubeDiagrams.yml#L10), [examples/kube-prometheus-stack/monitoring.coreos.com.kdc](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/kube-prometheus-stack/monitoring.coreos.com.kdc#L4), [examples/lws/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/lws/KubeDiagrams.yml#L19), and
[examples/argo/KubeDiagrams.yaml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/argo/KubeDiagrams.yaml#L22).
Following lists some custom resources already supported in [examples](https://github.com/philippemerle/KubeDiagrams/blob/main/examples).

|               Kind               |            ApiGroup            |           Versions            |                                                                          Icon                                                                          |
| :------------------------------: | :----------------------------: | :---------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------: |
|           `Application`           |    `argoproj.io`    |        `v1alpha1`         |                  ![Application](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/argo/icons/Application.png)                  |
|           `EventBus`           |    `argoproj.io`    |        `v1alpha1`         |                  ![EventBus](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/argo/icons/EventBus.png)                  |
|           `EventSource`           |    `argoproj.io`    |        `v1alpha1`         |                  ![EventSource](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/argo/icons/EventSource.png)                  |
|           `Rollout`           |    `argoproj.io`    |        `v1alpha1`         |                  ![Rollout](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/argo/icons/Rollout.png)                  |
|           `Sensor`           |    `argoproj.io`    |        `v1alpha1`         |                  ![Sensor](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/argo/icons/Sensor.png)                  |
|           `Workflow`           |    `argoproj.io`    |        `v1alpha1`         |                  ![Workflow](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/argo/icons/Workflow.png)                  |
|           `Service`           |    `serving.knative.dev`    |        `v1`         |                  ![Service](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/deathstarbench/icons/knative-service.png)                  |
|           `Route`           |    `route.openshift.io`    |        `v1`         |                  ![Route](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/deathstarbench/icons/openshift-route.png)                  |
|           `Chart`           |    `helm.k0sproject.io`    |        `v1beta1`         |                  ![Chart](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/k0s/icons/k0s-Chart.png)                  |
|           `ControlNode`           |    `autopilot.k0sproject.io`    |        `v1beta2`         |                  ![ControlNode](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/k0s/icons/k0s-ControlNode.png)                  |
|           `EtcdMember`           |    `etcd.k0sproject.io`    |        `v1beta1`         |                  ![EtcdMember](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/k0s/icons/k0s-EtcdMember.png)                  |
|           `Plan`           |    `autopilot.k0sproject.io`    |        `v1beta2`         |                  ![Plan](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/k0s/icons/k0s-Plan.png)                  |
|           `UpdateConfig`           |    `autopilot.k0sproject.io`    |        `v1beta2`         |                  ![UpdateConfig](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/k0s/icons/k0s-UpdateConfig.png)                  |
|           `Alertmanager`           |    `monitoring.coreos.com`    |        `v1`         |                  ![Alertmanager](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/kube-prometheus-stack/icons/Alertmanager.png)                  |
|           `Prometheus`           |    `monitoring.coreos.com`    |        `v1`         |                  ![Prometheus](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/kube-prometheus-stack/icons/Prometheus.png)                  |
|           `PrometheusRule`           |    `monitoring.coreos.com`    |        `v1`         |                  ![PrometheusRule](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/kube-prometheus-stack/icons/PrometheusRule.png)                  |
|           `ServiceMonitor`           |    `monitoring.coreos.com`    |        `v1`         |                  ![ServiceMonitor](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/kube-prometheus-stack/icons/ServiceMonitor.png)                  |
|           `LeaderWorkerSet`           |    `leaderworkerset.x-k8s.io`    |        `v1`         |                  ![LeaderWorkerSet](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/lws/icons/lws.png)                  |
|           `Certificate`           |    `cert-manager.io`    |    `v1alpha1` `v1alpha2` `v1`    |                  ![Certificate](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/azure/web/app-service-certificates.png)                  |
|           `ClusterIssuer`           |    `cert-manager.io`    |    `v1alpha1` `v1alpha2` `v1`    |                  ![ClusterIssuer](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/security/certificate-authority.png)                  |
|           `Issuer`           |    `cert-manager.io`    |    `v1alpha1` `v1alpha2` `v1`    |                  ![Issuer](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/security/certificate-authority.png)                  |

### Kubernetes resources clustering

With **KubeDiagrams**, Kubernetes resources can be clustered within the architecture diagrams automatically. **KubeDiagrams** uses the `metadata.namespace` resource field as first clustering criteria. Then, the `metadata.labels` keys can be used to define subclusters. Following table lists the predefined mappings between label keys and cluster titles, and background colors as defined in the [bin/kube-diagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/bin/kube-diagrams.yaml#L31) file (see the `clusters` list).

|           Label Key           |         Cluster Title          | Background Color | Recommended |
| :---------------------------: | :----------------------------: | :----------------------------: | :----------------------------: |
| `app.kubernetes.io/instance`  |  K8s Instance: `label value`   | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-E5F5FD) | Yes |
|           `release`           |     Release: `label value`     | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-E5F5FD) | No |
|        `helm.sh/chart`        |   Helm Chart: `label value`    | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-EBF3E7) | Yes |
|            `chart`            |      Chart: `label value`      | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-EBF3E7) | No |
|   `app.kubernetes.io/name`    | K8s Application: `label value` | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-ECE8F6) | Yes |
|             `app`             |   Application: `label value`   | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-ECE8F6) | No |
|            `tier`             |      Tier: `label value`       | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-ECE8F6) | No |
| `app.kubernetes.io/component` |  K8s Component: `label value`  | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-FDF7E3) | Yes |
| `component`                   |  Component: `label value`      | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-FDF7E3) | No |
|           `service`           |  Microservice: `label value`   | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-FDF7E3) | No |
| `rbac.authorization.k8s.io/aggregate-to-admin` |  Admin ClusterRole Aggregation  | transparent | Yes |
| `rbac.authorization.k8s.io/aggregate-to-edit` |  Edit ClusterRole Aggregation  | transparent | Yes |
| `rbac.authorization.k8s.io/aggregate-to-view` |  View ClusterRole Aggregation  | transparent | Yes |

Resource clustering could be also annotation-based, i.e. based on `metadata.annotations` keys. Following table lists the predefined mappings between annotation keys, cluster titles, and background colors as defined in the [bin/kube-diagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/bin/kube-diagrams.yaml#L97) file.

| Annotation Key |   Cluster Title    |  Background Color  |   Recommended   |
| :------------: | :----------------: | :----------------: | :----------------: |
| `helm.sh/hook` | `annotation value` | ![Static Badge](https://img.shields.io/badge/%20%20%20%20%20%20%20%20%20%20-EBF3E7) | Yes |

New label/annotation-based mappings can be easily defined in custom configuration files (see [examples/minikube/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/minikube/KubeDiagrams.yml#L2), [examples/k0s/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/k0s/KubeDiagrams.yml#L5), [examples/free5gc-k8s/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/free5gc-k8s/KubeDiagrams.yml#L2), [examples/open5gs-k8s/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/open5gs-k8s/KubeDiagrams.yml#L2), [examples/towards5gs-helm/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/towards5gs-helm/KubeDiagrams.yml#L2), [examples/lws/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/lws/KubeDiagrams.yml#L1), and [examples/argo/KubeDiagrams.yaml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/argo/KubeDiagrams.yaml#L9))
and provided to **KubeDiagrams** via the `--config` command-line option.

### Kubernetes resource relationships

With **KubeDiagrams**, each relationship between Kubernetes resources is represented by a visual edge between visual nodes.
Following table lists the predefined edges as defined in the [bin/kube-diagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/bin/kube-diagrams.yaml#L3) file (see the `edges` map).

|    Edge Kind    | Edge Style | Edge Color |                                Meaning                                |
| :-------------: | :--------: | :--------: | :-------------------------------------------------------------------: |
|   `REFERENCE`   |  `solid`   |  `black`   |       Used when a resource refers to another resource directly        |
|   `SELECTOR`    |  `dashed`  |  `black`   |     Used when a resource refers to other resources via a selector     |
|     `OWNER`     |  `dotted`  |  `black`   |              Used when a resource owns another resource               |
| `COMMUNICATION` |  `solid`   |  `brown`   | Used to represent ingress and egress networking policies between pods |

New edges can be easily defined or redefined in custom configuration files, and provided to **KubeDiagrams** via the `--config` command-line option.

Following diagram illustrates all the visual nodes, edges, and clusters supported by default by **KubeDiagrams**.

![semiotics.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/images/semiotics.png).

Generated SVG diagrams contain tooltips for each cluster/node/edge as illustrated in [images/semiotics.svg](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/images/semiotics.svg)

### Declarative custom diagrams

By default, **KubeDiagrams** generates diagrams from data contained into Kubernetes manifest files, actual cluster state, kustomization files, or Helm charts automatically. But sometimes, users would like to customize generated diagrams by adding their own clusters, nodes and edges as illustrated in the following diagram:

[![Custom diagram](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/wordpress/wordpress_deployed_in_aws_eks.png)](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/wordpress/wordpress_deployed_in_aws_eks.png)

This previous diagram contains three custom clusters labelled with `Amazon Web Service`, `Account: Philippe Merle` and `My Elastic Kubernetes Cluster`, three custom nodes labelled with `Users`, `Elastic Kubernetes Services`, and `Philippe Merle`, and two custom edges labelled with `use` and `calls`. The rest of this custom diagram is generated from actual cluster state for a deployed WordPress application automatically.
Have a look to [examples/wordpress/custom_diagram.kd](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/wordpress/custom_diagram.kd), [examples/online-boutique/custom_diagram.kd](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/online-boutique/custom_diagram.kd), and
[examples/custom-object-items/config/custom-object-items.kd](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/custom-object-items/config/custom-object-items.kd) to see how to define custom diagrams, clusters, nodes and edges declaratively.

## KubeDiagrams Interactive Viewer

**KubeDiagrams** could output diagrams in the `dot_json` format. For instance, type:

```sh
kube-diagrams examples/wordpress/*.yaml -o wordpress.dot_json
```

Diagrams in the `dot_json` format can be viewed and manipulated interactively thanks to **KubeDiagrams Interactive Viewer**. For instance, type:

```sh
open interactive_viewer/index.html
```

Then open the `wordpress.dot_json` file:

![KubeDiagrams Interactive Viewer](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/images/KubeDiagrams-Interactive-Viewer.png)

**KubeDiagrams Interactive Viewer** allows users to zoom in/out diagrams, to see cluster/node/edge tooltips, open/close clusters, move clusters/nodes interactively, and save as PNG/JPG images.

## Architecture

Following figure shows the software architecture of **KubeDiagrams**.

![Architecture.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/images/Architecture.png)

## Real-World Use Cases

Following provides links to real-world use cases.

### Documentation

**KubeDiagrams** could be used to generate architectural diagrams documenting your Kubernetes applications (manifests, Helm charts, helmfiles, or cluster state). See following links:

- [duoan/tinyurl](https://github.com/duoan/tinyurl?tab=readme-ov-file#deployment-kubernetes)
- [Daniel-Makhoba-Emmanuel/Full-stack-k8s-lab](https://github.com/Daniel-Makhoba-Emmanuel/Full-stack-k8s-lab)

### Architectural defects identification

Diagrams generated by **KubeDiagrams** could help you to identify architectural defects in your own or used Kubernetes applications. See following links:

- [Gradiant/5g-charts](https://github.com/Gradiant/5g-charts/pull/218)
- [argoproj/argo-cd](https://github.com/argoproj/argo-cd/pull/23313)
- [argoproj/argo-events](https://github.com/argoproj/argo-events/pull/3627)
- [argoproj/argo-helm](https://github.com/argoproj/argo-helm/pull/3350)

### Debugging

Generated diagrams could help you to debug your own or used Kubernetes applications. See following links:

- [How KubeDiagrams Saved My Day While Debugging Kubernetes at Porch](https://www.linkedin.com/feed/update/urn:li:activity:7340773828572172288/)
- [A subtle issue in Kube Prometheus Stack Helm Chart](https://github.com/prometheus-community/helm-charts/issues/6039)

### Your own real-world use cases

Don't hesitate to submit your own real-world use cases as [pull requests](https://github.com/philippemerle/KubeDiagrams/pulls).

## What do they say about it?

### Papers

1. [Visualizing Cloud-native Applications with KubeDiagrams](https://hal.science/hal-05263068). Philippe Merle and Fabio Petrillo. Proceedings of the [13th IEEE Working Conference on Software Visualization - VISSOFT 2025](https://vissoft.io/2025), pp.106-116, Auckland, New Zealand, September 2025.

1. [Visualizing Cloud-native Applications with KubeDiagrams](http://arxiv.org/abs/2505.22879). Philippe Merle and Fabio Petrillo. arXiv. May 28, 2025.

### Talks

1. [Visualizing Cloud-native Applications with KubeDiagrams](https://github.com/philippemerle/KubeDiagrams/blob/main/docs/2025-VISSOFT-slides.pdf), Philippe Merle, Fabio Petrillo. [13th IEEE Working Conference on Software Visualization (VISSOFT 2025)](https://vissoft.io/2025/), Auckland, New Zealand, September 7-8, 2025.

1. [Visualizing cloud-native applications with KubeDiagrams](https://mybox.inria.fr/f/61de0e6e5be94b7a941f/?dl=1), Philippe Merle, [PEPR Cloud Taranis Project](https://pepr-cloud.fr/en/project-taranis/), February 17, 2025.

### Blogs

1. [Visualising the architecture of cloud-native applications with KubeDiagrams](https://www.inria.fr/en/visualising-architecture-cloud-native-applications-kubediagrams), Inria, October 15, 2025.

1. [KubeDiagrams: Automating your Kubernetes Architecture](https://medium.com/@iamdanielemmanuelmark5/kubediagrams-automating-your-kubernetes-architecture-9f9b305a7bb4), Daniel Makhoba Emmanuel, Medium, June 19, 2025.

1. [[Literature Review] Visualizing Cloud-native Applications with KubeDiagrams](https://www.themoonlight.io/en/review/visualizing-cloud-native-applications-with-kubediagrams), Moonlight, May 27, 2025.

1. [KubeDiagrams](https://blog.csdn.net/gitblog_00745/article/details/147113830), CSDN, April 10, 2025.

1. [Generate Kubernetes Architecture Maps Directly from Your Cluster](https://blog.abhimanyu-saharan.com/posts/generate-kubernetes-architecture-maps-directly-from-your-cluster), Abhimanyu Saharan, March 29, 2025.

1. [KubeDiagrams 0.2.0 Makes It Way Easier to Visualize Your Kubernetes Setup](https://medium.com/@PlanB./kubediagrams-0-2-0-makes-it-way-easier-to-visualize-your-kubernetes-setup-bb65dd72668c), Mr.PlanB, Medium, March 27, 2025.

1. [Visualising SQL Server in Kubernetes](https://dbafromthecold.com/2025/02/06/visualising-sql-server-in-kubernetes/), Andrew Pruski, February 6, 2025.

### Social Networks

1. [Online KubeDiagrams Service](https://www.reddit.com/r/kubernetes/comments/1o4lk73/online_kubediagrams_service/), Reddit, October 12, 2025.

1. [Kube Architect's post](https://x.com/K8sArchitect/status/1975578370457964926) on X, October 7, 2025.

1. [Kube Architect's post](https://www.linkedin.com/posts/kubernetes-architect_kubediagrams-reads-kubernetes-manifests-activity-7381344073300979712-pKZa/) on LinkedIn, October 7, 2025.

1. [Kubernetes What's New's post](https://www.linkedin.com/posts/k8snews_heres-your-quick-roundup-of-the-top-kubernetes-activity-7375559648743043072-1e89/) on LinkedIn, September 22, 2025.

1. [KubeDiagrams 0.6.0 is out!](https://www.reddit.com/r/kubernetes/comments/1n86imp/kubediagrams_060_is_out/), Reddit, September 4, 2025.

1. [Evgeny Anikiev's post](https://www.linkedin.com/posts/anikievev_github-philippemerlekubediagrams-generate-activity-7368221605052694528-pB7Y/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAAemi4BApQnQWOvw041B_9Tbc_ljWmw1-E) on LinkedIn, September 2, 2025.

1. [Naveen Dornala's post](https://www.linkedin.com/posts/dornalanaveen_github-philippemerlekubediagrams-generate-activity-7353661169821249536-_E6Z/) on LinkedIn, August, 2025.

1. [Kube Architect's post](https://x.com/K8sArchitect/status/1956434726450860497) on X, August 15, 2025.

1. [Kubernetes Insights Report - July 2025](https://kube.today/kubernetes-insights-july-2025), Kube Today, August 12, 2025.

1. [KubeDiagrams 0.5.0 is out!](https://www.reddit.com/r/kubernetes/comments/1mj1lo8/kubediagrams_050_is_out/), Reddit, August 7, 2025. Announce also available [here](https://www.reddit.com/r/devops/comments/1mj1t4p/kubediagrams_050_is_out/).

1. [Shakur Shaik's post](https://www.linkedin.com/posts/shakur-shaik_use-case-improving-onboarding-for-new-devops-activity-7358598126896582657-5eui/) on LinkedIn, August 6, 2025.

1. [Shakur Shaik's post](https://www.linkedin.com/feed/update/urn:li:activity:7358597890732187648/) on LinkedIn, August 6, 2025.

1. [Python Hub's post](https://x.com/PythonHub/status/1948688533952082043) on X, July 25, 2025.

1. [Alain AIROM's post](https://www.linkedin.com/feed/update/urn:li:activity:7352351521562337280/) on LinkedIn, July 19, 2025.

1. [Christian Josef Aquino's post](https://www.linkedin.com/feed/update/urn:li:activity:7351589120986533889/) on LinkedIn, July 17, 2025.

1. [Daniele Polencic's post](https://x.com/danielepolencic/status/1945447333694419110) on X, July 16, 2025.

1. [Learn Kubernetes Weekly Issue 140](https://www.linkedin.com/posts/danielepolencic_learn-kubernetes-weekly-140-hot-off-the-press-activity-7351213039926349824---gt/), LinkedIn, July 16, 2025.

1. [Python Trending's post](https://x.com/pythontrending/status/1945434488441356341) on X, July 16, 2025.

1. [Kube Architect's post](https://x.com/K8sArchitect/status/1945199450273501291) on X, July 15, 2025.

1. [KubeDiagrams](https://www.reddit.com/r/devops/comments/1lzvsb7/kubediagrams/), Reddit, July 14, 2025.

1. [New Open-Source Tool Spotlight](https://www.instagram.com/p/DLk3_trO5wt/), Instagram, July 2, 2025.

1. [Kube Architect's post](https://x.com/K8sArchitect/status/1939401241953497488) on X, June 29, 2025.

1. [Suman Chakraborty's post](https://www.linkedin.com/posts/schakraborty007_kubernetes-developers-devops-activity-7342764039833296897-0ICb/) on LinkedIn, June 23, 2025.

1. [KubeDiagrams 0.4.0 is out!](https://www.reddit.com/r/kubernetes/comments/1lfzyly/kubediagrams_040_is_out/), Reddit, June 20, 2025.

1. [Syed Mansoor A's post](https://www.linkedin.com/feed/update/urn:li:activity:7340773828572172288/) on LinkedIn, June 19, 2025.

1. [Out Now: Kubernetes Content Performance Analysis Report, May 2025
](https://www.linkedin.com/posts/amitjayshah_out-now-kubernetes-content-performance-activity-7340339887239274496-8Td3/), LinkedIn, June 17, 2025. [Full Report](https://drive.google.com/file/d/1Et8ZnCttdvjhj8cHOwcqVJFZ2iLzIMu_/view).

1. [KubeDiagrams Interactive Viewer](https://www.reddit.com/r/kubernetes/comments/1lbba70/kubediagrams_interactive_viewer/) on Reddit, June 14, 2025.

1. [Mahyar Mirrashed's post](https://www.linkedin.com/feed/update/urn:li:activity:7339156177529774080/) on LinkedIn, June 13, 2025.

1. [Christophe Gourdin's post](https://www.linkedin.com/feed/update/urn:li:activity:7338139783220617216/) on LinkedIn, June 10, 2025.

1. [Preview: Kubernetes Content Performance Analysis Report for May 2025](https://www.linkedin.com/posts/amitjayshah_preview-kubernetes-content-performance-activity-7337803162893885440-Z_Ws/), LinkedIn, June 9, 2025. [Full Report Preview](https://drive.google.com/file/d/1Et8ZnCttdvjhj8cHOwcqVJFZ2iLzIMu_/view).

1. [Mathieu Acher's post](https://x.com/acherm/status/1932032555424928036) on X, June 9, 2025.

1. [Philippe Merle's post](https://www.linkedin.com/feed/update/urn:li:activity:7337365803010338817/) on LinkedIn, June 9, 2025.

1. [KubeDiagrams moved from GPL-3.0 to Apache 2.0 License](https://www.reddit.com/r/kubernetes/comments/1l4djek/kubediagrams_moved_from_gpl30_to_apache_20_license/) on Reddit, June 6, 2025.

1. [Jimmy Song's post](https://x.com/jimmysongio/status/1930073443866722570) on X, June 4, 2025.

1. [Sebastian Sejzer’s post](https://www.facebook.com/groups/860938820648880/posts/9900239206718751/) on Facebook, May 30, 2025.

1. [Donald Lutz’s post](https://www.linkedin.com/posts/donald-lutz-5a9b0b2_github-philippemerlekubediagrams-generate-activity-7334206152311791617-DONS/) on LinkedIn, May 30, 2025.

1. [Dor Ben Dov’s post](https://www.linkedin.com/posts/dorbendov_visualizing-cloud-native-applications-with-activity-7334205615742873600-RUzT/) on LinkedIn, May 30, 2025.

1. [박상길’s post](https://www.linkedin.com/posts/상길-박-b6ab145a_github-philippemerlekubediagrams-generate-activity-7334020967683264513-oBMC/) on LinkedIn, May 30, 2025.

1. [Visualizing Cloud-native Applications with KubeDiagrams](https://www.reddit.com/r/kubernetes/comments/1kyvadz/visualizing_cloudnative_applications_with/) on Reddit, May 30, 2025.

1. [Kubernetes Architect's post](https://www.linkedin.com/posts/kubernetes-architect_kubediagrams-is-a-tool-that-automatically-activity-7333935435754127381-LSV1/) on LinkedIn, May 29, 2025.

1. [Kubernetes Architect's post](https://x.com/K8sArchitect/status/1928169735843180597) on X, May 29, 2025.

1. [KubeDiagrams](https://app.daily.dev/posts/kubediagrams-e35zcloui) on Daily.dev, May 8, 2025.

1. [KubeDiagrams 0.3.0 is out!](https://www.reddit.com/r/kubernetes/comments/1kapc3i/kubediagrams_030_is_out/) on Reddit, April 29, 2025.

1. [JReuben1's post](https://x.com/jreuben1/status/1913635086047596736) on X, April 19, 2025.

1. [Custom declarative diagrams with KubeDiagrams](https://www.reddit.com/r/kubernetes/comments/1k184xj/custom_declarative_diagrams_with_kubediagrams/) on Reddit, April 17, 2025.

1. [DevOps Radar](https://www.linkedin.com/posts/devops-radar_kubernetes-devops-kubediagrams-activity-7310533737325174784-zEJi) on LinkedIn, April 1, 2025.

1. [Gregory Lindner’s post](https://www.linkedin.com/posts/lindnergreg_kubernetes-helm-activity-7310607746469429250-RXKX/) on LinkedIn, March, 2025.

1. [Vishnu Hari Dadhich’s post](https://www.linkedin.com/posts/vishnuhd_kubernetes-devops-kubediagrams-activity-7310533734376579073-y11N/) on LinkedIn, March, 2025.

1. [Rino Rondan’s post](https://www.linkedin.com/posts/rondancesar_kubediagrams-020-makes-it-way-easier-to-activity-7310933226984787968-Tm4X) on LinkedIn, March, 2025.

1. [Michael Cade's post](https://x.com/MichaelCade1/status/1905964723809427625) on X, March 29, 2025.

1. [Paco Xu's post](https://x.com/xu_paco/status/1904807247206899941) on X, March 26, 2025.

1. [KubeDiagrams 0.2.0 is out!](https://www.reddit.com/r/kubernetes/comments/1jjjw6j/kubediagrams_020_is_out/) on Reddit, March 25, 2025.

1. [KubeDiagrams: Revolutionizing Cloud Cluster Management!
   ](https://www.linkedin.com/posts/pepr-cloud_kubediagrams-activity-7307698605371379713-BqRp/) on LinkedIn, March 18, 2025.

1. [Anyone know of any repos/open source tools that can create k8 diagrams?](https://www.reddit.com/r/kubernetes/comments/1jabdoa/anyone_know_of_any_reposopen_source_tools_that/) on Reddit, March 13, 2025.

1. [Automation of diagram creation for Kubernetes](https://tlgrm.ru/channels/@devsecops_weekly/1145), DevSecOps, February/March 2025.

1. [Facebook Kubernetes Users Group](https://www.facebook.com/groups/kubernetes.users/permalink/2818586068320504), February 6, 2025.

1. [KubeDiagrams](https://www.reddit.com/r/kubernetes/comments/1ihjujy/kubediagrams) on Reddit, February 4, 2025.

### Referencing sites

1. [Cloud Native Landscape](https://landscape.cncf.io/)

1. [Awesome Cloud Native](https://github.com/rootsongjc/awesome-cloud-native)

1. [Awesome-Kubernetes](https://github.com/ramitsurana/awesome-kubernetes)

1. [Awesome Kubernetes Resources](https://github.com/tomhuang12/awesome-k8s-resources)

1. [Awesome Open Source K8s And Container Tools](https://github.com/vilaca/awesome-k8s-tools)

1. [Kubetools - Curated List of Kubernetes Tools](https://github.com/collabnix/kubetools/)

1. [GitHub mingrammer/diagrams](https://github.com/mingrammer/diagrams)

1. [Tool of the day](https://www.techopsexamples.com/p/understanding-kubernetes-etcd-locks), TechOps Examples, February 11, 2025.

1. [Papers with Code](https://cs.paperswithcode.com/)

### Your own contributions

Don't hesitate to submit your own papers, talks, blogs, social network posts, and referencing sites as [pull requests](https://github.com/philippemerle/KubeDiagrams/pulls).

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=philippemerle/KubeDiagrams&type=Date)](https://www.star-history.com/#philippemerle/KubeDiagrams&Date)

## Issue Stats

[Issue Stats](https://issues.ecosyste.ms/hosts/GitHub/repositories/philippemerle%2FKubeDiagrams)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](https://github.com/philippemerle/KubeDiagrams/blob/main/LICENSE) file for details.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fphilippemerle%2FKubeDiagrams.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fphilippemerle%2FKubeDiagrams?ref=badge_large&issueType=license)
