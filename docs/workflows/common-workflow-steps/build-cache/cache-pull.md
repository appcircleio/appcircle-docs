---
title: Cache Pull 
description: Enhance your development process with Cache Pull to quickly retrieve and reuse stored data, boosting efficiency and performance.
tags: [cache pull, efficiency, dependencies, cache structure]
---

import Screenshot from '@site/src/components/Screenshot';
import CacheTokenIdCaution from '@site/docs/workflows/common-workflow-steps/build-cache/\_cache-token-id-expiration-time-caution.mdx';
import CacheDeprecationBranch from '@site/docs/workflows/common-workflow-steps/build-cache/\_cache-deprecation-branch-based.mdx';

# Cache Pull

[**Cache Push**](/workflows/common-workflow-steps/build-cache/cache-push) uploads the cache archive file to a remote location, as we explained in detail in the **Cache Push** step. On the other hand, **Cache Pull** downloads and extracts that archive file in the build pipeline, restoring all files and folders to their original locations.

:::danger

[**Cache Push**](/workflows/common-workflow-steps/build-cache/cache-push) and **Cache Pull** components should work in coordination on the same cache file. Therefore, to download the pushed cache, the **Cache Pull** must have the same cache label as the **Cache Push**.

:::

<CacheDeprecationBranch />

:::info

If you need to use the cached folder in a separate project, you have the capability to modify the value of `$AC_BUILD_PROFILE_ID`. For further information, please check out the following documentation:
- [How to Share Files Between Build Profiles](/workflows/common-workflow-steps/build-cache/how-to-share-file-between-build-profiles)

This variables can be adjusted within the [cache label](#input-variables) field, as indicated by the red highlight in the accompanying image. Simply replace them with the project ID that corresponds to your intended usage.

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-197-cache-pull-1_v2.png' />

If you need to use branch-based caching, you can modify the [cache label](#input-variables) input value. For more information, please check the following documentation:
- [How to Configure Branch-Base Caching](/workflows/common-workflow-steps/build-cache/how-to-configure-branch-based-caching)
:::

### Prerequisites

There are no prerequisites required before using the **Cache Pull** step.

:::caution

This component does not require any prerequisite steps for operation. The only thing necessary for the component to work as expected is to utilize the cached files before the step in which they will be used. Additionally, an important prerequisite for this step to function properly is that the files to be used must have been cached in previous builds. 

For example, in the screenshot, to use cached files for Cocoapods, the **Cache Pull** step should be used before the [**Cocoapods Install**](/workflows/ios-specific-workflow-steps/cocoapods-install) step.

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-197-cache-pull-2_v2.png' />

:::

:::danger

If no cache exists for the cache label, for example on the first build or after a failed push, **Cache Pull** logs an error (HTTP `404`). The build is marked **Warning** and continues. It does not fail.

:::

### Input Variables

This step contains some input variable(s). It needs these variable(s) to work. The table below gives explanation for this variable(s).

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-197-cache-pull-3_v2.png' />

| Variable Name              | Description                                    | Status |
|----------------------------|------------------------------------------------|--------|
| `$AC_CACHE_LABEL`          | User defined cache label to identify one cache from others. Both [**Cache Push**](/workflows/common-workflow-steps/build-cache/cache-push) and **Cache Pull** steps should have the same value to match. | Required |
| `$AC_REPOSITORY_DIR`       | Specifies the cloned repository path. This path will be generated after running the [**Git Clone**](/workflows/common-workflow-steps/git-clone) step. | Optional |

<CacheTokenIdCaution />

### Cache Formats

Cache Pull **`1.0.8`** and later restore both cache formats that [**Cache Push**](/workflows/common-workflow-steps/build-cache/cache-push#compression) writes: the `zip` format and the faster `tar` and `zstd` format. The format is detected automatically.

- To restore the `zstd` format, the runner must have `zstd`. Without it, the step logs a warning and skips the cache. The build continues.
- Files on disk that are newer than their cached copy, for example files from **Git Clone**, are not overwritten.
- Restored files are owned by the runner user.

:::info

Update **Cache Pull** to `1.0.8` or later before you update **Cache Push**. When Cache Push finds an older Cache Pull in the workflow, it keeps the `zip` format, so the cache still works, but without the faster compression.

:::

#### Backward Compatibility

Cache Pull versions older than **`1.0.8`** cannot read the `tar` and `zstd` format. They fail to extract it with an `unzip` error, which is a cache miss. The build is marked **Warning** and continues. This can happen in these cases:

- **A cache label is shared between workflows or build profiles.** For example, you [share a cache between build profiles](/workflows/common-workflow-steps/build-cache/how-to-share-file-between-build-profiles) with another profile ID in the cache label. One workflow uses Cache Pull `1.0.8` or later with Cache Push `1.0.8` or later, so it writes the `zstd` format. Another workflow reads the same cache label with a Cache Pull older than `1.0.8` and gets a cache miss.
- **The same workflow pins an older Cache Pull and uses a new cache label.** On the first build, Cache Pull finds no cache, and Cache Push writes the `zstd` format. On the second build, the older Cache Pull cannot read it (cache miss), and Cache Push detects the older Cache Pull and writes `zip`. On the third build, the older Cache Pull restores the cache. So there is one cache miss.

On runners without `zstd`, for example some self-hosted runners, Cache Pull logs a warning and skips a `zstd` cache (cache miss). The build continues.

:::caution

Update every **Cache Pull** step that uses the cache label to `1.0.8` or later before you update **Cache Push**. This includes the steps in other workflows and build profiles that share the cache label.

:::

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-cache-pull-component