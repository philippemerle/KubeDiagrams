# Gateway API Example

This example is dedicated to **[Gateway API](https://gateway-api.sigs.k8s.io)**.

## Supported Gateway Resources

|               Kind               |            ApiGroup            |           Versions            |                                                                          Icon                                                                          |
| :------------------------------: | :----------------------------: | :---------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------: |
|           `BackendTLSPolicy`           |    `gateway.networking.k8s.io`    |        `v1`         |                  ![BackendTLSPolicy](../../bin/icons/BackendTLSPolicy.png)                  |
|           `Gateway`           |    `gateway.networking.k8s.io`    |        `v1`         |                  ![Gateway](../../bin/icons/Gateway.png)                  |
|           `GatewayClass`           |    `gateway.networking.k8s.io`    |        `v1`         |                  ![GatewayClass](../../bin/icons/GatewayClass.png)                  |
|           `GRPCRoute`           |    `gateway.networking.k8s.io`    |        `v1`         |                  ![GRPCRoute](../../bin/icons/GRPCRoute.png)                  |
|           `HTTPRoute`           |    `gateway.networking.k8s.io`    |        `v1`         |                  ![HTTPRoute](../../bin/icons/HTTPRoute.png)                  |
|           `ListenerSet`           |    `gateway.networking.k8s.io`    |        `v1`         |                  ![ListenerSet](../../bin/icons/ListenerSet.png)                  |
|           `ReferenceGrant`           |    `gateway.networking.k8s.io`    |        `v1`         |                  ![ReferenceGrant](../../bin/icons/ReferenceGrant.png)                  |
|           `TLSRoute`           |    `gateway.networking.k8s.io`    |        `v1`         |                  ![TLSRoute](../../bin/icons/TLSRoute.png)                  |

## Instructions

Generate the Kubernetes architecture diagrams for Gateway API examples available [here](manifests/):
```sh
$ ./generate.sh
```

## Generated architecture diagrams

Architecture diagram for the [simple gateway](manifests/standard/simple-gateway/) example:

![diagrams/simple-gateway.png](diagrams/simple-gateway.png)

Architecture diagram for the [HTTP routing](manifests/standard/http-routing/) example:

![diagrams/http-routing.png](diagrams/http-routing.png)

Architecture diagram for the [GRPC routing](manifests/standard/grpc-routing/) example:

![diagrams/grpc-routing.png](diagrams/grpc-routing.png)

Architecture diagram for the [TLS routing](manifests/standard/tls-routing/) example:

![diagrams/tls-routing.png](diagrams/tls-routing.png)

Architecture diagram for the [listenerset](manifests/standard/listenerset/) example:

![diagrams/listenerset.png](diagrams/listenerset.png)

All other generated diagrams are available [here](diagrams/).
