---
title: Enterprise App Store Activity Log
sidebar_label: Activity Log
description: Learn more about Enterprise App Store Activity Log in Appcircle.
tags:
 [
  enterprise app store,
  binaries,
  activity log,
 ]
sidebar_position: 9
---
import Screenshot from '@site/src/components/Screenshot';

# Enterprise App Store Activity Log

You can view Enterprise App Store module actions such as profile, app version, and custom domain operations, along with LDAP and SSO settings changes, within the Organizations or Sub-Organizations in the Activity Log section.

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-4_v2.png' />

:::caution
Only Organization / Sub-Organization Owners and users with Organization Management Role will have access to this area.

Information about other Organizations and their Sub-Organizations will not be accessible without the required level of clearance.
:::

:::info
Organization Owners can also observe the actions of their Sub-Organizations.
:::

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-5_v2.png' />

The default date range is the last 7 days. To change it, select the date chip next to **Filter** and choose another range, or select **Custom range** to pick dates from the calendar.

Another method to search is by **Actions**. Select **Filter**, then **Actions**, and choose a specific action to refine your search.

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-6_v2.png' />

Here is the full list of actions that can be monitored:

- Profile Created
- Profile Settings Updated
- Profile Deleted
- App Version Added
- App Version Uploaded
- App Version Deleted
- App Version Published
- App Version Unpublished
- Auto Re-sign Settings Updated
- Custom Domain Added
- Custom Domain Disabled
- In-App Update Secret Created
- In-App Update Secret Revoked
- LDAP Disabled
- LDAP Enabled
- LDAP Settings Created
- LDAP Settings Updated
- LDAP Settings Deleted
- SSO Enabled
- SSO Disabled
- SSO Setting Created
- SSO Setting Updated
- SSO Setting Deleted
- Single Session Enabled
- Single Session Disabled
- Store Customization Updated
- Store Settings Updated
- Store URL Updated
- Two-Factor Authentication Setting Updated

:::tip
This report page supports CSV export. Click the Export button in the top-right corner of the screen to download the data.
:::