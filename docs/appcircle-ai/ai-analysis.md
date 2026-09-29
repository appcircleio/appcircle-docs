---
title: AI Analysis
description: Use Troubleshoot with AI in the Appcircle build logs to analyze a failed build and understand what caused the error.
tags: [appcircle ai, ai, build logs, troubleshooting]
sidebar_position: 1
---

import Screenshot from '@site/src/components/Screenshot';
import NeedHelp from '@site/docs/\_need-help.mdx';

# AI Analysis

AI Analysis helps you find out why a build failed without reading through the full build log line by line. When a build fails, the build log can contain hundreds of lines of output from tools such as Xcode or Gradle, and the actual cause of the failure is often buried among them. AI Analysis reviews the failed build for you and explains the error.

## Build Failure Analysis

Build failure analysis starts from the **Build Logs** window, the same window you use to review each workflow step of a build. For details on opening and working with build logs, see [viewing build logs](/build/build-process-management/binary-actions#view-build-logs).

### How It Works

When you select **Troubleshoot with AI**, Appcircle analyzes the failed step and opens the **AI summary** panel on the right side of the **Build Logs** window. The summary has two sections:

- **Root cause:** Explains why the build failed in plain language. It quotes the relevant lines from the build log, such as the error message and related configuration output, so you can see the evidence behind the explanation.
- **Suggested fix:** Lists numbered steps to resolve the error. The steps point to the places in the Appcircle dashboard where you make the change.

To learn which build data is sent to the model and how it is anonymized, see the [AI FAQ and Disclaimer](https://appcircle.io/ai-faq).

### Analyze a Failed Build

1. Open the build profile that contains the failed build.
2. Open the **Build Logs** window for the failed build.
3. Select **Troubleshoot with AI** at the bottom of the window, next to **Download Logs**.

   <Screenshot url="https://cdn.appcircle.io/docs/assets/AI-152-troubleshoot-with-ai.png" alt="Troubleshoot with AI button in the Build Logs window" />

4. Review the **AI summary** panel, which shows the **Root cause** and **Suggested fix** sections.

   <Screenshot url="https://cdn.appcircle.io/docs/assets/AI-152-ai-analysis-panel.png" alt="AI summary panel with root cause and suggested fix" />

:::info
If more than one step failed, AI Analysis analyzes the step you select in the **Build Logs** window. If you haven't selected a failed step, it analyzes the first failed step.
:::

### Give Feedback

Each summary ends with a **Was this helpful?** prompt. Select **Yes** or **No** to rate the summary. Your feedback helps Appcircle improve the accuracy of future analyses.

:::info
To learn how Appcircle uses your feedback, see [AI FAQ and Disclaimer](https://appcircle.io/ai-faq).
:::

<Screenshot url="https://cdn.appcircle.io/docs/assets/AI-152-ai-analysis-feedback.png" alt="Was this helpful feedback prompt in the AI summary panel" />

<NeedHelp />
