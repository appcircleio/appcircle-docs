---
title: Publish to Huawei AppGallery
description: Publish your Android applications to Huawei AppGallery with Appcircle
tags: [android, android integrations, android publish integrations, huawei appgallery, publish appgallery]
sidebar_position: 2
---

import Screenshot from '@site/src/components/Screenshot';
import ContentRef from '@site/src/components/ContentRef';
import RunnerUsage from '@site/docs/\_publish-steps-runner-usage-caution.mdx';

# Publish to Huawei AppGallery

Appcircle supports sending [APK](https://developer.huawei.com/consumer/en/doc/app/agc-help-releaseapkrpk-0000001106463276) and [AAB](https://developer.huawei.com/consumer/en/doc/app/agc-help-releasebundle-0000001100316672) binaries to [Huawei AppGallery](https://appgallery.huawei.com/) through the Publish module.

<RunnerUsage />

### Prerequisites

Before uploading a binary to the store, please make sure that an application listing is created in Huawei AppGallery Connect and the initial binary is manually uploaded with the same keystore and the application ID. Otherwise, the store upload process will fail.

You also need to have an AppGallery Connect API and its key as a JSON file. Please refer to the following document for more information on creating your API key.

<ContentRef url="/account/my-organization/security/credentials/adding-huawei-api-key">
  Adding Huawei AppGallery API Key
</ContentRef>

After completing the integration with Huawei AppGallery API Key, open the [Publishing Settings](/publish-to-stores-module/publish-settings) of your publish profile by selecting **Settings** from the **...** menu next to the profile name. In the [`Store Credential`](/publish-to-stores-module/publish-settings#store-credentials) section, select the Huawei AppGallery API Key you uploaded, from the drop-down list.

If you are using [Publish Variables](/publish-to-stores-module/publish-settings#publish-variables), you should select them in the [Publishing Settings](/publish-to-stores-module/publish-settings) window.

## Input Variables

The parameters required for this step to work as expected are listed below:

<Screenshot url='https://cdn.appcircle.io/docs/assets/android-publishflow-publish-huawei-appgallery-1_v2.png'/>

| Variable Name       | Description                                                                                                                                                                                                                                  | Status    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `$AC_HUAWEI_APP_ID` | It is required to publish the app to Huawei AppGallery. You can find the App ID on the [Huawei Developer Console](https://developer.huawei.com/consumer/en/console) by navigating to `App Services` > `AppGallery Connect` > `My Apps` > `your app` > `App Information`. | Required  |
| `$AC_RELEASE_NOTES` | Provides release notes for the submission to Huawei AppGallery. | Optional  |

## Output Variables

**Publish to Huawei AppGallery** step does not produce any output. However, you can check the logs to see whether your app has successfully accessed Huawei AppGallery.

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-publish-send-to-appgallery.git


## FAQ

### App is not visible on Huawei AppGallery after a successful publish

**Question**:

Publishing to Huawei AppGallery completes successfully on Appcircle, but the app does not appear on the Huawei Store. The same build is visible on Google Play without any issues. Why does this happen?

**Answer**:

This issue can occur if there is a previous rollout on Huawei AppGallery that has not been completed or canceled.
We observed that when an incomplete or ongoing rollout exists, Huawei AppGallery may block the new upload even though Appcircle reports the publish step as successful.

**Solution**:

- Cancel the previous incomplete rollout on Huawei AppGallery.
- After canceling the old rollout, you will see that the app you previously submitted has been successfully installed.


### Cannot obtain upload URL (403)

**Error**

```
Cannot obtain upload URL, please check API Token / Permissions (status code: 403)
```

**Possible Causes & Solutions**

If you encounter this error during the **Send to Huawei AppGallery** step in **Appcircle**, please verify the following points:

#### 1. Check API Client Permissions

Ensure that the **AppGallery API Client** has **at least the following permissions enabled**:

- **Development**
- **Operations**

Missing or insufficient permissions will result in a `403 Forbidden` response when requesting the upload URL.

#### 2. Verify the API Key Used in Appcircle

Make sure that the **correct AppGallery API Key** is configured in Appcircle.

**Recommendation:**
Delete the existing AppGallery API Key in Appcircle and re-add the intended one to eliminate any misconfiguration.

:::info

Unlike Google Play Console, **Huawei AppGallery** allows downloading the same API Client JSON file multiple times. Re-downloading the JSON does not invalidate previous downloads.

:::

#### 3. Confirm Huawei App ID Configuration

Ensure that the **Huawei App ID** is correctly entered in the **Send to Huawei AppGallery** step configuration in Appcircle.

An incorrect or missing App ID will prevent Appcircle from obtaining the upload URL.

#### 4. Restart the Workflow

After making any changes (API Key, permissions, App ID):

* Use the **Restart Flow** button in Appcircle.
* Then rerun the **Send to Huawei AppGallery** step.

This ensures that all recent configuration updates are properly applied.

### Upload fails with Net::ReadTimeout

**Error**

The step log shows `Uploading app`, and the step then fails with an error similar to the following:

```text
Net::ReadTimeout with #<TCPSocket:(closed)> (Net::ReadTimeout)
```

**Cause**

The step sends the binary to Huawei AppGallery and waits for an answer. By default, it waits 60 seconds. Behind a slow proxy, or a proxy that inspects TLS traffic, Huawei AppGallery can answer many minutes after it receives the binary. The step stops waiting and fails, although the upload can succeed with a longer wait.

**Solution**

Increase the wait time with the `AC_HUAWEI_HTTP_TIMEOUT_SECONDS` variable:

1. On the **Publish variables** page, add `AC_HUAWEI_HTTP_TIMEOUT_SECONDS` to a variable group. Use a whole number of seconds from `1` to `86400`, for example `1800`.
2. In the **Settings** of the publish profile, select this group under **Publish variables**.
3. Run the **Send to Huawei AppGallery** step again. The step log shows the value that the step uses:

```text
Huawei AppGallery HTTP read/write timeout set to 1800 s (AC_HUAWEI_HTTP_TIMEOUT_SECONDS).
```

If you do not set the variable, the step uses the default of 60 seconds. If the value is not a whole number from `1` to `86400`, the step logs a warning and uses the default.

For more information on variable groups, see [Publish Variables](/publish-to-stores-module/publish-settings#publish-variables).

:::caution

When an upload times out, the step sends the binary one more time. A failed upload therefore takes about twice the value that you set. Make sure that the [Build Time Limit](/account/my-organization/billing) of your plan, which also applies to publish, is longer than twice the value. For example, with `1800`, the limit must be more than 60 minutes.

:::

:::info Self-hosted runners behind a proxy

The Huawei AppGallery requests of this step read the proxy address from the `http_proxy` environment variable, also for HTTPS addresses. If your runner connects through a proxy, set `http_proxy` on the runner, not only `https_proxy`.

:::

---

If the problem persists after completing all steps, please contact support with your pipeline details and error logs.

