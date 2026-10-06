---
title: Testing Distribution Activity Log
sidebar_label: Activity Log
description: Learn more about Testing Distribution Activity Log in Appcircle.
tags:
  [
    distribution,
    testing distribution,
    binaries,
    activity log,
  ]
sidebar_position: 6
---
import Screenshot from '@site/src/components/Screenshot';

# Testing Distribution Activity Log

You can view Testing Distribution module actions such as profile, app version, and testing group operations, along with LDAP and SSO settings changes, within the Organizations or Sub-Organizations in the Activity Log section.

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-7_v2.png' />

:::caution
Only Organization / Sub-Organization Owners and users with Organization Management Role will have access to this area.

Information about other Organizations and their Sub-Organizations will not be accessible without the required level of clearance.
:::

:::info
Organization Owners can also observe the actions of their Sub-Organizations.
:::

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-2_v2.png' />

The default date range is the last 7 days. To change it, select the date chip next to **Filter** and choose another range, or select **Custom range** to pick dates from the calendar.

Another method to search is by **Actions**. Select **Filter**, then **Actions**, and choose a specific action to refine your search.

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-3_v2.png' />

Here is the full list of actions that can be monitored:

- App Version Added
- App Version Uploaded
- App Version Updated
- App Version Deleted
- Profile Created
- Profile Deleted
- Profile Settings Updated
- App Version Sent To Testers
- Auto Re-sign Settings Updated
- LDAP Group Mapping Created
- LDAP Group Mapping Removed
- LDAP Setting Created
- LDAP Setting Updated
- LDAP Setting Deleted
- SSO Attribute Updated
- SSO Setting Created
- SSO Setting Updated
- SSO Setting Deleted
- Tester Added to the Group
- Tester Group Added
- Tester Group Deleted
- Tester Group Renamed
- Tester Removed from the Group
- Two-Factor Authentication Setting Updated

:::tip
This report page supports CSV export. Click the Export button in the top-right corner of the screen to download the data.
:::