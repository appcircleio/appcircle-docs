---
title: Service Memory Limits
description: See the memory limit and reservation of each self-hosted Appcircle server service, and change them in the global.yaml file.
tags: [self-hosted, advanced configuration, system optimization, docker, podman]
sidebar_position: 13
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SpacetechExampleInfo from '@site/docs/self-hosted-appcircle/install-server/linux-package/configure-server/\_spacetech-example-info.mdx';
import RestartAppcircleServer from '@site/docs/self-hosted-appcircle/install-server/linux-package/configure-server/\_restart-appcircle-server.mdx';
import DowntimeCaution from '@site/docs/self-hosted-appcircle/install-server/linux-package/configure-server/\_appcircle-server-downtime-caution.mdx';
import NeedHelp from '@site/docs/\_need-help.mdx';

## Overview

The Appcircle server runs each service in its own container. Each container has two memory settings:

- **Limit**: the most memory the service can use. If a service uses more, the kernel stops it and the container restarts automatically. The host and the other services keep running.
- **Reservation**: the memory the kernel protects for the service when the host runs low on memory.

The default values below fit most installations. If a service restarts because it reaches its limit, raise the limit of that service first. On Docker, add [replicas](#services-with-replicas) when the load, such as the number of concurrent users or builds, grows.

:::info
Per-service memory limits are available in Appcircle server `3.34.5` and later, on both Docker and Podman.
:::

## Default Values

The table shows the default limit and reservation of each container in MiB. Setup containers run once during `up` and exit when they finish.

| Container                                            | Limit (MiB) | Reservation (MiB) |
| ---------------------------------------------------- | ----------- | ----------------- |
| `agent_cache`                                        | 640         | 128               |
| `api_gateway`                                        | 896         | 128               |
| `app_parser`                                         | 9216        | 128               |
| `build`                                              | 3456        | 256               |
| `codepush`                                           | 896         | 128               |
| `distribution`                                       | 2560        | 128               |
| `grafana`                                            | 256         | 128               |
| `kafka`                                              | 2560        | 1024              |
| `kafka_zookeeper`                                    | 768         | 128               |
| `keycloak`                                           | 1536        | 768               |
| `keycloak_migration` (setup)                         | 1536        | 768               |
| `license`                                            | 1024        | 256               |
| `loki`                                               | 640         | 256               |
| `mcp`                                                | 256         | 128               |
| `minio_1` to `minio_4` (deprecated multi-node MinIO) | 3072        | 640               |
| `minio_setup` (setup)                                | 256         | 64                |
| `mongo_setup` (setup)                                | 512         | 64                |
| `nginx`                                              | 384         | 128               |
| `notification`                                       | 896         | 128               |
| `otp`                                                | 256         | 128               |
| `postgres`                                           | 384         | 128               |
| `publish`                                            | 1152        | 256               |
| `redis`                                              | 512         | 64                |
| `report`                                             | 896         | 128               |
| `resign`                                             | 384         | 128               |
| `resource`                                           | 3072        | 128               |
| `schedule_service`                                   | 512         | 128               |
| `signing_identity`                                   | 896         | 128               |
| `sms` (when enabled)                                 | 512         | 128               |
| `snsd` (MinIO)                                       | 3072        | 640               |
| `store_admin`                                        | 512         | 128               |
| `store_api`                                          | 768         | 128               |
| `store_profile`                                      | 640         | 128               |
| `store_report`                                       | 640         | 128               |
| `store_setup` (setup, custom store domain only)      | 256         | 64                |
| `store_submit`                                       | 512         | 128               |
| `store_web`                                          | 640         | 128               |
| `task`                                               | 384         | 128               |
| `tester_admin`                                       | 640         | 128               |
| `tester_api`                                         | 2816        | 128               |
| `tester_web`                                         | 640         | 128               |
| `vault`                                              | 640         | 128               |
| `web_app`                                            | 256         | 128               |
| `web_event`                                          | 512         | 128               |
| `web_event_redis`                                    | 512         | 64                |
| `web_event_redis_replica`                            | 512         | 64                |
| `webhook`                                            | 512         | 128               |

The limits add up to more than the memory of most hosts. This is expected, because the services do not reach their limits at the same time. Limits are ceilings: memory that the services do not use works as the kernel's file cache, for example for MinIO and MongoDB data, so it is not wasted.

MongoDB is the only part that uses a share of the host memory instead: the MongoDB primary uses up to 25% and each of the 2 secondaries up to 12.5%.

## Number of Services

With the default configuration, the Appcircle server runs 44 containers:

- 41 containers from the [Default Values](#default-values) table, without the setup containers, `minio_1` to `minio_4`, `sms` and `store_setup`.
- 3 MongoDB containers.

The setup containers `minio_setup`, `mongo_setup` and `keycloak_migration` also run during `up` and exit when they finish. If you use the [Enterprise App Store and Testing Distribution in DMZ](/self-hosted-appcircle/install-server/linux-package/configure-server/advanced-configuration/store-dist-dmz) setup, `store_web` and `tester_web` run on the Appcircle DMZ server instead.

### Services With Replicas

On Docker, some services can run more than one replica, that is, more than one copy of the same container. By default, every service runs one replica. On Podman, every service runs one container and the replica count is not used.

The limit and the reservation apply to each replica. A service with 2 replicas can use up to 2 times its limit, and reserves 2 times its reservation.

The services below support replicas on Docker. The second column is the key that sets the replica count in the `global.yaml` file.

| Service            | Replica count key in `global.yaml` |
| ------------------ | ---------------------------------- |
| `api_gateway`      | `apiGateway.deploy.replicas`       |
| `app_parser`       | `appParser.deploy.replicas`        |
| `build`            | `build.deploy.replicas`            |
| `mcp`              | `mcpServer.deploy.replicas`        |
| `notification`     | `notification.deploy.replicas`     |
| `resource`         | `resource.deploy.replicas`         |
| `store_api`        | `storeApi.deploy.replicas`         |
| `store_web`        | `storeWeb.deploy.replicas`         |
| `tester_api`       | `testerApi.deploy.replicas`        |
| `tester_web`       | `testerWeb.deploy.replicas`        |
| `web_app`          | `webApp.deploy.replicas`           |
| `web_event`        | `webEvent.deploy.replicas`         |

To change a replica count, set its key in the `global.yaml` file, then restart the Appcircle server with the `down`, `export` and `up` commands as shown in [Change the Memory of a Service](#change-the-memory-of-a-service). The example below runs 2 replicas of the `build` service.

```yaml
build:
  deploy:
    replicas: 2
```

:::caution
Each extra replica can use as much memory as the limit of the service. Make sure the host has enough memory before you increase a replica count.
:::

## Change the Memory of a Service

<DowntimeCaution />

- Log in to the Appcircle server with SSH or a remote connection.

- Go to the `appcircle-server` directory.

```bash
cd appcircle-server
```

- Edit the `global.yaml` file of your project.

<SpacetechExampleInfo />

```bash
vi ./projects/spacetech/global.yaml
```

- Add the service under `resources.services` and set its limit, its reservation, or both. The example below raises the limit of the `build` service to 4096 MiB.

```yaml
resources:
  services:
    build:
      memory:
        limit: 4096
        reservation: 256
```

Write the values as whole numbers in MiB, without a unit. The reservation must not be larger than the limit. If a value is not valid, the `export` command stops with an error that names the service.

Services you do not add keep their default values.

:::caution
A limit lower than what a service needs makes the service restart repeatedly. Do not set the `app_parser` limit below its default value.
:::

<RestartAppcircleServer />

## Verify the Limits

Check the limit and the reservation of a service. The output is in bytes: `4294967296` is 4096 MiB.

<Tabs groupId="container-engine">
  <TabItem value="docker" label="Docker" default>

```bash
docker inspect --format '{{.HostConfig.Memory}} {{.HostConfig.MemoryReservation}}' spacetech-build-1
```

  </TabItem>

  <TabItem value="podman" label="Podman">

```bash
podman inspect --format '{{.HostConfig.Memory}} {{.HostConfig.MemoryReservation}}' spacetech_build_1
```

  </TabItem>
</Tabs>

Below is a sample output for the example above.

```text
4294967296 268435456
```

To see the current memory usage of every service next to its limit, run the command below.

<Tabs groupId="container-engine">
  <TabItem value="docker" label="Docker" default>

```bash
docker stats --no-stream
```

  </TabItem>

  <TabItem value="podman" label="Podman">

```bash
podman stats --no-stream
```

  </TabItem>
</Tabs>

## Host Memory Check

The `check` command warns you when the host has less memory than the containers need. The minimum is the sum of the reservations of the containers your Appcircle server runs plus 4096 MiB for MongoDB and the operating system. On Docker, each replica's reservation is counted.

With the default configuration, the minimum is 12608 MiB. If you raise a reservation or add a replica, the minimum grows by the same amount.

```bash
./ac-self-hosted.sh -n "spacetech" check
```

If you see the warning below, add memory to the host. For the recommended host size, see the [server requirements](/self-hosted-appcircle/install-server/linux-package/installation/pre-installation-checklist#server-requirements).

```text
WARNING: The host has 7680 MiB of memory, less than the 12608 MiB the services reserve plus MongoDB and the OS. Add memory to the host.
```

<NeedHelp />
