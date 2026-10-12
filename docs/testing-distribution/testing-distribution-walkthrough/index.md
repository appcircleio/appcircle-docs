---
title: Testing Distribution Walkthrough
description: Learn how to set up a Testing Distribution profile, share iOS and Android builds with testers, and track their downloads in Appcircle, step by step.
slug: /testing-distribution/testing-distribution-walkthrough
tags: [testing distribution, distribution profile, testing groups, testing portal, testers, walkthrough]
---

import Screenshot from '@site/src/components/Screenshot';
import ContentRef from '@site/src/components/ContentRef';
import NeedHelp from '@site/docs/\_need-help.mdx';

## Why Use the Testing Distribution Module

The Testing Distribution module lets you share iOS and Android builds with testers before release, from a single profile per application. You decide who receives which version, deliver new builds automatically as soon as they are produced, control how testers sign in to download them, and see who installed what and when.

Teams coming from Expo Application Services (EAS) usually know internal distribution as a shareable install link generated for an EAS build. Appcircle's Testing Distribution covers the same need and adds a managed layer around it: reusable testing groups, a branded Testing Portal with SSO, LDAP or static authentication, automatic re-signing (including AAB to APK conversion) before delivery, and download reports and activity logs for auditing. It accepts binaries from any source (the Appcircle Build module, manual uploads, or your existing CI through the Appcircle CLI and API), and it is available on both Appcircle Cloud and self-hosted installations.

https://appcircle.io/testing-distribution

## Getting Started

This walkthrough follows the order in which a Testing Distribution setup is usually done: create a profile, configure its settings, create testing groups, add app versions, share them with testers, and track the results. The following sections describe each step.

<!-- SS: Testing Distribution module landing page / profile list -->

## Prerequisites for Using the Testing Distribution Module

### iOS: Signing for Device Installation

Testers can only install an iOS binary that is signed for distribution outside the App Store. Make sure your `.ipa` is signed with one of the following:

- **Ad Hoc** provisioning profile: The UDID of every tester device must be registered in your Apple Developer account and included in the provisioning profile. A device that is not in the profile cannot install the app.
- **Enterprise (In-House)** provisioning profile: Available to Apple Developer Enterprise Program members. Device UDIDs are not required, but testers must trust the enterprise developer certificate on the device after installation.

:::caution UDID Registration

When a new tester joins an Ad Hoc distribution, register the tester's device UDID in your Apple Developer account, regenerate the provisioning profile, and re-sign or rebuild the binary. Sharing the existing binary with a new device will not make it installable on that device.

:::

### Android: Installing from Unknown Sources

Android binaries downloaded from the Testing Portal are installed outside Google Play. Testers must allow their browser (or file manager) to **install unknown apps** on their device. Android prompts for this permission the first time a tester opens a downloaded `.apk`.

:::tip AAB Binaries

