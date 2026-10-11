---
title: Configure a Dedicated Redis Port
sidebar_label: Dedicated Redis Port
description: Give Redis its own port on an HTTPS Appcircle server to remove an internal proxy hop and handle more traffic under high load.
tags: [self-hosted, advanced configuration, network, runner, firewall, docker, podman]
sidebar_position: 60
---

import SpacetechExampleInfo from '@site/docs/self-hosted-appcircle/install-server/linux-package/configure-server/\_spacetech-example-info.mdx';
import RestartAppcircleServer from '@site/docs/self-hosted-appcircle/install-server/linux-package/configure-server/\_restart-appcircle-server.mdx';
import DowntimeCaution from '@site/docs/self-hosted-appcircle/install-server/linux-package/configure-server/\_appcircle-server-downtime-caution.mdx';
import NeedHelp from '@site/docs/\_need-help.mdx';

## Overview

Appcircle runners send live build logs to the Appcircle server through Redis. On an Appcircle server configured with HTTPS, Redis shares port `443` with the web services. The front proxy of the server reads the domain name of every new connection and forwards it internally, either to the web services or to Redis. This internal hop costs proxy CPU on every connection, including the web and API traffic that never goes to Redis.

You can give Redis its own port instead. Port `443` then carries only web traffic, the internal hop is removed, and the front proxy handles more traffic with the same resources.

The default configuration is suitable for most installations. Consider a dedicated Redis port when your Appcircle server handles high request volumes, for example CodePush updates rolled out to a large number of devices at the same time.

:::info
This feature is included in the Appcircle server package version **`3.34.0`** or later.
:::

:::info
This page applies to Appcircle servers configured with HTTPS (`external.scheme: https`). With HTTP, Redis already uses its own port (`6379` by default), so no change is needed.
:::

### What Changes

- Redis is served with TLS on the port you choose, using the same SSL certificate as the rest of the Appcircle server.
- Redis is no longer reachable on port `443`.
- Every Appcircle runner must connect to Redis on the new port.

## Prerequisites

- Choose a port that is free on the Appcircle server and allowed by your security policy. The examples on this page use `6380`.
- Allow the Appcircle runners to connect **directly** to the Appcircle server on that port.
  - If a load balancer is in front of the Appcircle server, create a direct route (firewall rule) from the runners to the Appcircle server for this port instead of sending it through the load balancer. Web traffic on port `443` keeps using the load balancer as before.
  - If there is no load balancer, allow the port in the same way as the existing runner access to the Appcircle server.
- If the Appcircle server uses `firewalld`, open the port on the server:

  ```bash
  sudo firewall-cmd --add-port=6380/tcp --permanent
  sudo firewall-cmd --reload
  ```

- The SSL certificate does not change. It already covers the `redis` subdomain, which the Appcircle server requires.

:::tip
With rootless Podman, ports above `1024` can be published directly, so the new port does not need a port redirection like `443` does.
:::

## Configuring the Appcircle Server

<DowntimeCaution />

1. Log in to your Appcircle server via SSH or a remote connection.

2. Change to the directory containing the Appcircle server configuration.

   ```bash
   cd appcircle-server
   ```

3. Open the `global.yaml` file in a text editor.

   <SpacetechExampleInfo />

   ```bash
   vi ./projects/spacetech/global.yaml
   ```

4. Add the `port` key under `webEventRedis.external`.

   :::caution
   If the `webEventRedis` entry already exists in your `global.yaml` file, for example with a custom `subdomain`, add the `port` key to the existing entry instead of creating a new one.
   :::

   ```yaml
   webEventRedis:
     external:
       port: 6380
   ```

5. After saving the configuration changes, restart your Appcircle server to apply the new settings.

   <RestartAppcircleServer />

## Updating the Appcircle Runners

After the Appcircle server restarts, runners that still use port `443` cannot reach Redis. Their builds keep running, but live build logs are not streamed until the runner is updated. Update every runner right after the Appcircle server.

1. On the runner machine, change to the directory of the Appcircle runner, where `appsettings.json` is located.

2. Set `ASPNETCORE_REDIS_STREAM_ENDPOINT` to the Redis subdomain of your Appcircle server with the new port.

   ```bash
   echo "$(jq '.ASPNETCORE_REDIS_STREAM_ENDPOINT="redis.appcircle.spacetech.com:6380,ssl=true"' appsettings.json)" > appsettings.json
   ```

3. Restart the runner service so that it uses the new endpoint.

   ```bash
   ./ac-runner service -c restart
   ```

   For more details, see [managing the self-hosted runner service](/self-hosted-appcircle/self-hosted-runner/configure-runner/runner-service).

:::info
If your runners are macOS virtual machines created from a base image, update `appsettings.json` in the base runner VM as well, so that new runner VMs use the new port. See [configuring the runner service on the runner VM](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#4-configure-runner-service).
:::

## Verifying the Configuration

1. From a runner machine, check that Redis answers on the new port with TLS.

   ```bash
   openssl s_client -connect redis.appcircle.spacetech.com:6380 -servername redis.appcircle.spacetech.com </dev/null
   ```

   The command should complete the TLS handshake and show the SSL certificate of your Appcircle server. A connection timeout usually means the port is blocked between the runner and the Appcircle server.

2. Start a build and confirm that its live logs appear on the Appcircle dashboard.

## Reverting to the Default Configuration

1. Remove the `port` key under `webEventRedis.external` in the `global.yaml` file.

2. Restart your Appcircle server.

   <RestartAppcircleServer />

3. Set `ASPNETCORE_REDIS_STREAM_ENDPOINT` back to port `443` on every runner and restart the runner service.

   ```bash
   echo "$(jq '.ASPNETCORE_REDIS_STREAM_ENDPOINT="redis.appcircle.spacetech.com:443,ssl=true"' appsettings.json)" > appsettings.json
   ./ac-runner service -c restart
   ```

:::info
The Appcircle DMZ server does not handle Redis traffic, so this configuration does not require any change on the DMZ server.
:::

<NeedHelp />
