---
title: Appcircle ChatGPT and Codex Assistant
description: Use the Appcircle GPT in ChatGPT, or install the Appcircle Plugin in Codex and the ChatGPT desktop app for MCP tools and Appcircle-aware skills.
tags: [appcircle ai, gpt, codex, assistant]
sidebar_position: 2
---

import Screenshot from '@site/src/components/Screenshot';

Appcircle offers two ways to work with Appcircle from OpenAI tools:

- **Appcircle GPT Assistant**: a custom GPT in ChatGPT that answers Appcircle questions, with step-by-step guidance and troubleshooting support.
- **Appcircle Codex Plugin**: a plugin for Codex and the ChatGPT desktop app that bundles the [Appcircle MCP Server](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp) with Appcircle-aware skills, so you can ask about your own Appcircle organization or how to use Appcircle.

## How to Use Appcircle GPT Assistant

The [**Appcircle GPT Assistant**](https://chatgpt.com/g/g-686e31aa891481919ef3603325b15ae0-appcircle-assistant) is available in ChatGPT:

1. Log in to your [ChatGPT account](https://chatgpt.com/).
2. In the left-hand menu, click **GPTs**.
3. Use the search bar to type **Appcircle Assistant**.
    <Screenshot url='https://cdn.appcircle.io/docs/assets/BE6548-chatGPTInstructions.png'/>

4. Click on it to open and start your conversation with the **Appcircle GPT Assistant**.
    <Screenshot url='https://cdn.appcircle.io/docs/assets/BE6548-assistantScreen2.png'/>

## How to Use Appcircle Codex Plugin

The plugin registers the [Appcircle MCP Server](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp) and the following Appcircle-aware skills:

| Skill | Purpose |
|-------|---------|
| `appcircle-assistant` | Answers Appcircle questions using official sources (`docs.appcircle.io` and `appcircle.io`) |
| `build-insights-report` | Renders a visual Build Insights Report (health & trends, root cause, workflow quality, artifact health, queue time, and CI maturity) from the `get_build_insights_report` MCP tool. See [Build Insights](/appcircle-ai/ai-insights/build-insights) for the full metric reference |

MCP tools are available in Codex. Installing the plugin in the ChatGPT desktop app gets you the skills, not the MCP tools.

### Install the Plugin

1. Add the Appcircle marketplace:
   ```bash
   codex plugin marketplace add appcircleio/appcircle-ai-plugins
   ```
2. Install the plugin:
   - **Codex CLI:** run `/plugins` and install the Appcircle plugin.
   - **ChatGPT desktop app:** restart the app, open the **Plugins Directory**, pick the Appcircle source, and install the plugin.
3. Ask an Appcircle question. For "how do I" or troubleshooting questions, for example "How do I set up automatic code signing for my iOS builds," Codex uses the `appcircle-assistant` skill. For questions about your own organization, for example "List my build profiles," Codex uses the Appcircle MCP tools, which need the MCP server connected below.

### Connect the MCP Server in Codex

The plugin can't pass your token to the MCP server in Codex, so register the server yourself by following the [Codex installation guide](/appcircle-ai/ai-features-on-appcircle/appcircle-mcp/installation-guides/codex). It covers Appcircle Cloud and self-hosted Appcircle servers, and replaces the plugin's own `appcircle` entry.

To access the source code of this plugin, please use the following link:

https://github.com/appcircleio/appcircle-ai-plugins
