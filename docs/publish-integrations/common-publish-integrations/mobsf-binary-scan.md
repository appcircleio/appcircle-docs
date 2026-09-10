---
title: MobSF Binary Scan
description: Scan the binary being published with MobSF and stop the publish flow on a security finding or a low security score.
tags: [mobsf, security, scan, binary scan, publish, publish module]
---

import RunnerUsage from '@site/docs/\_publish-steps-runner-usage-caution.mdx';
import MobSFSelfHosted from '@site/docs/workflows/common-workflow-steps/\_mobsf-self-hosted-note.mdx';

# MobSF Binary Scan

[MobSF (Mobile Security Framework)](https://github.com/MobSF/Mobile-Security-Framework-MobSF) is an open source security suite for mobile applications. The **MobSF Binary Scan** step runs a full MobSF static analysis on the app version your Publish flow is about to submit, an APK, an AAB, or an IPA.

Because it reads the compiled app rather than the code, this scan reports what actually ships to your users: the manifest and the requested permissions, the signing certificate, hardcoded secrets, binary protections, the network security configuration, the trackers found in the app, and a scored AppSec report.

In a Publish flow, the file that is scanned is the exact file the store receives, whether it came from the Build module or was uploaded to the Publish module directly. Placed before the store step, the scan can stop the flow while the app is still unsubmitted.

The same analysis is available during the build as the [**MobSF Binary Scan**](/workflows/common-workflow-steps/mobsf-binary-scan) workflow step, and the code equivalent is the [**MobSF Source Code Scan**](/workflows/common-workflow-steps/mobsf-source-code-scan) workflow step.

<RunnerUsage />
<MobSFSelfHosted />

### Prerequisites

There is no prerequisite step. The step reads the app file of the version being published from the Publish module and downloads it itself, so it works anywhere in the flow and needs no path configuration.

Place it before the step that submits the app, such as [**Send to TestFlight**](/publish-integrations/ios-publish-integrations/sent-to-testflight), [**Send to Google Play Console**](/publish-integrations/android-publish-integrations/publish-to-google-play) or [**Send to Huawei AppGallery**](/publish-integrations/android-publish-integrations/publish-to-huawei-appgallery), so that a binary breaking one of the gates is never submitted.

### The Scanned File

The step reads two reserved publish variables that the Publish module sets on its own. They are not step input variables, which is why the step form has no artifact path field:

| Variable | Description |
| -------- | ----------- |
| `$AC_APP_FILE_URL` | The URL of the app file of the version being published. |
| `$AC_APP_FILE_NAME` | The name of that app file, with its extension. |

See [Publish Variables](/publish-to-stores-module/publish-variables) for the full list of reserved variables.

The step downloads the app file into its own temporary folder under the name from `$AC_APP_FILE_NAME`, falling back to the file name in the URL when that variable is empty, and scans the downloaded file. The file stays in the temporary folder, so it is not added to the publish artifacts and does not survive the step.

:::caution The app file URL is signed and expires

`$AC_APP_FILE_URL` is a signed link with an expiry date. A Publish flow that waits longer than the lifetime of that link, on an approval step for instance, can no longer download the app file, and the step fails with the rejection reported. Restart the flow to get a fresh link.

:::

The signed URL is never written to the step log. The download command is logged with the URL replaced by `AC_APP_FILE_URL:...`, and the signature is removed from any error the download reports.

### Input Variables

This step contains some input variable(s). It needs these variable(s) to work. The table below gives explanation for this variable(s).

| Variable Name | Description | Status |
| ------------- | ----------- | ------ |
| `$AC_MOBSF_FAIL_ON` | Breaks the publish flow on a finding at the selected level or worse. Options: `critical`, `normal`, `low`, `none`. Default: `critical`. | Optional |
| `$AC_MOBSF_MIN_SCORE` | Breaks the publish flow when the MobSF security score out of 100 falls below this value. `0`, the default, disables the check. | Optional |
| `$AC_MOBSF_SCAN_TIMEOUT` | Timeout in seconds for the MobSF scan. Default: `1800`. MobSF applies its own decompile and SAST timeouts of 1000 seconds each, so keep this value above their sum for large apps. | Optional |
| `$AC_MOBSF_SAVE_REPORT` | Copies the JSON report into the artifacts folder. Options: `true`, `false`. Default: `true`. | Optional |

### Output Variables

The output(s) resulting from the operation of this component are as follows:

| Output Variable | Description |
| --------------- | ----------- |
| `AC_MOBSF_SCANNED_ARTIFACT` | The artifact that was scanned. |
| `AC_MOBSF_SECURITY_SCORE` | The MobSF security score out of 100. |
| `AC_MOBSF_FINDING_COUNT` | Total number of findings. |
| `AC_MOBSF_CRITICAL_COUNT` | Number of critical findings. |
| `AC_MOBSF_NORMAL_COUNT` | Number of normal findings. |
| `AC_MOBSF_LOW_COUNT` | Number of low findings. |
| `AC_MOBSF_WORST_LEVEL` | The worst level found: `critical`, `normal`, `low`, or `none`. |

The steps of a Publish flow run in separate runner environments, so these values are exported the way any publish step hands values to the steps after it. See [How to change environment variable and exchange it between steps?](/publish-to-stores-module/publish-variables#how-to-change-environment-variable-and-exchange-it-between-steps) for how a following step reads them.

### Failing the Publish Flow

Two independent gates decide the flow, and both are evaluated on every scan:

| Gate | Input Variable | Reads |
| ---- | -------------- | ----- |
| Level gate | `$AC_MOBSF_FAIL_ON` | The findings. |
| Score gate | `$AC_MOBSF_MIN_SCORE` | The MobSF security score out of 100. |

The gates are not chained, so neither one gates the other:

- Either gate on its own breaks the flow, as soon as one of them is breached and whatever the other one says.
- `$AC_MOBSF_FAIL_ON` set to `none` disables the level gate only. The score gate stays in force, so a score below the minimum still breaks the flow.
- A score comfortably above the minimum does not excuse a finding at or above the selected level, and a clean level gate does not excuse a low score.
- `$AC_MOBSF_MIN_SCORE` set to `0`, the default, disables the score gate, and the level gate decides alone.

The levels map onto MobSF's own grades: `critical` is `high`, `normal` is `warning` and `low` is `info`. The pipeline breaks on a finding at the selected level **or worse**, so `low` is the strictest setting and `critical` the loosest. A `secure` entry is a check the app passed and a `hotspot` is a finding that needs a human decision, so neither one breaks the flow.

### Reports

The report is written into the `$AC_OUTPUT_DIR` directory as `mobsf-binary-analyze.json`, unarchived and under its own name. `$AC_OUTPUT_DIR` is the directory a publish step leaves its output in, so the report is exported with that step's artifacts and a following step in the flow can read it from the same path.

JSON is the only format this step reports. MobSF's other export is a PDF, which needs the `wkhtmltopdf` tool that is not installed on the runners, so the step has no output format input variable.

The report is written before the flow is graded, so the findings stay available even when the step breaks the flow.

The step log closes with a summary that ends in the verdict:

```
  Artifact              Battery_8_1_.apk
  Security score        35 / 100
  Critical              6 finding(s)
  Normal                3 finding(s)
  Low                   1 finding(s)
  Passed checks         2
  Needs review          0
  Total                 10 finding(s)
  Worst level found     Critical
  Fail publish on       critical
  Minimum score         0 (no score gate)
  Verdict               pipeline breaks
```

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-publish-mobsf-binary-scan

---

## FAQ

### Which file formats can this step scan?

An APK, an AAB, or an IPA, which covers every binary the Publish module accepts. An AAB is converted to an APK by the bundletool that MobSF ships, using the Java installation provisioned on the runner.

### Do I need to tell the step where the binary is?

No. The step reads the app file of the version being published from `$AC_APP_FILE_URL` and downloads it itself, so there is nothing to configure and no path that can go stale. This also means the step always scans the file that the store step submits, and cannot be pointed at a different file.

### Why does this step need a runner while most publish steps do not?

MobSF performs the analysis itself, on the machine that runs the step. Steps like [**Get Approval via Email**](/publish-integrations/common-publish-integrations/get-approval-via-email) only talk to a service and are handled server-side, so they need no runner. This step needs the runner where MobSF is provisioned during setup, and it does not install MobSF itself.

### Does this step need Docker on the runner?

No. The step drives the MobSF installation that runner setup provisioned, and no container runtime is involved.

### What is the difference between scanning in the Publish flow and scanning during the build?

The analysis is the same. The [**MobSF Binary Scan**](/workflows/common-workflow-steps/mobsf-binary-scan) workflow step scans the app the build has just produced and breaks the build, which gives the fastest feedback to the developer who pushed the commit. This step scans the version that is about to be submitted and breaks the publish flow, which also covers a binary that was uploaded to the Publish module rather than built on Appcircle, and a re-signed binary. Running both is common: the build gate keeps findings out of the app version list, and the publish gate is the last check before the store.

### What is the difference between the MobSF Binary Scan and MobSF Source Code Scan steps?

The **MobSF Binary Scan** step analyzes the compiled APK, AAB, or IPA and reports what ships to your users, such as the signing certificate, the requested permissions, and the binary protections. The [**MobSF Source Code Scan**](/workflows/common-workflow-steps/mobsf-source-code-scan) step analyzes the source code in your repository and reports the file and line of every finding, so it runs before the build and points at code you can fix. Running both covers the code and the shipped app.

### Does a scan return a cached result for an app that was scanned before?

No. MobSF caches a scan by the MD5 hash of the artifact, but the step removes the scan record, the uploaded artifact, and the decompiled sources when it finishes, so every run produces a fresh scan.

### The step log mentions a failed decompilation. Did the scan fail?

Not necessarily. MobSF judges the `jadx` decompiler by its exit code, and `jadx` exits with an error as soon as a single class fails to decompile, which is routine for an app processed with R8. The step reads the report rather than the tool's verdict, so a summary with counts and a verdict is a valid result.
