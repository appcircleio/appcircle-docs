---
title: Connect Claude to Appcircle MCP
description: Connect Claude Code and Claude Desktop to the Appcircle MCP Server on Appcircle cloud or a self-hosted Appcircle server.
tags: [appcircle mcp, mcp server, claude, self-hosted]
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Connect Claude to Appcircle MCP

Connect Claude Code or Claude Desktop to the Appcircle MCP Server on Appcircle Cloud or on your self-hosted Appcircle server.

:::info
claude.ai doesn't currently support the Appcircle MCP Server.
:::

Each setup needs an Appcircle Access Token. See [Appcircle MCP Authentication](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication) to get one.

## Claude Code

Run the steps below in a terminal: zsh or bash on macOS and Linux, PowerShell on Windows. Select your system once; the tabs below follow it.

### Appcircle Cloud in Claude Code

:::info
If you installed the [Appcircle Claude Plugin](/appcircle-ai/ai-assistants/appcircle-claude-assistant), it already registers this server. Skip these steps.
:::

1. Get an access token in the `APPCIRCLE_ACCESS_TOKEN` variable of this terminal. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#appcircle-cloud).
2. Register the server once:

<Tabs groupId="os">
  <TabItem value="unix" label="macOS / Linux" default>

```bash
claude mcp add --scope user --transport http appcircle https://mcp.appcircle.io \
  --header 'Authorization: Bearer ${APPCIRCLE_ACCESS_TOKEN}'
```

  </TabItem>
  <TabItem value="windows" label="Windows (PowerShell)">

```powershell
claude mcp add --scope user --transport http appcircle https://mcp.appcircle.io `
  --header 'Authorization: Bearer ${APPCIRCLE_ACCESS_TOKEN}'
```

  </TabItem>
</Tabs>

   Keep the single quotes around the header. Claude Code stores `${APPCIRCLE_ACCESS_TOKEN}` as is and reads the token each time it starts, so you don't need to register again when the token changes.

3. Check the connection from the same terminal with `claude mcp list`. `appcircle` should show as connected.
4. Start Claude Code from the same terminal with `claude`. Claude Code reads the token only when it starts.

### Self-Hosted Appcircle in Claude Code

The plugin always points to the cloud server, so register your self-hosted server yourself.

:::warning
On a self-hosted Appcircle server, don't set `APPCIRCLE_ACCESS_TOKEN`, and remove it from your shell profile if you already set it. The plugin's server reads that variable and would send your self-hosted token to `mcp.appcircle.io`. Keep your self-hosted token in `APPCIRCLE_SELFHOSTED_TOKEN`.
:::

1. Get an access token in the `APPCIRCLE_SELFHOSTED_TOKEN` variable of this terminal. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#self-hosted-appcircle).
2. Register your server once:

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

3. Check the connection from the same terminal with `claude mcp list`. `appcircle-selfhosted` should show as connected. If you installed the plugin, its `appcircle` server still appears and fails to connect because it has no token. You can ignore it.
4. Start Claude Code from the same terminal with `claude`. Claude Code reads the token only when it starts.

:::info Certificates signed by an internal certificate authority
Claude Code trusts the certificate authorities in your operating system's certificate store. If your server's certificate is signed by an internal certificate authority that is not in that store, point `NODE_EXTRA_CA_CERTS` to the CA certificate (PEM) before you start Claude Code, for example `export NODE_EXTRA_CA_CERTS=/path/to/internal-ca.pem` or `$env:NODE_EXTRA_CA_CERTS = 'C:\certs\internal-ca.pem'`.
:::

:::info Token renewal
The access token is valid for 24 hours. When it expires, repeat step 1 and restart Claude Code. You don't need to register the server again.
:::

## Claude Desktop

Claude Desktop connects through [`mcp-remote`](https://www.npmjs.com/package/mcp-remote), which `npx` downloads and runs. Install [Node.js](https://nodejs.org/) first.

In the configs below, the token goes in `env` and the header reads it as `${AUTH_HEADER}`, without a space after `Authorization:`. Claude Desktop on Windows doesn't escape spaces inside `args`, so a header written as `"Authorization: Bearer <token>"` breaks there.

### Appcircle Cloud in Claude Desktop

1. Get an access token. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#appcircle-cloud).
2. Open the config file from **Claude Desktop > Settings > Developer > Edit Config**.
3. Add the server under `mcpServers`, replacing `<your-access-token>` with your token:
   ```json
   {
     "mcpServers": {
       "appcircle": {
         "command": "npx",
         "args": [
           "-y",
           "mcp-remote",
           "https://mcp.appcircle.io",
           "--header",
           "Authorization:${AUTH_HEADER}"
         ],
         "env": {
           "AUTH_HEADER": "Bearer <your-access-token>"
         }
       }
     }
   }
   ```
4. Quit and reopen Claude Desktop, then check that the Appcircle tools appear.

### Self-Hosted Appcircle in Claude Desktop

1. Get an access token. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#self-hosted-appcircle).
2. Open the config file from **Claude Desktop > Settings > Developer > Edit Config**.
3. Add your server under `mcpServers`, replacing `<your-access-token>` with your token:
   ```json
   {
     "mcpServers": {
       "appcircle-selfhosted": {
         "command": "npx",
         "args": [
           "-y",
           "mcp-remote",
           "https://mcp.<your-appcircle-domain>",
           "--header",
           "Authorization:${AUTH_HEADER}"
         ],
         "env": {
           "AUTH_HEADER": "Bearer <your-access-token>"
         }
       }
     }
   }
   ```
   If your server's certificate is signed by an internal certificate authority, add the path to the CA certificate (PEM) to `env`, for example `"NODE_EXTRA_CA_CERTS": "/path/to/internal-ca.pem"` on macOS or `"NODE_EXTRA_CA_CERTS": "C:\\certs\\internal-ca.pem"` on Windows. On Windows, double each backslash; a single one makes the config invalid JSON.
4. Quit and reopen Claude Desktop, then check that the Appcircle tools appear.

:::info Token renewal
The token is written into the config file, so Claude Desktop doesn't pick up a new one by itself. When the token expires after 24 hours, repeat step 1, replace the token in `AUTH_HEADER`, and quit and reopen Claude Desktop.
:::

## Troubleshooting

- **`401 Unauthorized` or `Invalid or expired access token`:** the token is expired, empty, or a key instead of an access token. In Claude Code, check that the token variable is set in the terminal you start `claude` from. See [Renew the Token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#renew-the-token).
- **Server status in Claude Code:** run `claude mcp list` in the terminal, or `/mcp` inside Claude Code.
- **Server doesn't appear in Claude Desktop:** check that the config is valid JSON, then quit and reopen Claude Desktop. For details, turn on **Debug mode** in **Settings > Developer** and open the logs from **Developer > View logs**.
