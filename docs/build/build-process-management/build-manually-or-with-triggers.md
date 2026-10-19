---
title: Triggers
description: Learn how to build manually or automatically with webhooks, event-based triggers, and scheduled triggers in Appcircle
tags: [build, build process management, manual build, automatic build, triggers, webhooks, scheduled build, cron]
sidebar_position: 5
---

import Screenshot from '@site/src/components/Screenshot';

There are multiple ways to trigger a build in Appcircle. You can run builds manually, automate the build process with various event-based triggers, or schedule builds to run automatically at times you define.

<iframe width="640" height="315" src="https://www.youtube.com/embed/zxxax79KD9U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Triggers for Manual Builds

For the manual builds, the currently available push triggers apply, and if no trigger is configured, the following trigger is provided by default under the [push triggers](#auto-build-on-every-push). If there are others, they may take precedence based on the [trigger priorities](#trigger-priorities).

<Screenshot url='https://cdn.appcircle.io/docs/assets/build-manual-push-trigger_v2.png' />

## Triggers Configuration

To set up or manage the build triggers, click the **Triggers** button at the top right of the build profile details.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5278-trigger_v2.png' />

The Triggers panel is organized into tabs: **On Every Push**, **On Merge/Pull Request**, **On Tag Push**, and **Scheduled** `(Beta)`. Event-based triggers (push, merge/pull request, and tag) are set up at the profile level, and you can specify individual branch names or [utilize wildcards](/build/build-process-management/build-manually-or-with-triggers#wildcard-reference) for branch names to trigger builds. Scheduled triggers, described in [Scheduled builds](#scheduled-builds-beta), instead run at fixed times regardless of repository activity.

You also need to select a workflow for each trigger, and the build will be run with that trigger for the specified branch. You can build the same branch with different workflows (e.g., production or development), or you can use the same workflow for multiple branches (e.g., multiple feature branches built with the develop workflow).

## Automatic Build

Builds can be triggered with various triggers such as every push to the repository, pull/merge requests, tagged pushes, or a defined schedule. Event-based triggers (push, pull/merge request, and tag) require the following:

- Webhook connection to the repository
- Setting up build triggers

There are two options to set up webhooks for automatic builds:

- You can [authorize the Appcircle app](/build/manage-the-connections/connection-guides) for GitHub, Bitbucket, or GitLab repositories for direct integration. The triggers will be available for use immediately. (You can skip the next part about the webhook setup.)
- For the repository connections through SSH, you can add the specific webhook for that build profile manually to the compatible git provider. This enables the Git provider to send a POST request to Appcircle for the selected events, which you can then use for triggers.

:::info
Scheduled builds do not rely on repository webhooks at all, since they are started by Appcircle itself at the times you configure. No webhook setup is required for scheduled triggers. See [Scheduled builds](#scheduled-builds-beta) below.
:::

## Setting up Manual Webhooks Based on Repository Connection Type

Depending on how your Git provider is connected to Appcircle, the webhook setup may be handled automatically or may require manual configuration.

### Setting Up Manual Webhooks for SSH and Public Repositories

For repositories connected through SSH, you can set up triggers with webhooks in compatible repository providers.

When you connect a repository through SSH or through a public URL, the **Webhooks** option will be enabled in the **...** menu next to the build profile name, at the top of the profile details.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE6019-ssh1_v2.png' />

You can copy this URL and paste it in the related section in the git provider repository settings with the copy button.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE6019-provider_v2.png' />

To manually configure a webhook:

**1.**	Go to your build profile.

**2.**	Open the **...** menu next to the profile name and select **Webhooks**.

**3.**	In the **Webhooks** dialog:

- **Select a Git Provider**:
  If the Git provider is detected, a compatible URL will be displayed automatically. If not, choose your Git provider (e.g., GitHub, GitLab, Bitbucket) from the dropdown list.

- **Copy the Webhook URL**:
  The generated Repository Webhook URL will appear based on your Git Provider. Copy this URL and paste it into your repository’s webhook settings.

The URL Format:
```bash
https://api.appcircle.io/build/v1/callback/hooks/{GIT_PROVIDER}/{YOUR_ORGANIZATION_ID}/custom/{WEBHOOK_KEY}/V11
```

- `api.appcircle.io`: Use your own API address for self-hosted Appcircle.
- `{GIT_PROVIDER}`: The provider you selected, such as `Github`, `GithubEnterprise`, `Gitlab`, `GitlabSelfHosted`, `Bitbucket`, `BitbucketServer`, `AzureDevopsServices`, or `AzureDevopsServer`.
- `{WEBHOOK_KEY}`: Generated by Appcircle for the repository. All build profiles bound to this webhook receive its events.

Always copy the URL from the **Webhooks** dialog instead of building it by hand.

- **Generate a Webhook Key**:
  You can generate a new webhook key/secret to refresh or reset the endpoint’s security token.

**4.**	Paste the Webhook URL in your Git repository.

:::info
**The Selected Git Provider** option in the **Webhooks** dialog is only available for repositories connected via **SSH** or **Public URL**.

If your repository is connected using GitHub, GitLab, Bitbucket or Azure Devops App integrations, this selection will not appear since webhooks are automatically managed.
:::

:::caution Azure Devops Connections
Azure Devops has slightly different steps to configure a manual webhook.
To manually configure a webhook for an Azure DevOps repository:

1. Connect your Azure DevOps repository to Appcircle and create a build profile.
2. In Azure DevOps, navigate to:
   `Project Settings → Service Hooks → + Create Subscription`
3. Choose Web Hooks as the service.
4. Select your repository and choose the required trigger events (e.g., code push, pull request).
5. In the “Action” step, paste the webhook URL.
6. “Accept untrusted SSL certificates“ option can stay disabled.
7. Enter `appcircle` as username.
8. Paste `{YOUR_WEBHOOK_SECRET}` as password.
   :::

#### Binding Existing Manual Webhooks to Other Build Profiles

When a manual webhook (SSH/Public URL/Read-only PAT) is already configured for a repository, additional build profiles that are connected to the same repository can reuse this existing webhook configuration.

- When opening the Webhooks section of a build profile, if a manual webhook is already detected for the repository, a prompt will appear asking if you would like to bind the build profile to the existing webhook.
- Selected Git Provider, Webhook URL, and the existing Webhook Key/Secret will be displayed as partially masked.
- Users can directly click the Bind button to link the build profile to the existing webhook.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE6529-hookv2.png' />

### Webhook Setup for OAuth and PAT-Based Repository Connections

When a repository is connected to Appcircle via OAuth connection (such as GitHub, GitLab, or Bitbucket) or using a Personal Access Token (PAT), the behavior of webhook creation varies depending on the type of integration and the permission level of the token.

In some cases, Appcircle handles webhook setup automatically, while in others—particularly when using read-only access—manual configuration may be required to enable trigger-based builds.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE6019-noprovider_v2.png' />

Below is a breakdown of how webhooks are managed for each supported Git provider based on the connection method.

#### GitHub OAuth Connection

When your repository is connected using the GitHub OAuth connection, webhooks are created automatically. No manual configuration is needed.

#### GitLab OAuth Connection

Webhooks are also automatically created when connecting via the GitLab OAuth connection.

#### GitLab Cloud/Server - PAT Connection

The behavior differs depending on the PAT’s permission level:

- **Admin Permissions**: Webhooks are created automatically.
- **Read-Only Permissions**: Manual webhook creation is required.

To set up a manual webhook for a read-only PAT:

1. Connect the GitLab repository to Appcircle using the read-only PAT and create a build profile.
2. In GitLab Server, go to:  
   `Projects → <Your Connected Repository> → Settings → Webhooks → Add Webhook`
3. Copy the webhook URL and secret from the build profile's **Webhooks** dialog and paste them into GitLab. The URL has this format:
   ```
   https://api.appcircle.io/build/v1/callback/hooks/{GIT_PROVIDER}/{YOUR_ORGANIZATION_ID}/custom/{WEBHOOK_KEY}/V11
   ```
4. Paste the webhook secret into the **Secret token** field, and enable **Push events**, **Tag push events**, and **Merge request events**. Also enable **Comments** if you want to [retry a workflow](#retrying-a-workflow) with a `[retry]` merge request comment. Otherwise it isn't needed.

:::warning PAT Role
For Appcircle to create the webhook automatically, the PAT owner must have at least the **Maintainer** role on the project and the token must have the `api` scope. GitLab does not allow lower roles to manage webhooks.
:::

#### Bitbucket OAuth Connection

When using the Bitbucket OAuth connection, Appcircle automatically creates the webhook—no further action is needed.

#### Bitbucket Server - PAT Connection

Webhook behavior is determined by the PAT’s permissions:

- **Admin Permissions**: Webhook is created automatically.
- **Read-Only Permissions**: Manual setup is required.

To manually configure a webhook for a Bitbucket Server repository using a read-only PAT:

1. Connect the Bitbucket Server repository using the read-only PAT and create a build profile in Appcircle.
2. In Bitbucket Server, go to:  
   `Repositories → <Your Connected Repository> → Repository Settings → Webhooks → Create Web Hook`
3. Copy the webhook URL and secret from the build profile's **Webhooks** dialog and paste them into Bitbucket Server. The URL has this format:
   ```
   https://api.appcircle.io/build/v1/callback/hooks/{GIT_PROVIDER}/{YOUR_ORGANIZATION_ID}/custom/{WEBHOOK_KEY}/V11
   ```
4. Select the **Repository: Push** and **Repository: Modified** events, and the **Pull request: Opened** and **Pull request: Source branch updated** events.

:::warning Token Permission
For Appcircle to create the webhook automatically, the HTTP access token must have **Repository admin** permission. Bitbucket only allows repository admins to manage webhooks.
:::

#### Azure Devops - PAT Connection

When using the Azure DevOps PAT integration, Appcircle automatically creates the service hook subscriptions. The token owner must be allowed to edit service hook subscriptions in the project (Project Administrators by default). If they aren't, follow the manual Azure DevOps steps above.

#### GitHub PAT and GitHub Enterprise Connections

To create a webhook automatically, Appcircle must be able to add a webhook to the repository settings. GitHub requires the **Webhooks: Read and write** permission (fine-grained PAT) or the `write:repo_hook` scope (classic PAT) for this, and the token owner must have admin access to the repository. This permission only covers the repository's webhook settings. It doesn't give write access to code or pull requests, so the **Contents** permission can stay read-only. If you don't want to grant webhook permissions, set up a manual webhook from the **Webhooks** dialog.

#### Bitbucket Cloud Token Connections

For API tokens and access tokens, Appcircle creates the webhook automatically when the token has webhook read and write permissions and its owner is a repository admin. Otherwise, set up a manual webhook from the **Webhooks** dialog.

### Automatically Created Webhooks

When Appcircle creates a webhook in your Git provider, it uses the following settings. You can use them to find and verify the webhook in your repository settings.

- **Name/description:** `Appcircle/V11`
- **URL:** `https://api.appcircle.io/build/v1/callback/hooks/{GIT_PROVIDER}/{YOUR_ORGANIZATION_ID}/{HOOK_ID}/V11`. Self-hosted Appcircle uses its own API address.
- **Security:** Each webhook has its own secret, which Appcircle checks on every request. GitHub and Bitbucket sign the payload with it, GitLab sends it as the secret token, and Azure DevOps uses basic authentication with username `appcircle`.

| Provider | Subscribed events |
|---|---|
| GitHub / GitHub Enterprise | `push`, `create`, `delete`, `pull_request` |
| GitLab | Push events, Tag push events, Merge request events, Comments |
| Bitbucket Cloud | `repo:push`, `pullrequest:created`, `pullrequest:updated` |
| Bitbucket Server | `repo:refs_changed`, `repo:modified`, `pr:opened`, `pr:from_ref_updated` |
| Azure DevOps | Code pushed, Pull request created, Pull request updated, Pull request merge attempted, Pull request commented on |

:::info
These events are notifications that the Git provider sends to Appcircle, for example "a pull request was opened or got new commits". Subscribing to them doesn't let Appcircle change your code, branches, or pull requests. Appcircle uses them to start push, tag, and pull request builds (for example when new commits are pushed to an open pull request) and to keep the branch list in sync when branches are created or deleted.
:::

Appcircle also tries to create the webhook again every time the repository is refreshed.

#### When Appcircle Cannot Create the Webhook

Appcircle can't create the webhook automatically in these cases:

- The repository is connected via SSH or a public URL.
- The connection token does not have the webhook permissions described above (for example a read-only PAT, or a GitLab role lower than Maintainer).
- The Git server rejects or can't reach the request (for example GitLab blocks local network requests, see [Outbound Requests](/build/manage-the-connections/connection-guides/connecting-to-gitlab#outbound-requests)).

The build profile is still created, but triggers won't fire until a webhook exists. You can tell this happened when the **Webhooks** option appears in the **...** menu of the build profile and no `Appcircle/V11` webhook exists in your repository settings. Set up a manual webhook from that dialog, or fix the token permissions and refresh the repository so Appcircle can try again.

This ensures proper webhook communication across all supported Git repository configurations.

Please refer to the following guides to set up webhooks in various git providers:

[https://docs.github.com/en/developers/webhooks-and-events/webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks)

[https://docs.gitlab.com/ee/user/project/integrations/webhooks.html](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html)

[https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/](https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/)

[https://docs.microsoft.com/en-us/azure/devops/service-hooks/overview?view=azure-devops](https://docs.microsoft.com/en-us/azure/devops/service-hooks/overview?view=azure-devops)

### Webhook Events Reference

You can enable or disable webhook event scopes according to your needs. The table below lists supported events for each Git provider along with their descriptions:

| **Event**                     | **Description**                                                            | **GitHub** | **GitLab** | **Bitbucket** | **Azure DevOps** |
|------------------------------|----------------------------------------------------------------------------|------------|------------|---------------|------------------|
| Push / Code Push             | Triggered when code is pushed to any branch.                              | ✅         | ✅         | ✅            | ✅               |
| Tag Push / Tag Created       | Triggered when a new tag is pushed.                                       | ✅         | ✅         | ✅            | ✅               |
| Branch or Tag Creation       | Triggered when a new branch or tag is created.                            | ✅         | ✅         | ✅            | ✅               |
| Branch or Tag Deletion       | Triggered when a branch or tag is deleted.                                | ✅         | ✅         | ✅            | ✅               |
| Pull/Merge Request Created   | Triggered when a PR/MR is opened.                                         | ✅         | ✅         | ✅            | ✅               |
| Pull/Merge Request Updated   | Triggered when commits are added or changes are made to the PR/MR.        | ✅         | ✅         | ✅            | ✅               |
| Pull/Merge Request Merged    | Triggered when a PR/MR is merged.                                         | ✅         | ✅         | ✅            | ✅               |
| Pull/Merge Request Closed    | Triggered when a PR/MR is closed or abandoned.                            | ✅         | ✅         | ✅            | ✅               |
| Issue or PR Comment Added    | Triggered when a comment is added to an issue or PR.                      | ✅         | ✅         | ✅            | ❌               |
| Pipeline Status Changed      | Triggered when a pipeline/build status changes (e.g., success/failure).   | ❌         | ✅         | ❌            | ✅               |
| Work Item Updated            | Triggered when a task/ticket is updated in the tracker system.            | ❌         | ❌         | ❌            | ✅               |

:::info
✅ = Supported by the provider  
❌ = Not supported or not applicable  
Note: Terminology may vary slightly across providers (e.g., PR vs. Merge Request).
:::

:::tip
You can also use[ appcircle-cli](/appcircle-api-and-cli) to trigger your builds from the command line as well.
:::

## Managing Triggers for Builds

To set up or manage the build triggers, click the **Triggers** button at the top right of the build profile details.

### Auto build on every push

Appcircle will start building your application whenever you push a commit to your Git repository. For the specified branches, your project will be built automatically with the selected workflow.

<Screenshot url='https://cdn.appcircle.io/docs/assets/build-manual-push-trigger_v2.png' />

You must choose both workflow, and a configuration when you're setting up a trigger.

### Auto build pull/merge requests

Appcircle will start building your application whenever you initiate a pull request or merge request from the source branch(es) to the target branch.

The build will be done with the pull/merge result using the selected workflow. This allows testing of the PR/MR result before the actual approval of the request.

:::caution
Make sure that the names of the source branch and the target branch are spelled correctly.
:::

<Screenshot url='https://cdn.appcircle.io/docs/assets/mr-pr-last_v2.png' />

:::info

If spaces are used in the name, Appcircle will trim it without spaces.

:::

:::info

If you are using Azure DevOps Server or Azure DevOps Services Cloud as a Git provider, the Appcircle build trigger will not run for PR status updates (Approve, Approve with suggestions, Wait for author, Reject, etc.) or action changes (Complete, Mark as draft, Abandon).

Appcircle will only run the trigger for PR creation or PR updates.

:::

### Triggering different workflows at the same time

Now you will be able to trigger different workflows in the same source branch and target branch on Appcircle at once. As soon as the trigger is triggered, Appcircle will start running all the triggered triggers in the build queue, starting from the first place in the established trigger queue.

<Screenshot url='https://cdn.appcircle.io/docs/assets/build-pr-mr-trigger-multiple_v2.png' />

### Selective auto build with specific tags

Appcircle will start building your application with the selected workflow whenever you perform a push with certain tags to your Git repository. Your project will be built automatically only if the push has the tags you specify, or you can specify a wildcard tag to build all tagged pushes.

This allows building scenarios like building only specific pushes that have the "release" in the tag.

<Screenshot url='https://cdn.appcircle.io/docs/assets/tag-last_v2.png' />

### Scheduled builds (Beta)

In addition to event-based triggers, Appcircle can start a build automatically at times you define, independent of any push, pull/merge request, or tag activity in your repository. This is useful for nightly or periodic builds, regression runs, or any workflow that needs to run on a fixed cadence rather than in response to a Git event.

To set up a scheduled trigger:

**1.** Open the Triggers panel for the build profile and select the **Scheduled** tab.

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA86-1_v2.png' />

**2.** Configure the schedule:

- **Time Zone**: The time zone used to interpret the cron expression below. Appcircle offers the full list of UTC offsets (e.g., `UTC+03:00`, `UTC+03:30`) so you can schedule builds in your team's local time rather than converting to UTC manually.

  <Screenshot url='https://cdn.appcircle.io/docs/assets/QA86-2_v2.png' />

- **Cron Expression**: A standard 5-field cron expression that defines when the build should run, in the format `minute hour day-of-month month day-of-week`:

  | Field | Allowed values | Notes |
    |---|---|---|
  | Minute | `0–59` | |
  | Hour | `0–23` | |
  | Day of month | `1–31` | |
  | Month | `1–12` | |
  | Day of week | `0–6` | `0` is Sunday |

  Each field accepts `*` (any value), a specific number, a comma-separated list (e.g. `1,15`), a range (e.g. `1-5`), or a step value (e.g. `*/30` for every 30 units). Appcircle shows a plain-language summary underneath the field to help confirm the schedule before saving — for example:

    - `0 11 * * 1` → "Schedule build will start 11:00 AM every Monday"
    - `*/30 * * * *` → runs every 30 minutes
    - `0 0 1 * *` → runs at midnight on the first day of every month

- **Branch Name**: The branch the scheduled build will run against.
- **Config**: The build configuration to use.
- **Workflow**: The workflow to run.

**3.** Click the **+** button to add additional schedules to the same build profile, or the **x** next to a field to remove a schedule. Click **Save** once you're done.

:::warning
Scheduled builds are currently in **Beta**. Design and behaviour could change in future stages.
:::

:::info
Since scheduled builds aren't tied to a commit, pull/merge request, or comment, commit-message directives such as [`[skip ci]`](#skipping-a-workflow) and [`[retry]`](#retrying-a-workflow) have no effect on them.
:::

:::tip
You can tell scheduled runs apart from other builds afterward: builds started by a schedule are labeled with their own **Schedule** trigger type in Build History and reporting, rather than being grouped with manually started builds.
:::

### Skipping a workflow

If your commit message includes `[skip ci]` or `[ci skip]`, your workflow will be skipped.

### Retrying a workflow

If your merge request comment includes `[retry]`, your workflow will be retried.

### Auto Cancel Redundant Pipeline

When enabled, this feature automatically cancels any previously running build that matches the same build configuration, build workflow, build trigger and branch if a new run is triggered.
This helps prevent unnecessary resource usage and reduces queue time by skipping outdated pipeline runs.

To enable this feature:

1. Open the build profile and select **Configurations** at the top right.
2. Open the configuration and, on the **Config** tab, turn on the **Auto cancel** toggle.
3. Click **Save**.

<Screenshot url='https://cdn.appcircle.io/docs/assets/auto-cancel-redundant-pipeline_v2.png' />

The Auto-Cancel Redundant Pipeline mechanism works based on four key parameters:
- Build Configuration
- Build Workflow
- Build Trigger
- Git Branch

If a new build is triggered with the same values for all these parameters, any previously queued or running build is automatically cancelled.

:::warning Manual Builds Bypass Auto Cancel Redundant Pipeline

Builds that are **manually started** do not affect ongoing or queued builds; the auto-cancel mechanism does not apply to manually started builds.

:::

<Screenshot url='https://cdn.appcircle.io/docs/assets/auto-cancel-redundant-pipeline-canceled-builds-v4.png' />

## Further Automatic Build Subjects

### Trigger Priorities

If you set multiple triggers, certain branch definitions will not take precedence over wildcard definitions. They will all start at the same time. Below is an example:

Assume that you have a branch named `development` with three push triggers.

- Trigger branch: `*` -> Trigger Workflow: Workflow 1
- Trigger branch: `development` -> Trigger Workflow: Workflow 2
- Trigger branch: `develop*` -> Trigger Workflow: Workflow 3

When there is a push or PR for the development branch, all triggers (since the word `development` contains both `*` and `develop*`) will be used to start a different build for each branch. At this point, a total of three build pipelines will begin.

:::info

If multiple triggered builds exceed your plan's concurrency limits, Appcircle will automatically queue them, and all of them will be executed unless you cancel.

:::

### Wildcard Reference

You can specify branch names or tags with an asterisk wildcard to automate builds. Below are some examples:

| Pattern       | Description                                           |
| ------------- | ----------------------------------------------------- |
| `*-fix`       | Build if it ends with `-fix`                          |
| `fix-*`       | Build if it starts with `fix-`                        |
| `*-fix-*`     | Build if it `-fix-` is present anywhere in the name   |
| `fix-*-build` | Build if it starts with `fix-` and ends with `-build` |
| `*`           | Build everything                                      |

## FAQ

### Why is my Appcircle trigger not working and how can I fix it?

First, ensure that the build profile triggers are set for the desired branches and actions. Please check the trigger settings from the [**Managing Triggers for Builds**](/build/build-process-management/build-manually-or-with-triggers#managing-triggers-for-builds) section in the documentation.

Appcircle is triggered via the Git provider's webhooks. To properly work with triggers, webhooks in the repositories are used by Appcircle. Also, ensure that the repository has webhook access to Appcircle. To connect webhooks, the Git provider connection must be set up properly while creating a build profile.

Certain Git actions to the repositories, such as push, merge, pull request, tag push, etc., activate a specified event with the repository's webhooks. It is necessary to ensure that the desired event is actually triggered by the action in the Git provider's repository.

If webhooks are disabled due to frequent use or connection-based errors, using test events may help re-enable webhooks in Git providers.

To ensure webhooks are set and working, the webhook history can be reviewed within the Git providers. Let's check the Git providers below. You can follow the steps in the Git provider's documentation to access the webhook event history.

- [**GitHub Webhook Deliveries**](https://docs.github.com/en/webhooks/testing-and-troubleshooting-webhooks/viewing-webhook-deliveries#about-webhook-deliveries)
- [**GitLab Webhook Request History**](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#view-webhook-request-history)
- [**Azure DevOps Services Webhook History**](https://learn.microsoft.com/en-us/azure/devops/service-hooks/services/webhooks?view=azure-devops)
- [**Bitbucket Webhook Documentations**](https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks)

:::info Bitbucket Webhook Event History

A document detailing the history of webhooks is not provided by Bitbucket. To access the webhook history, please navigate to:

**Bitbucket -> Repository -> Repository Settings -> Webhooks -> View Requests**

View Requests has to be enabled before requests can be seen.

:::

Once the webhook is created and confirmed to be properly set up and healthy in the Appcircle build profile, and it is verified to work correctly with the specific Git provider, the process works as follows:

- A Git action, such as pushing a code block, triggers a webhook event.
- This webhook event activates the trigger in Appcircle.
- Appcircle then automatically starts the build process.

You can also open **External Webhooks** in Appcircle to see the webhook events that Appcircle received, their status, and their payloads. See [External Webhooks](/build/manage-the-connections/reconnect-change-provider#external-webhooks).

### The webhook delivery is successful in my Git provider, but no build starts. Why?

A successful delivery only means Appcircle accepted the request. Check the HTTP response code in the provider's delivery history:

- **204 No Content** (or a 200 with no build) on a manual webhook URL means that no build profile is bound to this webhook. Open the build profile's **Webhooks** dialog and bind the profile, especially for profiles in sub-organizations that reuse a webhook created elsewhere.
- **401 Unauthorized** means the webhook secret doesn't match. Copy the secret from the **Webhooks** dialog again.
- **400 Bad Request** means the webhook URL is unknown or the webhook is no longer active. Copy the URL from the **Webhooks** dialog again.
- **200 OK** usually means the event reached a bound build profile. Check that the trigger's branch, target branch, or tag pattern matches the event. For pull/merge request triggers, compare the source branch, target branch, and action in the payload with the trigger settings.

If everything matches, contact support with the delivery time and payload. Self-hosted customers can also send the build service logs for that time range.

### Why does my tag trigger not start a build?

Appcircle starts a tag build from a commit it already knows. If the tagged commit hasn't reached Appcircle through a push webhook or a repository refresh, the tag event is ignored. Make sure the tagged commit is pushed to a branch and visible in the build profile before you push the tag.

### Why does my tag trigger start a build on a different branch?

When you create a tag, it is applied to a specific commit, not a branch. The system does not have explicit branch information linked to the tag. Therefore, when the tag trigger starts a build in Appcircle, it uses the branch where Appcircle most recently recorded the tagged commit. If the commit exists on more than one branch, this can look random.

To control this behavior, push an empty commit to the desired branch and then apply the tag to this new commit. This ensures that the tag trigger starts from the intended branch.

### Why isn't my scheduled build running at the expected time?

Scheduled builds don't depend on webhooks, so the troubleshooting steps above for event-based triggers don't apply. Instead, check the following:

- **Cron expression**: Confirm the expression matches the schedule you intend. The plain-language summary shown under the Cron Expression field in the Scheduled tab is a quick way to verify this before saving.
- **Time zone**: Double-check the selected time zone — a schedule saved against the wrong offset will run at the correct cron time, just in a different time zone than expected.
- **Branch, config, and workflow**: Make sure the selected branch, build configuration, and workflow are still valid and haven't been renamed, moved, or removed since the schedule was created.

If the schedule and time zone both look correct and the build still doesn't start, check Build History and filter by the **Schedule** trigger type to confirm whether the build ran at all.

### How to enable triggers for AWS CodeCommit repositories?

Appcircle supports AWS CodeCommit triggers through an Amazon SNS topic.

For more information, please refer to: [https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-notify-sns.html](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-notify-sns.html)

After you follow the steps in the referenced document above to create a trigger, you need to create a notification rule under CodeCommit Settings as shown below to add a webhook URL.

<Screenshot url='https://cdn.appcircle.io/docs/assets/codecommit-settings.png' />

Then select the "Enable raw message delivery" option while adding the webhook URL as a subscription to the topic.

<Screenshot url='https://cdn.appcircle.io/docs/assets/enable-raw-message-delivery.png' />

import NeedHelp from '@site/docs/\_need-help.mdx';

<NeedHelp />