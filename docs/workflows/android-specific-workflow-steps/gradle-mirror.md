---
title: Gradle Mirror
description: Point Gradle at your artifact proxy for builds on runners without internet access.
tags: [gradle, android, dependencies, proxy, self-hosted]
---

# Gradle Mirror

The **Gradle Mirror** step sends every Maven repository and Gradle plugin download of the build to a Maven repository on your artifact proxy, such as Sonatype Nexus or JFrog Artifactory. Use it on self-hosted runners without internet access, for Android, React Native Android and Flutter Android builds.

The step changes nothing in your repository. If `AC_MIRROR_GRADLE` is empty, it does nothing.

Supported: Gradle 7.0 and later.

## Prerequisites

- Place the step after **Git Clone** and before the steps that run Gradle, such as [**Android Build**](/workflows/android-specific-workflow-steps/android-build).
- Your artifact proxy has:
  - a Maven group that contains every repository your projects use;
  - a raw (generic) proxy of `https://services.gradle.org/` for the Gradle wrapper.

<details>
<summary>Artifact proxy setup</summary>

Add these upstreams to the Maven group, in this order. Skip the ones your projects don't use.

| Upstream | Remote URL |
| -------- | ---------- |
| Google Maven | `https://dl.google.com/dl/android/maven2/` |
| Maven Central | `https://repo1.maven.org/maven2/` |
| Gradle Plugin Portal | `https://plugins.gradle.org/m2/` |
| Flutter engine (Flutter projects) | `https://storage.googleapis.com/download.flutter.io/` |
| JitPack and vendor repositories | The URL from your project |

The proxy must follow redirects and reach these hosts too:

- `plugins.gradle.org` redirects to `plugins-artifacts.gradle.org` and `repo.maven.apache.org`.
- `services.gradle.org` redirects to `github.com` and `release-assets.githubusercontent.com`.
- Maven Central redirects React Native artifacts to `repo.reactnative.dev`.

</details>

:::tip

Add the URLs to an [environment variable group](/environment-variables) once and select the group in each build configuration. The inputs of the step read these variables by default.

:::

## Input Variables

| Variable Name | Description | Status |
| ------------- | ----------- | ------ |
| `$AC_MIRROR_GRADLE` | URL of the Maven group, for example `https://nexus.example.com/repository/maven-public/`. | Optional |
| `$AC_MIRROR_GRADLE_DISTRIBUTION` | URL of the raw proxy of `https://services.gradle.org/`, for example `https://nexus.example.com/repository/gradle-distributions/`. | Optional |
| `$AC_MIRROR_GRADLE_WRAPPER` | What to do when the project's Gradle wrapper downloads from `services.gradle.org`: `update`, `fail` or `warn`. The default is `update`. See [Gradle Wrapper](#gradle-wrapper). | Optional |
| `$AC_MIRROR_GRADLE_USERNAME` | User for the Gradle repositories. | Optional |
| `$AC_MIRROR_GRADLE_PASSWORD` | Password of that user. | Optional |
| `$AC_MIRROR_USERNAME` | User shared by the mirror steps. Used when the Gradle user and password are empty. | Optional |
| `$AC_MIRROR_PASSWORD` | Password of the shared user. | Optional |

:::caution

Store passwords as secret environment variables. The step does not print them in the build log.

:::

## Gradle Wrapper

The Gradle wrapper downloads Gradle before the step's settings apply, from the `distributionUrl` in `gradle/wrapper/gradle-wrapper.properties`. When it points at `services.gradle.org`:

- `update` (default): the step points it at `AC_MIRROR_GRADLE_DISTRIBUTION` in the build's copy of the repository. If that URL is empty, the build stops.
- `fail`: the build stops and the log names the file.
- `warn`: the build continues with a warning.

To fix it in the project instead, set `distributionUrl` to your proxy:

```properties
distributionUrl=https\://nexus.example.com/repository/gradle-distributions/distributions/gradle-8.11.1-bin.zip
```

## Find the Repositories Your Project Uses

On a machine where the build works with internet access, download [`list-repositories.gradle`](https://github.com/appcircleio/appcircle-gradle-mirror-component/blob/main/tools/list-repositories.gradle) and run it with the task your Appcircle build runs:

```bash
./gradlew -I list-repositories.gradle app:bundleRelease --dry-run
```

It prints every remote repository the build uses. Each one must be in your Maven group.

## Limits

- Scripts applied with `apply from:` keep their own repositories.
- Android SDK packages are not Maven artifacts. Install the ones the runner image lacks into the base VM: see [Android SDK Packages](/self-hosted-appcircle/self-hosted-runner/configure-runner/android-sdk-packages).
- Java toolchains that Gradle downloads by itself are not covered. Use the [**Select Java Version**](/workflows/common-workflow-steps/select-java-version) step instead.

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-gradle-mirror-component
