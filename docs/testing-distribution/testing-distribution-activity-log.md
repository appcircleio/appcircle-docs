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

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-7.png' />

:::caution
Only Organization / Sub-Organization Owners and users with Organization Management Role will have access to this area.

Information about other Organizations and their Sub-Organizations will not be accessible without the required level of clearance.
:::

:::info
Organization Owners can also observe the actions of their Sub-Organizations.
:::

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-2.png' />

You can edit the required date range by clicking the time filter in the top filter header as the default search time option is the last 7 days. Alternatively, you can choose custom dates from the calendar by selecting the 'In Between' option.

Another method to search is by **Actions**. Simply click the filter option and select **Actions**. Then you can choose a specific action to refine your search.

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-3.png' />

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