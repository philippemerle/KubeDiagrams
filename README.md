# KubeDiagrams

[![license](https://img.shields.io/github/license/philippemerle/KubeDiagrams)](https://github.com/philippemerle/KubeDiagrams/blob/main/LICENSE)
![python version](https://img.shields.io/badge/python-%3E%3D%203.9-blue?logo=python)
[![pypi version](https://badge.fury.io/py/KubeDiagrams.svg)](https://badge.fury.io/py/KubeDiagrams)
[![PyPI Downloads](https://static.pepy.tech/badge/kubediagrams)](https://pepy.tech/projects/kubediagrams)
[![Docker Stars](https://img.shields.io/docker/stars/philippemerle/kubediagrams)](https://hub.docker.com/r/philippemerle/kubediagrams)
[![Docker Image Version](https://img.shields.io/docker/v/philippemerle/kubediagrams)](https://hub.docker.com/r/philippemerle/kubediagrams)
[![Docker Pulls](https://img.shields.io/docker/pulls/philippemerle/kubediagrams)](https://hub.docker.com/r/philippemerle/kubediagrams)
![contributors](https://img.shields.io/github/contributors/philippemerle/KubeDiagrams)

![KubeDiagrams Logo](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/images/KubeDiagrams.png)

Generate Kubernetes architecture diagrams from Kubernetes manifest files, kustomization files, Helm charts, and actual cluster state.

There are several tools to generate Kubernetes architecture diagrams (see **[here](https://github.com/philippemerle/Awesome-Kubernetes-Architecture-Diagrams)**).
The main originality of **KubeDiagrams** is its **[configurability](https://github.com/philippemerle/KubeDiagrams/blob/main/bin/kube-diagrams.yaml)** allowing for instance to deal with custom Kubernetes resources.

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

Many other architecture diagrams are available into [examples/](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/).

All the examples are
1. [official Kubernetes WordPress tutorial](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/wordpress/)
1. [official Kubernetes ZooKeeper tutorial](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/zookeeper/)
1. [official Kubernetes Cassandra tutorial](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/cassandra/)
1. [Train Ticket](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/train-ticket/)
1. [minikube architecture diagrams](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/minikube/)
1. [k0s architecture diagrams](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/k0s/)
1. [Kube Prometheus Stack](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/kube-prometheus-stack/)
1. [free5gc-k8s](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/free5gc-k8s/)
1. [open5gs-k8s](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/open5gs-k8s/)
1. [Towards5GS-helm](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/towards5gs-helm/)
1. [OpenAirInterface 5G Core Network](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/oai-5g-cn/)
1. [docker-open5gs](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/docker-open5gs/)
1. [Miscellaneous examples](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/miscellaneous/)
1. [Some Helm charts](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/helm-charts/)
1. [LeaderWorkerSet API](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/lws/)

## Prerequisites

Following software must be installed:
* [Python](https://www.python.org) 3.9 or higher
* `dot` command ([Graphviz](https://www.graphviz.org/))

## Getting Started

Following command installs **KubeDiagrams** and all its Python dependencies, i.e., [PyYAML](https://pyyaml.org) and [Diagrams](https://diagrams.mingrammer.com/).

```ssh
# using pip (pip3)
pip install KubeDiagrams
```

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
  -o OUTPUT, --output OUTPUT
                        output diagram filename
  -f FORMAT, --format FORMAT
                        output format, allowed formats are png (default), jpg, svg, pdf, and dot
  -c CONFIG, --config CONFIG
                        custom kube-diagrams configuration file
  -v, --verbose         verbosity, set to false by default
  --without-namespace   disable namespace cluster generation
```
Examples:
```ssh
# generate a diagram from a manifest
kube-diagrams -o cassandra.png examples/cassandra/cassandra.yml

# generate a diagram from a kustomize folder
kubectl kustomize path_to_a_kustomize_folder | kube-diagrams - -o diagram.png

# generate a diagram from the actual default namespace state
kubectl get all -o yaml | kube-diagrams -o default-namespace.png -

# generate a diagram of all workload and service resources from all namespaces
kubectl get all --all-namespaces -o yaml | kube-diagrams -o all-namespaces.png -
```

### `helm-diagrams`

`helm-diagrams` generates a Kubernetes architecture diagram from an Helm chart.

`helm-diagrams` takes only one argument - the URL of the Helm chart - but requires that the `helm` command was installed.

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

# generate a diagram from the actual default namespace state
kubectl get all -o yaml | docker run -v "$(pwd)":/work -i philippemerle/kubediagrams kube-diagrams -o default-namespace.png -

# generate a diagram of all workload and service resources from all namespaces
kubectl get all --all-namespaces -o yaml | docker run -v "$(pwd)":/work -i philippemerle/kubediagrams kube-diagrams -o all-namespaces.png -

# generate a diagram for the Helm chart 'cert-manager' available in HTTP repository 'charts.jetstack.io'
docker run -v "$(pwd)":/work philippemerle/kubediagrams helm-diagrams https://charts.jetstack.io/cert-manager

# generate a diagram for the Helm chart 'argo-cd' available in OCI repository 'ghcr.io'
docker run -v "$(pwd)":/work philippemerle/kubediagrams helm-diagrams oci://ghcr.io/argoproj/argo-helm/argo-cd
```

## Features

### Kubernetes resources

**KubeDiagrams** supported the following 47 Kubernetes resource types:

| Kind          | ApiGroup                    | Versions | Icon |
| :--------: | :-------: | :-------: | :-------: |
| `APIService` | `apiregistration.k8s.io` | `v1beta1` `v1` | ![APIService](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/apiservice.png) |
| `ClusterRole` | `rbac.authorization.k8s.io` | `v1beta1` `v1` | ![ClusterRole](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/c-role-128.png) |
| `ClusterRoleBinding` | `rbac.authorization.k8s.io` | `v1beta1` `v1` | ![ClusterRoleBinding](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/crb-128.png) |
| `ConfigMap` | | `v1` | ![ConfigMap](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/cm-128.png) |
| `CronJob` | `batch` | `v1beta1` `v1` | ![CronJob](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/cronjob-128.png) |
| `CSIDriver` | `storage.k8s.io` | `v1beta1` `v1` | ![CSIDriver](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/csidriver.png) |
| `CSINode` | `storage.k8s.io` | `v1` | ![CSINode](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/csinode.png) |
| `CSIStorageCapacity` | `storage.k8s.io` | `v1` | ![CSIStorageCapacity](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/csisc.png) |
| `CustomResourceDefinition` | `apiextensions.k8s.io` | `v1beta1` `v1` | ![CustomResourceDefinition](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/crd-128.png) |
| `DaemonSet` | `apps` | `v1beta2` `v1` | ![DaemonSet](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ds-128.png) |
| `Deployment` | `apps` | `v1beta1` `v1beta2` `v1` | ![Deployment](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/deploy-128.png) |
| `Endpoints` | | `v1` | ![Endpoints](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ep-128.png) |
| `EndpointSlice` | `discovery.k8s.io` | `v1` | ![EndpointSlice](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/eps.png) |
| `Group` | `rbac.authorization.k8s.io` | `v1` | ![Group](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/group-128.png) |
| `HorizontalPodAutoscaler` | `autoscaling` | `v1` `v2beta1` `v2beta2` `v2` | ![HorizontalPodAutoscaler](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/hpa-128.png) |
| `Ingress` | `networking.k8s.io` | `v1beta1` `v1` | ![Ingress](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ing-128.png) |
| `IngressClass` | `networking.k8s.io` | `v1beta1` `v1` | ![IngressClass](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/ic.png) |
| `Job` | `batch` | `v1beta1` `v1` | ![Job](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/job-128.png) |
| `Lease` | `coordination.k8s.io` | `v1` | ![Lease](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/lease.png) |
| `LimitRange` | | `v1` | ![LimitRange](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/limits-128.png) |
| `MutatingWebhookConfiguration` | `admissionregistration.k8s.io` | `v1beta1` `v1` | ![MutatingWebhookConfiguration](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/mwc.png) |
| `Namespace` | | `v1` | ![Namespace](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ns-128.png) |
| `NetworkAttachmentDefinition` | `k8s.cni.cncf.io` | `v1` | ![NetworkAttachmentDefinition](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/azure/network/network-interfaces.png) |
| `NetworkPolicy` | `networking.k8s.io` | `v1` | ![NetworkPolicy](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/netpol-128.png) |
| `Node` | | `v1` | ![Node](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/infrastructure_components/labeled/node-128.png) |
| `PersistentVolume` | | `v1` | ![PersistentVolume](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pv-128.png) |
| `PersistentVolumeClaim` | | `v1` | ![PersistentVolumeClaim](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pvc-128.png) |
| `Pod` | | `v1` | ![Pod](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pod-128.png) |
| `PodDisruptionBudget` | `policy` | `v1beta1` `v1` | ![PodDisruptionBudget](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/pdb.png) |
| `PodSecurityPolicy` | `policy` | `v1beta1` `v1` | ![PodSecurityPolicy](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/psp-128.png) |
| `PodTemplate` | | `v1` | ![PodTemplate](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/podtemplate.png) |
| `PriorityClass` | `scheduling.k8s.io` | `v1beta1` `v1` | ![PriorityClass](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/pc.png) |
| `ReplicaSet` | `apps` | `v1` | ![ReplicaSet](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/rs-128.png) |
| `ReplicationController` | | `v1` | ![ReplicationController](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/rc.png) |
| `ResourceQuota` | | `v1` | ![ResourceQuota](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/quota-128.png) |
| `Role` | `rbac.authorization.k8s.io` | `v1beta1` `v1` | ![Role](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/role-128.png) |
| `RoleBinding` | `rbac.authorization.k8s.io` | `v1beta1` `v1` | ![RoleBinding](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/rb-128.png) |
| `RuntimeClass` | `node.k8s.io` | `v1` | ![RuntimeClass](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/runtimeclass.png) |
| `Secret` | | `v1` | ![Secret](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/secret-128.png) |
| `Service` | | `v1` | ![Service](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/svc-128.png) |
| `ServiceAccount` | | `v1` | ![ServiceAccount](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sa-128.png) |
| `StatefulSet` | `apps` | `v1beta1` `v1beta2` `v1` | ![StatefulSet](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sts-128.png) |
| `StorageClass` | `storage.k8s.io` | `v1beta1` `v1` | ![StorageClass](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sc-128.png) |
| `User` | `rbac.authorization.k8s.io` | `v1` | ![User](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/user-128.png) |
| `ValidatingWebhookConfiguration` | `admissionregistration.k8s.io` | `v1beta1` `v1` | ![ValidatingWebhookConfiguration](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/vwc.png) |
| `VerticalPodAutoscaler` | `autoscaling.k8s.io` | `v1` | ![VerticalPodAutoscaler](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/bin/icons/vpa.png) |
| `VolumeAttachment` | `storage.k8s.io` | `v1` | ![VolumeAttachment](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/vol-128.png) |

**Note**: The mapping between these supported Kubernetes resources and architecture diagrams is defined into [bin/kube-diagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/bin/kube-diagrams.yaml#L61).

**Note**: The mapping for any Kubernetes custom resources can be also defined into **KubeDiagrams** configuration files as illustrated in [examples/k0s/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/k0s/KubeDiagrams.yml#L10), [examples/kube-prometheus-stack/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/kube-prometheus-stack/KubeDiagrams.yaml#L3), and [examples/lws/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/lws/KubeDiagrams.yml#L17).

Currently, there are 15 unsupported Kubernetes resource types:

| Kind          | ApiGroup                    |
| :--------: | :-------: |
| `Binding` | |
| `ComponentStatus` | |
| `Event`| |
| `ControllerRevision` | `apps`|
| `TokenReview` | `authentication.k8s.io`|
| `LocalSubjectAccessReview` | `authorization.k8s.io` |
| `SelfSubjectAccessReview` | `authorization.k8s.io` |
| `SelfSubjectRulesReview` | `authorization.k8s.io` |
| `SubjectAccessReview` | `authorization.k8s.io`|
| `CertificateSigningRequest` | `certificates.k8s.io` |
| `Event` | `events.k8s.io` |
| `FlowSchema` | `flowcontrol.apiserver.k8s.io` |
| `PriorityLevelConfiguration`  | `flowcontrol.apiserver.k8s.io` |
| `NodeMetrics` | `metrics.k8s.io` |
| `PodMetrics` |  `metrics.k8s.io` |

### Kubernetes resources clustering

With **KubeDiagrams**, Kubernetes resources can be clustered within the architecture diagrams automatically. **KubeDiagrams** uses the `metadata.namespace` resource field as first clustering criteria. Then, the `metadata.labels` keys can be used to define subclusters. Following table lists the predefined mappings between label keys and cluster titles as defined in the [bin/kube-diagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/bin/kube-diagrams.yaml#L33) file (see the `clusters` list).

| Label | Cluster Title |
| :--------: | :-------: |
| `app.kubernetes.io/instance` | K8s Instance |
| `release` | Release |
| `helm.sh/chart` | Helm Chart |
| `chart` | Chart |
| `app.kubernetes.io/name` | K8s Application |
| `app` | Application |
| `app.kubernetes.io/component` | K8s Component |
| `service` | Microservice |
| `tier` | Tier |

New mappings can be easily defined in custom configuration files (see [examples/minikube/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/minikube/KubeDiagrams.yml#L2), [examples/k0s/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/k0s/KubeDiagrams.yml#L5), [examples/free5gc-k8s/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/free5gc-k8s/KubeDiagrams.yml#L2),  [examples/open5gs-k8s/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/open5gs-k8s/KubeDiagrams.yml#L2), [examples/towards5gs-helm/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/towards5gs-helm/KubeDiagrams.yml#L2), and [examples/lws/KubeDiagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/examples/lws/KubeDiagrams.yml#L1))
 and provided to **KubeDiagrams** via the `--config` command-line option.

### Kubernetes resource relationships

With **KubeDiagrams**, each relationship between Kubernetes resources is represented by a visual edge between visual nodes.
Following table lists the predefined edges as defined in the [bin/kube-diagrams.yml](https://github.com/philippemerle/KubeDiagrams/blob/main/bin/kube-diagrams.yaml#L3) file (see the `edges` map).

| Edge Kind  | Edge Style | Edge Color | Meaning |
| :--------: | :--------: | :-------:  | :-------: |
| `REFERENCE` | `solid` | `black` | Used when a resource refers to another resource directly |
| `SELECTOR` | `dashed` | `black` | Used when a resource refers to other resources via a selector |
| `OWNER` | `dotted` | `black` | Used when a resource owns another resource |
| `COMMUNICATION` | `solid` | `brown` | Used to represent ingress and egress networking policies between pods |

New edges can be easily defined or redefined in custom configuration files, and provided to **KubeDiagrams** via the `--config` command-line option.

Following diagram illustrates all the visual nodes, edges, and clusters supported by default by **KubeDiagrams**.

![semiotics.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/images/semiotics.png)

### Custom diagrams

By default, **KubeDiagrams** generates diagrams from data contained into Kubernetes manifest files, actual cluster state, kustomization files, or Helm charts automatically. But sometimes, users would like to customize generated diagrams by adding their own clusters, nodes and edges as illustrated in the following diagram:

[![Custom diagram](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/wordpress/wordpress_deployed_in_aws_eks.png)](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/wordpress/wordpress_deployed_in_aws_eks.png)

This previous diagram contains three custom clusters labelled with `Amazon Web Service`, `Account: Philippe Merle` and `My Elastic Kubernetes Cluster`, three custom nodes labelled with `Users`, `Elastic Kubernetes Services`, and `Philippe Merle`, and two custom edges labelled with `use` and `calls`. The rest of this custom diagram is generated from actual cluster state for a deployed WordPress application automatically.
See [examples/wordpress/custom_diagram.kd](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/examples/wordpress/custom_diagram.kd) to define custom diagrams, clusters, nodes and edges declaratively.

### GitHub Action

You can use Kube Diagrams (and Helm Diagrams) in your GitHub Action workflows.

```yaml
name: "Your GitHub Action Name"
on:
  workflow_dispatch: # add your specific triggers (https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: "Generate diagram from Helm chart"
        uses: philippemerle/KubeDiagrams@main
        with:
          type: "helm"
          args: 'https://charts.jetstack.io/cert-manager'
```

## Architecture

Following figure shows the software architecture of **KubeDiagrams**.

![Architecture.png](https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/images/Architecture.png)

## What do they say about it?

### Talks

1. [Visualizing cloud-native applications with KubeDiagrams](https://mybox.inria.fr/f/61de0e6e5be94b7a941f/?dl=1), Philippe Merle, [PEPR Cloud Taranis Project](https://pepr-cloud.fr/en/project-taranis/), February 17, 2025.

### Blogs

1. [KubeDiagrams](https://blog.csdn.net/gitblog_00745/article/details/147113830), CSDN, April 10, 2025.

1. [Generate Kubernetes Architecture Maps Directly from Your Cluster](https://blog.abhimanyu-saharan.com/posts/generate-kubernetes-architecture-maps-directly-from-your-cluster), Abhimanyu Saharan, March 29, 2025.

1. [KubeDiagrams 0.2.0 Makes It Way Easier to Visualize Your Kubernetes Setup](https://medium.com/@PlanB./kubediagrams-0-2-0-makes-it-way-easier-to-visualize-your-kubernetes-setup-bb65dd72668c), Mr.PlanB, Medium, March 27, 2025.

1. [Visualising SQL Server in Kubernetes](https://dbafromthecold.com/2025/02/06/visualising-sql-server-in-kubernetes/), Andrew Pruski, February 6, 2025.

### Social Networks

1. [JReuben1's post](https://x.com/jreuben1/status/1913635086047596736) on X, April 19, 2025.

1. [Custom declarative diagrams with KubeDiagrams](https://www.reddit.com/r/kubernetes/comments/1k184xj/custom_declarative_diagrams_with_kubediagrams/) on Reddit, April 17, 2025.

1. [DevOps Radar](https://www.linkedin.com/posts/devops-radar_kubernetes-devops-kubediagrams-activity-7310533737325174784-zEJi) on LinkedIn, April 1, 2025.

1. [Michael Cade's post](https://x.com/MichaelCade1/status/1905964723809427625) on X, March 29, 2025.

1. [Paco Xu's post](https://x.com/xu_paco/status/1904807247206899941) on X, March 26, 2025.

1. [KubeDiagrams 0.2.0 is out!](https://www.reddit.com/r/kubernetes/comments/1jjjw6j/kubediagrams_020_is_out/) on Reddit, March 25, 2025.

1. [KubeDiagrams: Revolutionizing Cloud Cluster Management!
](https://www.linkedin.com/posts/pepr-cloud_kubediagrams-activity-7307698605371379713-BqRp?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAAemi4BApQnQWOvw041B_9Tbc_ljWmw1-E) on LinkedIn, March 18, 2025.

1. [Anyone know of any repos/open source tools that can create k8 diagrams?](https://www.reddit.com/r/kubernetes/comments/1jabdoa/anyone_know_of_any_reposopen_source_tools_that/) on Reddit, March 13, 2025.

1. [Automation of diagram creation for Kubernetes](https://tlgrm.ru/channels/@devsecops_weekly/1145), DevSecOps, February/March 2025.

1. [Facebook Kubernetes Users Group](https://www.facebook.com/groups/kubernetes.users/permalink/2818586068320504), February 6, 2025.

1. [KubeDiagrams](https://www.reddit.com/r/kubernetes/comments/1ihjujy/kubediagrams) on Reddit, February 4, 2025.

### Referencing

1. [Cloud Native Landscape](https://landscape.cncf.io/)

1. [Awesome Open Source K8s And Container Tools](https://github.com/vilaca/awesome-k8s-tools)

1. [Kubetools - Curated List of Kubernetes Tools](https://github.com/collabnix/kubetools/)

1. [GitHub mingrammer/diagrams](https://github.com/mingrammer/diagrams)

1. [Tool of the day](https://www.techopsexamples.com/p/understanding-kubernetes-etcd-locks), TechOps Examples, February 11, 2025.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=philippemerle/KubeDiagrams&type=Date)](https://www.star-history.com/#philippemerle/KubeDiagrams&Date)

## License

This project is licensed under the GPL-3.0 license - see the [LICENSE](https://github.com/philippemerle/KubeDiagrams/blob/main/LICENSE) file for details.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fphilippemerle%2FKubeDiagrams.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fphilippemerle%2FKubeDiagrams?ref=badge_large&issueType=license)
