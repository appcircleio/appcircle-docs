---
title: Ostorlab Security Scan
description: Upload the built APK, AAB, or IPA to Ostorlab, start a security scan, and break the pipeline on a high risk rating.
tags: [ostorlab, security, scan, binary scan, android, ios]
---

import SensitiveVariablesDanger from '@site/docs/\_sensitive-variables-danger.mdx';

# Ostorlab Security Scan

[Ostorlab](https://www.ostorlab.co) is a mobile application security testing platform. The **Ostorlab Security Scan** step uploads the app your workflow has built, an APK, an AAB, or an IPA, to your Ostorlab organization and starts a security scan on it.

The step can also wait for the scan to finish and break the pipeline when the scan risk rating is too high. A release with a critical finding then stops before it reaches testers or the stores.

The step works on Java / Kotlin, Objective-C / Swift, React Native, and Flutter projects alike, because it scans the built app rather than the source code. It follows the [Run Ostorlab as a Workflow Step](https://docs.ostorlab.co/integrations/appcircle/#run-ostorlab-as-a-workflow-step) guide of Ostorlab: it installs the Ostorlab command line tool in a Python virtual environment and runs `ostorlab ci-scan run`.

:::caution

Ostorlab can also scan your builds through a webhook. Use either the webhook or this step for a build profile, not both. Otherwise every build is scanned twice.

:::

## Prerequisites

### For All Platforms

The step needs the following before it runs:

- **An Ostorlab API key.** In Ostorlab, open **Integrations/API → API Keys**, select **New API Key**, and copy the key. Keep the key in an environment variable group as described in [Storing the API Key](#storing-the-api-key).
- **Python 3.13 or later on the runner.** The Ostorlab command line tool does not install on older Python versions. The macOS Sequoia `15.4.1` and later stacks provide it. The Debian Bullseye and macOS Sonoma stacks have an older Python, so select a newer stack or set the **Python Path** input to a Python 3.13 or later. See the [iOS build infrastructure](/infrastructure/ios-build-infrastructure) and [Android build infrastructure](/infrastructure/android-build-infrastructure) pages for the Python version of each stack.
- **Network access on self-hosted runners.** The runner must reach `api.ostorlab.co` to upload the app and `pypi.org` to install the Ostorlab command line tool.

### For Android (Java / Kotlin and React Native)

| Prerequisite Workflow Step | Description |
| -------------------------- | ----------- |
| [**Android Build**](/workflows/android-specific-workflow-steps/android-build) | Generates the app (APK or AAB) required for the **Ostorlab Security Scan** step. |
| [**Android Sign**](/workflows/android-specific-workflow-steps/android-sign) | Signs the app (APK or AAB). If the app is already signed, this step can be skipped. |

### For Android Flutter

| Prerequisite Workflow Step | Description |
| -------------------------- | ----------- |
| [**Flutter Build for Android**](/workflows/flutter-specific-workflow-steps#flutter-build-for-android) | Generates the app (APK or AAB) required for the **Ostorlab Security Scan** step. |
| [**Android Sign**](/workflows/android-specific-workflow-steps/android-sign) | Signs the app (APK or AAB). If the app is already signed, this step can be skipped. |

### For iOS (Objective-C / Swift and React Native)

| Prerequisite Workflow Step | Description |
| -------------------------- | ----------- |
| [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps#xcodebuild-for-devices-archive--export) | Builds the application in ARM architecture and generates an `IPA` file. |

### For iOS Flutter

| Prerequisite Workflow Step | Description |
| -------------------------- | ----------- |
| [**Flutter Build for iOS**](/workflows/flutter-specific-workflow-steps#flutter-build-for-ios) | Prepares the Flutter project for the iOS environment and builds it using the [Flutter SDK](https://github.com/flutter/flutter). |
| [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps#xcodebuild-for-devices-archive--export) | Builds the application in ARM architecture and generates an `IPA` file. |

### Storing the API Key

The API key gives access to your Ostorlab organization, so keep it out of the step inputs and the build log:

1. In the Appcircle dashboard, open **Build → Environment Variables** and [create an environment variable group](/build/build-environment-variables#creating-environment-variable-groups), for example `OSTORLAB`.
2. Add a variable with the key `OSTORLAB_API_KEY`, paste your Ostorlab API key as its value, and select **Secret**.
3. In the configuration of your build profile, open the **Environment Variables** tab and select the `OSTORLAB` group.

The **Ostorlab API Key** input defaults to `$OSTORLAB_API_KEY`, so the step picks up the key without any other change. The step masks the API key and the test credentials password in the build log.

## Input Variables

This step contains some input variable(s). It needs these variable(s) to work. The table below gives explanation for this variable(s).

<SensitiveVariablesDanger />

| Variable Name | Description | Status |
| ------------- | ----------- | ------ |
| `$AC_OSTORLAB_API_KEY` | The Ostorlab API key. Default: `$OSTORLAB_API_KEY`. See [Storing the API Key](#storing-the-api-key). | Required |
| `$AC_OSTORLAB_SCAN_PROFILE` | The scan profile. `fast_scan` runs static analysis only. `full_scan` runs static, dynamic, and backend analysis, so it takes longer. Options: `fast_scan`, `full_scan`. Default: `fast_scan`. | Required |
| `$AC_OSTORLAB_ARTIFACT_PATH` | Path of the APK, AAB, or IPA to scan, or of the folder holding it. When empty, the step looks at `$AC_SIGNED_APK_PATH`, `$AC_APK_PATH`, `$AC_SIGNED_AAB_PATH`, and `$AC_AAB_PATH`, then for an `.ipa` file under `$AC_EXPORT_DIR` and `$AC_OUTPUT_DIR`. A folder is accepted because iOS builds do not expose the IPA path as a variable. | Optional |
| `$AC_OSTORLAB_SCAN_TITLE` | The scan title shown in Ostorlab. Default: `Appcircle scan`. | Optional |
| `$AC_OSTORLAB_BREAK_ON_RISK_RATING` | Waits for the scan result and breaks the pipeline when the risk rating is higher than the selected value. See [Breaking the Pipeline on the Risk Rating](#breaking-the-pipeline-on-the-risk-rating). Options: `none`, `high`, `medium`, `low`, `potentially`, `hardening`. Default: `none`. | Optional |
| `$AC_OSTORLAB_MAX_WAIT_MINUTES` | How many minutes to wait for the scan result when **Break On Risk Rating** is set. The step fails when the scan does not finish in time. Default: `30`. | Optional |
| `$AC_OSTORLAB_TEST_CREDENTIALS_LOGIN` | The user name the full scan uses to sign in to your app. Set it together with the password. | Optional |
| `$AC_OSTORLAB_TEST_CREDENTIALS_PASSWORD` | The password the full scan uses to sign in to your app. Keep it in a secret environment variable, for example `$OSTORLAB_TEST_PASSWORD`. | Optional |
| `$AC_OSTORLAB_UI_PROMPTS` | Natural language instructions that tell the scanner how to navigate your app, one per line as `name: action`. See [Guiding the Scanner Through Your App](#guiding-the-scanner-through-your-app). | Optional |
| `$AC_OSTORLAB_EXTRA_ARGUMENTS` | Other `ostorlab ci-scan run` options, written as on a command line, for example `--test-credentials-role admin --sbom sbom.json`. | Optional |
| `$AC_OSTORLAB_CLI_VERSION` | The Ostorlab command line tool version to install, for example `2.22.14`. When empty, the latest version is installed. Pin a version to keep builds reproducible. | Optional |
| `$AC_OSTORLAB_PYTHON_PATH` | Full path of a Python 3.13 or later. When empty, the step tries `python3.14`, `python3.13`, and `python3` on the `PATH`. | Optional |

### Breaking the Pipeline on the Risk Rating

Ostorlab grades every scan with a risk rating. From the most to the least severe, the ratings are **Critical**, **High**, **Medium**, **Low**, **Potentially**, and **Hardening**.

When **Break On Risk Rating** is `none`, the step creates the scan and continues without waiting for the result. Follow the result in Ostorlab.

Any other value makes the step wait for the result and fail when the rating is higher than the selected value:

| Break On Risk Rating | The pipeline breaks on |
| -------------------- | ---------------------- |
| `none` | Never. The step does not wait for the result. |
| `high` | Critical |
| `medium` | Critical or High |
| `low` | Critical, High, or Medium |
| `potentially` | Critical, High, Medium, or Low |
| `hardening` | Critical, High, Medium, Low, or Potentially |

:::info

The selected rating itself does not break the pipeline. To stop a release on a **High** rating, select `medium`.

:::

To keep the build running when the rating is too high but still see the result, turn on [Continue with the next step even if this step fails](/build/build-process-management/build-workflows#editing-workflow-steps) for this step.

### Guiding the Scanner Through Your App

A full scan runs your app and explores its screens. When your app needs a sign-in or a few taps to reach its main screens, give the scanner the test credentials and the UI prompts it needs.

Write one prompt per line in the **UI Prompts** input, as a short name, a colon, and the action:

```text
accept-terms: Scroll down and select the Accept Terms checkbox.
login: Tap the Login button and sign in with the test credentials.
```

## Output Variables

The output(s) resulting from the operation of this component are as follows:

| Variable Name | Description |
| ------------- | ----------- |
| `$AC_OSTORLAB_SCAN_ID` | The ID of the scan created in Ostorlab. |
| `$AC_OSTORLAB_RISK_RATING` | The risk rating of the scan, for example `High`. Empty when the step does not wait for the result. |
| `$AC_OSTORLAB_SCANNED_ARTIFACT` | The artifact that was uploaded to Ostorlab. |

The step sets these variables even when it breaks the pipeline, so the following steps can still report the scan ID.

---

To access the source code of this component, use the following link:

https://github.com/appcircleio/appcircle-ostorlab-security-scan-component

---

## FAQ

### Which file formats can this step scan?

An APK, an AAB, or an IPA. The step selects the Ostorlab asset type from the file extension. An `.xcarchive` is not accepted, so export the `.ipa` file first with the [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps#xcodebuild-for-devices-archive--export) step.

### Where do I see the scan findings?

In your Ostorlab organization. The build log shows the scan ID, and when the step waits for the result, the risk rating. The step does not download a report into the build artifacts.

### Why does the step fail with a message about the Python version?

The Ostorlab command line tool needs Python 3.13 or later. Select a stack that provides it, such as macOS Sequoia `15.4.1` or later, or set the **Python Path** input to a Python 3.13 or later on your self-hosted runner.

### Why does the step fail with a message about my Ostorlab subscription?

Your Ostorlab plan does not cover this app or the selected scan profile. Contact your Ostorlab account manager.

### Why does the step fail when the scan takes too long?

With **Break On Risk Rating** set, the step waits at most **Max Wait Minutes** for the result. A full scan can take longer than the default 30 minutes. Raise **Max Wait Minutes**, or set **Break On Risk Rating** to `none` and follow the scan in Ostorlab.

### Why does the step report that the scan could not be started?

Ostorlab rejected the request. Check that the `OSTORLAB_API_KEY` variable holds a valid key and that its environment variable group is selected in the build profile configuration. The lines above the error in the build log show the reason Ostorlab returned.

### Why does the step fail while installing the Ostorlab command line tool?

The runner could not download the tool. On self-hosted runners, check that the runner can reach `pypi.org`.
