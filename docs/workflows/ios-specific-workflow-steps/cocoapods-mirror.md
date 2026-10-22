---
title: CocoaPods Mirror
description: Point CocoaPods at your artifact proxy for builds on runners without internet access.
tags: [cocoapods, ios, dependencies, proxy, self-hosted]
---

# CocoaPods Mirror

The **CocoaPods Mirror** step makes [**Cocoapods Install**](/workflows/ios-specific-workflow-steps/cocoapods-install) download pods from a CocoaPods proxy on your artifact proxy, such as Sonatype Nexus or JFrog Artifactory. Use it on self-hosted runners without internet access, for iOS, React Native iOS and Flutter iOS builds.

CocoaPods has no global mirror setting: it uses the `source` in the `Podfile`. The step points that source at your proxy in the build's copy of the repository. Nothing is pushed to your repository. If `AC_MIRROR_COCOAPODS` is empty, the step does nothing.

## Prerequisites

- Place the step after **Git Clone** and before **Cocoapods Install**.
- Your artifact proxy has a CocoaPods proxy of `https://cdn.cocoapods.org/`. The proxy must follow redirects to `cdn.jsdelivr.net` and reach the hosts the pods download from, mostly `github.com`.
- Pods with a `:git` source are cloned with git. For them, add the [**Git Mirror**](/workflows/common-workflow-steps/git-mirror) step too.

:::tip

Add the URL to an [environment variable group](/environment-variables) once and select the group in each build configuration. The input of the step reads this variable by default.

:::

## Input Variables

| Variable Name | Description | Status |
| ------------- | ----------- | ------ |
| `$AC_MIRROR_COCOAPODS` | URL of the CocoaPods proxy, for example `https://nexus.example.com/repository/cocoapods-proxy/`. | Optional |
| `$AC_MIRROR_COCOAPODS_PODFILE` | What to do when a `Podfile` uses the public CocoaPods source: `update`, `fail` or `warn`. The default is `update`. See [Podfile Source](#podfile-source). | Optional |

## Podfile Source

A `Podfile` uses the public source when it has `source 'https://cdn.cocoapods.org/'`, `source 'https://github.com/CocoaPods/Specs.git'`, or no `source` line. In that case:

- `update` (default): the step replaces the public source with your proxy, or adds the proxy if there was no `source` line. Other sources, such as your private spec repository, stay.
- `fail`: the build stops and the log names the file.
- `warn`: the build continues with a warning.

A `Podfile` that already uses your proxy is not changed. To fix it in the project instead, add the proxy as the first line of the `Podfile`:

```ruby
source 'https://nexus.example.com/repository/cocoapods-proxy/'
```

## Limits

- The step reads plain `source '<url>'` lines. If your `Podfile` builds its sources in Ruby code, set the source in the project.
- Some pods download files during `pod install` with their own scripts (`prepare_command`), outside CocoaPods. Serve those files from your artifact proxy and point the pod at them.

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-cocoapods-mirror-component
