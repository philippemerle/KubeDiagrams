# k0s Example

This example provides architecture diagrams for **[k0s: Zero Friction Kubernetes](https://k0sproject.io/)**.

## Instructions

Start a minimal **k0s** cluster (see [here](https://docs.k0sproject.io/stable/install/)).

Generate some **k0s** architecture diagrams:

```sh
$ ./generate.sh
```
## Generated architecture diagrams

**Note**: As shown in following architecture diagrams, **k0s** provides several custom resource definitions (CRD) and instantiates both `ControlPlane` and `EtcdMember` custom resources.
Look at [KubeDiagrams.yml](KubeDiagrams.yml#L10) to see how **KubeDiagrams** could be configured to deal with these custom resources.

Architecture diagram of all **k0s** resources except for RBAC ones:
![k0s-without-rbac.png](k0s-without-rbac.png)

**Note**: [k0s-without-rbac-corrected.yml](k0s-without-rbac-corrected.yml) was manually corrected to better clustering some **k0s** resources (see `#TBR:` and `#ADDED:` comments).

Corrected architecture diagram of all **k0s** resources except for RBAC ones:
![k0s](k0s-without-rbac-corrected.png)

Architecture diagram of all **k0s** resources:
![k0s.png](k0s.png)
