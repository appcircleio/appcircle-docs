---
title: Setting Up Appcircle Testing Distribution Component for GitLab
sidebar_label: Testing Distribution
description: Upload iOS and Android binaries from a GitLab CI/CD pipeline to an Appcircle Testing Distribution profile.
tags: [gitlab, testing distribution, ipa distribution, apk distribution, binary distribution]
sidebar_position: 1
---

import PersonalApiTokenRef from '@site/docs/\_personal-api-token-reference.mdx';
import NeedHelp from '@site/docs/\_need-help.mdx';

The Appcircle Testing Distribution component allows users to upload their apps from a GitLab CI/CD pipeline and start distribution to the testing groups of a Testing Distribution profile.

### Discover Component

You can discover more about this component and add it to your pipeline from: [Appcircle CI/CD components - GitLab CI/CD Catalog](https://gitlab.com/explore/catalog/appcircleio/appcircle-ci-components)

## System Requirements

**Compatible Runners:**

- Linux (x86_64) runners with the Docker or Kubernetes executor
- GitLab 17.0 or later (GitLab.com or GitLab Self-Managed)

For details, such as macOS runners and closed networks, see the [GitLab CI/CD Catalog system requirements](/marketplace/gitlab-ci-cd-catalog#system-requirements).

:::note

Both **Appcircle Cloud** and **self-hosted** Appcircle installations are supported. See [Self-Hosted Appcircle](#self-hosted-appcircle) below to configure custom endpoints.

:::

### How to Add the Appcircle Testing Distribution Component to Your Pipeline

To use the Appcircle Testing Distribution component, add the following `include` to your `.gitlab-ci.yml` file:

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/testing-distribution@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      profileName: Spacetech Testers
      createProfileIfNotExists: true
      appPath: build/spacetech.ipa
      message: $CI_COMMIT_TITLE
```

- `personalAPIToken` (required): The Appcircle Personal API Token (Personal Access Key) is used to authenticate and secure access to Appcircle services. Store it in a masked CI/CD variable as described in [Store the Personal API Token](/marketplace/gitlab-ci-cd-catalog#store-the-personal-api-token).
- `subOrganizationName` (optional): The exact name (case-sensitive) of the sub-organization that owns the target Testing Distribution profile. Use it when your Personal API Token belongs to the root organization. Leave it empty to use the organization of the token; new profiles are then created in that organization. If the sub-organization cannot be found or the token cannot access it, the job fails and does not fall back to the root organization. For more information, see [Sub-Organizations](/marketplace/gitlab-ci-cd-catalog#sub-organizations).
- `profileName` (required): Specifies the profile that will be used for uploading the app. The component finds the profile by its exact name.
- `createProfileIfNotExists` (required): Set it to `true` to create the profile if it does not exist. If the profile already exists, the app is uploaded to that profile. Set it to `false` to fail the job when the profile does not exist.
- `appPath` (required): Indicates the file path to the application package that will be uploaded to the Testing Distribution profile. Use a `.apk` or `.aab` file for Android, and a `.ipa` file or a zipped `.xcarchive` (`.zip`) for iOS.
- `message` (required): Your message to testers, ensuring they receive important updates and information regarding the application.
- `authEndpoint` and `apiEndpoint` (optional): The endpoints of a self-hosted Appcircle server. See [Self-Hosted Appcircle](#self-hosted-appcircle) below.
- `jobName`, `stage`, `image`, and `runnerTags` (optional): Control the GitLab job. See [Common Job Inputs](/marketplace/gitlab-ci-cd-catalog#common-job-inputs).

The component adds a job named `appcircle-testing-distribution` to the `deploy` stage. After the upload, the job waits until Appcircle processes the binary, for up to 10 minutes. If Appcircle cancels the processing, the job fails.

:::caution

`createProfileIfNotExists` accepts only `true` or `false`. You cannot set it with a CI/CD variable.

:::

To upload an iOS build and an Android build in the same pipeline, give each include a different `jobName`. See [Use a Component More Than Once](/marketplace/gitlab-ci-cd-catalog#use-a-component-more-than-once). To upload an iOS build from a macOS runner, see [iOS Builds on macOS Runners](/marketplace/gitlab-ci-cd-catalog#ios-builds-on-macos-runners).

### Self-Hosted Appcircle

If you use a self-hosted Appcircle server, point the component to your own servers with the optional `authEndpoint` and `apiEndpoint` inputs. When omitted, they default to the Appcircle cloud (`https://auth.appcircle.io` and `https://api.appcircle.io`).

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

- `authEndpoint`: Base URL of the self-hosted Appcircle authentication server. Optional; defaults to `https://auth.appcircle.io`.
- `apiEndpoint`: Base URL of the self-hosted Appcircle API server. Optional; defaults to `https://api.appcircle.io`.
- Set `authEndpoint` and `apiEndpoint` together. If you set only one of them, the job stops before it sends a request, so a self-hosted token never goes to the Appcircle cloud. For details, see [Self-Hosted Appcircle](/marketplace/gitlab-ci-cd-catalog#self-hosted-appcircle) on the overview page.

## Leveraging Environment Variables

Use CI/CD variables in the component inputs with the `$VARIABLE_NAME` syntax, for example `personalAPIToken: $AC_PERSONAL_API_TOKEN` or `message: $CI_COMMIT_TITLE`. GitLab expands the variables when the job runs. To use a literal `$` character in an input value, write `$$`.

:::caution Build Steps Order

Ensure that the component job runs after your build job, and that the build job stores the binary as an artifact.

:::

## References

<PersonalApiTokenRef />

- To create or learn more about Appcircle testing and distribution profiles, see [Creating or Selecting a Distribution Profile](/testing-distribution/create-or-select-a-distribution-profile).

<NeedHelp />
