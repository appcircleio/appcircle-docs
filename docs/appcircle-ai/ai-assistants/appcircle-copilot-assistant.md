---
title: Appcircle Copilot Assistant
description: Use the Appcircle Copilot Plugin to connect GitHub Copilot to the Appcircle platform with MCP tools and Appcircle-aware skills.
tags: [appcircle ai, copilot, assistant]
sidebar_position: 4
---

# Appcircle Copilot Assistant

The **Appcircle Copilot Plugin** connects GitHub Copilot to the Appcircle platform, bundling the [Appcircle MCP Server](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp) with Appcircle-aware skills so you can ask Copilot about your Appcircle organization or how to use Appcircle.

## How to Use Appcircle Copilot Assistant

The plugin registers the [Appcircle MCP Server](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp) and the following Appcircle-aware skills:

| Skill | Purpose |
|-------|---------|
| `appcircle-assistant` | Answers Appcircle questions using official sources (`docs.appcircle.io` and `appcircle.io`) |
| `build-insights-report` | Renders a visual Build Insights Report (health & trends, root cause, workflow quality, artifact health, queue time, and CI maturity) from the `get_build_insights_report` MCP tool. See [Build Insights](/appcircle-ai/ai-insights/build-insights) for the full metric reference |

### In GitHub Copilot CLI

1. *(Optional, for MCP tools)* Before starting Copilot CLI, set your [Appcircle Access Token](https://github.com/appcircleio/appcircle-mcp/blob/main/docs/appcircle_access_token.md) in your shell so the MCP server can authenticate:
   ```bash
   export APPCIRCLE_ACCESS_TOKEN=<your-access-token>
   ```
   The MCP server reads this from the process environment, so it must be set before you launch `copilot`; exporting it later in an already-running session has no effect until you restart.
2. Add the Appcircle marketplace:
   ```shell
   copilot plugin marketplace add appcircleio/appcircle-ai-plugins
   ```
3. Install the plugin:
   ```shell
   copilot plugin install appcircle@appcircle
   ```
4. Ask Copilot an Appcircle question. For "how do I" or troubleshooting questions, for example "How do I set up automatic code signing for my iOS builds," Copilot uses the `appcircle-assistant` skill. For questions about your own organization, for example "List my build profiles," Copilot uses the Appcircle MCP tools, which requires step 1.

### Self-Hosted Appcircle in Copilot CLI

Self-hosted Appcircle installations include their own Appcircle MCP Server at `https://mcp.<your-appcircle-domain>`. The plugin always points to the cloud server, `mcp.appcircle.io`, so disable the plugin's server and register your self-hosted server yourself.

:::info
The Appcircle MCP Server is available on self-hosted Appcircle server 3.31.0 and later.
:::

:::warning
On a self-hosted Appcircle server, don't set `APPCIRCLE_ACCESS_TOKEN`, and remove it from your shell profile if you already set it. The plugin's server reads that variable and would send your self-hosted token to `mcp.appcircle.io`. Keep your self-hosted token in a separate variable, `APPCIRCLE_SELFHOSTED_TOKEN`, so it never reaches the cloud server.
:::

1. Export a token issued by your self-hosted Appcircle server:
   ```bash
   export APPCIRCLE_SELFHOSTED_TOKEN=<your-self-hosted-token>
   ```
2. Disable the plugin's server, then register yours:
   ```bash
   copilot mcp disable appcircle
   copilot mcp add --transport http appcircle-selfhosted https://mcp.<your-appcircle-domain> \
     --header 'Authorization: Bearer ${APPCIRCLE_SELFHOSTED_TOKEN}'
   ```
   Keep the single quotes around the header. Copilot CLI stores `${APPCIRCLE_SELFHOSTED_TOKEN}` as is and reads the token each time it starts, so you don't need to register again when the token changes.
3. If your server's certificate is signed by an internal certificate authority, point `NODE_EXTRA_CA_CERTS` to the CA bundle (PEM):
   ```bash
   export NODE_EXTRA_CA_CERTS=/path/to/internal-ca.pem
   ```
4. Restart Copilot CLI.

### In VS Code

1. *(Optional, for MCP tools)* Set your [Appcircle Access Token](https://github.com/appcircleio/appcircle-mcp/blob/main/docs/appcircle_access_token.md) so the bundled MCP server can authenticate. You can export it before launching VS Code, or supply it when prompted after installing the plugin.
2. Click **Chat Settings** -> **Plugins** -> **Install Plugin from Source**.

   <img src="https://cdn.appcircle.io/docs/assets/AI-115-vscode-plugin.png" alt="Enter the repository URL" width="480" style={{display: 'block', margin: 0}} />

3. Enter the repository URL: `https://github.com/appcircleio/appcircle-ai-plugins`

   <img src="https://cdn.appcircle.io/docs/assets/AI-115-vscode-plugin-2.png" alt="Enter the repository URL" width="480" style={{display: 'block', margin: 0}} />

4. Open Copilot Chat and ask an Appcircle question, for example "How do I set up automatic code signing for my iOS builds" or "List my build profiles."

To access the source code of this plugin, please use the following link:

https://github.com/appcircleio/appcircle-ai-plugins
