---
title: Cache Push 
description: Optimize your workflow by utilizing Cache Push to save and streamline data access, improving speed and reliability in your projects.
tags: [cache push, optimization, storage, dependencies, cache structure]
---

import Screenshot from '@site/src/components/Screenshot';
import CacheTokenIdCaution from '@site/docs/workflows/common-workflow-steps/build-cache/\_cache-token-id-expiration-time-caution.mdx';
import CacheDeprecationBranch from '@site/docs/workflows/common-workflow-steps/build-cache/\_cache-deprecation-branch-based.mdx';

# Cache Push

Every single build at Appcircle runs in a clean state. It means that all files and folders that are not versioned in the Git repository are lost when the build pipeline is completed. For example, install dependencies or build artifacts. If you need to keep those files and folders, you can use the Appcircle **Cache Push** and [**Cache Pull**](/workflows/common-workflow-steps/build-cache/cache-pull) components.

:::danger Minimum Version Requirement

Please ensure you are using version **`1.0.4` or later** of the Cache Push component. Earlier versions are no longer compatible with Appcircle.

To make sure you always get the latest updates, it is recommended to use the latest wildcard version (e.g., `1.0.*`):

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE6067-cachelimitversion_v2.png' />

:::

<CacheDeprecationBranch />

With cache, you can persist any resource that is ignored by Git. So you can transfer files and folders between build pipelines. Sometimes it may speed up your build, or it may help if you have reliability issues with the original download location for dependencies. But keep in mind that the cache is uploaded to or downloaded from a remote location. It may help you in some cases, but **it's not a guaranteed way to speed up builds**. You should try and see the actual results of your project.

The cache is stored as a single archive file. **Cache Push** and [**Cache Pull**](/workflows/common-workflow-steps/build-cache/cache-pull) components work in coordination on the same cache file defined with a label. Cache labeling helps you organize your caches. With custom labels, you can create separate cache chunks, share caches between build profiles, or isolate them per branch. For further information, please check out the following documentation:
- [How to Configure Branch-Base Caching](/workflows/common-workflow-steps/build-cache/how-to-configure-branch-based-caching)
- [How to Share Files Between Build Profiles](/workflows/common-workflow-steps/build-cache/how-to-share-file-between-build-profiles)

:::warning Cache Storage Limits

Cache Push component enforces cache storage limits based on license tiers:

- **Starter**: 5 GB
- **Developer**: 10 GB
- **Professional**: 20 GB
- **Enterprise**: 30 GB
- **Self-hosted**: Customizable (see [documentation](/self-hosted-appcircle/install-server/linux-package/configure-server/advanced-configuration/cache-size-configuration))

These limits apply per build. Exceeding the limit will result in a failed cache upload.

:::

