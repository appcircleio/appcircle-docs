---
title: GitLab CI/CD Catalog
description: Upload iOS and Android binaries to Appcircle from GitLab CI/CD pipelines with the Appcircle components in the GitLab CI/CD Catalog.
tags: [gitlab, marketplace, testing distribution, enterprise app store, publish to stores, ci/cd]
sidebar_position: 2
---

import PersonalApiTokenRef from '@site/docs/\_personal-api-token-reference.mdx';
import NeedHelp from '@site/docs/\_need-help.mdx';

Appcircle provides three CI/CD components for GitLab. A CI/CD component is a reusable part of a GitLab pipeline configuration that you add to your `.gitlab-ci.yml` file with the `include` keyword. The Appcircle components upload iOS and Android binaries from your GitLab pipeline to Appcircle.

### [Testing Distribution](/marketplace/gitlab-ci-cd-catalog/testing-distribution)

Upload a binary to a Testing Distribution profile and share it with the testing groups of the profile.

### [Enterprise App Store](/marketplace/gitlab-ci-cd-catalog/enterprise-app-store)

Upload a binary to the Enterprise App Store and publish it as a beta or live version.

### [Publish to Stores](/marketplace/gitlab-ci-cd-catalog/publish-to-stores)

Upload a binary to a Publish profile and start the publish flow of the profile.

The components work with the Appcircle cloud and with a self-hosted Appcircle server.

### Discover the Components

