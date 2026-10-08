---
title: Apple Identifiers
description: Learn how to manage iOS identifiers in Appcircle
tags: [signing identities, ios certificates, provisioning profiles, identifiers]
sidebar_position: 2
---

import Screenshot from '@site/src/components/Screenshot';

# Apple Identifiers Overview

The first requirement for publishing an application on the Apple App Store is to determine the unique identifier that identifies your application. For this reason, you must first register a BundleID. For more information, please refer to the [**Apple Documentation**](https://developer.apple.com/documentation/appstoreconnectapi/bundle_ids).

With the **Apple Identifiers** option in Appcircle's Signing Identities module, you can easily register a BundleID on the Apple Developer Portal or list your existing BundleIDs on Appcircle.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE3953-appleIdentifer_v2.png' />

## Register Bundle Identifier

With the **Register Bundle Identifier** option, you can register a new BundleID on the Apple Developer portal using Appcircle.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE3953-registerBundle1_v2.png' />

You can specify the BundleID you wish to save, provide a description to identify this identifier, and select the capabilities you want it to have. Once you click the Save button, Appcircle will store this BundleID in your Apple Developer account.

:::info Register Bundle Identifier

When you register a BundleID, it will be created simultaneously in your Apple Developer account.

:::

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE3953-registerDetails_v2.png' />

- **Description**: A brief explanation to distinguish BundleID.
- **BundleID**: BundleID value to be saved.
- **Capabilities**: The capability values you want BundleID to have.

## Get Bundle Identifiers from Apple Developer

In this option, all currently registered BundleIDs are listed. 

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE3953-getBundle1_v2.png' />

You can list your registered BundleIDs on Appcircle by making selections from this list.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE3953-getBundleList_v2.png' />

After the registration process is completed, the selected or registered BundleIDs will be listed as follows.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE3953-registerListv2.png' alt='Registered bundle IDs listed under Apple identifiers' />

## Edit BundleID

Open the **...** menu of the BundleID under the Actions column and select **Edit** to edit your existing BundleID content.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE3953-editBundlev2.png' alt='Edit action in the Apple identifiers actions menu' />

:::info Edit Bundle

The changes you make here will be modified **simultaneously** and saved in your Apple Developer account.

:::

In the **Edit** panel, you can see all the capabilities the BundleID has, add or remove them if you wish, and click **Save**.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE3953-editModalv2.png' alt='Edit panel of an Apple identifier with its capabilities' />

## Delete BundleID

To delete a BundleID, click the ... button and select the **Delete** option.

:::info

BundleIDs deleted on **Appcircle** will only be removed from **Appcircle** and will not affect those on **Apple Developer** account.

:::

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5651-Apple-Identifiers-Delete-Annotatedv2.png' alt='Delete action in the Apple identifiers actions menu' />