When you drag and drop the **Cache Push** component into your [workflow](/workflows), it comes with pre-defined values according to your project type. For example, in the case of Android projects, it comes with pre-defined [Gradle cache](https://docs.gradle.org/current/userguide/build_cache.html) paths, which should prove useful for most Android apps.

<CacheTokenIdCaution />

If you need more paths to cache or need to change paths according to your project, you can customize [included](#input-variables) and [excluded](#input-variables) paths as you wish. All path updates will be reflected in the archived cache file on your next build.

:::danger

You cannot delete a specific cache file from the UI, but if you have a problem with a cache file and need a fresh one, you can change your [cache label](#input-variables) to a new one to go on with a clean cache.

:::

:::info

The system automatically cleans unreachable and obsolete cache files periodically. For this reason, **it's not guaranteed to reach a previously used cache file by using the previous cache label in build**. Also, it’s a good idea to build your workflow in such a way that your **build won’t fail if the cache can’t be accessed**.

:::

### Prerequisites

Before running the **Cache Push** step, you must complete certain prerequisites, as detailed in the table below:

| Prerequisite Workflow Step                      | Description                                     |
|-------------------------------------------------|-------------------------------------------------|
| [**Git Clone**](/workflows/common-workflow-steps/git-clone) | If the folders to be cached are in the repo directory, the **Git Clone** step must be used before. This step will generate the [`$AC_REPOSITORY_DIR`](#input-variables) path. |

:::danger

Keep in mind that included paths and the **Cache Push** step's workflow order are closely related to each other. For example, if you include a path from a repository and you place the **Cache Push** step before the **Git Clone** step, **Cache Push** won't find that path since it's not Git cloned yet. Although that's not a fatal error for **Cache Push**, it will inform you about unreachable paths on build logs. You can review and resolve those kinds of issues from build logs.

:::

:::caution

The other important prerequisite for this component to work is that it must be used after the step in which the generated artifact of the step is to be cached. For example, in the screen shot, to cache dependencies, the **Cache Push** step is used after the [**CocoaPods Install**](/workflows/ios-specific-workflow-steps/cocoapods-install) step.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE2911-pushOrder_v2.png' />

:::


### Input Variables

This step contains some input variable(s). It needs these variable(s) to work. The table below gives explanation for this variable(s).

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE2911-pushInput_v2.png' />

| Variable Name              | Description                                    | Status |
|----------------------------|------------------------------------------------|--------|
| `$AC_CACHE_LABEL`          | User defined cache label to identify one cache from others. Both **Cache Push** and **Cache Pull** steps should have the same value to match. | Required |
| `$AC_CACHE_INCLUDED_PATHS` | Specifies the files and folders that should be in the cache. Multiple glob patterns can be provided as a colon-separated list. For example; `.gradle:app/build` or `Pods:Podfile.lock`. | Required |
| `$AC_CACHE_EXCLUDED_PATHS` | Specifies the files and folders that should be ignored from the cache. Multiple glob patterns can be provided as a colon-separated list. For example, `.gradle/*.lock:*.apk`. An exclude applies only to included paths with the same prefix. See [Excluded Paths and Prefixes](#excluded-paths-and-prefixes). | Optional |
| `$AC_CACHE_KEY_FILE`       | Path to your dependency lock file. The path can be relative to the repository root, start with `~/`, or be absolute. For example, `Podfile.lock` (iOS), `gradle/libs.versions.toml` (Android), `yarn.lock` or `package-lock.json` (React Native), `pubspec.lock` (Flutter). If this file and the included and excluded paths did not change since the last push, the push is skipped. Leave empty to always push. See [Skipping Unchanged Caches](#skipping-unchanged-caches). | Optional |
| `$AC_REPOSITORY_DIR`       | Specifies the cloned repository path. This path will be generated after running the [**Git Clone**](/workflows/common-workflow-steps/git-clone) step. | Optional |

:::info

`$AC_CACHE_KEY_FILE` is available in Cache Push **`1.0.8`** and later. For the React Native Android Cache Push component, it is available in **`1.0.7`** and later.

:::

### Excluded Paths and Prefixes

An exclude pattern applies only to included paths with the same prefix:

- A pattern without a prefix, for example `*.lock`, applies only to included paths in the repository.
- A pattern that starts with `~/` applies only to included paths that start with `~/`.
- A pattern that starts with `/` or with an environment variable applies only to included paths under the same base path.

For example, to exclude the `.lock` files in the `~/.gradle` included path, use `~/.gradle/**/*.lock`. The pattern `*.lock` does not exclude them.

### Skipping Unchanged Caches

Cache Push runs these checks in order. Each check stops the step as early as possible:

1. If `AC_CACHE_PUSH_SKIP` is `true`, the push is skipped. The value is not case-sensitive. You can set it from a [**Custom Script**](/workflows/common-workflow-steps/custom-script) step, for example `echo "AC_CACHE_PUSH_SKIP=true" >> $AC_ENV_FILE_PATH`. This variable is not shown in the step inputs.
2. If `$AC_CACHE_KEY_FILE` is set, Cache Push calculates the SHA-256 of the file together with the included and excluded paths. If the result is the same as the key stored in the pulled cache, the push is skipped before compression. The build log shows `<file> has not changed since the last push. Cache push is skipped.`
3. After compression, if the cache is the same as the pulled cache, the upload is skipped.

:::caution

The key file check needs a **Cache Pull** step with the same cache label earlier in the workflow, because the stored key is read from the pulled cache. Without it, the push always runs.

If the key file is not found, the step logs a warning and pushes the cache. The build does not fail. The first push of a label always runs.

:::

### Compression

When `zstd` is available on the runner, Cache Push archives each included path with `tar` and compresses it with `zstd`. This is much faster than `zip`. If `zstd` is not available, the step uses `zip`. The uploaded cache keeps the same file name in both formats: `<cache key>.zip`, even when the content is a `tar` archive. This matters only if you process the cache file yourself. Extended file attributes (xattrs) are not preserved in the cache.

If the workflow uses a Cache Pull version older than **`1.0.8`**, Cache Push uses `zip`, so that the older Cache Pull can still restore the cache. To use the faster format, update **Cache Pull** before **Cache Push**.

The first build after a workflow moves to Cache Push `1.0.8` and Cache Pull `1.0.8` always uploads the full cache, because the archive format and the change check differ from the older versions. The [Cache Key File](#skipping-unchanged-caches) skip works from the second push onward. Cache Pull `1.0.8` still restores existing `zip` caches.

:::info

In a runner pool that mixes runners with and without `zstd`, for example self-hosted runners, the cache format can change between builds, so the cache is uploaded more often. Install `zstd` on every [self-hosted runner](/self-hosted-appcircle/self-hosted-runner/installation).

:::

:::caution

If you change a Cache Push step to a version older than `1.0.8` (React Native Android: `1.0.7`) in the same edit, the `$AC_CACHE_KEY_FILE` input can stay on the step, and the build fails with `Component does not have input. Input name: AC_CACHE_KEY_FILE`. To fix it, open the step again and save it.

:::

:::tip

**Cache Push** uses a pattern in order to select files and folders. Although the pattern is not a RegExp, it's closer to a shell glob. For example, `~/Library/Caches/CocoaPods` and `Pods` will select the `CocoaPods` folder from home and the repository direction as a whole. Or for an Android project, you can cache the `.gradle ` folder with `~/.gradle` include path and exclude all `.lock` files from there with `~/.gradle/**/*.lock` exclude path. Patterns that can be used in both included and excluded paths are explained in detail [here](https://github.com/appcircleio/appcircle-cache-push-component#included--excluded-paths).

:::

### Known Issues

:::warning Cache Push can report success when the cache is not stored

**Cache Push** can report success even when the cache was not stored. Uploads that took about 70 seconds or longer were missing in the next build, and **Cache Pull** got a `404` error, while the **Cache Push** step was successful. Cache size alone did not cause this: 1.1 GB and 1.6 GB caches were restored when the upload was fast. The root cause is under investigation.

As a workaround, keep your caches small. Narrow the included paths and use excluded paths. If **Cache Pull** gets a `404` error after a successful **Cache Push**, treat it as this known issue.

:::

### Output Variables

You cannot reach the cache archive file directly by yourself. But you can see cache file updates and track changes to cache at the end of the build pipeline from the `ac_cache.zip` file in the [**Download artifacts**](/workflows/common-workflow-steps/export-build-artifacts#download-exported-artifacts) side panel (available from the build's **...** menu in the build list). Also, build logs have some useful information about the cache mechanism and how included and excluded paths are processed. You can see the produced cache file size from the build logs. (The size of the cache file affects upload and download durations.)

:::caution

To view the generated artifacts in the [**Download artifacts**](/workflows/common-workflow-steps/export-build-artifacts#download-exported-artifacts) side panel, please ensure that the [**Export Build Artifacts**](/workflows/common-workflow-steps/export-build-artifacts) step is included in the [workflow](/workflows) after this step.

:::

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-cache-push-component
