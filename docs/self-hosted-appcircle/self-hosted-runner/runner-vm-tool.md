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

Everything here is optional: add only what your runners need. A complete folder looks like this:

```text
~/appcircle-runner-config/
├── host.env              your server, NTP and proxy
├── certs/
│   └── company-root.pem  your root certificate
├── trust-urls.txt        hosts your builds reach over HTTPS
├── hosts                 lines for /etc/hosts
├── files/
│   └── .npmrc            copied to the VM's home folder as ~/.npmrc
├── tools.txt             tools to install
├── android-sdk.txt       Android SDK packages to install
└── scripts/
    └── 10-license.sh     your own setup step, runs last
```

**`host.env`**: NTP and proxy, if your network needs them.

```bash
NTP_SERVER=ntp.spacetech.com
PROXY_HOSTPORT=proxy.spacetech.com:8080
PROXY_USER=runner
PROXY_PASSWORD=secret
NO_PROXY=localhost,127.0.0.1,.spacetech.com
```

**`certs/`**: Copy the root certificate of your company (`.pem`) here. Do not copy server certificates.

**`trust-urls.txt`**: Every host your builds reach over HTTPS, one per line. Add a port if it is not 443.

```text
api.appcircle.spacetech.com
redis.appcircle.spacetech.com
git.spacetech.com
nexus.spacetech.com:8443
```

**`hosts`**: Lines for `/etc/hosts`, if some of your hosts are not in DNS.

```text
10.0.0.15 git.spacetech.com
```

**`files/`**: Files your builds need in the home folder, at the same path. For example `files/.npmrc` becomes `~/.npmrc`, and `files/.gradle/init.d/mirror.gradle` becomes `~/.gradle/init.d/mirror.gradle`.

**`tools.txt`**: One tool per line, from Homebrew or from a URL with its SHA-256 checksum and install folder.

```text
brew xcbeautify
url https://github.com/realm/SwiftLint/releases/download/0.65.1/portable_swiftlint.zip c1e429b0599cf1b516f369a2d9ec04eaf0e436f3c12b637df8851fa52ff694d0 /opt/tools/swiftlint
```

**`android-sdk.txt`**: Android SDK packages the image does not have, one per line.

```text
platforms;android-37.0
build-tools;36.1.0
```

**`scripts/`**: Anything else, such as installing a licensed tool, as a `.sh` script. Scripts run last, in name order.

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
