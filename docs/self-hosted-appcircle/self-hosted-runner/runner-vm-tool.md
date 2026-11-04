---
title: Install and Upgrade macOS VM Runners with runner-vm.sh
description: Install, upgrade and roll back Tart macOS VM runners with one tool that keeps your runner settings in one folder on the host.
tags: [self-hosted runner, runner upgrade, macos, tart]
sidebar_position: 26
---

# Install and Upgrade macOS VM Runners with runner-vm.sh

`runner-vm.sh` installs, upgrades and rolls back the macOS VM runners on a host.

Your runner settings live in one folder on the host: server address, certificates, NTP, proxy and extra tools. On every install and upgrade, the tool builds the runner VMs from the image and this folder. You set things up once and never again inside a VM.

:::info
Prepare the host first as described in [Requirements](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#requirements). The tool supports image `261102` and newer.
:::

## Download the Tool

```bash
curl -fsSL "${AC_RUNNER_CDN_BASE_URL:-https://cdn.appcircle.io/self-hosted}/runner-vm.sh" -o ~/runner-vm.sh && \
chmod +x ~/runner-vm.sh
```

See the images and their Xcode versions:

```bash
~/runner-vm.sh images
```

```text
Current host macOS: 26.6.2, 512 GB free

IMAGE    GUEST MACOS      REQUIRED HOST    RUN.SH   STATE            XCODE (BUILD)
261102   Tahoe 26.6.2     Tahoe 26+        1.11.0   available        27.2 (27B52), 27.1 (27A9275), 27.0 (27A266a), 26.6 (17F113)
```

Pick the image with the Xcode versions you need. **Current host macOS** is the macOS of your host, and **REQUIRED HOST** is the oldest macOS the image runs on. If the host is too old, **STATE** shows `host too old`: update the host's macOS first.

:::info Hosts without internet access
Set `AC_RUNNER_IMAGE_BASE_URL` and `AC_RUNNER_CDN_BASE_URL` to your artifact proxy, as described in [Choose the Download Source](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#choose-the-download-source).
:::

## Install Runners

### 1. Create the Settings Folder

```bash
~/runner-vm.sh init
```

Open `~/appcircle-runner-config/host.env` and set your server:

```bash
AC_BASE_API_URL=https://api.appcircle.spacetech.com/build/v1
AC_REDIS_STREAM_ENDPOINT=redis.appcircle.spacetech.com:443,ssl=true
```

`init` also sets the CPU and memory of each runner VM from your host: half of the host's cores and memory each, for two runners. If you run only one runner, double `VM_CPU` and `VM_MEMORY_MB`.

### 2. Add What Your Network Needs

Skip what you do not use.

| What | Where in `~/appcircle-runner-config` |
| ---- | ------------------------------------ |
| Root certificates | `.pem` files in `certs/` |
| Hosts your builds reach over HTTPS (server, Git, artifact proxy) | `trust-urls.txt`, one host per line |
| NTP server | `NTP_SERVER` in `host.env` |
| Proxy | `PROXY_HOSTPORT`, `PROXY_USER`, `PROXY_PASSWORD`, `NO_PROXY` in `host.env` |
| `/etc/hosts` lines | `hosts` |
| Files for the VM home folder, such as `.npmrc` | `files/`, at the same path |
| Tools | `tools.txt`: `brew <formula>` or `url <URL> <sha256> <path>` |
| Android SDK packages | `android-sdk.txt` |
| Anything else | a `.sh` script in `scripts/` |

:::caution
Builds can read everything in this folder. Do not put licenses or passwords in it, except the proxy password. Use a proxy account that has no other access.
:::

### 3. Install

Create a runner access token, see [Register](/self-hosted-appcircle/self-hosted-runner/installation#2-register). Then give the image, a pool and the runner names:

```bash
~/runner-vm.sh install 261102 macos-pool runner1 runner2
```

The tool asks for the token and your password. It downloads the image, builds and registers the runners, and starts them as services.

```bash
~/runner-vm.sh status
```

The runners are online in the **Self-hosted Runners** list after a minute.

:::tip
The download takes hours. Over SSH, run the command in `screen` or `tmux`. If it stops, run the same command again: it downloads only what is missing and continues where it stopped.
:::

## Upgrade Runners

### 1. Read Your Current Runners (Once)

Do this only before your first upgrade with the tool, when no build is running:

```bash
~/runner-vm.sh stop runner1 runner2
~/runner-vm.sh capture vm01 macOS_260723
~/runner-vm.sh capture vm02 macOS_260723
```

Give each VM and the image it was created from. The tool copies the runner registration and your settings into the folder. Check `review/` in the folder and move what you need to the right place. Add any missing host to `trust-urls.txt`.

### 2. Check Xcode Versions

If the new image drops an Xcode version, move the build configurations that use it to a kept version first. Otherwise those builds wait in the queue.

### 3. Upgrade

```bash
~/runner-vm.sh upgrade 261102
```

The runners keep their names and pool. No new token is needed. Running builds finish first.

To keep one runner serving, upgrade one at a time:

```bash
~/runner-vm.sh upgrade 261102 runner1
```

If the upgrade fails, nothing changes and your runners start again on the old VMs.

### Roll Back

```bash
~/runner-vm.sh rollback runner1 runner2
```

### Free Disk Space

A new image needs about 330 GB free, or about 190 GB with `~/runner-vm.sh pull 261102 --stream`. When the new image works, delete the old VMs and image:

```bash
tart delete runner1-prev
tart delete macOS_260723
```

## Commands

| Command | Description |
| ------- | ----------- |
| `images` | Lists images and their Xcode versions |
| `pull <image> [--stream]` | Downloads an image |
| `init` | Creates the settings folder |
| `install <image> <pool> <name>...` | Installs and starts runners |
| `capture <vm> <image>` | Reads an existing runner into the folder |
| `upgrade <image> [<name>...]` | Upgrades runners |
| `rollback <name>...` | Goes back to the previous VMs |
| `start`, `stop` `[<name>...]` | Starts or stops runners |
| `status` | Shows the runners |
| `doctor` | Checks the host |

## Troubleshooting

The error message says what to fix. Fix it and run the command again. Logs are in `~/appcircle-runner-config/logs`.

If a host in `trust-urls.txt` fails, add the root certificate that signs it to `certs/`.

## Need Help?

Send Appcircle support the log file and the output of `~/runner-vm.sh doctor`. Do not send the settings folder.
