---
title: Appcircle Jenkins Publish to Stores Plugin
sidebar_label: Publish to Stores
description: Enhance powerful plugin to publish your builds via appcircle publish to stores module
tags:
  [
    publish to stores,
    ipa publish,
    apk publish,
    binary publish
  ]
sidebar_position: 3
---

import Screenshot from '@site/src/components/Screenshot';

# Setting Up Appcircle Publish to Stores Plugin

The Appcircle Publish to Stores plugin allows users to upload their application binaries to an Appcircle **Publish** profile and trigger its publish flow to release apps directly to the app stores.

### Discover Plugin[​](#discover-plugin "Direct link to Discover Plugin")

You can discover more about this action and install it from: [Appcircle Publish to Stores](https://plugins.jenkins.io/appcircle-publish/)

## System Requirements[​](#system-requirements "Direct link to System Requirements")

**Compatible Agents:**

- macOS 14 (arm64)

**Supported Version:**

- Jenkins 2.541.3

:::caution

Currently, plugins are only compatible to use with **Appcircle Cloud**. **Self-hosted** support will be available in future releases.

:::

### Install Appcircle Publish to Stores Plugin[​](#install-appcircle-publish-to-stores-plugin "Direct link to Install Appcircle Publish to Stores Plugin")

Go to your Jenkins dashboard and navigate to Manage Jenkins > Manage Plugins. Then, search for "Appcircle Publish" in the available plugins section.

<!-- ![Screenshot](https://cdn.appcircle.io/docs/assets/sp-XXX-publish-installation-steps.png) -->

### Add Plugin in Build Steps[​](#add-plugin-in-build-steps "Direct link to Add Plugin in Build Steps")

Go to your configuration page of the project and add a build step for **Appcircle Publish**.

<!-- ![Screenshot](https://cdn.appcircle.io/docs/assets/sp-XXX-publish-build-step.png) -->

### Configure Plugin[​](#configure-plugin "Direct link to Configure Plugin")

After adding the plugin to your build steps, ensure that you provide all required inputs.

- **Personal Access Key** — Appcircle Personal Access Key used to authenticate Appcircle services.
- **Platform** — `iOS` or `Android`.
- **Publish Profile Name** — the name of the Publish profile to target. Create the profile in Appcircle first; profile names are unique per platform.
- **Upload binary** — uploads the file at App Path as a new app version on the profile.
- **Trigger publish flow** — starts the profile's publish flow.
- **App Path** — path to the application file; required when Upload is checked. For iOS, this is a `.ipa` file path. For Android, this is an `.apk` or `.aab` file path.
- **Self-Hosted Appcircle** (advanced) — optional `Auth Endpoint` / `API Endpoint`, defaults to the Appcircle cloud.

:::note

The build step has two independent switches, `upload` and `publish`, both default to `false`. **You must enable at least one.**

:::

<!-- ![Screenshot](https://cdn.appcircle.io/docs/assets/sp-XXX-publish-usage.png) -->

### Adding the Plugin to Your Pipeline[​](#adding-the-plugin-to-your-pipeline "Direct link to Adding the Plugin to Your Pipeline")

```groovy
stage('Publish') {

   environment {

      AC_PAT = credentials('AC_PAT')

   }

    steps {

       appcirclePublish personalAPIToken: AC_PAT,

               platform: 'PLATFORM',

               publishProfile: 'PROFILE_NAME',

               upload: true,

               publish: true,

               appPath: 'APP_PATH'

    }

}
```

- `personalAPIToken`: The Appcircle Personal API token (Personal Access Key) is used to authenticate and secure access to Appcircle services. Add this token to your credentials to enable its use in your pipeline and ensure authorized actions within the platform.
- `platform`: Specifies the target platform, either `ios` or `android`.
- `publishProfile`: Specifies the Publish profile that will be used for uploading and/or publishing the app. Profile names are unique per platform.
- `upload`: Optional boolean. When `true`, uploads the binary at `appPath` as a new app version on the profile.
- `publish`: Optional boolean. When `true`, triggers the publish flow for the profile.
- `appPath`: Indicates the file path to the application package that will be uploaded to the Appcircle Publish profile. Required when `upload` is `true`.
- `authEndpoint`: Optional. For self-hosted Appcircle installations, sets the authentication server base URL (for example, `https://auth.your-appcircle-domain.com`). Leave empty to use the Appcircle cloud default (`https://auth.appcircle.io`).
- `apiEndpoint`: Optional. For self-hosted Appcircle installations, sets the API server base URL (for example, `https://api.your-appcircle-domain.com`). Leave empty to use the Appcircle cloud default (`https://api.appcircle.io`).

#### Upload / Publish Behavior[​](#upload--publish-behavior "Direct link to Upload / Publish Behavior")

| `upload` | `publish` | Behavior                                                                                             |
| -------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `true`   | `false`   | Upload the binary at App Path as a new app version on the profile.                                    |
| `false`  | `true`    | Trigger the publish flow for the profile's current release candidate.                                 |
| `true`   | `true`    | Upload the binary, mark the new version as release candidate, then trigger the publish flow for it.   |
| `false`  | `false`   | Error — nothing to do.                                                                                 |

:::info In-Progress Guard

If a publish is already running for the target profile, the step does not start a new one and fails the build.

:::

:::caution

If the profile's publish flow contains a manual step (e.g. "Get Approval via Email"), the flow waits for that action and the plugin keeps polling until it completes or the poll times out. For CI use, prefer publish flows without manual gates.

:::

:::caution Build Steps Order

Ensure that this action is added after build steps have been completed, since you will need to specify the build path later on.

:::

## References[​](#references "Direct link to References")

- For details on generating an Appcircle Personal Access Key, visit [Generating/Managing Personal Access Keys](https://docs.appcircle.io/account/my-organization/security/personal-access-key).

- For more detailed instructions and support, visit the [Appcircle Publish to Stores documentation](https://docs.appcircle.io/publish-to-stores-module).