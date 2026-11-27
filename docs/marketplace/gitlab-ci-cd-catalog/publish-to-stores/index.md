---
title: Setting Up Appcircle Publish to Stores Component for GitLab
sidebar_label: Publish to Stores
description: Upload binaries from a GitLab CI/CD pipeline to an Appcircle Publish profile and start its publish flow to the app stores.
tags: [gitlab, publish to stores, ipa publish, apk publish, binary publish]
sidebar_position: 3
---

import PersonalApiTokenRef from '@site/docs/\_personal-api-token-reference.mdx';
import NeedHelp from '@site/docs/\_need-help.mdx';
import Screenshot from '@site/src/components/Screenshot';

The Appcircle Publish to Stores component allows users to upload an application binary to an Appcircle **Publish** profile and/or trigger its publish flow (app store publishing) directly from a GitLab CI/CD pipeline.

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

### Generating/Managing the Personal Access Key

To generate a Personal Access Key:

1. In the left sidebar, go to **Organization** > **Security**.
2. Find the **Personal access key** section.
3. Select **Generate key** to generate your first key.

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM91-1_v2.png' alt="Generate Personal Access Key"/>

Store the key in a masked CI/CD variable as described in [Store the Personal API Token](/marketplace/gitlab-ci-cd-catalog#store-the-personal-api-token).

## What the Component Does

The component has two independent switches, `upload` and `publish`. Both default to `false`. **You must enable at least one.** Create the Publish profile in Appcircle first; the component targets it by name (profile names are unique per platform).

| `upload` | `publish` | Behavior                                                                                               |
| -------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `true`   | `false`   | Upload `appPath` as a new app version on the profile.                                                  |
| `false`  | `true`    | Trigger the publish flow for the profile's current release candidate.                                  |
| `true`   | `true`    | Upload `appPath`, mark the new version as release candidate, then trigger the publish flow for it.     |
| `false`  | `false`   | Error: nothing to do. The job fails with `ERROR: Nothing to do: set 'upload' and/or 'publish' to true.` |

:::info Rules

- **Publish flow:** when `publish` is `true`, Appcircle runs every step of the publish flow of the profile. If the flow contains a step that sends the app to a store, the app is sent to the store.
- **Release candidate:** when both `upload` and `publish` are `true`, the freshly uploaded version is marked as the release candidate before it is published. When only `publish` is `true`, the profile must have a release candidate. Otherwise, the job fails with `ERROR: No release candidate app version found on the publish profile. Mark a version as release candidate (or enable upload) before publishing.`
- **Publish flow required:** the profile must have a publish flow. Otherwise, the job fails with `ERROR: No publish flow steps found for the app version. Configure a publish flow on the profile first.`
- **In-progress guard:** if a publish is already running for the target profile, the component does not start a new one and the job fails.
- **Progress:** while publishing, the job shows the progress of each step and waits about 20 minutes at most for the flow to complete.

:::

:::caution

If the profile's publish flow contains a manual step (for example, "Get Approval via Email"), the job waits for that step until the time limit. For CI use, prefer publish flows without manual steps.

:::

### How to Add the Appcircle Publish Component to Your Pipeline

**Upload only:**

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/publish@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      platform: ios
      publishProfile: Spacetech iOS
      upload: true
      appPath: build/spacetech.ipa
```

**Publish only (publishes the profile's current release candidate):**

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/publish@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      platform: ios
      publishProfile: Spacetech iOS
      publish: true
```

**Upload and publish (uploads, marks it release candidate, then publishes):**

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/publish@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      platform: android
      publishProfile: Spacetech Android
      upload: true
      publish: true
      appPath: build/spacetech.aab
```

The component adds a job named `appcircle-publish` to the `deploy` stage.

### Inputs

- `personalAPIToken` (required): Appcircle Personal API Token used to authenticate and secure access to Appcircle services.
- `subOrganizationName` (optional): The exact name (case-sensitive) of the sub-organization that owns the target Publish profile. Use it when your Personal API Token belongs to the root organization. Leave it empty to use the organization of the token. If the sub-organization cannot be found or the token cannot access it, the job fails and does not fall back to the root organization. For more information, see [Sub-Organizations](/marketplace/gitlab-ci-cd-catalog#sub-organizations).
- `platform` (required): Target platform of the Publish profile, `ios` or `android`.
- `publishProfile` (required): Name of the Publish profile to target. Resolved to the profile for the selected platform.
- `upload` (optional, default `false`): Upload `appPath` as a new app version.
- `publish` (optional, default `false`): Trigger the profile's publish flow.
- `appPath` (required when `upload` is `true`): Path to the application file. For iOS use a `.ipa` file; for Android use a `.apk` or `.aab` file.
- `authEndpoint` and `apiEndpoint` (optional): self-hosted endpoints, see below.
- `jobName`, `stage`, `image`, and `runnerTags` (optional): Control the GitLab job. See [Common Job Inputs](/marketplace/gitlab-ci-cd-catalog#common-job-inputs).

:::caution

`upload` and `publish` accept only `true` or `false`. You cannot set them with a CI/CD variable.

Appcircle does not accept the same version and build number of an app twice in the same profile. The second upload fails with `ERROR: <task id> id upload request failed with status Cancelled`.

:::

### Self-Hosted Appcircle

If you use a self-hosted Appcircle server, point the component to your own servers with the optional `authEndpoint` and `apiEndpoint` inputs. When omitted, they default to the Appcircle cloud (`https://auth.appcircle.io` and `https://api.appcircle.io`).

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/publish@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      authEndpoint: https://auth.appcircle.example.com
      apiEndpoint: https://api.appcircle.example.com
      platform: ios
      publishProfile: Spacetech iOS
      publish: true
```

- `authEndpoint`: Base URL of the self-hosted Appcircle authentication server. Optional; defaults to `https://auth.appcircle.io`.
- `apiEndpoint`: Base URL of the self-hosted Appcircle API server. Optional; defaults to `https://api.appcircle.io`.
- Set `authEndpoint` and `apiEndpoint` together. If you set only one of them, the job stops before it sends a request, so a self-hosted token never goes to the Appcircle cloud. For details, see [Self-Hosted Appcircle](/marketplace/gitlab-ci-cd-catalog#self-hosted-appcircle) on the overview page.

## Leveraging Environment Variables

Use CI/CD variables in the component inputs with the `$VARIABLE_NAME` syntax, for example `personalAPIToken: $AC_PERSONAL_API_TOKEN`. GitLab expands the variables when the job runs. To use a literal `$` character in an input value, write `$$`.

:::caution Build Steps Order

When you upload a binary, ensure that the component job runs after your build job, and that the build job stores the binary as an artifact.

:::

## References

<PersonalApiTokenRef />

- For more detailed instructions and support, visit the [Appcircle Publish to Stores documentation](/publish-to-stores-module).

<NeedHelp />
