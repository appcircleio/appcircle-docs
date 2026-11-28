---
title: Setting Up Appcircle Enterprise App Store Component for GitLab
sidebar_label: Enterprise App Store
description: Upload iOS and Android binaries from a GitLab CI/CD pipeline to the Appcircle Enterprise App Store and publish them.
tags: [gitlab, enterprise app store, ipa distribution, apk distribution, binary distribution]
sidebar_position: 2
---

import PersonalApiTokenRef from '@site/docs/\_personal-api-token-reference.mdx';
import NeedHelp from '@site/docs/\_need-help.mdx';

The Appcircle Enterprise App Store component allows users to upload their apps from a GitLab CI/CD pipeline to the Appcircle Enterprise App Store and publish them as a beta or live version.

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

### How to Add the Appcircle Enterprise App Store Component to Your Pipeline

To use the Appcircle Enterprise App Store component, add the following `include` to your `.gitlab-ci.yml` file:

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/enterprise-app-store@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      appPath: build/spacetech.ipa
      summary: Spacetech $CI_COMMIT_SHORT_SHA
      releaseNotes: $CI_COMMIT_MESSAGE
      publishType: '1'
```

- `personalAPIToken` (required): The Appcircle Personal API Token (Personal Access Key) is used to authenticate and secure access to Appcircle services. Store it in a masked CI/CD variable as described in [Store the Personal API Token](/marketplace/gitlab-ci-cd-catalog#store-the-personal-api-token).
- `subOrganizationName` (optional): The exact name (case-sensitive) of the sub-organization that owns the target Enterprise App Store profile. Use it when your Personal API Token belongs to the root organization. Leave it empty to use the organization of the token. If the sub-organization cannot be found or the token cannot access it, the job fails and does not fall back to the root organization. For more information, see [Sub-Organizations](/marketplace/gitlab-ci-cd-catalog#sub-organizations).
- `appPath` (required): Indicates the file path to the application package that will be uploaded to the Enterprise App Store. Use a `.apk` or `.aab` file for Android and a `.ipa` file for iOS.
- `summary` (required): Used to provide a brief overview of the version of the app that is about to be published.
- `releaseNotes` (required): Contains the details of changes, updates, and improvements made in the current version of the app being published.
- `publishType` (optional, default `'0'`): Specifies the publishing status as either none, beta, or live, and must be assigned the values `'0'`, `'1'`, or `'2'` accordingly. Write the value in quotes.
- `authEndpoint` and `apiEndpoint` (optional): The endpoints of a self-hosted Appcircle server. See [Self-Hosted Appcircle](#self-hosted-appcircle) below.
- `jobName`, `stage`, `image`, and `runnerTags` (optional): Control the GitLab job. See [Common Job Inputs](/marketplace/gitlab-ci-cd-catalog#common-job-inputs).

The component adds a job named `appcircle-enterprise-app-store` to the `deploy` stage. After the upload, the job waits until Appcircle processes the binary, for up to 10 minutes. If Appcircle cancels the processing, the job fails.

:::info

GitLab requires `summary` and `releaseNotes` even when `publishType` is `'0'`.

:::

### Self-Hosted Appcircle

If you use a self-hosted Appcircle server, point the component to your own servers with the optional `authEndpoint` and `apiEndpoint` inputs. When omitted, they default to the Appcircle cloud (`https://auth.appcircle.io` and `https://api.appcircle.io`).

```yaml
include:
  - component: $CI_SERVER_FQDN/appcircleio/appcircle-ci-components/enterprise-app-store@1.0.0
    inputs:
      personalAPIToken: $AC_PERSONAL_API_TOKEN
      authEndpoint: https://auth.appcircle.example.com
      apiEndpoint: https://api.appcircle.example.com
      appPath: build/spacetech.apk
      summary: Spacetech $CI_COMMIT_SHORT_SHA
      releaseNotes: $CI_COMMIT_MESSAGE
      publishType: '0'
```

- `authEndpoint`: Base URL of the self-hosted Appcircle authentication server. Optional; defaults to `https://auth.appcircle.io`.
- `apiEndpoint`: Base URL of the self-hosted Appcircle API server. Optional; defaults to `https://api.appcircle.io`.
- Set `authEndpoint` and `apiEndpoint` together. If you set only one of them, the job stops before it sends a request, so a self-hosted token never goes to the Appcircle cloud. For details, see [Self-Hosted Appcircle](/marketplace/gitlab-ci-cd-catalog#self-hosted-appcircle) on the overview page.

## Leveraging Environment Variables

Use CI/CD variables in the component inputs with the `$VARIABLE_NAME` syntax, for example `personalAPIToken: $AC_PERSONAL_API_TOKEN` or `releaseNotes: $CI_COMMIT_MESSAGE`. GitLab expands the variables when the job runs. To use a literal `$` character in an input value, write `$$`.

:::caution Build Steps Order

Ensure that the component job runs after your build job, and that the build job stores the binary as an artifact.

:::

:::caution

To publish, the component selects the Enterprise App Store profile that received a binary most recently and publishes its newest version. If two pipelines upload at the same time, the version of the other pipeline can be published. Do not run Enterprise App Store uploads of the same organization at the same time.

Appcircle does not accept the same version and build number of an app twice in the same profile. The second upload fails with `ERROR: <task id> id upload request failed with status Cancelled`.

:::

## References

<PersonalApiTokenRef />

- For more detailed instructions and support, visit the [Appcircle Enterprise App Store documentation](/enterprise-app-store).

<NeedHelp />
