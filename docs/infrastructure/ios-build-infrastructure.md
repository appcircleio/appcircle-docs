---
title: iOS Build Stacks
description: Learn about the iOS build stacks in Appcircle
tags: [ios, build, build stacks, ios build stacks]
sidebar_position: 1
---

import ContentRef from '@site/src/components/ContentRef';

# iOS Build Stacks

Depending on which Xcode version you select, Appcircle creates a brand new virtual machine running.

If your selected pool from config is "Appcircle macOS Pool (arm64)", there are several options for the virtual machine as listed below:

| Xcode Selection | macOS Version |
| ------- | ----- |
| 27.0.x | Tahoe `26.6.2` |
| 26.3.x - 26.6.x | Tahoe `26.3.2` |
| 16.3.x - 26.3.x | Sequoia `15.6.1` / Sequoia `15.4.1` |
| 16.0.x - 16.2.x | Sequoia `15.6.1` / Sequoia `15.4.1` / Sonoma `14.5` |
| 14.3.x - 15.4.x | Sonoma `14.5` |

MacOS images run on fresh virtual machines for stability and performance. They are created just for your build and become ready within seconds.

During the build process, you can install any dependencies and run commands using [custom script](/workflows/common-workflow-steps/custom-script) steps in the build workflow. This gives you complete control over your build and the virtual machine.

:::info

Please note that virtual machines are wiped off after a build is executed (no matter success or fail) and anything you installed in the virtual machine will be gone.

:::

## Available Xcode Versions

Our macOS runners have Xcode versions 27.0.x, 26.6.x, 26.5.x, 26.4.x, 26.3.x, 26.2.x, 26.1.x, 26.0.x, 16.4.x, 16.3.x, 16.2.x, 16.1.x, 16.0.x, 15.4.x, 15.3.x, 15.2.x, 15.1.x, 15.0.x, 14.3.x available.

The "Appcircle macOS Pool (arm64)" macOS **Tahoe** (`26.3.2`) stack has the Xcode versions below:

| Version | Build |
| ------- | ----- |
| 26.6 | `17F113` |
| 26.5 | `17F42` |
| 26.4.1 | `17E202` |
| 26.3 | `17C529` |

The "Appcircle macOS Pool (arm64)" macOS **Tahoe** (`26.6.2`) stack has the Xcode versions below:

| Version | Build |
| ------- | ----- |
| 27.0 | `27A266a` |
| 26.6 | `17F113` |

:::info

The macOS Tahoe (`26.6.2`) stack carries the Xcode 27.0 release candidate together with the stable Xcode 26.6. Xcode 26.6 is available on the macOS Tahoe (`26.3.2`) stack as well, so you can move between the two stacks without changing the Xcode version you select.

Xcode 27.0 is a pre-release. We strongly recommend testing your workflows on it before relying on it for production builds.

:::

The "Appcircle macOS Pool (arm64)" macOS **Sequoia** (`15.6.1`) stack has the Xcode versions below:

| Version | Build |
| ------- | ----- |
| 26.3 | `17C529` |
| 26.2 | `17C52` |
| 26.1.1 | `17B100` |
| 26.0.1 | `17A400` |
| 16.4 | `16F6` |
| 16.3 | `16E140` |
| 16.2 | `16C5032a` |
| 16.1 | `16B40` |
| 16.0 | `16A242d` |

The "Appcircle macOS Pool (arm64)" macOS **Sequoia** (`15.4.1`) stack has the Xcode versions below:

| Version | Build |
| ------- | ----- |
| 16.4 | `16F6` |
| 16.3 | `16E140` |
| 16.2 | `16C5032a` |
| 16.1 | `16B40` |
| 16.0 | `16A242d` |

The "Appcircle macOS Pool (arm64)" macOS **Sonoma** (`14.5`) stack has the Xcode versions below:

| Version | Build |
| ------- | ----- |
| 16.2 | `16C5032a` |
| 16.1 | `16B40` |
| 16.0 | `16A242d` |
| 15.4 | `15F31d` |
| 15.3 | `15E204a` |
| 15.2 | `15C500b` |
| 15.1 | `15C65` |
| 15.0.1 | `15A507` |
| 14.3.1 | `14E300c` |

## iOS Build Environment

