---
title: Enterprise App Store Walkthrough
description: A quick overview of the Appcircle Enterprise App Store, from setting up your Enterprise Portal to publishing iOS and Android apps and tracking downloads.
slug: /enterprise-app-store/enterprise-app-store-walkthrough
tags: [enterprise app store, enterprise portal, in-house distribution, beta channel, live channel, walkthrough]
---

import Screenshot from '@site/src/components/Screenshot';
import ContentRef from '@site/src/components/ContentRef';
import NeedHelp from '@site/docs/\_need-help.mdx';

The Enterprise App Store gives you a private, branded app store for in-house iOS and Android apps that are not meant for the public stores. Your users sign in with your own authentication and install the apps they are allowed to see, while you decide which version is live and who can try beta versions. Versions validated in Testing Distribution can be sent here with a single action.

https://appcircle.io/enterprise-app-store

## Before You Start

- **iOS**: Sign your `.ipa` with an **Enterprise (In-House)** or **Ad Hoc** provisioning profile. App Store-signed binaries cannot be installed from the portal.
- **Android**: Any keystore works. Users must allow their browser to install unknown apps. `.aab` files must be converted to `.apk` with [Re-sign Binary](/enterprise-app-store/resign-binary).

:::danger

Apple does not allow enterprise-signed apps to be distributed publicly. If you distribute them, set an authentication method for your portal.

:::

## 1. Set Up the Enterprise Portal

The portal is configured once in the root organization and is shared by all your apps.

- **Settings**: Choose how users sign in (None, Static, SSO, or LDAP), set your store URL or custom domain, and enable captcha or single-session rules. See [Portal Settings](/enterprise-app-store/portal-settings).
- **Customize**: Apply your logo, colors, and store title. See [Portal Customization](/enterprise-app-store/portal-customization).

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5909-eas1_v2.png' />

## 2. Add Your Apps

Upload an `.ipa` or `.apk` and a profile is created automatically, named after the app. New versions of the same app are added to that profile. You can upload:

- Manually, with **Add a new app**
- Automatically after each build, from the [Build module](/build/build-process-management/configurations#distribution-configuration)
- From [Testing Distribution](/testing-distribution/create-or-select-a-distribution-profile#send-your-application-to-enterprise-app-store) after testers approve a version
- From a [Publish flow](/publish-integrations/common-publish-integrations/send-to-enterprise-app-store)
- From your own CI with the [Appcircle CLI](/appcircle-api-and-cli/cli-authentication) or [API](/appcircle-api-and-cli/api-authentication)

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE-4225-profile2_v2.png' />

## 3. Configure the App Profile

Open **Settings** from the profile's **...** menu to:

- Re-sign new uploads automatically with your enterprise certificate or keystore ([Re-sign Binary](/enterprise-app-store/resign-binary))
- Control how the app appears on the portal
- Choose which users or groups can see the **Beta** and **Live** channels (requires SSO or LDAP)
- Get direct links and QR codes to share the app
- Enable [In-App Updates](/enterprise-app-store/in-app-updates) so your app can update itself

See [Enterprise App Store Profile](/enterprise-app-store/enterprise-app-store-profile) for all options.

## 4. Publish a Version

Each app has two channels, each holding one version at a time:

- **Beta**: For trying a new version with a limited audience.
- **Live**: The version all permitted users see.

Select **Publish** from a version's **...** menu, choose a channel, and add release notes. When a beta version is ready, promote it with **Go Live**. You can also publish a version as **Unlisted** so it is reachable only through its link.

## 5. Your Users Install the App

Users open the portal, sign in, and install the app directly on their device. For enterprise-signed iOS apps, they trust the developer certificate in device settings once. See [Enterprise Portal](/enterprise-app-store/enterprise-portal).

<Screenshot url="https://cdn.appcircle.io/docs/assets/BE-4225-store3.png" />

## 6. Track Downloads and Activity

- [Download Report](/enterprise-app-store/enterprise-reports): See who downloaded which version, on which device, and export it as CSV.
- [Activity Log](/enterprise-app-store/enterprise-app-store-activity-log): Audit profile, version, and portal setting changes.

## Further Support and Resources

<ContentRef url="/enterprise-app-store">Enterprise App Store</ContentRef>
<ContentRef url="/enterprise-app-store/enterprise-app-store-profile">Enterprise App Store Profile</ContentRef>
<ContentRef url="/enterprise-app-store/portal-settings">Portal Settings</ContentRef>
<ContentRef url="/enterprise-app-store/enterprise-portal">Enterprise Portal</ContentRef>

<NeedHelp />
