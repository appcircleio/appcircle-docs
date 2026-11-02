---
title: Installing Additional JDK Versions
description: Learn how to install a JDK version that is not preinstalled on a self-hosted Linux runner in Appcircle
tags: [self-hosted runner, jdk, java, java version, docker, runner]
sidebar_position: 7
---

# Overview

Self-hosted Linux runners are provisioned with four Java Development Kit (JDK) versions: 8, 11, 17 and 21. These are the versions that the **Select Java Version** step offers, and they cover the long term support (LTS) releases that receive security updates.

If your project requires a JDK that is not on that list, you can install it yourself on the runner host. A self-hosted Linux runner keeps its filesystem between builds, so a JDK you install once stays available for every subsequent build. This page uses Java 18 as the example, but the same procedure applies to any other version.

:::caution
Java 18 is not an LTS release and reached end of life on 31 March 2023. The final published build is `18.0.2.1` and no further security updates will be released for it. Before installing it, confirm that your project genuinely needs the Java 18 runtime. If your build only sets `sourceCompatibility` and `targetCompatibility` to 18, it compiles successfully on JDK 21 with a Gradle toolchain or the `--release 18` compiler flag, and no extra JDK is needed.
:::

## Prerequisites

- A self-hosted Linux runner that is already installed and connected. See the [self-hosted runner installation guide](/self-hosted-appcircle/self-hosted-runner/installation).
- Shell access to the runner host as the user that runs the runner service, with `sudo` privileges.
- The runner is idle. Installing a JDK requires a service restart, which terminates any build that is currently running.