`.aab` is a store-only format and cannot be installed directly on a device. If your build produces an `.aab`, enable **Auto re-sign for Android** with the **Convert AAB to APK** option so testers receive an installable `.apk`. See [Auto Re-sign](#auto-re-sign) below.

:::

## Testing Distribution Setup Process

### Creating a Distribution Profile

Select **Testing Distribution** > **Profiles** from the left menu and click **New profile**. Give your profile a name, usually the name of your application.

<!-- SS: New profile dialog -->

:::info One Profile per Application

A distribution profile holds the versions of the same application for both iOS and Android. As a best practice, use a single profile for both platforms instead of creating separate profiles. An empty profile named **Send to Myself** is created automatically for every account.

:::

For details on listing, searching, renaming, pinning, and deleting profiles, see the [Distribution Profile](/testing-distribution/create-or-select-a-distribution-profile) documentation.

### Configuring the Profile Settings

To open the profile settings, select **Settings** from the **...** menu next to the profile name. The settings are grouped into the tabs described below, in the order they appear on the screen.

<!-- SS: Settings menu (... next to the profile name) -->

#### Config

The **Config** tab holds binary-related settings for the profile.

<!-- SS: Config tab -->

**Bundle/Package Identifier Validation**

- **Bundle Validation for iOS** and **Package Validation for Android** restrict uploads to binaries whose identifier exactly matches the one defined in the profile.
- When validation is enabled, the profile header shows a **Locked** tag next to the identifier, and binaries with a different identifier are rejected during upload, including those sent from the Build module.
- Validation is not retroactive. Versions uploaded before it was enabled remain available.

<a id="auto-re-sign"></a>

**Auto Re-sign**

The **Auto re-sign for iOS** and **Auto re-sign for Android** toggles re-sign every new binary uploaded to the profile, before it reaches testers. This is useful when builds are signed with a development identity, or when a single binary must be distributed under a different certificate, provisioning profile, or keystore.

After enabling a toggle, configure it from the **...** menu next to the profile name (**Auto re-sign for iOS** / **Auto re-sign for Android**).

:::caution Auto Re-sign Depends on Signing Identities

Auto re-sign uses the signing assets stored in your organization, so they must be in place before you save the configuration:

- **iOS**: The certificate must be uploaded under **Signing Identities** > **Apple Certificates**, and an [App Store Connect API key](/account/my-organization/security/credentials/adding-an-app-store-connect-api-key) must be selected.
- **Android**: The keystore must be uploaded under **Signing Identities** > **Android Keystores**.

:::

:::tip Convert AAB to APK

Testing Distribution profiles do not allow `.aab` binaries to be shared with testers. Keep the **Convert AAB to APK** option of **Auto re-sign for Android** enabled so that every `.aab` sent to the profile is converted and signed as an installable `.apk`.

:::

For all configuration options, including versioning and display name updates, see [Re-sign Binaries](/testing-distribution/resigning-binaries#auto-re-sign).

#### Auto Send

The **Auto Send** tab lists your testing groups. Enable the groups that should receive every new version automatically, whether the version comes from a build, a manual upload, or the CLI.

<!-- SS: Auto Send tab -->

- **Show Only the Shared Version to Tester**: When enabled together with auto send, testers only see the most recently shared version on the Testing Portal.

:::info

Testing groups must exist before they can be selected here. See [Creating Testing Groups and Adding Testers](#creating-testing-groups-and-adding-testers). Expired binaries are never sent automatically.

:::

#### Testing Portal

The **Testing Portal** tab controls what testers see on the portal for this profile.

<!-- SS: Testing Portal tab -->

- **Publisher information**: **Publisher Name**, **Contact Email**, **Privacy Policy URL**, and **Terms of Service URL**. Testers see this information when they select the user icon on the portal.
- **Exclude from Shared Application List**: Hides this profile from the shared application list of other profiles. Testers who received a direct email invitation can still access it.
- **Hide Shared Application List**: Testers of this profile see only this profile's application and cannot browse applications shared from other profiles.
- **Single Active Session**: Each tester can have only one active session across browsers and devices. Signing in elsewhere ends the previous session. Not applicable when authentication is set to **None**.
- **Binary Tags**: Shows build metadata (commit message, branch, Git tag, workflow name, and more) next to each version on the portal. Tags are only available for binaries sent from the Build module.

#### Authentication

The **Authentication** tab sets how testers sign in to the Testing Portal for this profile.

<!-- SS: Authentication tab -->

- **None**: Anyone with the link can download the binaries.
- **Static Username and Password**: A single username and password shared by all testers.
- **SSO Login**: Testers sign in with your identity provider (Enterprise plans).
- **LDAP Login**: Testers sign in with their LDAP credentials (Enterprise plans).

SSO and LDAP appear as options only after they are configured under **Organization** > **Security** > **Authentication**. See [Testing Portal SSO Login](/account/my-organization/security/authentications/distribution-sso-authentication) and [Testing Portal LDAP Login](/account/my-organization/security/authentications/distribution-ldap-authentication).

#### Distribution Link

The **Distribution Link** tab enables a public link (and a QR code) that gives access to all versions of the profile. It is the quickest way to share a profile with people who are not in a testing group, for example during a demo.

<!-- SS: Distribution Link tab with QR code -->

:::caution

Anyone who has the link can reach every version in the profile. The link uses the authentication method selected in the **Authentication** tab, so set an authentication method before sharing it outside your team. Downloads made through the public link are listed as `N/A` in the download report because the downloader cannot be identified.

:::

### Creating Testing Groups and Adding Testers

Testing groups let you share versions with a predefined audience (for example "QA", "Beta", or a customer team) instead of typing email addresses each time.

1. Go to **Testing Distribution** > **Testing Groups**.
2. Click the **+** button, type a group name, and press Enter.
3. Type a tester's email address in the input at the top of the page and press Enter. Repeat for each tester.

<!-- SS: Testing Groups page with testers -->

:::tip Bulk Import

Testers can also be imported from a CSV file or synced from LDAP groups. See [Testing Groups](/testing-distribution/testing-groups).

:::

## Managing App Versions

### Adding an App Version to the Profile

#### Upload via Build Module

Every successful build can be sent to a distribution profile automatically. Go to **Build** > select the build profile > **Configurations** > select a configuration > **Distribution** tab, then select the distribution profile.
<!-- SS: Build configuration > Distribution tab -->

For details, see [Distribution Configuration](/build/build-process-management/configurations#distribution-configuration).

:::caution

Only signed builds are distributed. If **Bundle/Package Identifier Validation** is enabled on the profile, a build whose identifier does not match the profile is rejected.

:::

#### Manual Binary Upload

Click **Upload Binary** at the top right of the profile and select an `.ipa`, `.apk`, or `.aab` file. The file is validated and its metadata is parsed; any errors are shown in the upload area.

<!-- SS: Upload Binary -->

#### Version List and Version Details

New versions appear at the top of the profile's version list. iOS and Android versions are listed separately; use the iOS/Android toggle above the list to switch between them. Each row shows the version, build number, signing status (a **signed** badge after re-signing), and expiration status (**Expire Soon** / **Expired**) of the signing certificate.

<!-- SS: Version list with iOS/Android toggle -->

Select a version to open its details: provisioning profile type, certificate, build metadata (branch, commit, build logs), and the option to compare it with another version. See [Binary Information](/testing-distribution/binary-information).

<!-- SS: Version details -->

### Sharing with Testers

#### Share with Testers

Select a version and click **Share with Testers**. Choose one or more testing groups, or type individual email addresses to send the version directly without a group.

<!-- SS: Share with Testers dialog -->

#### Message to Testers

Use the **Message to testers** field to add release notes or testing instructions. The message is included in the email testers receive. For builds coming from the Build module, the Git commit message is added automatically, and the message can be automated with the [Release Notes component](https://github.com/appcircleio/appcircle-release-notes-component/).

:::caution Expired Binaries

A version whose signing certificate has expired cannot be shared, and its download button is disabled on the Testing Portal.

:::

#### Notifications

- **Tester emails**: Each tester receives an email with the version, release notes, and a link to the Testing Portal. The profile name is used as the sender name. On self-hosted installations, emails can be sent from your own domain through [SMTP settings](https://docs.appcircle.io/self-hosted-appcircle/configure-server/integrations-and-access/integration#email).
- **Team notifications**: Notify your team on Slack, Microsoft Teams, or email when a new version is added or shared. See [Notifications](/account/my-organization/notifications).

<!-- SS: Tester email -->

## Tester Experience: Testing Portal

### Login

Testers open the link in the email (or the distribution link) and land on the Testing Portal. The login screen depends on the profile's authentication method: no login for **None**, a username and password for **Static**, the identity provider's page for **SSO**, and LDAP credentials for **LDAP**.

<!-- SS: Testing Portal login -->

:::info

Testing Portal accounts are independent of Appcircle accounts and are used only to download shared apps. Cookies must be enabled in the browser to sign in.

:::

### Shared Application List and App Details

After signing in, testers see the versions shared with them, grouped by profile, with each version's size, certificate type, release notes, and binary tags. They can search by app name, version, release notes, or build number, filter by OS, and sort by version or date. Unless **Hide Shared Application List** is enabled, they can also switch to other applications shared with them.

<!-- SS: Testing Portal app list -->
<!-- SS: Testing Portal app details -->

### Installing on iOS and Android

- **iOS**: Open the portal in Safari on the device and tap **Install**. For enterprise-signed apps, go to **Settings** > **General** > **VPN & Device Management** and trust the developer certificate before opening the app. The portal shows this guidance for enterprise builds.
- **Android**: Tap **Download**, open the `.apk`, and allow installing unknown apps for the browser when prompted.

<!-- SS: iOS install flow -->
<!-- SS: Android install flow -->

For more information, see [Testing Portal](/testing-distribution/testing-portal).

## Tracking and Reporting

### Tester Status

After a version is shared, the profile shows each tester's status for that version:

- **Pending**: The tester has not opened the link yet.
- **Clicked**: The tester opened the link but has not signed in (authenticated profiles only).
- **Login, No Download**: The tester signed in but has not downloaded the binary.
- **Downloaded**: The tester downloaded the binary.

<!-- SS: Tester status list -->

### Download Report

Go to **Testing Distribution** > **Download report** to see every download with the user, app, profile, version, device platform, OS version, and date. Filter by date range and export the list as CSV. See [Reporting](/testing-distribution/reports).

<!-- SS: Download report -->

### Activity Log

The [Activity Log](/testing-distribution/testing-distribution-activity-log) records profile, app version, and testing group operations, as well as SSO and LDAP settings changes. It is available to organization owners and users with the Organization Management role.

<!-- SS: Activity log -->

## Automating Testing Distribution with Appcircle CLI & API

If you build outside Appcircle, upload binaries from your existing CI with the [Appcircle CLI](/appcircle-api-and-cli/cli-authentication). Combined with auto send, every upload is shared with the selected testing groups automatically.

```bash
npm install -g @appcircle/cli
appcircle login personal-access-key --secret "$AC_PERSONAL_ACCESS_KEY"

# One-time setup: select the testing groups that receive every new upload
appcircle testing-distribution profile settings auto-send \
  --distProfile "My App" \
  --testingGroups "QA Team,Beta Testers"

# On every CI run: upload the binary with release notes
appcircle testing-distribution upload \
  --distProfile "My App" \
  --message "Release notes" \
  --app ./build/app-release.apk
```

Profiles, testing groups, and testers can also be managed from the CLI (`appcircle testing-distribution profile`, `appcircle testing-distribution testing-group`). For direct REST access, see the [Appcircle API](/appcircle-api-and-cli/api-authentication).

## FAQ

### Why is my binary rejected as invalid during upload?

The file is validated and parsed before it is added to the profile. Make sure it is a valid, signed `.ipa`, `.apk`, or `.aab`, and that it is not corrupted. If **Bundle/Package Identifier Validation** is enabled, the binary's identifier must exactly match the identifier locked on the profile.

### Why does the Testing Portal say no compatible package was found?

The tester's device platform does not match the versions shared with them, for example an Android tester opening a profile with only iOS versions shared. Share a version for the tester's platform. An `.aab` that was not converted to `.apk` cannot be installed either; enable **Convert AAB to APK** in [Auto Re-sign](#auto-re-sign).

### Why can't a tester install the iOS app?

With an Ad Hoc provisioning profile, the tester's device UDID must be registered in your Apple Developer account and included in the provisioning profile used to sign the binary. Register the device, regenerate the provisioning profile, and rebuild or re-sign the binary. Then share the new version.

### Why are two Android packages distributed for one build?

Your project signs the APK with Gradle and the Appcircle **Android Sign** step is also enabled, so two signed APKs are produced. Use only one signing path. See the [Distribution Profile FAQ](/testing-distribution/create-or-select-a-distribution-profile#faq).

### Why didn't a tester receive the email?

Ask the tester to check the spam folder. If the tester previously unsubscribed, add their email address directly in **Share with Testers** to re-subscribe them. See [Testing Groups](/testing-distribution/testing-groups#managing-unsubscribed-users).

## Further Support and Resources

<ContentRef url="/testing-distribution">Testing Distribution</ContentRef>
<ContentRef url="/testing-distribution/create-or-select-a-distribution-profile">Distribution Profile</ContentRef>
<ContentRef url="/testing-distribution/resigning-binaries">Re-sign Binaries</ContentRef>
<ContentRef url="/testing-distribution/testing-portal">Testing Portal</ContentRef>

<NeedHelp />
