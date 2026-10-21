---
title: Android SDK Packages
description: Install Android SDK packages, such as an NDK version, that your projects need but the macOS VM image does not contain, from your artifact proxy on runners without internet access.
tags: [self-hosted runner, android, android sdk, ndk, air-gapped, artifact proxy]
sidebar_position: 8
---

# Android SDK Packages

The macOS VM image contains a set of Android SDK packages: platforms, build-tools, NDK, CMake and platform-tools. When a project needs a package that is not in the image, most often an NDK version, the Android Gradle Plugin downloads it from `https://dl.google.com/android/repository/` during the build.

A runner without internet access can't download it, and the build fails. This page shows how to install the missing package from your artifact proxy into the base VM, so every build finds it.

## When You Need This

An Android, Flutter or React Native build fails, or waits for several minutes and then fails, with one of these messages:

```txt
NDK not configured. Download it with SDK manager. Preferred NDK version is '27.0.12077973'.
Warning: Failed to download any source lists!
Warning: Still waiting for package manifests to be fetched remotely.
```

To find the package version the project needs:

- The build error names it, for example `Preferred NDK version is '27.0.12077973'`.
- Flutter projects use `flutter.ndkVersion` unless `android/app/build.gradle` sets `ndkVersion`.
- React Native projects set `ndkVersion` in `android/build.gradle`.
- Otherwise the default NDK of the project's Android Gradle Plugin version applies.

To see which packages the image already contains, run this inside a runner VM:

```bash
SDK="$HOME/android-sdk-linux"
JAVA_HOME="$(ls -d $HOME/.sdkman/candidates/java/17* | head -1)" \
  "$SDK/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK" --list_installed
```

## Prerequisites

- A raw proxy repository for `https://dl.google.com` on your artifact proxy that keeps the upstream path. With Sonatype Nexus, a `raw (proxy)` repository with the remote URL `https://dl.google.com`; with JFrog Artifactory, a Generic remote repository. The Android SDK repository is then at `https://nexus.example.com/repository/<raw-repo>/android/repository/`.
- The runner VMs trust your artifact proxy's TLS certificate. See [Trust The Root Certificates of Your Organization](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#3-trust-the-root-certificates-of-your-organization).

Check the repository from a runner VM. The command must print `200`:

```bash
curl -s -o /dev/null -w '%{http_code}\n' \
  "https://nexus.example.com/repository/<raw-repo>/android/repository/repository2-3.xml"
```

<details>
<summary>Notes for the artifact proxy administrator</summary>

- The Android SDK tools read `repository2-3.xml` and the other package lists under `/android/repository/`, then download the archives from the same path.
- An NDK archive is about 1 GB. Each version is stored once on the proxy.
- To limit the repository to the Android SDK, scope it with a routing rule that allows only `^/android/repository/.*`.

</details>

## Install a Package into the Base VM

Install the package once into each base VM, `vm01` and `vm02`. Every runner VM is cloned from a base VM, so every build afterwards has the package and no build downloads it again.

1. Stop the runners and start `vm01` as described in [Update Base Images](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#update-base-images), then connect to it with SSH.

2. Stop the runner service inside the VM, so the base VM doesn't take builds while you work on it:

   ```bash
   cd /Volumes/agent-disk/appcircle-runner
   ./ac-runner service -c stop
   ```

3. Install the package with `sdkmanager` from your artifact proxy. Replace the repository URL and the package version with your own:

   ```bash
   SDK="$HOME/android-sdk-linux"
   export JAVA_HOME="$(ls -d $HOME/.sdkman/candidates/java/17* | head -1)"
   yes | SDK_TEST_BASE_URL="https://nexus.example.com/repository/<raw-repo>/android/repository/" \
     "$SDK/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK" --install "ndk;27.0.12077973"
   ```

   `SDK_TEST_BASE_URL` makes `sdkmanager` read the package lists and download the archives from your artifact proxy instead of `https://dl.google.com/android/repository/`. Keep the trailing `/`. The variable is not documented by Google: if your `sdkmanager` version ignores it, the next step shows it, and you can use [the manual installation](#manual-installation) instead.

4. Check the installed version:

   ```bash
   grep Pkg.Revision "$SDK/ndk/27.0.12077973/source.properties"
   # Pkg.Revision = 27.0.12077973
   ```

5. Enable the runner service again and shut down the VM:

   ```bash
   sudo launchctl enable system/io.appcircle.runner
   sudo launchctl print-disabled system | grep io.appcircle.runner
   sudo shutdown -h now
   ```

   The second command must show `enabled` for `io.appcircle.runner`.

   :::caution
   `./ac-runner service -c stop` also disables the runner service. If you shut down the base VM without enabling it again, the runner VMs cloned from it start without a runner and never come online.
   :::

6. Repeat the steps for `vm02`, then start the runners again.

Repeat this after every macOS VM image upgrade, because a new image starts without the packages you added.

### Manual Installation

Use this when `sdkmanager` can't use your artifact proxy. It does the same steps by hand: it finds the macOS archive of the package in the package list, downloads it from the proxy, verifies its checksum and extracts it where the Android Gradle Plugin looks for it. Run it in place of step 3 above.

```bash
SDK="$HOME/android-sdk-linux"
REPO="https://nexus.example.com/repository/<raw-repo>/android/repository/"
PKG="ndk;26.1.10909125"; VERSION="${PKG#ndk;}"

# 1. Find the macOS archive and its SHA-1 in the package list
curl -fsS "${REPO}repository2-3.xml" -o /tmp/repository2-3.xml
read URL SHA1 < <(PKG="$PKG" python3 -c '
import os, re
x = open("/tmp/repository2-3.xml").read()
m = re.search(r"<remotePackage path=\"%s\">(.*?)</remotePackage>" % re.escape(os.environ["PKG"]), x, re.S).group(1)
for a in re.findall(r"<archive>(.*?)</archive>", m, re.S):
    if "<host-os>macosx</host-os>" in a:
        print(re.search(r"<url>(.*?)</url>", a).group(1), re.search(r"<checksum type=\"sha1\">(.*?)</checksum>", a).group(1))
        break')
echo "$URL $SHA1"

# 2. Download through the proxy and verify
curl -fsS "${REPO}${URL}" -o /tmp/ndk.zip
echo "$SHA1  /tmp/ndk.zip" | shasum -a 1 -c -

# 3. Extract and move it to ndk/<version>
mkdir -p /tmp/ndk-extract && ditto -x -k /tmp/ndk.zip /tmp/ndk-extract && rm -f /tmp/ndk.zip
mkdir -p "$SDK/ndk" && mv "$(ls -d /tmp/ndk-extract/*/ | head -1)" "$SDK/ndk/$VERSION"
grep Pkg.Revision "$SDK/ndk/$VERSION/source.properties"
```

## Temporary Workaround: Download Missing Packages in Each Build

:::caution
Use this only to unblock builds until the package is in the base VM. `SDK_TEST_BASE_URL` is an undocumented test variable of Google's SDK tools: any Android Gradle Plugin release may stop reading it, and the build then fails again without warning. Every build also downloads the package again, about 1 GB for an NDK.
:::

Add `SDK_TEST_BASE_URL` to the build's environment variables, for example in an [environment variable group](/environment-variables) bound to the build configuration:

| Key | Value |
| --- | --- |
| `SDK_TEST_BASE_URL` | `https://nexus.example.com/repository/<raw-repo>/android/repository/` |

The Android Gradle Plugin then downloads the missing package from your artifact proxy during the build and installs it. Remove the variable once the package is installed in the base VM.
