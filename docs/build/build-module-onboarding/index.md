---
title: Build Module Onboarding
description: A step-by-step onboarding path for new Appcircle users, from preparing your project to running and automating your first iOS or Android build.
slug: /build/build-module-onboarding
tags: [build module, onboarding, getting started, build profile, walkthrough, ci/cd]
---

import ContentRef from '@site/src/components/ContentRef';
import NeedHelp from '@site/docs/\_need-help.mdx';

This onboarding guide takes you from an empty Appcircle organization to your first successful, automated build. It is written for readers who are new to Appcircle or to mobile CI/CD (Continuous Integration and Continuous Delivery), where every code change is built and checked automatically instead of on a developer's computer.

Follow the steps in order. Each step explains what to do, why it matters, and how to confirm that the step is complete before you move on. Each step also links to the page that covers the topic in full detail.

:::tip Onboarding or Walkthrough?

This page is an ordered path for your first setup. When you need the complete reference for a feature, such as every trigger option or every configuration field, see the [Build Walkthrough](/build/build-walkthrough).

:::

## Before You Begin

### Account and Roles

You need an Appcircle account and an organization. If you do not have one yet, sign up at [my.appcircle.io](https://my.appcircle.io). See [Sign Up / Login](/account/my-account/sign-up-login).

Appcircle controls access to the Build module with roles. Check your role before you start, because most setup steps change settings that only some roles can change:

- **Owner** and **Manager**: Create and change build profiles, repository connections, configurations, workflows, and triggers.
- **Operator**: Start builds, distribute binaries, and download artifacts, but cannot change the setup.
- **Viewer**: View build profiles, builds, and reports, and download artifacts.

If you cannot see a button described in this guide, ask your organization Owner to update your role. See [Role Management](/account/my-organization/profile-and-team/role-management#build-permissions).

### Project Requirements

Appcircle builds your project from your repository, not from your computer. Make sure that everything the build needs is committed:

- **iOS (Swift / Objective-C)**: An Xcode project or workspace and a **shared** scheme. Appcircle can only build schemes that are marked as shared in Xcode, and the scheme files must be committed to your repository. See [iOS Applications](/build/platform-build-guides/building-ios-applications).
- **Android (Java / Kotlin)**: The Gradle wrapper (`gradlew` and the `gradle/wrapper` folder) committed to your repository. See [Building Android Applications](/build/platform-build-guides/building-android-applications).
- **React Native, Flutter, and other frameworks**: See the requirements in [Platform Build Guides](/build/platform-build-guides).

To confirm that nothing is missing, clone your repository into a new folder, install the dependencies (for example, run `pod install` for an iOS project that uses CocoaPods), and build the project locally. Files that exist only on your computer, or that are excluded by `.gitignore`, are not available to Appcircle.

If your project uses libraries from other private repositories, the build must be able to access them too. Use a repository connection that can read those repositories, an SSH key, or a `.netrc` file. See [Appcircle Onboarding Best Practices](/best-practices/onboarding#dependencies).

A build profile targets one operating system. For a cross-platform app, such as a React Native or Flutter app, plan one build profile for iOS and one for Android. Both profiles can use the same repository.

### Repository Access

Decide how Appcircle will access your source code. The choice affects how webhooks are created later in [Step 9](#step-9-automate-builds-with-triggers).

| Option | Use It When | Webhook Setup |
| --- | --- | --- |
| GitHub App or OAuth | Your code is on GitHub, GitLab, Bitbucket, or Azure DevOps in the cloud. | Automatic, if the connected user has webhook permissions |
| Personal Access Token (PAT) | You use a self-hosted Git server, or your company does not allow OAuth apps. | Automatic, if the token has webhook permissions |
| SSH | Your Git provider is not listed, or your company requires SSH keys. | Manual |
| Public URL | The repository is public. | Manual |

If your repository is in an internal network or behind a firewall, Appcircle must be able to reach it. See [Accessing Internal Networks](/build/manage-the-connections/accessing-repositories-in-internal-networks-firewalls).

:::tip Try It Without Your Own Code

You can complete this onboarding with a sample project. Select **Start with a sample repository** in [Step 3](#step-3-connect-your-repository), or use one of the [Appcircle sample apps on GitHub](https://github.com/appcircleio?q=sample).

:::

### Signing Assets

A binary must be signed before it can be installed on a device or sent to a store. The signature proves who built the app.

- **iOS**: A certificate (`.p12`) and a provisioning profile (`.mobileprovision`) for each bundle identifier, such as `com.example.spacetech`. Alternatively, use automatic signing with a development certificate, a distribution certificate, and an App Store Connect API key. See [Automatic Signing](/signing-identities/apple-profiles#automatic-signing).
- **Android**: A keystore (`.keystore`) with its passwords and alias.

Add these to the Signing Identities module before you create the configuration in [Step 5](#step-5-create-a-configuration). You can run your first build without signing to check that the project compiles, but an unsigned iOS build produces an `.xcarchive` file instead of an installable `.ipa` file.

<ContentRef url="/signing-identities/signing-identities-walkthrough">Signing Identities Walkthrough</ContentRef>

**Checkpoint**: You know your role, your project builds from a clean clone of the repository, you have chosen a repository access option, and your signing assets are in the Signing Identities module.

## Step 1: Choose Your Build Infrastructure

Before you configure your build, decide where the build runs and which tool versions it uses. On Appcircle cloud runners, every build runs on a brand new virtual machine, so each build starts from the same clean state.

- **Appcircle cloud runners**: Ready to use, with no setup. The machine plan of your organization defines the hardware. You can see your current plan in **Organization** > **Billing**. See [Machine Plans](/infrastructure/machine-plans).
- **Self-hosted runners**: Run builds on your own machines, for example to reach internal resources or to use custom hardware. Only the Owner of the root organization can add runners. See [Self-hosted Runners](/self-hosted-appcircle/self-hosted-runner).

Check that the tool versions your project needs are available:

- **iOS**: Select the Xcode version in the build configuration. The latest stable Xcode version is selected by default. See [iOS Build Stacks](/infrastructure/ios-build-infrastructure) and [Selecting the Xcode Version](/build/platform-build-guides/building-ios-applications#selecting-the-xcode-version-and-switching-to-the-xcode-beta).
- **Android**: OpenJDK 17 is the default Java version. If your project needs another version, add the **Select Java Version** step to your workflow in [Step 6](#step-6-review-the-workflow). See [Android Build Stacks](/infrastructure/android-build-infrastructure).

**Checkpoint**: You know whether you build on cloud or self-hosted runners, and the Xcode or Java version your project needs is available.

## Step 2: Create a Build Profile

A build profile holds everything Appcircle needs to build one app for one platform: the repository connection, configurations, workflows, and triggers.

1. In the Appcircle dashboard, go to **Build**.
2. Click **New profile** at the top right. If you have no build profiles yet, click the link in the middle of the page.
3. Enter a unique, descriptive name, for example `spacetech-ios`.
4. Select the target OS: **iOS** or **Android**.
5. Select the target platform, for example **Objective-C / Swift**, **Java / Kotlin**, **React Native**, or **Flutter**. Appcircle uses this choice to prepare a matching build environment and default workflows.
6. Click **Save**.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-build1_v2.png' alt="New profile button on the Build profiles page" />

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-build2_v2.png' alt="Build profile name, target OS, and target platform fields" />

<ContentRef url="/build/build-process-management/profile-creation">Profile Creation</ContentRef>

**Checkpoint**: The new build profile opens and asks you to connect a repository.

## Step 3: Connect Your Repository

1. Select the repository access option you chose in [Repository Access](#repository-access).
2. Follow the connection guide for your provider:
   - [Connecting to GitHub](/build/manage-the-connections/connection-guides/connecting-to-github)
   - [Connecting to GitLab](/build/manage-the-connections/connection-guides/connecting-to-gitlab)
   - [Connecting to Bitbucket](/build/manage-the-connections/connection-guides/connecting-to-bitbucket)
   - [Connecting to Azure DevOps](/build/manage-the-connections/connection-guides/connecting-to-azure)
   - [Connecting to Private Repository via SSH](/build/manage-the-connections/connection-guides/connecting-to-private-repository-via-ssh)
   - [Connecting to Public Repository](/build/manage-the-connections/connection-guides/connecting-to-public-repository)
   - [Connecting to Multiple Instances](/build/manage-the-connections/connection-guides/connecting-multiple-instance)
3. Select the repository.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-build3_v2.png' alt="Repository connection options for a new build profile" />

After the connection is established, Appcircle fetches your branches and the last 100 commits of each branch. Pin the branches you build most often, such as `develop` and `main`, so they stay at the top of the list. See [Branch Operations](/build/build-process-management/build-profile-branch-operations).

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-build4_v2.png' alt="Build profile with the branch list of the connected repository" />

All OAuth and PAT connections of your organization are listed in **Build** > **Connections**. See [Connections](/build/manage-the-connections).

**Checkpoint**: Your branches and commits are listed in the build profile.

## Step 4: Prepare Environment Variables

Environment variables keep values such as API keys, passwords, and configuration files out of your repository. This protects your secrets and lets you use different values for different environments, such as development and production.

Variable groups are shared by all build profiles in your organization, so create them before you configure the build.

1. Go to **Build** > **Environment Variables** and click **Add variable group**.
2. Enter a group name, for example `spacetech-dev`, and press Enter.
3. Add your variables as **Text**, **Secret**, or **File**. Use **Secret** for passwords and tokens, because secret values are not shown in build logs.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE8488-5_v2.png' alt="Adding a variable to an environment variable group" />

Appcircle also provides read-only variables that start with `AC_` to every build, such as `AC_REPOSITORY_DIR`. You do not need to create these.

<ContentRef url="/build/build-environment-variables">Environment Variables</ContentRef>

**Checkpoint**: Your variable group exists and contains every value your build needs that is not committed to the repository. If your project needs no extra values, you can skip this step.

## Step 5: Create a Configuration

A configuration defines how a build runs. A build profile can have several configurations, for example one for development builds and one for release builds.

Click **Configurations** at the top right of the build profile, then click **New**. Complete the tabs in order:

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-config1_v2.png' alt="Configurations button at the top right of the build profile" />

1. **Config**: Click **Autofill** to let Appcircle read the project details, such as the project path, scheme, or module, from your repository. For iOS, select the Xcode version. If you use self-hosted runners, select your pool in **Organization pool**.
2. **Signing**: Select the signing identities you added in [Signing Assets](#signing-assets). For iOS, select a provisioning profile for each bundle identifier, including extensions such as widgets. For Android, select the keystore.
3. **Distribution**: Leave this tab empty for now. After your first successful build, you can send every new build to testers or stores automatically. See [Next Steps](#next-steps).
4. **Versioning**: Optionally, let Appcircle increase the build number for every build, so each binary has a unique version. See [Versioning](/versioning).
5. **Environment**: Select the variable groups you created in [Step 4](#step-4-prepare-environment-variables).

<Screenshot url='https://cdn.appcircle.io/docs/assets/7131-2_v2.png' alt="Config tab with Autofill, organization pool, Xcode version, and project details" />

<Screenshot url='https://cdn.appcircle.io/docs/assets/build-profile-ios-signing-configuration_v2.png' alt="Signing tab of an iOS build configuration" />

<Screenshot url='https://cdn.appcircle.io/docs/assets/build-configuration-env-variables_v2.png' alt="Environment tab with selected variable groups" />

Click **Save**.

<ContentRef url="/build/build-process-management/configurations">Configurations</ContentRef>

**Checkpoint**: The configuration is saved, and the **Config** tab shows your project details without errors.

## Step 6: Review the Workflow

A workflow is the ordered list of steps that run during a build, such as cloning the repository, installing dependencies, building, and signing. Each new build profile has default workflows for its platform, so you do not need to create one from scratch.

1. Click **Workflows** at the top right of the build profile.
2. Open the default workflow and review its steps. Steps run from top to bottom.
3. Click **Manage Workflow** to add steps from the Workflow Marketplace, reorder them, or disable the ones you do not need. For example, add the **Select Java Version** step for Android projects that need a Java version other than the default.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-workflow1_v2.png' alt="Workflows list of a build profile" />

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-workflow6_v2.png' alt="Workflow steps with the Workflow Marketplace" />

Start your first build with the default workflow, and make changes only if the build needs them. This makes it easier to find the cause of a failure.

<ContentRef url="/build/build-process-management/build-workflows">Workflows</ContentRef>

<ContentRef url="/workflows">Workflow Steps</ContentRef>

**Checkpoint**: You know which workflow you will use, and it contains the steps your project needs.

## Step 7: Run Your First Build

1. In the build profile, select the branch you want to build.
2. Click **Start build** at the top right.
3. Keep the latest commit, or enter the hash of a previous commit to build that specific commit.
4. Select the configuration from [Step 5](#step-5-create-a-configuration) and the workflow from [Step 6](#step-6-review-the-workflow).
5. Click **Start build**.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-start2_v2.png' alt="Start build dialog with commit, configuration, and workflow selection" />

Follow the progress and the log of each step in real time. If a build waits before it starts, all build slots of your plan may be in use. The build starts when a slot is free.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-start4_v2.png' alt="Build progress with real-time step logs" />

<ContentRef url="/build/build-process-management/manual-builds">Manual Builds</ContentRef>

**Checkpoint**: The build has started and the step logs are visible.

## Step 8: Check the Build Result

When the build ends, it shows one of the following statuses:

- **Success**: All workflow steps finished successfully.
- **Warning**: A step that is allowed to fail failed, and all other steps succeeded.
- **Failed**: One or more workflow steps failed.
- **Timeout**: The build exceeded the timeout limit.
- **Canceled**: The build was canceled by a user or automatically.

If the build failed:

1. Open the build logs and find the first step that failed. Later failures are often caused by the first one.
2. Click **Troubleshoot with AI** in the **Build Logs** window to get the likely root cause and a suggested fix. See [Build Failure Analysis](/appcircle-ai/ai-features-on-appcircle/build-failure-analysis).
3. Check the FAQ of your [platform build guide](/build/platform-build-guides) and the [FAQ](#faq) on this page for common first-build errors.
4. Fix the cause and start the build again.

<Screenshot url='https://cdn.appcircle.io/docs/assets/AI-152-troubleshoot-with-ai.png' alt="Troubleshoot with AI button in the Build Logs window" />

If the build succeeded, open the **...** menu of the build to download artifacts, such as the `.ipa`, `.apk`, or `.aab` file, and the logs.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-action_v2.png' alt="Binary actions menu of a completed build" />

<ContentRef url="/build/build-process-management/binary-actions">Binary Actions</ContentRef>

**Checkpoint**: Your build ends with the **Success** status, and you can download a signed binary.

## Step 9: Automate Builds with Triggers

Triggers start builds automatically, so every change is checked without anyone starting a build by hand.

1. Click **Triggers** at the top right of the build profile.
2. Select the tab for the event you want to build on:
   - **On Every Push**: Build every push to the selected branches, for example `develop`.
   - **On Merge/Pull Request**: Build a pull or merge request before it is merged, to catch errors early.
   - **On Tag Push**: Build only pushes with matching tags, for example `release*`.
   - **Scheduled**: Build at fixed times, for example every night.
3. Select the branch or tag pattern, the configuration, and the workflow, and save the trigger.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-trigger_v2.png' alt="Triggers panel of a build profile" />

Event-based triggers need a webhook in your Git provider. For GitHub App, OAuth, and PAT connections, Appcircle tries to create it automatically. For SSH and public URL connections, or when the connected user or token has no webhook permissions, select **Webhooks** from the **...** menu next to the profile name and add the webhook URL to your repository settings.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE6019-ssh1_v2.png' alt="Webhooks option in the build profile menu" />

<ContentRef url="/build/build-process-management/build-manually-or-with-triggers">Triggers</ContentRef>

**Checkpoint**: Push a small commit to a branch that has a trigger. A new build starts automatically.

## Step 10: Keep Your Team Informed

Notify your team on Slack, Microsoft Teams, or email when a build succeeds or fails, so failures are fixed quickly.

<ContentRef url="/account/my-organization/notifications">Notifications</ContentRef>

Use the following reports to follow your builds over time and to audit changes:

- [Build History](/build/build-history): All builds started in a selected time period, with their status and duration.
- [Build Activity Log](/build/build-activity-log): Who changed build profiles, configurations, workflows, triggers, connections, and environment variables, and when.

<Screenshot url='https://cdn.appcircle.io/docs/assets/7112-4_v2.png' alt="Build History report with build status and duration" />

**Checkpoint**: Your team receives a notification when a build ends.

## Onboarding Checklist

Use this checklist to confirm that your Build module setup is complete:

- [ ] Your role allows you to create build profiles and configurations.
- [ ] Your project builds from a clean clone, with shared schemes (iOS) or the Gradle wrapper (Android) committed.
- [ ] Your signing identities are in the Signing Identities module.
- [ ] A build profile exists for each platform of your app.
- [ ] Each build profile is connected to your repository and lists your branches.
- [ ] Your environment variable groups contain all required values.
- [ ] A configuration with project details and signing is saved.
- [ ] Your first build ended with the **Success** status.
- [ ] At least one trigger starts builds automatically.
- [ ] Your team receives build notifications.

## Next Steps

After your builds run automatically, connect the Build module to the rest of your release process:

- **Share builds with testers**: Create a Testing Distribution profile, then select it in the configuration's **Distribution** tab. See the [Testing Distribution Walkthrough](/testing-distribution/testing-distribution-walkthrough).
- **Publish to app stores**: Create a publish profile and select it in the **Distribution** tab. See [Publish to Stores](/publish-to-stores-module).
- **Distribute internal apps**: Send builds to your own enterprise app store. See the [Enterprise App Store Walkthrough](/enterprise-app-store/enterprise-app-store-walkthrough).
- **Run tests during builds**: Add unit and UI test steps to your workflow. See [Continuous Testing](/continuous-testing).
- **Automate from the command line**: Start builds and download results from scripts or other CI tools. See [Appcircle CLI](/appcircle-api-and-cli/cli-authentication).

## FAQ

### I cannot see the New profile or Configurations buttons. Why?

Your role does not allow you to change the Build module setup. Creating build profiles, configurations, workflows, and triggers requires the Owner or Manager role. Ask your organization Owner to update your role. See [Role Management](/account/my-organization/profile-and-team/role-management#build-permissions).

### Autofill does not find my iOS scheme. What should I check?

Make sure that the scheme is marked as **Shared** in Xcode (**Product** > **Scheme** > **Manage Schemes**), and that the scheme files are committed and pushed to the branch you selected. See [Xcode Scheme Errors](/build/platform-build-guides/building-ios-applications#xcode-scheme-errors).

### My Android build fails because `gradlew` cannot be found. What should I do?

Commit the Gradle wrapper files (`gradlew` and the `gradle/wrapper` folder) to your repository. If `gradlew` is not in the root of your repository, edit the **Android Build** step in your workflow and set the project path to the folder that contains it, for example `./android` for a React Native project. See the [Building Android Applications FAQ](/build/platform-build-guides/building-android-applications#faq).

### Why is my iOS build output an `.xcarchive` instead of an `.ipa`?

The build was not signed. Select a certificate and a provisioning profile in the configuration's **Signing** tab, and make sure the signing step is active in the workflow.

### Why does my push not start a build?

Check that a trigger exists for the branch, that the webhook exists in your Git provider, and that the commit message does not contain `[skip ci]` or `[ci skip]`. See the [Triggers FAQ](/build/build-process-management/build-manually-or-with-triggers#faq).

### Do I need a separate build profile for iOS and Android?

Yes. A build profile targets one operating system. Create one build profile for each platform and connect both to the same repository.

## Further Support and Resources

<ContentRef url="/build/build-walkthrough">Build Walkthrough</ContentRef>

<ContentRef url="/best-practices/onboarding">Appcircle Onboarding Best Practices</ContentRef>

<ContentRef url="/build">Build Module Overview</ContentRef>

<ContentRef url="/build/platform-build-guides">Platform Build Guides</ContentRef>

<NeedHelp />
