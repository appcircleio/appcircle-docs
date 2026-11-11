---
title: Appcircle Claude Assistant
description: Use the Appcircle Claude Plugin to connect Claude to the Appcircle platform with MCP tools and Appcircle-aware skills.
tags: [appcircle ai, claude, assistant]
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Appcircle Claude Assistant

The **Appcircle Claude Plugin** connects Claude to the Appcircle platform, bundling the [Appcircle MCP Server](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp) with Appcircle-aware skills so you can ask Claude about your Appcircle organization or how to use Appcircle.

## How to Use Appcircle Claude Assistant

The plugin registers the [Appcircle MCP Server](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp) and the following Appcircle-aware skills, automatically namespaced under `appcircle`:

| Skill | Purpose |
|-------|---------|
| `appcircle:appcircle-assistant` | Answers Appcircle questions using official sources (`docs.appcircle.io` and `appcircle.io`) |
| `appcircle:build-insights-report` | Renders a visual Build Insights Report (health & trends, root cause, workflow quality, artifact health, queue time, and CI maturity) from the `get_build_insights_report` MCP tool. See [Build Insights](/appcircle-ai/ai-insights/build-insights) for the full metric reference |

Claude Code and claude.ai install the plugin differently, so follow the steps for the surface you use. MCP tools are only available in Claude Code for now; installing the plugin in claude.ai gets you the `appcircle-assistant` skill, not the MCP tools.

### In Claude Code

1. *(Optional, for MCP tools)* Before starting Claude Code, set your [Appcircle Access Token](https://github.com/appcircleio/appcircle-mcp/blob/main/docs/appcircle_access_token.md) in your shell so the MCP server can authenticate:
   ```bash
   export APPCIRCLE_ACCESS_TOKEN=<your-access-token>
   ```
   The MCP server reads this from the process environment, so it must be set before you launch `claude`; exporting it later in an already-running session has no effect until you restart.
2. Add the Appcircle marketplace:
   ```shell
   /plugin marketplace add appcircleio/appcircle-ai-plugins
   ```
3. Install the plugin:
   ```shell
   /plugin install appcircle@appcircle
   ```
4. Reload:
   ```shell
   /reload-plugins
   ```
5. Ask Claude an Appcircle question. For "how do I" or troubleshooting questions, for example "How do I set up automatic code signing for my iOS builds," Claude uses the `appcircle-assistant` skill. For questions about your own organization, for example "List my build profiles," Claude uses the Appcircle MCP tools, which requires step 1.

### Self-Hosted Appcircle in Claude Code

Self-hosted Appcircle installations include their own Appcircle MCP Server at `https://mcp.<your-appcircle-domain>`. The plugin always points to the cloud server, `mcp.appcircle.io`, so register your self-hosted server yourself.

:::info
The Appcircle MCP Server is available on self-hosted Appcircle server 3.31.0 and later.
:::

:::warning
On a self-hosted Appcircle server, don't set `APPCIRCLE_ACCESS_TOKEN`, and remove it from your shell profile if you already set it. The plugin's server reads that variable and would send your self-hosted token to `mcp.appcircle.io`. Keep your self-hosted token in a separate variable, `APPCIRCLE_SELFHOSTED_TOKEN`, so it never reaches the cloud server.
:::

Run the steps below in a terminal: zsh or bash on macOS and Linux, PowerShell on Windows. Select your system once; the tabs below follow it.

1. In your Appcircle dashboard, create a [Personal Access Key](/account/my-organization/security/personal-access-key) and copy it.
2. Exchange the key for an access token on your server. The commands ask for the key without showing it and keep the token in the `APPCIRCLE_SELFHOSTED_TOKEN` variable of this terminal:

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

   The token length should be about 1,000 characters. If it is `0`, the exchange failed: run the request again without saving the result to see the error message. The macOS / Linux commands need `jq`.

   To work in a sub-organization, create the key in the root organization and add `subOrganization=<sub-organization-id>` to the request (in PowerShell, `subOrganization = '<sub-organization-id>'` in `$body`). A token works only in the organization it was issued for. See [Sub-organization scope](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp#authentication).

3. Register your server once:

<Tabs groupId="os">
  <TabItem value="unix" label="macOS / Linux" default>

```bash
claude mcp add --scope user --transport http appcircle-selfhosted https://mcp.<your-appcircle-domain> \
  --header 'Authorization: Bearer ${APPCIRCLE_SELFHOSTED_TOKEN}'
```

  </TabItem>
  <TabItem value="windows" label="Windows (PowerShell)">

```powershell
claude mcp add --scope user --transport http appcircle-selfhosted https://mcp.<your-appcircle-domain> `
  --header 'Authorization: Bearer ${APPCIRCLE_SELFHOSTED_TOKEN}'
```

  </TabItem>
</Tabs>

   Keep the single quotes around the header. Claude Code stores `${APPCIRCLE_SELFHOSTED_TOKEN}` as is and reads the token each time it starts, so you don't need to register again when the token changes.

4. Check the connection from the same terminal:
   ```bash
   claude mcp list
   ```
   `appcircle-selfhosted` should show as connected. The plugin's `appcircle` server still appears and fails to connect because it has no token. You can ignore it.

5. Start Claude Code from the same terminal with `claude`. Claude Code reads the token only when it starts.

:::info Token renewal
The access token is valid for 24 hours. When it expires, repeat step 2 and restart Claude Code. You don't need to register the server again.
:::

:::info Certificates signed by an internal certificate authority
Claude Code trusts the certificate authorities in your operating system's certificate store. If your server's certificate is signed by an internal certificate authority that is not in that store, point `NODE_EXTRA_CA_CERTS` to the CA certificate (PEM) before you start Claude Code, for example `export NODE_EXTRA_CA_CERTS=/path/to/internal-ca.pem` or `$env:NODE_EXTRA_CA_CERTS = 'C:\certs\internal-ca.pem'`.
:::

If `claude mcp list` shows `Invalid or expired access token`, the token is expired or `APPCIRCLE_SELFHOSTED_TOKEN` is empty in this terminal. Repeat step 2 in the terminal you start Claude Code from.

### In claude.ai

You can install this plugin's skills in claude.ai too. MCP tools remain Claude Code-only for now.

1. Click **Customize > Plugins > Add > Add marketplace**.

   <img src="https://cdn.appcircle.io/docs/assets/AI-115-claude-plugin.png" alt="Create plugin, Add marketplace" width="480" style={{display: 'block', margin: 0}} />

2. You will see the following screen.

   <img src="https://cdn.appcircle.io/docs/assets/claude-assistant-2.png" alt="Add marketplace screen" width="480" style={{display: 'block', margin: 0}} />

3. Enter the repository URL: `https://github.com/appcircleio/appcircle-ai-plugins`

   <img src="https://cdn.appcircle.io/docs/assets/AI-115-claude-plugin-2.png" alt="Enter the repository URL" width="480" style={{display: 'block', margin: 0}} />

4. Click **Sync**, then click **+**.

   <img src="https://cdn.appcircle.io/docs/assets/AI-115-claude-plugin-3.png" alt="Click Sync" width="480" style={{display: 'block', margin: 0}} />

5. Ask Claude an Appcircle question, for example *How do I set up automatic code signing for my iOS builds*, and Claude will use the `appcircle-assistant` skill to answer.

To access the source code of this plugin, please use the following link:

https://github.com/appcircleio/appcircle-ai-plugins
