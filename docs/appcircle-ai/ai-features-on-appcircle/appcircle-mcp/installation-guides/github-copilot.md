---
title: Connect GitHub Copilot to Appcircle MCP
description: Connect GitHub Copilot in VS Code and Copilot CLI to the Appcircle MCP Server on Appcircle cloud or a self-hosted Appcircle server.
tags: [appcircle mcp, mcp server, github copilot, copilot cli, self-hosted]
sidebar_position: 3
---

# Connect GitHub Copilot to Appcircle MCP

Connect GitHub Copilot CLI or GitHub Copilot in VS Code to the Appcircle MCP Server on Appcircle Cloud or on your self-hosted Appcircle server.

Each setup needs an Appcircle Access Token. See [Appcircle MCP Authentication](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication) to get one.

## GitHub Copilot CLI

Copilot CLI reads MCP servers from `~/.copilot/mcp-config.json` (`%USERPROFILE%\.copilot\mcp-config.json` on Windows). The configs below don't contain the token: Copilot CLI fills in `${...}` from the environment each time it starts, so you don't need to edit the file when the token changes.

### Appcircle Cloud in Copilot CLI

:::info
If you installed the [Appcircle Copilot Plugin](/appcircle-ai/ai-assistants/appcircle-copilot-assistant), it already registers this server. Skip these steps.
:::

1. Get an access token in the `APPCIRCLE_ACCESS_TOKEN` variable of a terminal. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#appcircle-cloud).
2. Add the server under `mcpServers` in `mcp-config.json`:
   ```json
   {
     "mcpServers": {
       "appcircle": {
         "type": "http",
         "url": "https://mcp.appcircle.io",
         "headers": {
           "Authorization": "Bearer ${APPCIRCLE_ACCESS_TOKEN}"
         }
       }
     }
   }
   ```
3. Start Copilot CLI from the same terminal with `copilot`, then run `/mcp show`. `appcircle` should appear in the list.

### Self-Hosted Appcircle in Copilot CLI

:::warning
On a self-hosted Appcircle server, don't set `APPCIRCLE_ACCESS_TOKEN`, and remove it from your shell profile if you already set it. The plugin's server reads that variable and would send your self-hosted token to `mcp.appcircle.io`. Keep your self-hosted token in `APPCIRCLE_SELFHOSTED_TOKEN`.
:::

1. Get an access token in the `APPCIRCLE_SELFHOSTED_TOKEN` variable of a terminal. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#self-hosted-appcircle).
2. If you installed the plugin, disable its server, which always points to the cloud server:
   ```bash
   copilot mcp disable appcircle
   ```
3. Add your server under `mcpServers` in `mcp-config.json`:
   ```json
   {
     "mcpServers": {
       "appcircle-selfhosted": {
         "type": "http",
         "url": "https://mcp.<your-appcircle-domain>",
         "headers": {
           "Authorization": "Bearer ${APPCIRCLE_SELFHOSTED_TOKEN}"
         }
       }
     }
   }
   ```
4. Start Copilot CLI from the same terminal with `copilot`, then run `/mcp show`. `appcircle-selfhosted` should appear in the list.

:::info Certificates signed by an internal certificate authority
Copilot CLI trusts the certificate authorities in your operating system's certificate store. If your server's certificate is signed by an internal certificate authority that is not in that store, point `NODE_EXTRA_CA_CERTS` to the CA certificate (PEM) before you start Copilot CLI, for example `export NODE_EXTRA_CA_CERTS=/path/to/internal-ca.pem` or `$env:NODE_EXTRA_CA_CERTS = 'C:\certs\internal-ca.pem'`.
:::

:::info Token renewal
The access token is valid for 24 hours. When it expires, repeat step 1 and restart Copilot CLI from the same terminal. You don't need to edit the config again.
:::

## VS Code

VS Code reads MCP servers from `mcp.json`. Open it from the Command Palette with **MCP: Open User Configuration**; servers there are available in all workspaces. VS Code uses a `servers` object, not `mcpServers`.

### Appcircle Cloud in VS Code

:::info
If you installed the [Appcircle Copilot Plugin](/appcircle-ai/ai-assistants/appcircle-copilot-assistant), it already registers this server and asks for your token. Skip these steps.
:::

1. Get an access token. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#appcircle-cloud).
2. Open `mcp.json` with **MCP: Open User Configuration**.
3. Add the server under `servers`, replacing `<your-access-token>` with your token:
   ```json
   {
     "servers": {
       "appcircle": {
         "type": "http",
         "url": "https://mcp.appcircle.io",
         "headers": {
           "Authorization": "Bearer <your-access-token>"
         }
       }
     }
   }
   ```
4. Save the file, then start the server from **MCP: List Servers**. If VS Code asks whether to trust the server, confirm. Check that the Appcircle tools appear in Copilot Chat.

### Self-Hosted Appcircle in VS Code

:::warning
If you installed the plugin, its server always points to the cloud server. Don't enter your self-hosted token when the plugin asks for a token, or it is sent to `mcp.appcircle.io`.
:::

1. Get an access token. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#self-hosted-appcircle).
2. Open `mcp.json` with **MCP: Open User Configuration**.
3. Add your server under `servers`, replacing `<your-access-token>` with your token:
   ```json
   {
     "servers": {
       "appcircle-selfhosted": {
         "type": "http",
         "url": "https://mcp.<your-appcircle-domain>",
         "headers": {
           "Authorization": "Bearer <your-access-token>"
         }
       }
     }
   }
   ```
4. Save the file, then start the server from **MCP: List Servers**. If VS Code asks whether to trust the server, confirm. Check that the Appcircle tools appear in Copilot Chat.

:::info Token renewal
The token is written into `mcp.json`, so VS Code doesn't pick up a new one by itself. When the token expires after 24 hours, repeat step 1, replace the token in `Authorization`, save the file, and restart the server from **MCP: List Servers**.
:::

## Troubleshooting

- **`401 Unauthorized`:** the token is expired, empty, or a key instead of an access token. In Copilot CLI, check that the token variable is set in the terminal you start `copilot` from. See [Renew the Token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#renew-the-token).
- **Server doesn't appear in `/mcp show`:** check that `mcp-config.json` is valid JSON, then exit and start a new Copilot CLI session.
- **Server doesn't start in VS Code:** check that `mcp.json` is valid JSON and uses `servers` with `"type": "http"`. To see the server's logs, open **MCP: List Servers**, select the server, and choose **Show Output**.
