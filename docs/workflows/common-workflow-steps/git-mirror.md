---
title: Git Mirror
description: Point git at mirrors on your git server for builds on runners without internet access.
tags: [git, swift, dependencies, repository, self-hosted]
---

# Git Mirror

The **Git Mirror** step makes the build clone public git repositories, for example from `github.com`, from mirrors on your own git server. Use it on self-hosted runners without internet access, for dependencies that are cloned with git:

- Swift packages;
- CocoaPods pods with a `:git` source;
- git submodules;
- git dependencies in `pubspec.yaml` and `package.json`.

The step only sets git configuration for the later steps of the build. It writes nothing to the runner or to your repository. If `AC_MIRROR_GIT` is empty, it does nothing.

## Prerequisites

- Your git server has a mirror of each public repository your projects use, under one path with the same `<owner>/<repository>` names. For example, `https://github.com/apple/swift-log` is mirrored at `https://git.example.com/github/apple/swift-log`.
- Mirror the submodules of those repositories too. If a repository uses Git LFS, the mirror needs its LFS files.
- Keep the mirrors up to date, for example with the pull mirroring feature of your git server.
- The build can read the mirrors. The step has no credential inputs, so either:
  - the mirrors are on the same git server as your app, the build profile connects to it over HTTPS, and its user can read them; or
  - the mirrors allow anonymous read.

:::tip

Add the URL to an [environment variable group](/environment-variables) once and select the group in each build configuration. The input of the step reads this variable by default.

:::

## Where to Place the Step

- **After Git Clone**, with the other mirror steps. This covers every dependency that later steps clone.
- **Before Git Clone**, only if your repository has submodules on public hosts. Git Clone then fetches them from the mirrors too.

## Input Variables

| Variable Name | Description | Status |
| ------------- | ----------- | ------ |
| `$AC_MIRROR_GIT` | Base URL of the mirrors on your git server, for example `https://git.example.com/github/`. | Optional |
| `$AC_MIRROR_GIT_SOURCE` | Base URL of the public host that is mirrored. The default is `https://github.com/`. Its https, http and ssh URLs all go to the mirror. For a second host, add the step again. | Optional |

## Find the Repositories to Mirror

| Dependency | Where to look |
| ---------- | ------------- |
| Swift packages | Every `Package.resolved` in the `.xcodeproj` and the `.xcworkspace` (under `xcshareddata/swiftpm/`). It also lists indirect packages. |
| CocoaPods | `:git` pods in the `Podfile` and in `Podfile.lock` |
| Submodules | `.gitmodules`, also inside the submodules |
| Flutter | `git:` entries in `pubspec.yaml` and `pubspec.lock` |
| React Native | git URLs in `package.json` and the lockfile |

## Swift Package Binary Targets

Some Swift packages download a prebuilt framework as a zip file (`.binaryTarget(url:checksum:)` in their `Package.swift`). This is a file download, not git, so the Git Mirror step does not cover it. Point it at a raw (generic) proxy of `https://github.com` on your artifact proxy with a SwiftPM mirror file in your project:

`<App>.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/configuration/mirrors.json`

```json
{
  "object": [
    {
      "original": "https://github.com/rive-app/rive-ios/releases/download/6.28.0/RiveRuntime.xcframework.zip",
      "mirror": "https://nexus.example.com/repository/github/rive-app/rive-ios/releases/download/6.28.0/RiveRuntime.xcframework.zip"
    }
  ],
  "version": 1
}
```

If you open the project from an `.xcworkspace`, put the file under `<App>.xcworkspace/xcshareddata/swiftpm/configuration/` instead.

To find the URLs, look for `.binaryTarget(` with a `url:` in the `Package.swift` of each package. A build without the mirror fails with `failed downloading '<url>'`, which names the file.

## Limits

- Only git is redirected. Other file downloads, such as GitHub release files, need your artifact proxy. For Swift package binary targets, see [Swift Package Binary Targets](#swift-package-binary-targets).
- npm downloads `github:` dependencies as files from `codeload.github.com`, not with git. See [**npm Mirror**](/workflows/common-workflow-steps/npm-mirror#limits).

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-git-mirror-component
