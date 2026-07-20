---
title: Appcircle Copilot Assistant
description: Use the Appcircle Copilot Plugin to connect GitHub Copilot to the Appcircle platform with MCP tools and Appcircle-aware skills.
tags: [appcircle ai, copilot, assistant]
sidebar_position: 4
---

# Appcircle Copilot Assistant

The **Appcircle Copilot Plugin** connects GitHub Copilot to the Appcircle platform, bundling the [Appcircle MCP Server](/appcircle-ai/appcircle-mcp-server) with Appcircle-aware skills so you can ask Copilot about your Appcircle organization or how to use Appcircle.

## How to Use Appcircle Copilot Assistant

The plugin registers the [Appcircle MCP Server](/appcircle-ai/appcircle-mcp-server) and the following Appcircle-aware skills:

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
   copilot plugin install appcircle@appcircle-ai-plugins
   ```
4. Ask Copilot an Appcircle question. For "how do I" or troubleshooting questions, for example "How do I set up automatic code signing for my iOS builds," Copilot uses the `appcircle-assistant` skill. For questions about your own organization, for example "List my build profiles," Copilot uses the Appcircle MCP tools, which requires step 1.

### In VS Code

1. *(Optional, for MCP tools)* Set your [Appcircle Access Token](https://github.com/appcircleio/appcircle-mcp/blob/main/docs/appcircle_access_token.md) so the bundled MCP server can authenticate. You can export it before launching VS Code, or supply it when prompted after installing the plugin.
2. Click **Chat Settings** -> **Plugins** -> **Install Plugin from Source**.

   <img src="https://cdn.appcircle.io/docs/assets/AI-115-vscode-plugin.png" alt="Enter the repository URL" width="480" style={{display: 'block', margin: 0}} />

3. Enter the repository URL: `https://github.com/appcircleio/appcircle-ai-plugins`

   <img src="https://cdn.appcircle.io/docs/assets/AI-115-vscode-plugin-2.png" alt="Enter the repository URL" width="480" style={{display: 'block', margin: 0}} />

4. Open Copilot Chat and ask an Appcircle question, for example "How do I set up automatic code signing for my iOS builds" or "List my build profiles."

To access the source code of this plugin, please use the following link:

https://github.com/appcircleio/appcircle-ai-plugins