:::info
If your runner runs inside a Docker container, the steps below still apply. See [Docker-based runners](#docker-based-runners) for the three differences that affect containers.
:::

## Step 1: Disable the runner in the Appcircle dashboard

Restarting the runner service stops in-flight builds immediately. To avoid interrupting a build, disable the runner in the Appcircle dashboard and wait until it reports as idle before continuing. See [managing runners](/self-hosted-appcircle/self-hosted-runner/configure-runner/manage-runners).

## Step 2: Install the JDK with SDKMAN

Self-hosted Linux runners manage JDKs with [SDKMAN](https://sdkman.io/), and the preinstalled JDKs live under `$HOME/.sdkman/candidates/java/` for the user that runs the runner service.

Connect to the runner host as that user and load SDKMAN:

```bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

List the Java versions the SDKMAN catalog currently offers:

```bash
sdk list java
```

If the version you need appears in the catalog, install it directly. For example:

```bash
sdk install java 21.0.2-zulu
```

For Java 18 the catalog no longer lists any vendor build, because SDKMAN removes non-LTS releases from its catalog once they reach end of life. In that case, download the archive from the vendor and register it with SDKMAN as a local candidate:

```bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

curl -fLO https://cdn.azul.com/zulu/bin/zulu18.32.13-ca-jdk18.0.2.1-linux_x64.tar.gz
tar -xzf zulu18.32.13-ca-jdk18.0.2.1-linux_x64.tar.gz -C "$SDKMAN_DIR/candidates/java/"
mv "$SDKMAN_DIR/candidates/java/zulu18.32.13-ca-jdk18.0.2.1-linux_x64" \
   "$SDKMAN_DIR/candidates/java/18.0.2.1-zulu"
```

Verify the installation:

```bash
"$SDKMAN_DIR/candidates/java/18.0.2.1-zulu/bin/java" -version
```

:::caution
Verify the archive checksum published by your JDK vendor before extracting it. Because the version is no longer distributed through SDKMAN, this integrity check is not performed for you.
:::

Keep the directory name in the `<version>-<vendor>` format used by the preinstalled JDKs, such as `18.0.2.1-zulu`. This keeps the layout consistent with the rest of the runner and lets SDKMAN commands recognize the candidate.

## Step 3: Expose the JDK to the runner service

Appcircle build steps locate a JDK through an environment variable named `JAVA_HOME_<major>_X64`. The preinstalled versions are exposed as `JAVA_HOME_8_X64`, `JAVA_HOME_11_X64`, `JAVA_HOME_17_X64` and `JAVA_HOME_21_X64`.

The runner service runs non-interactively, so exporting the variable in `~/.bashrc` alone does not make it visible to builds. Add it to the systemd unit as well.

First, add the export to the shell profile so that interactive sessions and setup scripts see it:

```bash
echo 'export JAVA_HOME_18_X64=$HOME/.sdkman/candidates/java/18.0.2.1-zulu' >> ~/.bashrc
```

Then edit the runner unit file:

```bash
sudo nano /etc/systemd/system/io.appcircle.runner.service
```

Add a new `Environment` line to the `[Service]` section, next to the existing `JAVA_HOME_*_X64` entries, and replace `<runner-user-home>` with the home directory of the user that runs the service:

```ini
[Service]
Environment="JAVA_HOME_8_X64=<runner-user-home>/.sdkman/candidates/java/8.0.392-zulu"
Environment="JAVA_HOME_17_X64=<runner-user-home>/.sdkman/candidates/java/17.0.9-zulu"
Environment="JAVA_HOME_21_X64=<runner-user-home>/.sdkman/candidates/java/21.0.2-zulu"
Environment="JAVA_HOME_11_X64=<runner-user-home>/.sdkman/candidates/java/11.0.21-zulu"
Environment="JAVA_HOME_18_X64=<runner-user-home>/.sdkman/candidates/java/18.0.2.1-zulu"
```

:::info
Reinstalling the runner service does not regenerate an existing unit file, and the generated template only covers versions 8, 11, 17 and 21. Your `JAVA_HOME_18_X64` line is preserved across service reinstalls, but you must re-add it manually if you ever delete the unit file and recreate it.
:::

## Step 4: Reload systemd and restart the runner

Systemd does not pick up a hand-edited unit file until it is reloaded, and the runner restart command does not reload it for you. Run both commands:

```bash
sudo systemctl daemon-reload
```

Then restart the runner from the runner directory:

```bash
./ac-runner service -c restart
```

Confirm that the new variable reached the service:

```bash
systemctl show io.appcircle.runner -p Environment
```

The output must contain `JAVA_HOME_18_X64`. Re-enable the runner in the Appcircle dashboard once the service reports as running.

## Step 5: Select the JDK in your workflow

The **Select Java Version** step exposes a fixed list of 8, 11, 17 and 21, so it cannot select Java 18. Use a **Custom Script** step instead, placed before the build step that needs the JDK.

Add a Custom Script step with the following content:

```bash
#!/usr/bin/env bash
set -euo pipefail

if [ -z "${JAVA_HOME_18_X64:-}" ]; then
  echo "JAVA_HOME_18_X64 is not defined on this runner."
  exit 1
fi

echo "JAVA_HOME=$JAVA_HOME_18_X64" >> "$AC_ENV_FILE_PATH"
echo "PATH=$JAVA_HOME_18_X64/bin:$PATH" >> "$AC_ENV_FILE_PATH"

"$JAVA_HOME_18_X64/bin/java" -version
```

Writing to `$AC_ENV_FILE_PATH` makes the value available to every following step in the workflow, not only to this script. The final `java -version` line prints the active version into the build log, which makes the selection easy to verify.

:::caution
This procedure applies to the runner host it is performed on. If your self-hosted setup has several runners in a pool, repeat every step on each host. A build that is dispatched to a runner without the JDK fails at the Custom Script step. See [managing runner pools](/self-hosted-appcircle/self-hosted-runner/configure-runner/manage-pools).
:::

## Docker-based runners

A self-hosted Linux runner can also run inside a Docker container, as described in the [self-hosted runner installation guide](/self-hosted-appcircle/self-hosted-runner/installation). That setup requires an image with `systemd` enabled, and the runner runs as a `systemd` service inside the container exactly as it does on a bare-metal host. The steps on this page therefore apply unchanged, with three differences.

### Run the steps inside the container

Open a shell in the running container and perform every step from there:

```bash
docker exec -it <container-name> /bin/bash
```

Do not run the steps on the Docker host. The runner, its SDKMAN installation and its `systemd` unit all live inside the container.

### The runner user is always root

In a container the runner requires root, so `HOME` is `/root`. Use the concrete paths below rather than the `<runner-user-home>` placeholder:

```ini
Environment="JAVA_HOME_18_X64=/root/.sdkman/candidates/java/18.0.2.1-zulu"
```

### Container lifecycle determines persistence

The documented `docker run` command mounts only the cgroup filesystem, so the JDK you install is written to the container's writable layer. It survives `docker stop`, `docker start`, `docker restart` and a host reboot, but it is lost when the container is removed and recreated, or when the image is rebuilt.

If your process recreates the runner container, make the JDK part of the container instead of installing it interactively. Either bind-mount the SDKMAN directory and the runner home so they outlive the container:

```bash
docker run -d --name appcircle-runner --privileged \
  -v /sys/fs/cgroup:/sys/fs/cgroup:ro \
  -v appcircle-runner-sdkman:/root/.sdkman \
  -v appcircle-runner-home:/root/appcircle-runner \
  <systemd-enabled-image>
```

Or build a derived image that installs the JDK at image build time, and repeat Step 3 and Step 4 after each container recreation, since the `systemd` unit is generated during runner installation and is not part of the image.

:::caution
Environment variables passed with `docker run -e`, an `--env-file`, a Compose `environment:` block or a Dockerfile `ENV` instruction do not reach the runner. The runner is started by `systemd`, not as the container entrypoint, and a `systemd` service does not inherit the container environment. `JAVA_HOME_18_X64` must be declared in the unit file as shown in Step 3.
:::

## Custom certificates

If you install custom certificates on the runner, the certificate installation script resolves the target JDK from the same `JAVA_HOME_<major>_X64` variable. Once `JAVA_HOME_18_X64` is defined, you can install a certificate into the Java 18 keystore the same way as for the preinstalled versions. See [self-signed certificates](/self-hosted-appcircle/self-hosted-runner/configure-runner/custom-certificates).

## FAQ

### Does the JDK survive a build or a runner restart?

Yes. A self-hosted Linux runner does not reset its filesystem between builds, so the JDK persists. The `JAVA_HOME_18_X64` entry in the systemd unit persists across service restarts as well.

### Does the JDK survive a runner upgrade?

The JDK directory under `.sdkman/candidates/java/` and the systemd unit are both preserved during a runner upgrade. Verify the variable with `systemctl show io.appcircle.runner -p Environment` after upgrading, and re-add the `Environment` line if the unit file was recreated.

### Does the JDK survive recreating the Docker container?

Not by default. It is stored in the container's writable layer, so it is lost when the container is removed and recreated. See [Docker-based runners](#docker-based-runners) for the volume and derived-image options.

### Can the same procedure be used on macOS runners?

The SDKMAN part is the same, but macOS runners are provisioned from a virtual machine base image and reset after every build. A JDK installed during a build is lost. Install it into the base image instead, as described in [runner VM setup](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup).

### Why is Java 18 not preinstalled?

Appcircle preinstalls only LTS releases that still receive security updates. Java 18 is a short term support release that reached end of life in 2023, so shipping it in the runner image would distribute an unpatched JDK to every runner.

## Need Help?

If you have questions about installing an additional JDK on your self-hosted runner, contact us at [support@appcircle.io](mailto:support@appcircle.io) or join the [Appcircle Community Slack](https://join.slack.com/t/appcircle/shared_invite/zt-1sgu9vgz9-fkvyxbtwiaEbNGoZ6PsZaA).
