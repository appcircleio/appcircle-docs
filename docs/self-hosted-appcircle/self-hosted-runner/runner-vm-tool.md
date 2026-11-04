---
title: Install and Upgrade macOS VM Runners with runner-vm.sh
description: Install, upgrade and roll back Tart macOS VM runners with one tool that keeps every runner customization in one folder on the host.
tags: [self-hosted runner, runner upgrade, macos, tart]
sidebar_position: 26
---

# Install and Upgrade macOS VM Runners with runner-vm.sh

`runner-vm.sh` manages the Appcircle runners on a macOS host that runs them as Tart VMs. It lists the runner images and their Xcode versions, downloads an image, builds ready runner VMs, registers them, runs them as launchd services, upgrades them to a new image and rolls them back.

Every customization of your runner VMs lives in one folder on the host, outside the VM image: your Appcircle server, the VM size, your NTP server and corporate proxy, your root certificates, files and tools your builds need, and the runner registrations. When a new image comes out, the tool builds the runner VMs from the new image plus that folder. Nothing is configured by hand inside a VM, and nothing has to be repeated after an upgrade.

Each runner has one name everywhere: the name in the **Self-hosted Runners** list is also the name of its VM and of its folder on the host.

:::info
The tool needs a host that is prepared as described in [Requirements](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#requirements) on the macOS VM setup page: Homebrew, Tart, Pigz, and the power settings. It covers the macOS VM image `261102` and newer for runners that use your own root certificates.
:::

## Download the Tool

Download the tool into your home folder on the host:

```bash
curl -fsSL "${AC_RUNNER_CDN_BASE_URL:-https://cdn.appcircle.io/self-hosted}/runner-vm.sh" -o ~/runner-vm.sh && \
chmod +x ~/runner-vm.sh
```

List the macOS VM images and the Xcode versions they include:

```bash
~/runner-vm.sh images
```

```text
IMAGE    GUEST MACOS      HOST MACOS     RUN.SH   STATE      XCODE (BUILD)
261102   Tahoe 26.6.2     Tahoe+         1.11.0   -          27.2 (27B52), 27.1 (27A9275), 27.0 (27A266a), 26.6 (17F113)
```

Choose the image that includes the Xcode versions your projects use. **HOST MACOS** is the oldest macOS the host must run for that image.

:::info Hosts without internet access
Set `AC_RUNNER_IMAGE_BASE_URL` and `AC_RUNNER_CDN_BASE_URL` to your artifact proxy repositories as described in [Choose the Download Source](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#choose-the-download-source). The tool downloads the images, `run.sh` and `runner-service.sh` through them.
:::

## Install Runners on a New Host

### 1. Create the Configuration Folder

```bash
~/runner-vm.sh init
```

This creates `~/appcircle-runner-config` with a `host.env` file to fill in. Open it and set at least your Appcircle server and the size of each runner VM:

```bash
AC_BASE_API_URL=https://api.appcircle.spacetech.com/build/v1
AC_REDIS_STREAM_ENDPOINT=redis.appcircle.spacetech.com:443,ssl=true
VM_CPU=4
VM_MEMORY_MB=8192
```

The values are the same as in [Configure Runner Service](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#5-configure-runner-service). For the CPU and memory of each VM, see [Configure Runner VM Resources](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#configure-runner-vm-resources).

### 2. Add Your Certificates and Settings

Add only what your network needs. Each item is applied to every runner VM, on every install and upgrade.

| What | Where in `~/appcircle-runner-config` |
| ---- | ------------------------------------ |
| Root certificates of your organization | `.pem` files in `certs/` |
| Every host your builds reach over HTTPS: Appcircle server, Redis, Git server, artifact proxy, mirrors | one `host` or `host:port` per line in `trust-urls.txt` |
| NTP server | `NTP_SERVER` in `host.env` |
| Corporate proxy | `PROXY_HOSTPORT`, `PROXY_USER`, `PROXY_PASSWORD` and `NO_PROXY` in `host.env` |
| Lines for `/etc/hosts` | `hosts` |
| Files for the VM's home folder, such as `.npmrc` or `.gradle/init.d/` scripts | `files/`, at the same path |
| Tools to install | `tools.txt`: `brew <formula>`, or `url <https URL> <sha256> <install path>` |
| Android SDK packages the image does not have | `android-sdk.txt` |
| Anything else, such as a licensed tool | a `.sh` script in `scripts/`, run last |

Put every host your builds reach in `trust-urls.txt`, including the ones signed by a root you added to `certs/`. macOS rejects a server certificate that is valid for more than 825 days even when its root is trusted; the tool trusts such certificates for every host in the list.

<details>
<summary>How the proxy settings work</summary>

With `PROXY_USER` set, the tool runs a small local proxy in each runner VM that holds the proxy credentials. Builds use it without credentials. Android tools such as `sdkmanager` and Gradle cannot send proxy credentials from the `HTTPS_PROXY` variable, so a proxy that requires a user and password would break Android builds otherwise. The credentials stay out of the build environment.

`NO_PROXY` lists the hosts the VMs reach directly, for example your Appcircle server and Git server: `localhost,127.0.0.1,.spacetech.com`.

</details>

:::caution
Do not put license files or other credentials in the folder. Everything in it is copied into the runner VMs, and every build can read it. Use environment variables in Appcircle for secrets. The runner registrations and the proxy credentials are the exceptions; the folder is readable only by its owner.
:::

### 3. Install the Runners

Create a runner access token on the **Self-hosted Runners** page, see [Register](/self-hosted-appcircle/self-hosted-runner/installation#2-register). Then install the runners with the image you chose, a pool name and a name for each runner:

```bash
~/runner-vm.sh install 261102 macos-pool runner1 runner2
```

The tool asks for the token. It downloads the image when it is not on the host yet, builds the runner VMs, registers them in the pool, and starts them as launchd services. Starting the services asks for your password, because they are installed with `sudo`. For more about the services, see [Running macOS VM Runners as a Service](/self-hosted-appcircle/self-hosted-runner/configure-runner/macos-vm-service).

Check the runners:

```bash
~/runner-vm.sh status
```

The runners appear online in the **Self-hosted Runners** list after a minute.

:::tip
The image download takes a while and continues only while the command runs. Run the command in `screen` or `tmux` when you are connected over SSH. Every run also writes a log to `~/appcircle-runner-config/logs`.
:::

## Upgrade Runners to a New Image

### 1. Read the Current Runners Into the Folder

Do this once, before the first upgrade with the tool. Stop the runners, then read each runner's base VM into the folder. Give the image it was created from; the tool compares the two, so only your changes are recorded:

```bash
~/runner-vm.sh stop runner1 runner2
~/runner-vm.sh capture vm01 macOS_260723
~/runner-vm.sh capture vm02 macOS_260723
```

`capture` copies each runner's registration, your server settings, VM size, NTP server, root certificates and `/etc/hosts` lines into the folder. What it cannot apply on its own goes to `review/`: tools, Android SDK packages, files in the home folder, shell settings. Go through `review/` once and copy what your runners need to the matching place in the folder. Add the hosts your builds reach to `trust-urls.txt`.

From then on, the folder is the place to change your runners. A change made only inside a VM is lost at the next upgrade.

:::info
After `capture`, each runner is named after its registration. A runner registered as `runner1` whose VM was `vm01` gets a VM named `runner1` in the upgrade; the old `vm01` stays until you delete it.
:::

### 2. Move Build Configurations to Kept Xcode Versions

An image can drop Xcode versions. Compare the images with `~/runner-vm.sh images`, and move every build configuration and App Store publish step that uses a version the new image does not have to one it has. A build pinned to an Xcode version no runner in the pool has waits in the queue without an error.

### 3. Upgrade

```bash
~/runner-vm.sh upgrade 261102
```

The tool downloads the image when needed, stops the runners, builds new runner VMs from the image and the folder, puts the matching `run.sh` in each runner folder, and starts the runners again. The runners keep their names and their pool, so no new runner access token is needed and no duplicate runner appears. The previous VM of each runner is kept as `<name>-prev`.

Upgrade one runner at a time to keep builds running on the others:

```bash
~/runner-vm.sh upgrade 261102 runner1
```

### Roll Back

```bash
~/runner-vm.sh rollback runner1 runner2
```

This brings back the previous VM and `run.sh` of each runner and starts it again.

### Free Disk Space

The download and extraction of an image need about 290 GB of free disk space, and about 150 GB with `~/runner-vm.sh pull 261102 --stream`, which extracts while it downloads and keeps no archive. When the new image works, delete the previous VMs and the old image:

```bash
tart delete runner1-prev
tart delete macOS_260723
```

## Commands

| Command | Description |
| ------- | ----------- |
| `images` | Lists the images, their Xcode versions and which are installed |
| `pull <image> [--stream]` | Downloads, verifies and extracts an image and its Xcode disks |
| `init` | Creates the configuration folder and `host.env` |
| `install <image> <pool> <name>...` | Downloads the image, creates, registers and starts runners |
| `capture <vm> <image>` | Reads an existing runner VM into the folder |
| `upgrade <image> [<name>...]` | Rebuilds runners from a new image and the folder |
| `rollback <name>...` | Brings back the previous VM of runners |
| `create <image> <name>...` | Builds runner VMs from an image and the folder |
| `register <name> <pool>` | Registers a created runner VM |
| `start`, `stop` `[<name>...]` | Starts or stops runners as launchd services |
| `status` | Shows the runners, their services, previous VMs and images |
| `doctor` | Checks the host |

## Troubleshooting

### A command stops with an error

Read the message: it names the step and what to change. The full output is in `~/appcircle-runner-config/logs`. A failed `create` or `upgrade` changes no runner; fix the cause and run the command again.

### A host in trust-urls.txt does not verify

The last step of `create` and `upgrade` connects to every host in `trust-urls.txt` from the new VM. A failure means the VM does not trust the server's certificate: add the root certificate that signs it to `certs/`, or check that the host is reachable from the VM.

## Need Help?

Contact Appcircle support with the log file from `~/appcircle-runner-config/logs`. Remove the proxy password from `host.env` before you send the folder to anyone.
