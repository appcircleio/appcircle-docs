---
title: Maestro Cloud Upload
description: Facilitate the execution of automated tests for mobile applications directly within Appcircle using Maestro Cloud Upload.
tags: [maestro, maestro cloud, mobile, testing]
---

import Screenshot from '@site/src/components/Screenshot';

# Maestro Cloud Upload

[Maestro Cloud](https://cloud.mobile.dev) is a cloud-based mobile device farm for testing and debugging mobile applications, offering developers and QA teams access to a wide range of real devices for comprehensive testing across various platforms, operating systems, and device configurations.

The Appcircle **Maestro Cloud Upload** step enables users to upload their mobile applications directly to Maestro, a cloud-based mobile device farm for testing and debugging applications. This integration simplifies the process of distributing apps for testing purposes across various devices and platforms supported by Maestro. Users can configure this step within their CI/CD workflows to deploy their apps to Maestro's cloud infrastructure, facilitating efficient and comprehensive testing procedures.

## Prerequisites

Before running the **Maestro Cloud Upload** step, you must complete certain prerequisites, as detailed in the table below:

### For All Platforms

| Prerequisite Workflow Step | Description                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| [**Git Clone**](/workflows/common-workflow-steps/#git-clone) | Fetches the repository to be built from the specified branch, ensuring that the [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro) can run on the repository path. |

### For Android (Java / Kotlin and React Native) 

| Prerequisite Workflow Step        | Description                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [**Android Build**](/workflows/android-specific-workflow-steps/android-build) | Generates the app required for the **Maestro Cloud Upload** step. |
| [**Android Sign**](/workflows/android-specific-workflow-steps/android-sign)   | This step is required for signing the app. It processes the output for signing but can be skipped if the app is already signed. |

<Screenshot url='https://cdn.appcircle.io/docs/assets/common-workflow-components-maestro-cloud-upload_1_v2.png'/>

### For iOS (Objective-C / Swift and React Native) 

| Prerequisite Workflow Step        | Description                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps#xcodebuild-for-devices-archive--export) | Builds the application in ARM architecture and generates an `IPA` file. |

<Screenshot url='https://cdn.appcircle.io/docs/assets/common-workflow-components-maestro-cloud-upload_2_v2.png'/>

### For Android Flutter 

| Prerequisite Workflow Step        | Description                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [**Flutter Build for Android**](/workflows/flutter-specific-workflow-steps#flutter-build-for-android) | Generates the app required for the **Maestro Cloud Upload** step.                                                                           |
| [**Android Sign**](/workflows/android-specific-workflow-steps/android-sign)   | This step is required for signing the app. It processes the output for signing but can be skipped if the app is already signed. |

<Screenshot url='https://cdn.appcircle.io/docs/assets/common-workflow-components-maestro-cloud-upload_3_v2.png'/>

### For iOS Flutter

| Prerequisite Workflow Step        | Description                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [**Xcodebuild for Devices**](/workflows/ios-specific-workflow-steps#xcodebuild-for-devices-archive--export) | Builds the application in ARM architecture and generates an `IPA` file. |
| [**Flutter Build for iOS**](/workflows/flutter-specific-workflow-steps#flutter-build-for-ios) | Prepares the Flutter project for the iOS environment and builds it using the [Flutter SDK](https://github.com/flutter/flutter). |

<Screenshot url='https://cdn.appcircle.io/docs/assets/common-workflow-components-maestro-cloud-upload_4_v2.png'/>

## Input Variables

This step contains some input variable(s). It needs these variable(s) to work. The table below gives explanation for this variable(s).

<Screenshot url='https://cdn.appcircle.io/docs/assets/common-workflow-components-maestro-cloud-upload_5_v2.png'/>

:::danger Sensitive Variables

Please do not use sensitive variables such as **Username**, **Password**, **API Key**, or **Personal Access Key** directly within the step.

We recommend using [**Environment Variables**](/build/build-environment-variables) groups for such sensitive variables.

:::

| Variable Name                 | Description                                                                                             | Status    |
|-------------------------------|---------------------------------------------------------------------------------------------------------|-----------|
| `$AC_MAESTRO_API_KEY`         | The API key is required for accessing Maestro Cloud services.                                              | Required  |
| `$AC_MAESTRO_PROJECT_ID`      | The Maestro Cloud Project ID. You can find it in the Maestro Dashboard settings. Required if your Maestro account has more than one project; otherwise, the only project is selected automatically. | Optional  |
| `$AC_MAESTRO_APP_FILE`        | **Android**: Specify the path to an ARM compatible or multi-architecture APK file. **iOS**: Specify the path to a simulator build (`.app` directory or a zip archive of it).   | Required  |
| `$AC_MAESTRO_WORKSPACE`       | Specifies the directory or file path where Maestro flows are located. By default, it looks for a `.maestro` folder in the project root. Override with a workspace argument if needed.  | Required  |
| `$AC_MAESTRO_UPLOAD_NAME`     | Specifies the custom name for the upload.                                                               | Optional  |
| `$AC_MAESTRO_ASYNC`           | Toggle to enable asynchronous mode for running flows.                                                   | Optional  |
| `$AC_MAESTRO_ENV`             | Pass environment variables to the flows. Separate variables using a new line, or `\n`.                   | Optional  |
| `$AC_MAESTRO_DEVICE_OS`       | The OS version of the cloud device, such as `android-34` or `iOS-26-2`. Run `maestro list-cloud-devices` to see all supported values. | Optional  |
| `$AC_MAESTRO_DEVICE_MODEL`    | The model of the cloud device, such as `pixel_6` or `iPhone-17-Pro`. Run `maestro list-cloud-devices` to see all supported values. | Optional  |
| `$AC_MAESTRO_ANDROID_API_LEVEL` | **Deprecated.** Use `$AC_MAESTRO_DEVICE_OS` instead (for example, `android-34`). It is ignored when `$AC_MAESTRO_DEVICE_OS` is set. | Optional  |
| `$AC_MAESTRO_INCLUDE_TAGS`    | Run only flows containing the specified tags (comma-separated).                                         | Optional  |
| `$AC_MAESTRO_EXCLUDE_TAGS`    | Exclude flows with the specified tags (comma-separated).                                                | Optional  |
| `$AC_MAESTRO_EXPORT_TEST_REPORT` | Toggle to export the test suite report (JUnit).                                                      | Optional  |
| `$AC_MAESTRO_EXPORT_OUTPUT`   | Specify the output file for the test file output. The default is `report.xml`. The report is also copied to `$AC_OUTPUT_DIR/maestro/maestro_report.xml`. | Optional  |
| `$AC_MAESTRO_MAPPING_FILE`    | **Android**: Include the Proguard mapping file. **iOS**: Include the generated .dSYM file.              | Optional  |
| `$AC_MAESTRO_BRANCH`          | The branch from which the upload originated.                                                            | Optional  |
| `$AC_MAESTRO_REPO_NAME`       | The name of the repository (e.g., GitHub repo slug).                                                     | Optional  |
| `$AC_MAESTRO_REPO_OWNER`      | The owner of the repository (e.g., GitHub organization or user slug).                                    | Optional  |
| `$AC_MAESTRO_PULL_ID`         | The ID of the pull request from which the upload originated.                                            | Optional  |
| `$AC_MAESTRO_CLI_VERSION`     | The version of the Maestro CLI is to be downloaded in your CI environment. The default value is the `latest` version.  | Optional  |

:::info Project ID and device selection

The **Project ID**, **Device OS**, and **Device model** inputs are available in version `1.0.3` and later of the **Maestro Cloud Upload** step. If your Maestro account has more than one project, you must set `$AC_MAESTRO_PROJECT_ID`, because the build cannot select a project for you.

:::

:::caution iOS Simulator Builds

Maestro Cloud runs iOS apps on simulators, so the app file must be a simulator build. You can use the [**Xcodebuild for iOS Simulator**](/workflows/ios-specific-workflow-steps/xcodebuild-for-ios-simulator) step and pass its `$AC_SIMULATOR_APP_PATH` output as the **App File**. An `.ipa` built for physical devices does not run on Maestro Cloud.

:::

:::info Output Variables

The **Maestro Cloud Upload** step generates no output variables. The results are shown in the build log.

:::

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-maestro-cloud-upload-component.git