---
title: Setting Up Appcircle Publish to Stores Action
sidebar_label: Publish to Stores
description: Enhance powerful action to distribute your builds to app stores via publish to stores module
tags:
  [
    publish to stores,
    ipa publish,
    apk publish,
    binary publish
  ]
sidebar_position: 3
---

import PersonalApiTokenRef from '@site/docs/\_personal-api-token-reference.mdx';
import Screenshot from '@site/src/components/Screenshot';

# Setting Up Appcircle Publish to Stores Action

The Appcircle Publish to Stores action allows users to upload an application binary to an Appcircle **Publish** profile and/or trigger its publish flow (app store publishing) directly from your GitHub workflow.

### Discover Action[​](#discover-action "Direct link to Discover Action")

You can discover more about this action and install it from: [Appcircle Publish - GitHub Marketplace](https://github.com/marketplace/actions/appcircle-publish)

## System Requirements[​](#system-requirements "Direct link to System Requirements")

**Compatible Agents:**

- macos-14 (arm64)
- Ubuntu-22.04

:::note

Both **Appcircle Cloud** and **self-hosted** Appcircle installations are supported. See [Self-Hosted Appcircle](#self-hosted-appcircle) below to configure custom endpoints.

:::

![Appcircle Publish](https://github.com/appcircleio/appcircle-publish-githubaction/raw/main/images/publish.png)

### Generating/Managing the Personal API Tokens[​](#generatingmanaging-the-personal-api-tokens "Direct link to Generating/Managing the Personal API Tokens")

To generate a Personal API Token:

1. Go to the My Organization screen (second option at the bottom left).
2. Find the Personal API Token section in the top right corner.
3. Press the "Generate Token" button to generate your first token.

![Token Generation](https://github.com/appcircleio/appcircle-publish-githubaction/raw/main/images/PAT.png)

## What the Action Does[​](#what-the-action-does "Direct link to What the Action Does")

The action has two independent switches, `upload` and `publish`, both default to `false`. **You must enable at least one.** Create the Publish profile in Appcircle first; the action targets it by name (profile names are unique per platform).

| `upload` | `publish` | Behavior                                                                                                |
| -------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `true`   | `false`   | Upload `appPath` as a new app version on the profile.                                                     |
| `false`  | `true`    | Trigger the publish flow for the profile's current release candidate.                                     |
| `true`   | `true`    | Upload `appPath`, mark the new version as release candidate, then trigger the publish flow for it.        |
| `false`  | `false`   | Error — nothing to do.                                                                                     |

:::info Rules

- **In-progress guard:** if a publish is already running for the target profile, the action does not start a new one and fails fast.
- **Release candidate:** when both `upload` and `publish` are `true`, the freshly uploaded version is automatically marked as the release candidate before it is published. In publish-only mode, the profile's existing release candidate is published.
- **Progress:** while publishing, the action polls the publish status and prints step-by-step progress until the flow succeeds or fails.

:::

:::caution

If the profile's publish flow contains a manual step (e.g. "Get Approval via Email"), the flow will wait for that action and the plugin will keep polling until it completes or the poll times out. For CI use, prefer publish flows without manual gates.

:::

### How to Add the Appcircle Publish Action to Your Pipeline[​](#how-to-add-the-appcircle-publish-action-to-your-pipeline "Direct link to How to Add the Appcircle Publish Action to Your Pipeline")

**Upload only:**

```yaml
- name: Upload to Appcircle Publish
  uses: appcircleio/appcircle-publish-githubaction
  with:
    personalAPIToken: ${{ secrets.AC_PERSONAL_API_TOKEN }}
    platform: ios # or android
    publishProfile: PUBLISH_PROFILE_NAME
    upload: 'true'
    appPath: ./app.ipa
```

**Publish only (publishes the profile's current release candidate):**

```yaml
- name: Trigger Appcircle Publish
  uses: appcircleio/appcircle-publish-githubaction
  with:
    personalAPIToken: ${{ secrets.AC_PERSONAL_API_TOKEN }}
    platform: ios
    publishProfile: PUBLISH_PROFILE_NAME
    publish: 'true'
```

**Upload and publish (uploads, marks it release candidate, then publishes):**

```yaml
- name: Upload and Publish to Appcircle
  uses: appcircleio/appcircle-publish-githubaction
  with:
    personalAPIToken: ${{ secrets.AC_PERSONAL_API_TOKEN }}
    platform: android
    publishProfile: PUBLISH_PROFILE_NAME
    upload: 'true'
    publish: 'true'
    appPath: ./app.aab
```

### Inputs[​](#inputs "Direct link to Inputs")

- `personalAPIToken` (required): Appcircle Personal API Token used to authenticate and secure access to Appcircle services.
- `platform` (required): Target platform of the Publish profile, `ios` or `android`.
- `publishProfile` (required): Name of the Publish profile to target. Resolved to the profile for the selected platform.
- `upload` (optional, default `false`): Upload `appPath` as a new app version.
- `publish` (optional, default `false`): Trigger the profile's publish flow.
- `appPath` (required when `upload` is `true`): Path to the application file. For iOS use a `.ipa` file; for Android use a `.apk` or `.aab` file.
- `authEndpoint` / `apiEndpoint` (optional): self-hosted endpoints — see below.

### Self-Hosted Appcircle[​](#self-hosted-appcircle "Direct link to Self-Hosted Appcircle")

If you run a self-hosted Appcircle installation, point the action to your own servers with the optional `authEndpoint` and `apiEndpoint` inputs. When omitted, they default to the Appcircle cloud (`https://auth.appcircle.io` and `https://api.appcircle.io`), so existing cloud workflows keep working without any change.

```yaml
- name: Trigger Appcircle Publish
  uses: appcircleio/appcircle-publish-githubaction
  with:
    personalAPIToken: ${{ secrets.AC_PERSONAL_API_TOKEN }}
    platform: ios
    publishProfile: PUBLISH_PROFILE_NAME
    publish: 'true'
    authEndpoint: https://auth.your-appcircle-domain.com
    apiEndpoint: https://api.your-appcircle-domain.com
```

- `authEndpoint`: Base URL of the self-hosted Appcircle authentication server. Optional; defaults to `https://auth.appcircle.io`.
- `apiEndpoint`: Base URL of the self-hosted Appcircle API server. Optional; defaults to `https://api.appcircle.io`.

:::caution Self-Signed or Private CA Certificates

If your self-hosted Appcircle server uses a self-signed certificate (or one issued by a private/internal CA), requests will fail certificate validation. The action does not disable TLS verification. Trust the server's CA on the runner — set the `NODE_EXTRA_CA_CERTS` environment variable to a PEM file containing the CA certificate, or add the CA to the system certificate store.

:::

## Leveraging Environment Variables[​](#leveraging-environment-variables "Direct link to Leveraging Environment Variables")

Utilize environment variables seamlessly by substituting the parameters with `${{ envs.VARIABLE_NAME }}` in your task inputs. The action automatically retrieves values from the specified environment variables within your pipeline.

:::caution Build Steps Order

Ensure that this action is added after build steps have been completed.

:::

## References[​](#references "Direct link to References")

- For details on generating an Appcircle Personal API Token, visit [Generating/Managing Personal Access Keys](https://docs.appcircle.io/account/my-organization/security/personal-access-key).

- For more detailed instructions and support, visit the [Publish to Stores documentation](https://docs.appcircle.io/publish-to-stores-module).