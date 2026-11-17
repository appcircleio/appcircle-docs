---
title: Ostorlab Security Scan
description: Scan the built APK, AAB, or IPA for security issues with Ostorlab during Appcircle builds.
tags: [ostorlab, security, scan, binary scan, android, ios]
---

import Screenshot from '@site/src/components/Screenshot';
import SensitiveVariablesDanger from '@site/docs/\_sensitive-variables-danger.mdx';

# Ostorlab Security Scan

[Ostorlab](https://www.ostorlab.co) is a mobile application security testing platform. The **Ostorlab Security Scan** step uploads the app your workflow has built, an APK, an AAB, or an IPA, to your Ostorlab organization and starts a security scan on it.

The step can also wait for the scan result and break the pipeline when the scan risk rating is too high, so a release with a critical finding stops before it reaches testers or the stores.

Because it scans the built app rather than the source code, the step works on Java / Kotlin, Objective-C / Swift, React Native, and Flutter projects alike. It follows the [Run Ostorlab as a Workflow Step](https://docs.ostorlab.co/integrations/appcircle/#run-ostorlab-as-a-workflow-step) guide of Ostorlab: it installs the Ostorlab CLI in a Python virtual environment and runs `ostorlab ci-scan run`.

:::caution

Ostorlab can also scan your builds through a webhook. Use either the webhook or this step for a build profile, not both. Otherwise, every build is scanned twice.

:::

### Prerequisites

Before running the **Ostorlab Security Scan** step, you must complete certain prerequisites, as detailed in the table below:

#### For Android (Java / Kotlin and React Native)

| Prerequisite Workflow Step | Description |
| -------------------------- | ----------- |
| [**Android Build**](/workflows/android-specific-workflow-steps/android-build) | Generates the app (APK or AAB) required for the **Ostorlab Security Scan** step. |
| [**Android Sign**](/workflows/android-specific-workflow-steps/android-sign) | Signs the app (APK or AAB). If the app is already signed, this step can be skipped. |

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-673-ostorlab-android-order.png' alt='Ostorlab Security Scan step placed after Android Sign in an Android workflow' />

#### For Android Flutter

| Prerequisite Workflow Step | Description |
| -------------------------- | ----------- |
| [**Flutter Build for Android**](/workflows/flutter-specific-workflow-steps#flutter-build-for-android) | Generates the app (APK or AAB) required for the **Ostorlab Security Scan** step. |
| [**Android Sign**](/workflows/android-specific-workflow-steps/android-sign) | Signs the app (APK or AAB). If the app is already signed, this step can be skipped. |

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-673-ostorlab-flutter-android-order.png' alt='Ostorlab Security Scan step placed after Android Sign in a Flutter Android workflow' />

#### For iOS (Objective-C / Swift and React Native)

| Prerequisite Workflow Step | Description |
| -------------------------- | ----------- |
| [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps#xcodebuild-for-devices-archive--export) | Builds the application in ARM architecture and generates an `IPA` file. |

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-673-ostorlab-ios-order.png' alt='Ostorlab Security Scan step placed after Xcodebuild for Devices in an iOS workflow' />

#### For iOS Flutter

| Prerequisite Workflow Step | Description |
| -------------------------- | ----------- |
| [**Flutter Build for iOS**](/workflows/flutter-specific-workflow-steps#flutter-build-for-ios) | Prepares the Flutter project for the iOS environment and builds it using the [Flutter SDK](https://github.com/flutter/flutter). |
| [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps#xcodebuild-for-devices-archive--export) | Builds the application in ARM architecture and generates an `IPA` file. |

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-673-ostorlab-flutter-ios-order.png' alt='Ostorlab Security Scan step placed after Xcodebuild for Devices in a Flutter iOS workflow' />

:::info Ostorlab API Key

The step needs an Ostorlab API key. In Ostorlab, open **Integrations/API → API Keys**, select **New API Key**, and copy the key.

1. In Appcircle, [create an environment variable group](/build/build-environment-variables#creating-environment-variable-groups), for example `OSTORLAB`.
2. Add a variable with the key `OSTORLAB_API_KEY`, paste your Ostorlab API key as its value, and select **Secret**.
3. In the configuration of your build profile, select the `OSTORLAB` group on the **Environment Variables** tab.

The `$AC_OSTORLAB_API_KEY` input defaults to `$OSTORLAB_API_KEY`, so the step picks up the key without any other change.

:::

:::info Python Version

The Ostorlab CLI requires Python 3.13 or later. The macOS Sequoia `15.4.1` and later stacks provide it. The Debian Bullseye and macOS Sonoma stacks have an older Python, so select a newer stack or set `$AC_OSTORLAB_PYTHON_PATH` to a Python 3.13 or later. For the Python version of each stack, see the [iOS Build Infrastructure](/infrastructure/ios-build-infrastructure) and [Android Build Infrastructure](/infrastructure/android-build-infrastructure) pages.

On self-hosted runners, the runner must also reach `api.ostorlab.co` to upload the app and `pypi.org` to install the Ostorlab CLI.

:::

### Input Variables

This step contains some input variable(s). It needs these variable(s) to work. The table below gives explanation for this variable(s).

<SensitiveVariablesDanger />

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-673-ostorlab-inputs.png' alt='Ostorlab Security Scan step input variables' />

| Variable Name | Description | Status |
| ------------- | ----------- | ------ |
| `$AC_OSTORLAB_API_KEY` | The Ostorlab API key. Default: `$OSTORLAB_API_KEY`. | Required |
| `$AC_OSTORLAB_ARTIFACT_PATH` | Path of the APK, AAB, or IPA to scan, or of the folder holding it. On Android, use `$AC_SIGNED_APK_PATH` or `$AC_SIGNED_AAB_PATH` from the **Android Sign** step. On iOS, use `$AC_EXPORT_DIR` from the **Xcodebuild for Devices** step, because iOS builds do not expose the IPA path as a variable. A folder must hold exactly one APK, AAB, or IPA. The step does not pick an artifact on its own. | Required |
| `$AC_OSTORLAB_SCAN_PROFILE` | The scan profile. `fast_scan` runs static analysis only. `full_scan` runs static, dynamic, and backend analysis, so it takes longer. Options: `fast_scan`, `full_scan`. Default: `fast_scan`. | Required |
| `$AC_OSTORLAB_SCAN_TITLE` | The scan title shown in Ostorlab. Default: `Appcircle scan`. | Optional |
| `$AC_OSTORLAB_BREAK_ON_RISK_RATING` | Waits for the scan result and breaks the pipeline when the risk rating is higher than the selected value. For details, see [Risk Rating](#risk-rating). Options: `none`, `high`, `medium`, `low`, `potentially`, `hardening`. Default: `none`. | Optional |
| `$AC_OSTORLAB_MAX_WAIT_MINUTES` | How many minutes to wait for the scan result when `$AC_OSTORLAB_BREAK_ON_RISK_RATING` is set. The step fails when the scan does not finish in time. Default: `30`. | Optional |
| `$AC_OSTORLAB_TEST_CREDENTIALS_LOGIN` | The username the full scan uses to sign in to your app. Set it together with the password. | Optional |
| `$AC_OSTORLAB_TEST_CREDENTIALS_PASSWORD` | The password the full scan uses to sign in to your app. Keep it in a secret environment variable, for example `$OSTORLAB_TEST_PASSWORD`. | Optional |
| `$AC_OSTORLAB_UI_PROMPTS` | Natural language instructions that tell the scanner how to navigate your app, one per line as `name: action`. For an example, see the [FAQ](#how-can-the-full-scan-get-past-the-sign-in-screen-of-my-app). | Optional |
| `$AC_OSTORLAB_EXTRA_ARGUMENTS` | Additional arguments for the `ostorlab ci-scan run` command, for example `--test-credentials-role admin --sbom sbom.json`. | Optional |
| `$AC_OSTORLAB_CLI_VERSION` | The Ostorlab CLI version to install, for example `2.22.14`. When empty, the latest version is installed. | Optional |
| `$AC_OSTORLAB_PYTHON_PATH` | Full path of a Python 3.13 or later. When empty, the step tries `python3.14`, `python3.13`, and `python3` on the `PATH`. | Optional |

### Output Variables

The output(s) resulting from the operation of this component are as follows:

<Screenshot url='https://cdn.appcircle.io/docs/assets/CSM-673-ostorlab-outputs.png' alt='Ostorlab Security Scan step output variables' />

| Output Variable | Description |
| --------------- | ----------- |
| `AC_OSTORLAB_SCAN_ID` | The ID of the scan created in Ostorlab. |
| `AC_OSTORLAB_RISK_RATING` | The risk rating of the scan, for example `High`. Empty when the step does not wait for the result. |
| `AC_OSTORLAB_SCANNED_ARTIFACT` | The artifact that was uploaded to Ostorlab. |

The step sets these variables even when it breaks the pipeline, so the following steps can still use the scan ID.

### Risk Rating

Ostorlab grades every scan with a risk rating. From the most to the least severe, the ratings are **Critical**, **High**, **Medium**, **Low**, **Potentially**, and **Hardening**.

When `$AC_OSTORLAB_BREAK_ON_RISK_RATING` is `none`, the step creates the scan and continues without waiting for the result. You can follow the result in Ostorlab.

Any other value makes the step wait for the result and break the pipeline when the rating is higher than the selected value:

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

:::warning

When the risk rating is too high, this step fails and breaks the pipeline.
To prevent pipeline interruption, enable "[Continue with the next step even if this step fails](/build/build-process-management/build-workflows#editing-workflow-steps)" toggle.

:::

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-ostorlab-security-scan-component

---

## FAQ

### What is the difference between the Fast Scan and Full Scan profiles?

`fast_scan` runs static analysis on the uploaded app. `full_scan` also runs the app to perform dynamic analysis and checks the backend it talks to, so it takes longer and finds issues that only appear at runtime. Your Ostorlab subscription determines which profiles you can use.

### Which file formats can this step scan?

An APK, an AAB, or an IPA. The step selects the Ostorlab asset type from the file extension. An `.xcarchive` is not accepted, so export the `.ipa` file first with the [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps#xcodebuild-for-devices-archive--export) step.

### Where can I see the scan findings?

In your Ostorlab organization. The build log shows the scan ID and, when the step waits for the result, the risk rating. The step does not add a report to the build artifacts.

### How can the full scan get past the sign-in screen of my app?

Set `$AC_OSTORLAB_TEST_CREDENTIALS_LOGIN` and `$AC_OSTORLAB_TEST_CREDENTIALS_PASSWORD` to a test account. When your app needs a few taps to reach its main screens, also describe them in `$AC_OSTORLAB_UI_PROMPTS`, one prompt per line as a short name, a colon, and the action:

```text
accept-terms: Scroll down and select the Accept Terms checkbox.
login: Tap the Login button and sign in with the test credentials.
```

### Why does the step fail with a message about the artifact path?

The step scans only the artifact set in `$AC_OSTORLAB_ARTIFACT_PATH`. It fails when the input is empty, when the variable it refers to, for example `$AC_SIGNED_APK_PATH`, was not exported by an earlier step, or when the folder it points to holds more than one APK, AAB, or IPA. Place the step after the step that signs your app, or set the input to the full path of the file to scan.

### Why does the step fail with a message about the Python version?

The Ostorlab CLI requires Python 3.13 or later. Select a stack that provides it, such as macOS Sequoia `15.4.1` or later, or set `$AC_OSTORLAB_PYTHON_PATH` to a Python 3.13 or later on your self-hosted runner.

### Why does the step fail with a message about my Ostorlab subscription?

Your Ostorlab subscription does not cover this app or the selected scan profile. Contact your Ostorlab account manager.

### Why does the step report that the scan could not be started?

Ostorlab rejected the request. Check that the `OSTORLAB_API_KEY` variable holds a valid key and that its environment variable group is selected in the build profile configuration. The lines above the error in the build log show the reason Ostorlab returned.

### Why does the step fail when the scan takes too long?

When `$AC_OSTORLAB_BREAK_ON_RISK_RATING` is set, the step waits at most `$AC_OSTORLAB_MAX_WAIT_MINUTES` for the result, and a full scan can take longer than the default 30 minutes. Increase `$AC_OSTORLAB_MAX_WAIT_MINUTES`, or set `$AC_OSTORLAB_BREAK_ON_RISK_RATING` to `none` and follow the scan in Ostorlab.

### Why does the step fail while installing the Ostorlab CLI?

The runner could not download the Ostorlab CLI. On self-hosted runners, check that the runner can reach `pypi.org`.