The components are published in the [GitLab CI/CD Catalog](https://gitlab.com/explore/catalog/appcircleio/appcircle-ci-components). The source code and the README file are in the [appcircle-ci-components project](https://gitlab.com/appcircleio/appcircle-ci-components).

## System Requirements

:::info
The components require GitLab 17.0 or later. CI/CD components, the CI/CD Catalog, and CI/CD inputs are generally available in GitLab 17.0.
:::

- **A Linux runner with the Docker or Kubernetes executor.** Each component runs its job in a container image. The Shell and SSH executors do not support the `image` keyword, so they cannot run the components. To upload an iOS build from a macOS runner, see [iOS Builds on macOS Runners](#ios-builds-on-macos-runners).
- **An x86_64 (`amd64`) runner.** The image is built for `linux/amd64` only. A Linux `arm64` runner cannot run it unless the host emulates `amd64`.
- **Access to the image.** The runner pulls the image from `registry.gitlab.com`. If your runners cannot reach `registry.gitlab.com`, see [Closed Networks](#closed-networks).
- **An Appcircle Personal API Token.** The `personalAPIToken` input accepts a Personal API Token (Personal Access Key).

## Store the Personal API Token

Store the token in a CI/CD variable so that it does not appear in your `.gitlab-ci.yml` file or in the job log:

1. In your GitLab project, go to **Settings** > **CI/CD** and expand **Variables**.
2. Add a variable with the key `AC_PERSONAL_API_TOKEN` and your token as the value.
3. Set **Visibility** to **Masked and hidden**. On GitLab versions earlier than 17.4, select **Masked**.
4. Select **Protect variable**.

Then pass the variable to the component with `personalAPIToken: $AC_PERSONAL_API_TOKEN`.

:::info
A protected variable is available only in pipelines that run on protected branches or protected tags. Run the upload job on a protected branch, or clear **Protect variable**.
:::

## Add a Component to Your Pipeline

Add the component with the `include` keyword. Each component adds one job to your pipeline:

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/testing-distribution@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      profileName: Spacetech Testers
      createProfileIfNotExists: true
      appPath: build/spacetech.apk
      message: Build $CI_PIPELINE_ID
```

`$CI_SERVER_FQDN` is a predefined GitLab variable that contains the address of your GitLab instance.

The job runs in the `deploy` stage and uploads the file at `appPath`. Make sure that an earlier job creates the file and stores it as a [job artifact](https://docs.gitlab.com/ci/jobs/job_artifacts/).

To change the job, define a job with the same name in your `.gitlab-ci.yml` file. GitLab merges it with the job of the component. For example, to download the artifact of a specific job:

```yaml
appcircle-testing-distribution:
  needs:
    - build-android
```

### Common Job Inputs

The three components share these inputs. They control the GitLab job, not the upload:

- `jobName` (optional): Name of the job. The default is `appcircle-testing-distribution`, `appcircle-enterprise-app-store`, or `appcircle-publish`. Set a different name for each include of the same component in a pipeline.
- `stage` (optional, default `deploy`): Stage of the job. If your `.gitlab-ci.yml` file defines `stages` without `deploy`, set a stage that exists.
- `image` (optional): Image that runs the job. Each version pins the image of that version by its digest. Set it only to use a copy of the same image, as described in [Closed Networks](#closed-networks).
- `runnerTags` (optional, default `[]`): Tags that select a Linux runner with the Docker or Kubernetes executor, for example `[linux, docker]`.

## iOS Builds on macOS Runners

iOS builds usually run on a macOS runner with the Shell executor, which cannot run the components. GitLab-hosted macOS runners also use the `image` keyword only to select a GitLab macOS image. Build the app on the macOS runner, store the `.ipa` file as an artifact, and upload it from a Linux runner:

```yaml
stages:
  - build
  - deploy

build-ios:
  stage: build
  tags:
    - macos
  script:
    - ./scripts/build-ios.sh
  artifacts:
    paths:
      - build/spacetech.ipa

include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/testing-distribution@1.0.0
    inputs:
      jobName: upload-ios
      runnerTags:
        - linux
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      profileName: Spacetech Testers
      createProfileIfNotExists: false
      appPath: build/spacetech.ipa
      message: iOS build $CI_PIPELINE_ID

upload-ios:
  needs:
    - build-ios
```

Replace `./scripts/build-ios.sh` with your build commands and the tags with the tags of your runners.

## Use a Component More Than Once

GitLab merges jobs that have the same name. To upload an iOS build and an Android build with the same component, give each include a different `jobName`:

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/testing-distribution@1.0.0
    inputs:
      jobName: appcircle-ios
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      profileName: Spacetech Testers
      createProfileIfNotExists: false
      appPath: build/spacetech.ipa
      message: iOS build $CI_PIPELINE_ID
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/testing-distribution@1.0.0
    inputs:
      jobName: appcircle-android
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      profileName: Spacetech Testers
      createProfileIfNotExists: false
      appPath: build/spacetech.apk
      message: Android build $CI_PIPELINE_ID
```

## Versions

Releases use semantic versions without a `v` prefix, for example `1.0.0`. Reference a version after `@` in the component address:

| Reference  | Selects                                              |
| ---------- | ---------------------------------------------------- |
| `@1.0.0`   | Exactly version `1.0.0`.                             |
| `@1.0`     | The latest `1.0.x` version.                          |
| `@1`       | The latest `1.x.y` version.                          |
| `@~latest` | The latest version. It can include breaking changes. |

- Beta versions use the form `1.1.0-beta.1`. Partial references and `@~latest` never select a beta version. To use a beta version, reference it exactly, for example `@1.1.0-beta.1`.
- Each version pins its image by digest, so a version always runs the same code.
- For reproducible pipelines, reference an exact version.

## Self-Hosted Appcircle

To use a self-hosted Appcircle server, set the `authEndpoint` and `apiEndpoint` inputs together. When you omit them, the components use the Appcircle cloud (`https://auth.appcircle.io` and `https://api.appcircle.io`).

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/testing-distribution@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      authEndpoint: https://auth.appcircle.example.com
      apiEndpoint: https://api.appcircle.example.com
      profileName: Spacetech Testers
      createProfileIfNotExists: true
      appPath: build/spacetech.apk
      message: Build $CI_PIPELINE_ID
```

- `authEndpoint`: Base URL of the authentication server of your self-hosted Appcircle server. Optional; defaults to `https://auth.appcircle.io`.
- `apiEndpoint`: Base URL of the API server of your self-hosted Appcircle server. Optional; defaults to `https://api.appcircle.io`.
- Set `authEndpoint` and `apiEndpoint` together. If you set only one of them, the job stops before it sends a request, so the token of a self-hosted server never goes to the Appcircle cloud. The job fails with this message:

  ```text
  ERROR: Set both authEndpoint and apiEndpoint for a self-hosted Appcircle server, or leave both empty for the Appcircle cloud.
  ```

- The components remove leading and trailing spaces and a trailing `/` from the endpoints. An empty endpoint, or the cloud address in any letter case, means the Appcircle cloud.

## Sub-Organizations

If your Personal API Token belongs to the root organization and the target profile belongs to a sub-organization, set the optional `subOrganizationName` input to the exact name (case-sensitive) of the sub-organization:

- The component signs in to the sub-organization with the same token and runs every request there. The job log shows `Switched to sub-organization: <name>`.
- Leave `subOrganizationName` empty to use the organization of the token.
- If the sub-organization cannot be found or the token cannot access it, the job fails and does not fall back to the root organization:

  ```text
  ERROR: Sub-organization '<name>' could not be found or is not accessible with this token.
  ```

- Sub-organizations work the same way with a self-hosted Appcircle server.

## Closed Networks

If your runners cannot pull images from `registry.gitlab.com`, copy the image to your own registry and set the `image` input.

1. Find the digest of the image. It is the `sha256:<digest>` part of the default value of the `image` input in `templates/testing-distribution.yml` of the version that you use. The three components of a version use the same image.
2. Copy the image with [skopeo](https://github.com/containers/skopeo). Reference the source image only by its digest, because skopeo does not accept a tag and a digest together. The `--preserve-digests` option keeps the digest, so you can reference your copy with the same digest.

   ```bash
   skopeo copy --all --preserve-digests \
     docker://registry.gitlab.com/appcircleio/appcircle-ci-components@sha256:<digest> \
     docker://registry.example.com/mobile/appcircle-ci-components:1.0.0
   ```

3. Set the `image` input to your copy, referenced by the same digest:

   ```yaml
   include:
     - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/testing-distribution@1.0.0
       inputs:
         image: registry.example.com/mobile/appcircle-ci-components@sha256:<digest>
         personalAPIToken: $AC_PERSONAL_API_TOKEN
         profileName: Spacetech Testers
         createProfileIfNotExists: true
         appPath: build/spacetech.apk
         message: Build $CI_PIPELINE_ID
   ```

:::caution
If you store the copy in the private container registry of another GitLab project, add each project that uses the components to the **CI/CD job token allowlist** of that project (**Settings** > **CI/CD** > **Job token permissions**). Otherwise, the job cannot pull the image and fails with `pull access denied`.
:::

## Self-Managed GitLab

A pipeline can include components only from its own GitLab instance. To use the components on a GitLab Self-Managed instance, copy the `appcircle-ci-components` project to your instance and release its versions there. Prepare the project before you copy any tag, because each tag pipeline publishes a version.

1. Create a project on your instance and add a project description.
2. Go to **Settings** > **General**, expand **Visibility, project features, permissions**, and turn on **CI/CD Catalog project**. This setting requires the Owner role.
3. Go to **Settings** > **CI/CD**, expand **General pipelines**, and set **CI/CD configuration file** to `ci/mirror-release.yml`. This file only releases a version; it does not build an image.
4. Go to **Settings** > **Repository** > **Protected tags**, protect `*.*.*`, and allow Maintainers to create these tags. The release job runs only for protected tags.
5. Copy the repository and the release tags:
   - On GitLab Free, push the default branch, then push the release tags one at a time or a few at a time. By default, GitLab creates pipelines for at most four tags or branches in one push. For more information, see [Number of pipelines per Git push](https://docs.gitlab.com/administration/cicd/limits/#number-of-pipelines-per-git-push).
   - On GitLab Premium or Ultimate, you can use [pull mirroring](https://docs.gitlab.com/user/project/repository/mirror/pull/) instead. Select **Trigger pipelines for mirror updates** so that new tags start the release pipeline.
6. The `release` job of each tag pipeline creates the release, and the version appears in the CI/CD Catalog of your instance.
7. In the `component:` address of your pipelines, replace `appcircleio/appcircle-ci-components` with the path of your project, for example `$CI_SERVER_FQDN/mobile/appcircle-ci-components/testing-distribution@1.0.0`.

:::warning
If you do not set the CI/CD configuration file in step 3, tag pipelines run `.gitlab-ci.yml`, which releases only in the original project on GitLab.com, and no version is published on your instance. For tags that are not protected, the release job fails with `Releases run only from protected branches and tags. <tag> is not protected.`
:::

- The `release` job uses the GitLab CLI image from `registry.gitlab.com` by default. In a closed network, copy that image to your registry and set the project CI/CD variable `AC_MIRROR_RELEASE_IMAGE` to your copy.
- On GitLab versions earlier than 18.0, the `release` keyword needs `release-cli` instead of the GitLab CLI. Set `AC_MIRROR_RELEASE_IMAGE` to an image that contains `release-cli`.
- If a tag already has a release, a retry of its `release` job fails because the release exists.
- The components still pin the image on `registry.gitlab.com`. If your runners cannot reach it, see [Closed Networks](#closed-networks).

## Notes

- **The `$` character in inputs:** GitLab expands CI/CD variables in input values, for example `message: Build $CI_PIPELINE_ID`. To use a literal `$`, write `$$`.
- **Do not define variables that start with `AC_INPUT_`:** the components pass their inputs to the job as variables with the `AC_INPUT_` prefix. A variable with the same name from the project, group, or instance settings, from the pipeline run, or from a dotenv report overrides the input.
- **Upload processing:** after the upload, the job waits until Appcircle processes the binary, for up to 10 minutes. If Appcircle cancels the processing, the job fails.

## References

<PersonalApiTokenRef />

- For the full list of inputs, see the [README file of the appcircle-ci-components project](https://gitlab.com/appcircleio/appcircle-ci-components).

<NeedHelp />
