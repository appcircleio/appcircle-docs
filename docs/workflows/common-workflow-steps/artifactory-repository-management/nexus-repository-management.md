---
title: Sonatype Nexus Integration
description: Learn how to integrate Sonatype Nexus with Appcircle.
tags: [cache pull, efficiency, dependencies, cache structure]
sidebar_position: 1
---

import Screenshot from '@site/src/components/Screenshot';
import NexusHttpsProtocol from '@site/docs/\_nexus-https-protocol.mdx';

# Sonatype Nexus Integration

Integrating Sonatype Nexus into your CI/CD pipeline enables secure, efficient, and automated management of dependencies, artifacts, and container images. By connecting Appcircle with Nexus Repository Manager, teams can centralize artifact storage, enforce security policies, and ensure consistent version control across builds. This integration not only streamlines dependency resolution but also enhances supply chain security through vulnerability scanning and license compliance checks. Ultimately improving build reliability and traceability throughout the release process.

### Nexus Integration for iOS

Integrating an Artifactory repository manager into your iOS build process is a robust approach to centralizing dependency management, improving build reliability, and ensuring reproducibility. Below, we’ll demonstrate this process using **Sonatype Nexus Repository Manager** as an example in conjunction with the Appcircle **CocoaPods Install** workflow step. Please ensure your Sonatype Nexus Repository Manager is properly installed and configured. For more information, please visit the [official Sonatype Nexus documentation](https://help.sonatype.com/repomanager3).

:::info Supported Frameworks

Sonatype Nexus supports **CocoaPods** and [**SPM (Swift Package Manager)**](https://www.swift.org/documentation/package-manager/) for iOS. There is no support for [**Carthage**](https://github.com/Carthage/Carthage).

SPM support is provided through the Swift Package Registry API and requires a recent Nexus version. See [Nexus Integration for SPM](#nexus-integration-for-spm) below for the version requirements and configuration.

For more information about supported frameworks, please visit [**Sonatype Nexus Repository documentation**](https://help.sonatype.com/en/formats.html).

:::

:::tip Artifactory Management for SPM on older Nexus versions

If your Nexus instance is older than the versions listed in [Nexus Integration for SPM](#nexus-integration-for-spm), Swift repositories are not available and SPM packages cannot be managed by Nexus.

In that case, an alternative approach to centralize and fetch SPM packages is to collect all SPM packages in a private Git repository. This way, all SPM packages are pulled only from a repository accessible to the user and included in the build process.

**Note**: With this method, the **SPM** packages collected in a single repository must be regularly checked and updated to ensure they remain up to date.

:::

:::caution Configure Sonatype Nexus Repository Authentication

If [anonymous access option](https://help.sonatype.com/en/anonymous-access.html) is turned off in Sonatype Nexus repository, you need to authenticate to the repository with the [**Authenticate with Netrc**](/workflows/common-workflow-steps/authenticate-with-netrc) step or by using a [**Custom Script**](/workflows/common-workflow-steps/custom-script). If Custom Script is used, you can use the bash script given below.

For more information, please visit the [**Sonatype Nexus Authentication documentations**](https://help.sonatype.com/en/cocoapods-repositories.html#configure-nexus-repository-authentication).

```bash
$cat ~/.netrc
machine https://Sonatype Nexus.example.com/repository/cocoapods-specs.git
login admin
password admin123
```

:::

For more information about Sonatype Nexus integration with CocoaPods, please visit the [Sonatype Nexus CocoaPods documentations](https://help.sonatype.com/en/cocoapods-repositories.html).

#### Example 1: How can I fetch the all dependencies from Sonatype Nexus with CocoaPods?

In the **CocoaPods Install** step, in order to pull dependencies from Sonatype Nexus or another artifactory, you need to make some changes in the `Pods` file. For this, the `source url` value of the `Pods` file in the project must be replaced with the relevant artifactory. A short example is shown in the following bash script.

For detailed server-side configuration steps, you can refer to [Appcircle’s Sonatype Nexus configuration guide](/self-hosted-appcircle/install-server/linux-package/configure-server/external-image-registry#sonatype-nexus-configuration).


<NexusHttpsProtocol />

:::info SSL Configuration

If you are using a self-signed SSL certificate, ensure that curl can work with it properly. Since the CocoaPods client uses the curl command to download Pod files from Nexus Repository, you can configure curl by adding the `--insecure` option to the .curlrc file in your home directory. If the file does not exist, simply create it. Example:

```bash
$cat ~/.curlrc
--insecure
```

For detailed information, please visit the [**Sonatype Nexus SSL Configuration documentations**](https://help.sonatype.com/en/cocoapods-repositories.html#configure-ssl).

:::

```bash

platform :ios, '13.0'
source 'https://Sonatype Nexus.example.com/repository/cocoapods-specs.git'
target 'MyApp' do

use_frameworks!
  
  pod 'AFNetworking', '~> 4.0'
  pod 'Alamofire', '~> 5.4'

end

.
.
. #Other Pod file codes

```

### Nexus Integration for SPM

In addition to CocoaPods, Sonatype Nexus can also act as a **Swift Package Registry** for your iOS projects, so SPM dependencies are resolved through your own Nexus instance instead of being fetched directly from public sources.

:::info Version Requirements

Swift repository support was not introduced in a single Nexus release. The minimum version depends on the repository type:

- `swift (proxy)`: Nexus **3.89.0** or later
- `swift (hosted)`: Nexus **3.90.0** or later
- `swift (group)`: Nexus **3.91.0** or later

Swift repositories are available in both the **Community** and **Pro** editions. On the client side, **SPM 5.7 or later** is required, and Sonatype recommends **5.9 or later**.

For more information, please visit the [**Sonatype Nexus Swift repository documentation**](https://help.sonatype.com/en/swift-repositories.html).

:::

:::caution Proxy Repository Limitation

A `swift (proxy)` repository can only use `https://github.com/` as its **Remote storage URL**. Swift proxy repositories only support registries that implement the Swift Package Registry protocol, and there is currently no official public Swift registry, so an arbitrary third-party registry cannot be proxied.

:::

#### 1. Set up the Swift repositories in Nexus

Create the repositories from **Settings > Repository > Repositories > Create repository**:

- `swift (proxy)`: for example `swift-proxy`, with `https://github.com/` as the Remote storage URL.
- `swift (hosted)`: for example `swift-hosted`, for your own internal packages.
- `swift (group)`: for example `swift-group`, containing the hosted and proxy repositories as members, in the order you want them to be resolved.

Clients should target the group repository URL, for example `https://your-nexus-url/repository/swift-group/`.

For the detailed repository creation steps, please visit the [**Sonatype Nexus create a Swift repository documentation**](https://help.sonatype.com/en/create-a-swift-repository.html).

#### 2. Declare the dependencies in Package.swift

Nexus supports both registry identity and Git URL declarations, and they can be mixed in the same manifest:

```swift
dependencies: [
    .package(id: "apple.swift-nio", from: "2.65.0"),
    .package(url: "https://github.com/baekteun/EventLimiter.git", from: "1.0.0")
]
```

In Xcode, packages coming from the registry are referenced as `SCOPE.PACKAGENAME`, for example `apple.swift-log`.

#### 3. Configure the registry with registries.json

SwiftPM reads the registry configuration from a `registries.json` file. For CI builds, the project-scoped path is recommended, since it is resolved from the cloned repository directory:

- Project-scoped: `<repo-root>/.swiftpm/configuration/registries.json`
- Global (macOS): `~/Library/org.swift.swiftpm/configuration/registries.json`

The Xcode variant of the file keeps no credentials, authentication is handled through `~/.netrc`:

```json
{
  "authentication": {
    "your-nexus-url": {
      "loginAPIPath": "/repository/swift-group/login",
      "type": "basic"
    }
  },
  "registries": {
    "[default]": {
      "supportsAvailability": false,
      "url": "https://your-nexus-url/repository/swift-group/"
    }
  },
  "version": 1
}
```

For more information, please visit the [**Sonatype Nexus SPM registry configuration documentation**](https://help.sonatype.com/en/configure-spm-registry.html).

#### 4. Configure the Appcircle workflow

The registry configuration and the credentials must be in place **before** the [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps/xcodebuild-for-devices) step runs. A typical workflow order is:

1. **Git Clone**
2. **Custom Script**: write the `registries.json` file into the cloned repository.
3. **Authenticate with Netrc**: provide the Nexus credentials.
4. **Xcodebuild for Devices**

In the [**Custom Script**](/workflows/common-workflow-steps/custom-script) step, you can generate the configuration file as shown below:

```bash
mkdir -p "$AC_REPOSITORY_DIR/.swiftpm/configuration"
cat > "$AC_REPOSITORY_DIR/.swiftpm/configuration/registries.json" <<EOF
{
  "authentication": {
    "$NEXUS_HOST": {
      "loginAPIPath": "/repository/swift-group/login",
      "type": "basic"
    }
  },
  "registries": {
    "[default]": {
      "supportsAvailability": false,
      "url": "https://$NEXUS_HOST/repository/swift-group/"
    }
  },
  "version": 1
}
EOF
```

For authentication, use the [**Authenticate with Netrc**](/workflows/common-workflow-steps/authenticate-with-netrc) step with the following values:

- `$AC_NETRC_HOSTNAME`: your Nexus host
- `$AC_NETRC_USER`: the Nexus User Token **Name Code**
- `$AC_NETRC_PASS`: the Nexus User Token **Pass Code**

You can generate a User Token from **Account > User Token > Access User Token** in Nexus. If [anonymous access](https://help.sonatype.com/en/anonymous-access.html) is enabled on your Nexus instance, the authentication step can be skipped.

:::caution Store Credentials as Secrets

The Nexus user token name and pass codes should be stored as **secret** environment variables in Appcircle, so they are masked in build logs.

:::

:::info Transitive Dependencies

Sonatype documents the `--replace-scm-with-registry` flag as required for transitive dependencies to be resolved through the proxy repository:

```bash
swift package resolve --replace-scm-with-registry
```

This is a SwiftPM CLI flag and there is currently no documented `xcodebuild` equivalent, so its behavior in an `xcodebuild` based workflow may differ.

For more information, please visit the [**Sonatype Nexus Swift CLI usage documentation**](https://help.sonatype.com/en/swift-cli-usage.html).

:::

:::info SSL Configuration

If your Nexus instance uses a self-signed SSL certificate, the certificate must be trusted by the build machine. On self-hosted runners, install the root CA by following the [**custom certificates guide**](/self-hosted-appcircle/self-hosted-runner/configure-runner/custom-certificates).

The `~/.curlrc --insecure` workaround described for CocoaPods is not applicable here, since the SPM registry client requires a properly trusted certificate.

:::

### Nexus Integration for Android

Integrating an Artifactory repository manager into your Android build process is a robust approach to centralizing dependency management, improving build reliability, and ensuring reproducibility. Below, we’ll demonstrate this process using [**Nexus Repository Manager**](https://www.sonatype.com/products/sonatype-nexus-repository) as an example in conjunction with the Appcircle **Android Build** workflow step.

For detailed instructions on integrating Nexus Repository Manager with Appcircle, see our [Sonatype Nexus Configuration guide](/self-hosted-appcircle/install-server/linux-package/configure-server/external-image-registry#sonatype-nexus-configuration).


#### 1. Set up Nexus repository

- Ensure your Nexus Repository Manager is properly installed and configured. For hosted installations, follow the [official Nexus documentation](https://help.sonatype.com/repomanager3) to set up your Maven or Gradle repositories.  
- Create a hosted Maven repository (or any repository format compatible with your project). Name the repository, for example, `android-repo`.

#### 2. Integrate Nexus into the Android project

In your Android project’s build.gradle (or settings.gradle if using Gradle Version Catalog), configure Nexus as a repository.

<NexusHttpsProtocol />

To fetch dependencies from a Nexus repository, add the following configuration to your Gradle file.
You can place this block in either the project-level or module-level `build.gradle` file, depending on your project structure.

If all modules in your project will use the same artifacts, it is recommended to place it in the project-level file:

```gradle
repositories {
    maven {
        url 'https://your-nexus-url/repository/android-repo/'
    }
}
```

If the URL requires authentication for access, you can configure it as shown below:

```gradle
repositories {
    maven {
        url 'https://your-nexus-url/repository/android-repo/'
        credentials {
            username = "your-username"
            password = "your-password"
        }
    }
}
```

To update your Gradle distribution URL with a Nexus repository, modify your `gradle-wrapper.properties` file and replace the `distributionUrl` value with the Nexus repository URL. Below is an example:  

```gradle
distributionUrl=https://your-nexus-url/repository/gradle-distributions/gradle-8.8-bin.zip
```

#### 3. Run the build workflow

Trigger your build through Appcircle. The workflow will fetch dependencies from the Nexus repository as configured and compile the project with them. Logs will show dependency resolution status to confirm successful integration with Nexus.