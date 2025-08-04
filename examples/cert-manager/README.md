# `cert-manager` Example

This example is dedicated to **[cert-manager](https://cert-manager.io/)** example.

## Instructions

Generate the Kubernetes architecture diagrams for **[cert-manager](https://cert-manager.io/)** example:

```sh
$ generate.sh
```

## Generated architecture diagrams

Architecture diagram for **[cert-manager](https://cert-manager.io/)** Helm Chart:

![diagrams/cert-manager-helm-chart.png](diagrams/cert-manager-helm-chart.png)

Architecture diagram for **[cert-manager](https://cert-manager.io/)** Helm Chart including CRDs:

![diagrams/cert-manager-with-crds-helm-chart.png](diagrams/cert-manager-with-crds-helm-chart.png)

Architecture diagram for **[Rancher Helm Chart](https://artifacthub.io/packages/helm/rancher-stable/rancher)** using `cert-manager`:

![diagrams/rancher.png](diagrams/rancher.png)

Architecture diagram for **[FQDN Controller Helm Chart](https://artifacthub.io/packages/helm/fqdn-controller/fqdn-controller)** using `cert-manager`:

![diagrams/fqdn-controller.png](diagrams/fqdn-controller.png)

Architecture diagram for **[Mozilla securitywiki](manifests/mozilla-securitywiki.yaml)** using `cert-manager`:

![diagrams/mozilla-securitywiki.png](diagrams/mozilla-securitywiki.png)

Architecture diagram for **[ClusterIssuer resources](manifests/cluster-issuers.yaml)**:

![diagrams/cluster-issuers.png](diagrams/cluster-issuers.png)
