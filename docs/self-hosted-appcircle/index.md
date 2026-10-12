---
title: Overview & Concepts
description: Overview of self-hosted Appcircle and related concepts
tags: [self-hosted, overview, concepts, kubernetes, openshift, helm, docker, podman]
sidebar_position: 1
---

import Screenshot from '@site/src/components/Screenshot';

Self-hosted Appcircle enables you to use your own systems and infrastructure for all cloud features.

By this way, you can build and test your apps on your choice of architectures. You have full control over the build environment. You can also customize your Appcircle installation with various options.

With the help of self-hosted runners as connected agents, you can have whole Appcircle in your own infrastructure and use all Appcircle features in your private cloud without any limitations.

Self-hosted Appcircle section in here, gives you detailed information about only server-side components installation and other related operations. For details about self-hosted runner concept, see [Self-hosted Runner](/self-hosted-appcircle/self-hosted-runner) section in docs.

:::caution

The only requirement for using self-hosted Appcircle is to be in `enterprise` plan.

See [pricing](https://appcircle.io/pricing) and feature comparison table for details.

:::

## Docker/Podman Standalone Architecture

We generally recommend a standalone approach by deploying a single node environment for the Appcircle server to reduce the complexity a little further.

When we look at self-hosted Appcircle deployment as a whole, we will see below architecture in execution for a basic installation.

<Screenshot url='https://cdn.appcircle.io/docs/assets/be-3008-appcircle-topology.png' />

To see the topology diagram in greater detail, click [here](https://cdn.appcircle.io/docs/assets/be-3008-appcircle-topology.png). It will open the diagram in new browser tab.

:::tip
You can see all external network access details on the [Network Access](/self-hosted-appcircle/install-server/linux-package/configure-server/integrations-and-access/network-access) page.

If the Appcircle server and runners have no internet access, see the [air-gapped architecture](#dockerpodman-architecture-in-an-air-gapped-network) below.
:::

## Docker/Podman Architecture With DMZ Support

If you plan to use the Enterprise App Store and Testing Distribution modules isolated from the internal network in which these modules are only exposed to the external networks, you can use Docker/Podman Architecture in DMZ formation.

<Screenshot url='https://cdn.appcircle.io/docs/assets/be-3008-appcircle-dmz-topology.png' />

For more information about the Appcircle DMZ architecture, you can check the [Enterprise App Store and Testing Distribution in DMZ](/self-hosted-appcircle/install-server/linux-package/configure-server/advanced-configuration/store-dist-dmz) document.

## Docker/Podman Architecture in an Air-Gapped Network

In an air-gapped network, the Appcircle server, the macOS hosts and the runner VMs have no internet access. An artifact proxy in your network, such as Sonatype Nexus or JFrog Artifactory, is the only component that connects to the internet. Everything Appcircle publishes, such as container images, macOS VM and Xcode images and runner files, and every public package your builds need comes through it.

<Screenshot url='https://cdn.appcircle.io/docs/assets/PL-468-airgap-topology_v3.png' alt='Air-gapped architecture of self-hosted Appcircle' />

To see the topology diagram in greater detail, click [here](https://cdn.appcircle.io/docs/assets/PL-468-airgap-topology_v3.png). It will open the diagram in new browser tab.

Compared to the [standalone architecture](#dockerpodman-standalone-architecture):

| Area | Standalone | Air-gapped |
| ---- | ---------- | ---------- |
| Container images | Appcircle registry | Artifact proxy (Docker proxy repository) |
| Server package | Downloaded on the server | Downloaded on a separate host with internet access and brought into your network |
| macOS VM and Xcode images, runner files | Appcircle storage and CDN | Artifact proxy (raw proxy repositories) |
| Build dependencies (Maven, Gradle, npm, CocoaPods, RubyGems, PyPI, pub) | Public registries | Artifact proxy |
| Source code, sign-in, email, time, name resolution, certificates | Internal or public services | Internal services only: Git provider, LDAP or SSO, SMTP, NTP, DNS and your corporate root CA |
| App store publishing, App Store Connect certificate management, Slack and Teams notifications | Available | Not available |

:::info

The air-gapped architecture covers the Docker/Podman Appcircle server, installed fresh from version 3.33.0, with [macOS VM runners](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup) on Apple silicon hosts. It doesn't cover the DMZ architecture, Kubernetes/OpenShift installations or Linux runners.

:::

The installation guides cover the air-gapped setup in their own steps: the runner VM setup asks where the host downloads from and continues with the same commands, and the [Network Access](/self-hosted-appcircle/install-server/linux-package/configure-server/integrations-and-access/network-access#air-gapped-network) page lists the hosts your artifact proxy needs.

## Kubernetes/OpenShift Architecture Using Helm Chart

In addition to the standalone and DMZ architectures, you can deploy Appcircle using the Helm chart for Kubernetes/OpenShift environments. This method allows for greater scalability and management flexibility.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE-5525-k8s-ocp-arch-diagram.png' />

For detailed instructions on installing and configuring Appcircle using the Helm chart, refer to the relevant Helm chart installation documentation for [Kubernetes](/self-hosted-appcircle/install-server/helm-chart/installation/kubernetes) or [OpenShift](/self-hosted-appcircle/install-server/helm-chart/installation/openshift). These documentation pages include steps for setting up Helm, configuring `values.yaml`, and deploying the Appcircle server.

### Advantages

- **High Availability:** Deploying on Kubernetes/OpenShift ensures high availability through automated failover and load balancing.
- **Scalability:** Supports high traffic and large-scale applications with horizontal scaling based on load, ensuring optimal performance. Easily scale your deployment by adding or removing nodes in the Kubernetes/OpenShift cluster.
- **Fault Tolerance:** Kubernetes/OpenShift can handle node failures and automatically reschedule workloads to maintain application uptime.

### Disadvantages

- **Complexity:** Requires familiarity with Kubernetes/OpenShift and Helm, which can be complex to learn and manage.
- **Resource Requirements:** May require more resources compared to a single-node deployment, including more compute power and storage.
- **Operational Overhead:** Maintaining and monitoring a Kubernetes/OpenShift cluster can add operational overhead.
