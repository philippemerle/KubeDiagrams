# towards5gs-helm Example

This example is based on **[towards5gs-helm](https://github.com/Orange-OpenSource/towards5gs-helm)**.

## Instructions

Generate the Kubernetes architecture diagrams for **towards5gs-helm** charts:

```sh
$ ./generate.sh
```

## Generated architecture diagrams

Architecture diagram for the **towards5gs/free5gc** chart:
![towards5gs_free5gc.png](towards5gs_free5gc.png)

Architecture diagram for the **towards5gs/ueransim** chart:
![towards5gs_ueransim.png](towards5gs_ueransim.png)

**Note**: The previous diagram shows that metadata labels seem to be incorrectly used in the **towards5gs/ueransim** chart. File [towards5gs_ueransim-corrected.yaml](towards5gs_ueransim-corrected.yaml) proposes some possible corrections illustrated in the following diagram.

![towards5gs_ueransim-corrected.png](towards5gs_ueransim-corrected.png)

Same diagram but without namespace:
![towards5gs_ueransim-corrected-without-namespace.png](towards5gs_ueransim-corrected-without-namespace.png)
