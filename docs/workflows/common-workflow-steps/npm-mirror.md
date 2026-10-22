---
title: npm Mirror
description: Point npm, Yarn, pnpm and Node.js installs at your artifact proxy for builds on runners without internet access.
tags: [yarn, node, react native, dependencies, proxy, self-hosted]
---

# npm Mirror

The **npm Mirror** step points the JavaScript tools of the build at your artifact proxy, such as Sonatype Nexus or JFrog Artifactory. Use it on self-hosted runners without internet access, for React Native builds:

- npm, Yarn, pnpm and Corepack download packages from your npm proxy;
- [**Install Node**](/workflows/react-native-specific-workflow-steps/node-install) downloads Node.js from your Node.js proxy;
- React Native 0.81 and later download Hermes and their prebuilt iOS frameworks from your Maven repository.

The step changes nothing in your repository. If all its URLs are empty, it does nothing.

## Prerequisites

- Place the step after **Git Clone** and before **Install Node** and [**npm/Yarn Commands**](/workflows/react-native-specific-workflow-steps/npm-yarn-commands).
- For the rest of a React Native build, add:
  - Android: [**Gradle Mirror**](/workflows/common-workflow-steps/gradle-mirror);
  - iOS: [**CocoaPods Mirror**](/workflows/ios-specific-workflow-steps/cocoapods-mirror) and [**Git Mirror**](/workflows/common-workflow-steps/git-mirror);
  - Android, when a dependency comes from git: **Git Mirror**.
- Your artifact proxy has these repositories, with anonymous read:

| Repository | Type | Remote URL |
| ---------- | ---- | ---------- |
| npm | npm proxy | `https://registry.npmjs.org` |
| Node.js | raw (generic) proxy | `https://nodejs.org/dist` |
| Maven | the Maven group of the Gradle Mirror step | includes `https://repo1.maven.org/maven2/` |

:::tip

Add the URLs to an [environment variable group](/environment-variables) once and select the group in each build configuration. The inputs of the step read these variables by default.

:::

## Input Variables

| Variable Name | Description | Status |
| ------------- | ----------- | ------ |
| `$AC_MIRROR_NPM` | URL of the npm proxy, for example `https://nexus.example.com/repository/npm-proxy/`. | Optional |
| `$AC_MIRROR_NPM_LOCKFILE` | What to do when a lockfile still points at the public registry: `update`, `fail` or `warn`. The default is `update`. See [Lockfiles](#lockfiles). | Optional |
| `$AC_MIRROR_NODE` | URL of the Node.js proxy, for example `https://nexus.example.com/repository/nodejs-dist/`. | Optional |
| `$AC_MIRROR_REACT_NATIVE_MAVEN` | URL of a Maven repository with Maven Central. The default is `$AC_MIRROR_GRADLE`, the URL of the Gradle Mirror step. | Optional |

:::info

Install Node runs `n` with `sudo`, which drops environment variables. When `AC_MIRROR_NODE` is set, the step adds the rule `Defaults env_keep += "N_NODE_MIRROR"` to `/etc/sudoers.d/appcircle-npm-mirror` on the runner, so Install Node keeps the Node.js proxy URL. The rule holds no URL and has no effect on builds without the variable.

:::

## Lockfiles

npm, pnpm and Yarn 2 or later follow the registry the step sets. Yarn 1 downloads from the URLs written in `yarn.lock`. When a lockfile still points at the public registry:

- `update` (default): the step points its URLs at `AC_MIRROR_NPM` in the build's copy of the repository.
- `fail`: the build stops and the log names the file.
- `warn`: the build continues with a warning.

## Limits

- **GitHub dependencies:** npm downloads `github:owner/repo` dependencies as files from `codeload.github.com`, and no setting changes that host. Change them in `package.json`:
  - Recommended: a tarball URL through a raw proxy of `https://github.com` on your artifact proxy, for example `https://nexus.example.com/repository/github/owner/repo/archive/refs/tags/v1.2.3.tar.gz`.
  - If the package builds itself when installed (a `prepare` script), a tarball has no build output. Use a git URL on your git server instead, for example `git+https://git.example.com/github/owner/repo.git#v1.2.3`, and add the **Git Mirror** step.
  - For a GitHub dependency of a dependency, use `overrides` in `package.json`.
- **React Native 0.80 and earlier** download Hermes for iOS from `repo1.maven.org`, with no setting to change it. Use React Native 0.81 or later for iOS builds without internet access. The step warns when it finds an older version.
- **Android SDK packages** that the runner image lacks, such as the NDK version of a native module, are not covered: see [Android SDK Packages](/self-hosted-appcircle/self-hosted-runner/configure-runner/android-sdk-packages).

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-npm-mirror-component
