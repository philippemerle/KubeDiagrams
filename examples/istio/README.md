# Istio Example

This example is dedicated to **[Istio](https://istio.io)**.

## Instructions

Generate the Kubernetes architecture diagrams for Istio Helm charts and helmfile:
```sh
$ ./generate.sh
```

## Generated architecture diagrams

Architecture diagram for [Istio base Helm Chart](https://artifacthub.io/packages/helm/istio-official/base):

![base.png](base.png)

Architecture diagram for [Istiod Helm Chart](https://artifacthub.io/packages/helm/istio-official/istiod):

![istiod.png](istiod.png)

Architecture diagram for [Istio Gateway Helm Chart](https://artifacthub.io/packages/helm/istio-official/gateway):

![gateway.png](gateway.png)

Architecture diagram for [Istio CNI Helm Chart](https://artifacthub.io/packages/helm/istio-official/cni):

![cni.png](cni.png)

Architecture diagram for [Istio Ztunnel Helm Chart](https://artifacthub.io/packages/helm/istio-official/ztunnel):

![ztunnel.png](ztunnel.png)

Architecture diagram for [Istio Ambient Helm Chart](https://artifacthub.io/packages/helm/istio-official/ambient):

![ambient.png](ambient.png)

Architecture diagram for [Istiod Remote Helm Chart](https://artifacthub.io/packages/helm/istio-official/istiod-remote):

![istiod-remote.png](istiod-remote.png)

Architecture diagram for [istio-all.yaml helmfile](istio-all.yaml):

![istio-all.png](istio-all.png)

Architecture diagram for [istio-all.yaml helmfile](istio-all.yaml) with all namespaces:

![istio-all-namespaces.png](istio-all-namespaces.png)

Architecture diagram for [istio-all.yaml helmfile](istio-all.yaml) with focus on all Helm charts:

![istio-all-helm-charts.png](istio-all-helm-charts.png)

Architecture diagram for [istio-all.yaml helmfile](istio-all.yaml) with focus on all application clusters:

![istio-all-applications.png](istio-all-applications.png)
