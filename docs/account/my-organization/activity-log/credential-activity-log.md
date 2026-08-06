---
title: Credential Activity
description: Learn how to use Credential Activity Log to track your store credentials in Appcircle.
tags: [account, my organization, store credentials, activity log]
sidebar_position: 3
---

import Screenshot from '@site/src/components/Screenshot';

# Credential Activity Log

The Credential Activity Log provides visibility into all store credential operations performed within your organization. It helps Organization Owners and authorized members monitor credential-related activities, including credential creation, updates, deletion, sharing, and permission changes.

You can access the Credential Activity Log by navigating to **My Organization > Credential Activity Log**.

:::info
Organization Owners can also monitor credential activities performed within their Sub-Organizations.
:::

:::caution
Only **Organization Owners**, **Sub-Organization Owners**, and users with the **Organization Management Role** can access the Credential Activity Log.
Information from organizations or sub-organizations that you do not have permission to access will not be displayed.
:::


## Overview

Each activity record contains detailed information about the credential operation, including:

- Organization
- Credential Name
- Store Type
- User Email
- User Role
- Action
- Description
- Date and Time

These records provide an audit trail of credential management activities across your organization.

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-1.png' />

## Filtering Activity Records

You can filter activity records to quickly locate specific events.

Available filters include:

- **Date:** Display activities within a selected time range.
- **Action:** Filter records by credential activity type.
- **Email:** Filter records by the user email.
- **Credential Name:** Filter records by the name of the credential.
- **Organization:** Filter records by their organization.

Multiple filters can be applied simultaneously to narrow down the displayed results.

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-8.png' />

## Tracked Actions

The Credential Activity Log records the following actions:

| Action | Description                                                         |
| ------- |---------------------------------------------------------------------|
| Credential Created | A new store credential was created.                                 |
| Credential Updated | An existing credential was modified.                                |
| Credential Deleted | A credential was removed from the organization.                     |
| Credential Shared with Sub Organization | A credential was shared with a Sub-Organization.                    |
| Credential Unshared from Sub Organization | A previously shared credential was removed from a Sub-Organization. |

<Screenshot url='https://cdn.appcircle.io/docs/assets/QA84-9.png' />