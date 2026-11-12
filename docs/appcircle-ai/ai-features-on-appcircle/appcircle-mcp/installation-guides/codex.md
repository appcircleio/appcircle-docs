---
title: Connect Codex to Appcircle MCP
description: Connect the Codex app and Codex CLI to the Appcircle MCP Server on Appcircle cloud or a self-hosted Appcircle server.
tags: [appcircle mcp, mcp server, codex, self-hosted]
sidebar_position: 2
---

# Connect Codex to Appcircle MCP

Connect the Codex CLI or the Codex app to the Appcircle MCP Server on Appcircle Cloud or on your self-hosted Appcircle server. Both read the same config file, `~/.codex/config.toml`, so a server you add in one also appears in the other.

Each setup needs an Appcircle Access Token. See [Appcircle MCP Authentication](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication) to get one.

:::info
If you installed the [Appcircle Codex Plugin](/appcircle-ai/ai-assistants/appcircle-gpt-assistant), it adds an `appcircle` server that can't send your token. The steps below register the server as `appcircle`, which replaces the plugin's entry.
:::

## Codex CLI

The commands below work in zsh or bash on macOS and Linux, and in PowerShell on Windows.

### Appcircle Cloud in Codex CLI

1. Get an access token in the `APPCIRCLE_ACCESS_TOKEN` variable of this terminal. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#appcircle-cloud).
2. Register the server once:
   ```bash
   codex mcp add appcircle --url https://mcp.appcircle.io --bearer-token-env-var APPCIRCLE_ACCESS_TOKEN
   ```
   Codex stores the variable name, not the token, and reads the token each time it starts, so you don't need to register again when the token changes.
3. Start Codex from the same terminal with `codex`. Codex reads the token only when it starts.

### Self-Hosted Appcircle in Codex CLI

1. Get an access token in the `APPCIRCLE_SELFHOSTED_TOKEN` variable of this terminal. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#self-hosted-appcircle).
2. Register your server once:
   ```bash
   codex mcp add appcircle --url https://mcp.<your-appcircle-domain> --bearer-token-env-var APPCIRCLE_SELFHOSTED_TOKEN
   ```
   Codex stores the variable name, not the token, and reads the token each time it starts, so you don't need to register again when the token changes.
3. Start Codex from the same terminal with `codex`. Codex reads the token only when it starts.

:::info Token renewal
The access token is valid for 24 hours. When it expires, repeat step 1 and restart Codex. You don't need to register the server again.
:::

## Codex App

### Appcircle Cloud in the Codex App

1. Get an access token. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#appcircle-cloud).
2. Open the config file from **Settings > Configuration > Open config.toml**, or open `~/.codex/config.toml` directly.
3. Add the server, replacing `<your-access-token>` with your token:
   ```toml
   [mcp_servers.appcircle]
   url = "https://mcp.appcircle.io"

   [mcp_servers.appcircle.http_headers]
   Authorization = "Bearer <your-access-token>"
   ```
4. Quit and reopen the Codex app, then check that the Appcircle tools appear.

### Self-Hosted Appcircle in the Codex App

1. Get an access token. See [how to get a token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#self-hosted-appcircle).
2. Open the config file from **Settings > Configuration > Open config.toml**, or open `~/.codex/config.toml` directly.
3. Add your server, replacing `<your-access-token>` with your token:
   ```toml
   [mcp_servers.appcircle]
   url = "https://mcp.<your-appcircle-domain>"

   [mcp_servers.appcircle.http_headers]
   Authorization = "Bearer <your-access-token>"
   ```
4. Quit and reopen the Codex app, then check that the Appcircle tools appear.

:::info Token renewal
The token is written into the config file, so the Codex app doesn't pick up a new one by itself. When the token expires after 24 hours, repeat step 1, replace the token in `Authorization`, and quit and reopen the Codex app.
:::

## Troubleshooting

- **`401 Unauthorized`:** the token is expired, empty, or a key instead of an access token. In the Codex CLI, check that the token variable is set in the terminal you start `codex` from. See [Renew the Token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication#renew-the-token).
- **Server status:** run `codex mcp list` in the terminal, or `/mcp` inside the Codex CLI.
- **Server doesn't appear in the Codex app:** check that `config.toml` is valid TOML, then quit and reopen the app.
