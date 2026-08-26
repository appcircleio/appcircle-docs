---
title: MobSF Setup on the Runner
description: Install MobSF and its static analysis toolchain on a self-hosted Appcircle runner, and keep the installation in your macOS virtual machine image.
tags: [self-hosted runner, mobsf, security, static analysis, configuration]
sidebar_position: 7
---

# MobSF Setup on the Runner

The Appcircle MobSF binary scan step analyzes an APK or IPA with [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) running on the runner itself. Before the step can be used on a self-hosted runner, MobSF and its analysis toolchain must be installed on that runner once.

The runner package ships the installer under its `scripts` directory, so the setup is a local script run, not a separate download from Appcircle.

:::info

MobSF is licensed under GPL-3.0-only. Appcircle does not distribute MobSF: the installer on your runner downloads it from its upstream source at install time. The installation is optional, and runners that do not run mobile security scans do not need it.

:::

## Prerequisites

- A self-hosted runner on version **1.8.9 or newer**. Older packages do not contain the MobSF installer. See [Upgrading Runner](/self-hosted-appcircle/self-hosted-runner/update) and verify with `./ac-runner --version`.
- Around **6 GB of free disk space** for MobSF, its virtual environment and the analysis tools, plus room for the scan working set.
- Outbound internet access from the runner during installation. For a disconnected runner, see [Air-gapped installation](#air-gapped-installation).
- Administrative rights on the runner host. The installer writes to `/usr/local` on macOS and `/opt` on Linux.

## Step 1: Upgrade the runner

MobSF ships with the runner package, so start from a runner that contains it. Follow [Upgrading Runner](/self-hosted-appcircle/self-hosted-runner/update) to download the new package, reconfigure the runner and reinstall the service, then confirm the version:

```bash
./ac-runner --version
```

## Step 2: Install MobSF

Run the installer from the runner's `scripts` directory:

```bash
cd appcircle-runner/scripts
./setup-mobsf.sh --action install
```

The defaults are `--prefix /usr/local/appcircle/mobsf` on macOS (`/opt/appcircle/mobsf` on Linux), `--port 8000`, and the invoking user as the owner of the installation. Override them when they do not fit your host:

```bash
./setup-mobsf.sh --action install \
  --prefix /usr/local/appcircle/mobsf \
  --port 8000 \
  --runner-user appcircle
```

| Option | What it controls |
| --- | --- |
| `--prefix` | Absolute installation directory. Everything MobSF needs lives under it. |
| `--port` | Loopback port MobSF listens on. Change it when another service already uses 8000. |
| `--runner-user` | Account that owns the MobSF home directory and the API key. Set it to the account the runner service runs as, otherwise a build cannot read them. |
| `--version` | MobSF version to install. Defaults to the version pinned in the runner package. |
| `--python` | Absolute path of the Python interpreter used to build the MobSF virtual environment. |
| `--offline-dir` | Directory of pre-staged artifacts for an air-gapped installation. |

:::info

MobSF supports Python 3.12 and 3.13. The installer prefers a matching interpreter and warns when it has to fall back to a newer one, which some macOS images ship as the default `python3`. If the warning appears, install Python 3.13 on the host and rerun the installer with `--python`.

:::

## Step 3: Verify the installation

Print the installation manifest:

```bash
./setup-mobsf.sh --action status
```

The manifest is written to `<prefix>/appcircle-mobsf-manifest.json` and records the installed MobSF version, the resolved Python interpreter, the JDK and Android build tools, and the port. The command exits with a non-zero status when MobSF is not installed at that prefix.

MobSF does not run as a background service. The runner starts it when a scan step needs it and stops it afterwards. To exercise it manually:

```bash
./mobsf-control.sh --action start
./mobsf-control.sh --action status
./mobsf-control.sh --action stop
```

The API key is generated during installation and stored in `<prefix>/api.key`, readable only by the runner user. It is never printed to the console, and the scan step reads it from that file.

## Step 4: Keep MobSF in your virtual machine image

This step applies when your runners are macOS virtual machines, as described in [Runner Virtual Machine Setup](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup). A build virtual machine is reset after every build, so an installation performed inside a running build is lost, and reinstalling several gigabytes per build is not practical. Install MobSF once and capture the result in the image the runners are cloned from.

1. Stop the runners that use the image so nothing writes to it during the update.
2. Clone the current image to a new name, so the existing one stays untouched as your rollback point:

   ```bash
   tart clone macOS_runner_base macOS_runner_mobsf
   ```

3. Start the new virtual machine, install MobSF inside it with the steps above, and verify it with `--action status`.
4. Shut the virtual machine down cleanly from inside the guest, so the disk image is consistent:

   ```bash
   sudo shutdown -h now
   ```

5. Point your runners at the new image and start them again.

To roll back, point the runners at the previous image; because the installation was made on a clone, the original image never changed.

:::warning

Keep the MobSF installation as its own image generation rather than installing it into an image you also update for other reasons. When a MobSF upgrade or removal is needed, you then have a clean image to fall back to.

:::

## Air-gapped installation

A runner without outbound internet access cannot download MobSF from upstream. Stage the artifacts on a machine that does have access, copy them to the runner, and point the installer at them.

The staging directory is flat: every file sits directly in it, with no subdirectories. It must contain two kinds of artifact.

**1. MobSF and its Python dependencies.** The installer runs `pip` against the directory with `--no-index`, so every wheel MobSF needs must already be there. Download them on the staging machine with the same Python version and the same platform as the runner:

```bash
pip download "mobsf==<version>" --dest /path/to/staged-artifacts
```

Use the version you will pass to `--version`. Omitting `--version` installs the version pinned in the runner package, so read that pin first with `./setup-mobsf.sh --action pin` and download exactly that version, otherwise the install fails with an unresolved requirement.

**2. The analysis tools.** Each pinned tool is copied from the directory under the exact file name of its upstream download, so keep the downloaded file names unchanged. The pinned versions and their download URLs are listed in `lib/mobsf.versions` inside the runner package; fetch each URL on the staging machine and place the resulting file in the same directory. When a file is missing, the installer stops and names the file it expected.

With both in place, run the installer:

```bash
./setup-mobsf.sh --action install --offline-dir /path/to/staged-artifacts
```

Add `--version <version>` when you staged a version other than the pinned one.

## Uninstalling

Remove the installation and its data:

```bash
./setup-mobsf.sh --action uninstall
```

Uninstalling does not change the runner itself; the runner keeps working, and only the MobSF scan step stops being available on that host.

## Troubleshooting

**The scan step reports that MobSF is not installed.** Run `./setup-mobsf.sh --action status` on the runner host. If it exits with an error, MobSF was never installed at the prefix the step is looking at, or it was installed under a different `--prefix`.

**MobSF does not start, or the port is in use.** Another process may already hold the port recorded in the manifest. Reinstall with a different `--port`, or free the port.

**A build cannot read the API key.** The installation was made for a different account. Reinstall with `--runner-user` set to the account the runner service runs as.

**The installation disappears after a build.** The runner is a virtual machine that resets between builds and MobSF was installed in a running build instead of in the image. Follow [Step 4](#step-4-keep-mobsf-in-your-virtual-machine-image).