There are many pre-installed packages on virtual machines. You can get a full list of pre-installed packages by running Bash commands in the [custom script](/workflows/common-workflow-steps/custom-script) steps.

Here are some of the most important packages installed in our iOS build runners used for iOS builds:

| Package            | macOS Sonoma | macOS Sequoia `15.4.1` | macOS Sequoia `15.6.1` | macOS Tahoe `26.3.2` | macOS Tahoe `26.6.2` |
| ------------------ | -------------- | -------------- | -------------- | -------------- | -------------- |
| Bash               | 3.2.57         | 3.2.57 | 3.2.57 | 5.3.9 | TBD |
| Bundle             | 2.4.19         | 2.4.19 | 2.7.2 | 2.4.19 | 2.6.9 |
| Carthage           | 0.39.1         | 0.40.0 | 0.40.0 | 0.40.0 | 0.40.0 |
| Curl               | 8.6.0          | 8.7.1 | 8.7.1 | 8.7.1 | TBD |
| Homebrew           | 4.3.5          | 4.5.1 | 4.6.16 | 5.1.0 | TBD |
| Java (OpenJDK)     | 17.0.9         | 17.0.9 | 17.0.9 | 17.0.12 | 17.0.19 |
| Gem                | 3.4.19         | 3.4.19 | 3.4.19 | 3.4.19 | 3.6.9 |
| Fastlane           | 2.220.0        | 2.227.2 | 2.228.0 | 2.232.2 | 2.239.0 |
| Git                | 2.45.2         | 2.49.0 | 2.51.0 | 2.53.0 | 2.55.0 |
| Git LFS            | 3.5.1          | 3.6.1 | 3.7.0 | 3.7.1 | 3.8.0 |
| Gzip (Apple)       | 430.100.5      | 457.100.3 | 457.140.3 | 475 | TBD |
| LibreSSL (OpenSSL) | 3.3.6          | 3.3.6 | 3.3.6 | 3.3.6 | 3.3.6 |
| ImageMagick        | 7.1.1-33       | 7.1.1-47 | 7.1.2-5 | 7.1.2-17 | 7.1.2-31 |
| Maven              | 3.9.7          | 3.9.9 | 3.9.11 | 3.9.14 | 3.9.16 |
| N                  | 9.2.3          | 10.1.0 | 10.2.0 | 10.2.0 | 10.2.0 |
| Node               | 18.20.3        | 18.20.8 | 18.20.8 | 22.22.1 | 22.23.2 |
| Npm                | 10.7.0         | 10.8.2 | 10.8.2 | 10.9.4 | 10.9.8 |
| Perl               | 5.34.1         | 5.34.1 | 5.34.1 | 5.34.1 | TBD |
| Pod                | 1.15.2         | 1.16.2 | 1.16.2 | 1.16.2 | 1.17.0 |
| Pip                | 24.0           | 25.0.1 | 25.2 | 26.0 | 26.2.1 |
| Python             | 3.12.3         | 3.13.3 | 3.14.0 | 3.14.3 | 3.14.7 |
| Rake               | 13.0.6         | 13.0.6 | 13.3.0 | 13.0.6 | TBD |
| Ruby               | 3.2.3          | 3.2.3 | 3.2.3 | 3.2.3 | 3.4.10 |
| Rbenv              | 1.2.0          | 1.3.2 | 1.3.2 | 1.3.2 | 1.3.2 |
| Sdkman             | 5.18.2         | 5.19.0 | 5.20.0 | 5.21.0 | 5.23.0 |
| Slather            | 2.8.0          | 2.8.5 | 2.8.5 | 2.8.5 | 2.8.5 |
| Unzip              | 6.00           | 6.00 | 6.00 | 6.00 | 6.00 |
| Xcodeproj          | 1.27.0         | 1.27.0 | 1.27.0 | 1.27.0 | 1.28.1 |
| Yarn               | 1.22.22        | 1.22.22 | 1.22.22 | 1.22.22 | 1.22.22 |
| Zip                | 3.0            | 3.0 | 3.0 | 3.0 | 3.0 |

### Using your own computer for build

Appcircle supports using a third-party computer to perform builds. You can create your own build environment by installing the operating system and other tools and dependencies you need to tell Appcircle to use that environment to perform builds.

<ContentRef url="/self-hosted-appcircle/self-hosted-runner">
Appcircle Self-hosted Runner
</ContentRef>
