---
title: Appcircle MCP Authentication
description: Exchange a Personal Access Key or API Key for an Appcircle Access Token to use the Appcircle MCP Server on Appcircle cloud or a self-hosted Appcircle server.
tags: [appcircle mcp, mcp server, authentication, self-hosted]
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Appcircle MCP Authentication

The Appcircle MCP Server needs an **Appcircle Access Token**. You get it by exchanging one of these credentials with Appcircle's Auth API:

- [Personal Access Key](/account/my-organization/security/personal-access-key): best for individual use. The token has your user permissions in the organization.
- [API Key](/account/my-organization/security/api-keys): best for automation and CI. The token has the roles you select for the key.

The exchange returns a JWT. This JWT, not the key or secret itself, is the access token you give the MCP server. The server never sees your Personal Access Key or API Key secret.

## Exchange a Personal Access Key

Create a [Personal Access Key](/account/my-organization/security/personal-access-key), then exchange it in a terminal: zsh or bash on macOS and Linux, PowerShell on Windows. The commands ask for the key without showing it and keep the token in an environment variable of this terminal. Select your system once; the tabs below follow it.

### Appcircle Cloud

<Tabs groupId="os">
  <TabItem value="unix" label="macOS / Linux" default>

```bash
read -rs PAK
export APPCIRCLE_ACCESS_TOKEN=$(curl -s -X POST https://auth.appcircle.io/auth/v3/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "personalAccessKey=$PAK" | jq -r '.access_token // empty')
unset PAK
echo "token length: ${#APPCIRCLE_ACCESS_TOKEN}"
```

  </TabItem>
  <TabItem value="windows" label="Windows (PowerShell)">

```powershell
$key = Read-Host 'Personal Access Key' -AsSecureString
$body = @{ personalAccessKey = [System.Net.NetworkCredential]::new('', $key).Password }
$response = Invoke-RestMethod -Method Post `
  -Uri 'https://auth.appcircle.io/auth/v3/token' `
  -ContentType 'application/x-www-form-urlencoded' -Body $body
$env:APPCIRCLE_ACCESS_TOKEN = $response.access_token
Remove-Variable key, body, response
"token length: $($env:APPCIRCLE_ACCESS_TOKEN.Length)"
```

  </TabItem>
</Tabs>

### Self-Hosted Appcircle

The Appcircle MCP Server is available on self-hosted Appcircle server 3.31.0 and later.

:::warning
On a self-hosted Appcircle server, keep the token in `APPCIRCLE_SELFHOSTED_TOKEN` and don't set `APPCIRCLE_ACCESS_TOKEN`. Clients and plugins configured for Appcircle Cloud read `APPCIRCLE_ACCESS_TOKEN` and would send your self-hosted token to `mcp.appcircle.io`.
:::

<Tabs groupId="os">
  <TabItem value="unix" label="macOS / Linux" default>

```bash
read -rs PAK
export APPCIRCLE_SELFHOSTED_TOKEN=$(curl -s -X POST https://auth.<your-appcircle-domain>/auth/v3/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "personalAccessKey=$PAK" | jq -r '.access_token // empty')
unset PAK
echo "token length: ${#APPCIRCLE_SELFHOSTED_TOKEN}"
```

  </TabItem>
  <TabItem value="windows" label="Windows (PowerShell)">

```powershell
$key = Read-Host 'Personal Access Key' -AsSecureString
$body = @{ personalAccessKey = [System.Net.NetworkCredential]::new('', $key).Password }
$response = Invoke-RestMethod -Method Post `
  -Uri 'https://auth.<your-appcircle-domain>/auth/v3/token' `
  -ContentType 'application/x-www-form-urlencoded' -Body $body
$env:APPCIRCLE_SELFHOSTED_TOKEN = $response.access_token
Remove-Variable key, body, response
"token length: $($env:APPCIRCLE_SELFHOSTED_TOKEN.Length)"
```

  </TabItem>
</Tabs>

### Check the Token

The token length should be about 1,000 characters. If it is `0`, the exchange failed: run the request again without saving the result to see the error message. The macOS / Linux commands need `jq`.

## Exchange an API Key

Create an [API Key](/account/my-organization/security/api-keys) and exchange its name, secret, and organization ID with the script in [Using API Keys to Retrieve Access Tokens](/account/my-organization/security/api-keys#using-api-keys-to-retrieve-access-tokens). On a self-hosted Appcircle server, replace `auth.appcircle.io` in the script with `auth.<your-appcircle-domain>`.

## Sub-Organizations

An access token works in one organization: the one it was issued for. Profiles, builds, signing, distribution and publish tools only see that organization. Reports from a root-organization token also include its sub-organizations.

To work in a sub-organization, use one of these:

- **A Personal Access Key created in the root organization**, exchanged with the sub-organization ID in a header: add `-H 'Sub-Organization-Id: <sub-organization-id>'` to the `curl` command, or `-Headers @{ 'Sub-Organization-Id' = '<sub-organization-id>' }` to `Invoke-RestMethod`. This also works for users who reach the sub-organization through the root organization and can't create a key there.
- **A key created in the sub-organization.**

## Use the Token

How you give the token to the MCP server depends on how you connect:

- **Remote server or streamable-http:** the client sends the token in the `Authorization: Bearer <token>` header with each request.
- **stdio:** set `APPCIRCLE_ACCESS_TOKEN` in the environment of the process that runs the server.

See the [Installation Guides](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/installation-guides) for the setup of each client.

## Renew the Token

The access token is valid for **24 hours**, and the MCP server doesn't refresh it. When it expires, requests fail with `401 Unauthorized`. To renew it:

1. Repeat the exchange with the same key. Personal Access Keys are valid for 1 year, and API Keys until the expiry date you set for them.
2. Update the token wherever your client reads it.
3. Restart your MCP client or server so it picks up the new token.

## Restrict Write Access

If you only need to read data, such as listing build profiles, distribution profiles or reports, use a token without write access. Grant write access only when you want the AI or your client to trigger builds, notify testers, publish to stores, or change settings.

- **API Key:** select **Viewer** or read-only roles for the relevant modules.
- **Personal Access Key:** your user role in the organization applies. Use an account with read-only access if you don't need write operations.
