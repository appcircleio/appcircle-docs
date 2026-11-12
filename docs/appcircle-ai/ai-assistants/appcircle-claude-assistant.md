---
title: Appcircle Claude Assistant
description: Use the Appcircle Claude Plugin to connect Claude to the Appcircle platform with MCP tools and Appcircle-aware skills.
tags: [appcircle ai, claude, assistant]
sidebar_position: 3
---

# Appcircle Claude Assistant

The **Appcircle Claude Plugin** connects Claude to the Appcircle platform, bundling the [Appcircle MCP Server](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp) with Appcircle-aware skills so you can ask Claude about your Appcircle organization or how to use Appcircle.

## How to Use Appcircle Claude Assistant

The plugin registers the [Appcircle MCP Server](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp) and the following Appcircle-aware skills, automatically namespaced under `appcircle`:

| Skill | Purpose |
|-------|---------|
| `appcircle:appcircle-assistant` | Answers Appcircle questions using official sources (`docs.appcircle.io` and `appcircle.io`) |
| `appcircle:build-insights-report` | Renders a visual Build Insights Report (health & trends, root cause, workflow quality, artifact health, queue time, and CI maturity) from the `get_build_insights_report` MCP tool. See [Build Insights](/appcircle-ai/ai-insights/build-insights) for the full metric reference |

The MCP tools are optional. The `appcircle-assistant` skill works without them. The MCP tools, and the `build-insights-report` skill that uses them, need an [Appcircle Access Token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication).

Claude Code installs the plugin differently from claude.ai and Claude Desktop, so follow the steps for the app you use. The plugin includes the MCP tools only in Claude Code. In claude.ai and Claude Desktop, it installs the skills only.

### In Claude Code

1. *(Optional, for MCP tools)* Before starting Claude Code, set your [Appcircle Access Token](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/authentication) in your shell so the MCP server can authenticate:
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

The plugin's MCP server always points to the cloud server, `mcp.appcircle.io`. On a self-hosted Appcircle server, skip step 1 and register your own server by following the [Claude Code self-hosted installation guide](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/installation-guides/claude-applications#self-hosted-appcircle-in-claude-code). The plugin's skills then use your self-hosted server's MCP tools.

### In claude.ai and Claude Desktop

You can install this plugin's skills in claude.ai and Claude Desktop.

:::warning
The plugin doesn't add the MCP tools in claude.ai or Claude Desktop. In Claude Desktop, you can add them yourself, on Appcircle Cloud or a self-hosted Appcircle server, by following the [Claude Desktop installation guide](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/installation-guides/claude-applications#claude-desktop). claude.ai doesn't currently support the Appcircle MCP Server.
:::

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
