---
title: Enterprise Portal LDAP Authentication
description: Learn how to set up and manage LDAP login integration for the Enterprise Portal of your organization in Appcircle
tags: [account, my organization, ldap login, distribution, distribution profile, authentication, 2FA]
sidebar_position: 6
---

import Screenshot from '@site/src/components/Screenshot';

# Enterprise Portal LDAP Settings

This document serves as a helpful guide for setting up and managing LDAP (Lightweight Directory Access Protocol) login integration within our organizational system.
Whether you're new to LDAP or looking to streamline your authentication process, this document provides step-by-step instructions to ensure a smooth setup and management experience.

To get started, go to **Organization** > **Security** and select **Enterprise Portal LDAP login** under **Authentication** to open its side panel.
From there, you'll be guided through the process of creating LDAP configurations, including filling in the necessary details and enabling Two Factor Authentication (2FA) for added security.

:::note
**Cloud** Appcircle supports **only email** 2FA method, while the self-hosted Appcircle installation using **Docker/Podman** supports both **email** and **SMS** 2FA methods.

Similar to the cloud, the self-hosted Appcircle installation using the **Helm chart** also **does not support SMS** 2FA method for now.
:::

:::info
The SMS 2FA method on Docker/Podman-based self-hosted Appcircle requires a custom integration with your SMS service. Please [contact us](https://appcircle.io/contact) for further details.
:::

Once set up, LDAP Login allows you to control access to distributed links and adjust distribution authorization through the Distribution Profiles.
This means you can tailor access permissions according to your organization's specific needs.

If you ever need to remove LDAP Login integration, the document also provides clear instructions for doing so, ensuring that your system remains secure and up-to-date.

To start, go to [Organization](/account/my-organization) > **Security**. Under **Authentication**, select **Enterprise Portal LDAP login** to open its side panel.

<Screenshot url='https://cdn.appcircle.io/docs/assets/store-ldap-add-new_v2.png' />

- The **Manage Enterprise Portal LDAP Login** side panel opens. Click the **Create New Authentication** button.

- The **Create New Authentication** window will open, presenting two options:
    - **Create New Authentication**
    - **Create From Existing Authentication**
You can create a new configuration or create one from an existing configuration. Click on the **Create New Authentication** section to create new configuration.
Please refer the [**Create From Existing LDAP Configuration**](/account/my-organization/security/authentications/store-ldap-authentication#create-from-existing-ldap-configuration).

<Screenshot url='https://cdn.appcircle.io/docs/assets/store-ldap-create-options_v2.png' />

- Fill in the details of your LDAP Configurations

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5679-ldap4_v2.png' />

- Once a configuration is created, select **Enterprise Portal LDAP login** again to manage it in the side panel.

<Screenshot url='https://cdn.appcircle.io/docs/assets/store-ldap-login4_v2.png' />

- To access the LDAP integration settings, select **Enterprise Portal LDAP login** under **Authentication** to open its side panel. Then, click **Manage Authentication** button and select the "Edit" button of the existing LDAP provider.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login-configuration-edit_v2.png' />

- The "Order" field in your LDAP configuration determines the priority or sequence in which providers are utilized when conducting a user lookup.
  Providers are entities responsible for retrieving user information from LDAP servers.
  Specifying the order allows you to prioritize certain providers over others, ensuring efficient user lookup operations.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5679-ldap5_v2.png' />

:::info

Provider A: Order: 1

Provider B: Order: 2

In this example, when conducting a user lookup, Appcircle will first attempt to retrieve information from "Provider A" before falling back to "Provider B".

:::

- The "Connection Pooling" option in your LDAP configuration determines whether Appcircle should utilize connection pooling for accessing the LDAP server.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login-connection-pooling_v2.png' />

- To enable Two Factor Authentication, open the **Enterprise Portal LDAP login** side panel and select the verification method.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login5_v2.png' />

- To change the distribution authorization go to Distribution Profiles screen and press the your distribution profile click **Settings** button and under the Authentication tab you should see LDAP Login. Convert **LDAP Login** to on.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login6_v2.png' />

- After this step, it will be necessary to log in from the LDAP Login screen to access the distributed links.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login7.png' />

- You must verify according to the method you have chosen.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login8.png' />

- If the login is successful, a screen similar to the one below will appear.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login9.png' />

## Create From Existing LDAP Configuration

  Appcircle allows you to create a new SSO configuration based on an existing one, ensuring a smooth and efficient setup experience. 
 
- Go to **Organization** > **Security** and find the **Authentication** section.
- Select **Enterprise Portal LDAP login** to open its side panel.

<Screenshot url='https://cdn.appcircle.io/docs/assets/distribute-ldap-manage-button_v2.png' /> 

- Select the **Create New Authentication** and then select the **Create From Existing Configuration**.

Existing LDAP configurations will be listed on the screen. Select one, and click on **Next** to proceed.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-create-from-existing_v2.png' /> 

- On the Create LDAP Configuration screen, fill in the **Name** and **Credential** fields (all other values are prefilled). Customize as needed, then click **Save**.

<Screenshot url='https://cdn.appcircle.io/docs/assets/BE5679-ldap4_v2.png' />

:::info
The LDAP authentication configuration for Enterprise Portal can be enabled or disabled by clicking the “Activate LDAP” toggle.
:::

## Deleting LDAP Login

- To delete, go to [Organization](/account/my-organization) > **Security** and select **Enterprise Portal LDAP login** under **Authentication** to open its side panel.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login10_v2.png' />

- Click the Remove button.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login11_v2.png' />

- Type the alias’s name to confirm deletion and click the Delete button.

<Screenshot url='https://cdn.appcircle.io/docs/assets/ldap-login12_v2.png' />
