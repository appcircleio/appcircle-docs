---
title: AI FAQ and Disclaimer
description: How Appcircle uses AI technologies in its features and services - what data is processed, which models are used, how your content is protected, and how to turn AI features off.
tags: [appcircle ai, ai, faq, security]
sidebar_position: 5
---

# AI FAQ and Disclaimer

## At a glance

Appcircle invests in AI and large language model (LLM) technologies to make mobile CI/CD faster to operate and easier to debug. We build these features with the same priorities as the rest of the platform: your source code, secrets and signing identities are protected first, and AI is added on top of that boundary - never around it.

This page explains, for every AI-powered capability in Appcircle:

- which of your data is processed and which is not,
- where the processing happens and which models are involved,
- whether anything is retained or used to train models,
- what the technology can and cannot guarantee,
- how to turn AI features off.

:::caution AI-generated content disclaimer
AI-generated output in Appcircle is a **recommendation, not a verified fact**. Large language models can produce inaccurate, incomplete or misleading results. Always review AI output before acting on it, and never apply a suggested change to a production workflow, signing configuration or credential without verifying it yourself.
:::

## Which Appcircle features use AI?

| Feature | What it does | Who runs the model |
| --- | --- | --- |
| **AI Build Error Interpreter** (**Cloud Beta**) | Explains why a build step failed, from the build log of that step. Available in Appcircle cloud only - see [Self-hosted Appcircle](#self-hosted-appcircle) | Appcircle, on your behalf |
| **Appcircle MCP Server** | Exposes Appcircle data and actions to an AI assistant of your choice | **You** - your own AI tool and provider |
| **AI Assistants** (GPT / Claude / Copilot assistants) | Answer questions about Appcircle from public documentation, and - where the assistant bundles the MCP Server - from your own organization, build and workflow data | **You** - your own AI tool and provider |
| **AI Insights / Build Insights Report** | Computes build and pipeline metrics; the metrics themselves are calculated deterministically by Appcircle and returned as structured data | **You** - your own AI tool renders the report |

An important distinction: with the **MCP Server** and the **AI Assistants**, Appcircle does not send anything to any model. Your AI tool (for example Claude Desktop, Cursor, VS Code Copilot) calls Appcircle, and whatever it retrieves is then handled by **your** AI provider under **your** agreement with that provider.

:::warning Appcircle's guarantees do not extend to your own AI tool
Some assistant integrations bundle the Appcircle MCP Server and can therefore retrieve **private** organization, build and workflow data - not just public documentation. When that happens, the data is sent to whichever model provider *you* have configured, and the anonymization, retention and no-training guarantees described on this page **do not apply** - they cover only the features Appcircle runs on your behalf. What that data is used for is governed by your agreement with your AI provider. This access is **not** controlled by the AI credit allowance or the consent gate - see [Can I turn AI features off?](#can-i-turn-ai-features-off).
:::

The sections below about models, retention and sub-processors apply to features Appcircle runs on your behalf - today, the **AI Build Error Interpreter**, which ships as a **Cloud Beta**: it runs in Appcircle cloud only, and being a Beta, its behavior and limits may change between releases.

## How is my data used with AI?

We classify your data before deciding whether it may reach a model at all.

| Classification | Meaning | May reach a model? |
| --- | --- | --- |
| **Sensitive, non-anonymizable** | Must stay unchanged to be useful, so it cannot be safely de-identified | **No** |
| **Sensitive, anonymizable** | Useful after identifying values are removed | Only in anonymized form |
| **Non-sensitive** | Operational data with no customer secrets or personal data | Yes |

Applied to the platform:

| Data type | Classification | Used with AI |
| --- | --- | --- |
| Source code | Sensitive, non-anonymizable | Not sent to any model by Appcircle |
| Secrets and environment variables | Sensitive, non-anonymizable | Values you store as secret environment variables are masked by the platform at the source, so they do not appear in a build log to begin with. A secret **printed into the log by your own build steps** is subject to best-effort detection - see [Anonymization](#anonymization-and-its-limits) |
| Signing identities, certificates, keystores, provisioning profiles | Sensitive, non-anonymizable | Not sent to any model |
| Build artifacts | Sensitive, non-anonymizable | Not sent to any model |
| Connected Git, SAML and store accounts | Sensitive, non-anonymizable | Not sent to any model |
| Build logs | Sensitive, anonymizable | Sent **only** as an anonymized extract - see [Anonymization](#anonymization-and-its-limits) |
| Build step name | Non-sensitive | Sent **as-is, not anonymized** - it has to match the build log exactly for us to select the step you asked about. For a custom script this is text you wrote, so keep secrets out of step names |
| Other build and pipeline metadata (status, duration) | Sensitive, anonymizable | Sent only as needed, in anonymized form |
| Usage metrics and platform telemetry | Non-sensitive | May be used to operate and improve the service |

## Is my content used to train models?

**No.** Appcircle does not use your content to train or fine-tune any model, and does not permit its model providers to do so.

## What is retained, and for how long?

Retention is a separate question from training, and the honest answer is that some data **is** retained - all of it anonymized.

| What | Retained where | Why |
| --- | --- | --- |
| The raw build log | **Nowhere.** It is not persisted by the AI feature and never leaves the anonymization boundary | - |
| The AI interpretation of a failed step | Appcircle's own database, in the Appcircle cloud | So re-opening the build shows the existing result without re-running the analysis |
| Execution traces, latency and cost of each AI call | Appcircle's observability provider, EU region | Operating the feature, measuring quality, acting on your feedback |
| Your thumbs up / thumbs down feedback | Same as above | Improving prompts and examples |
| The request sent to the model provider | Subject to the provider's own request-retention terms, which are separate from training | Provider-side abuse monitoring and operations |

Everything Appcircle retains contains **anonymized content only**.

## Where does inference happen, and which models are used?

| Feature | Model | Inference location | Used for training |
| --- | --- | --- | --- |
| AI Build Error Interpreter | Anthropic Claude, pinned to a specific version per Appcircle release | Anthropic API | No |

Models are pinned per release rather than floating on the newest version, so a model change is a deliberate, tested and documented step - not something that happens under your workflows silently. We evaluate newer or lower-cost models continuously and switch when they clear our quality bar.

## Anonymization and its limits

This is the most important section of this page.

Before any build log content reaches a model, it goes through Appcircle's anonymization pipeline:

1. The raw log of the failed step is reduced to a small set of ranked error blocks with their surrounding context. The rest of the log is discarded.
2. Those blocks are scanned for secrets, tokens, keys, credentials, hostnames, identifiers, personal names and other identifying values.
3. Every detected value is replaced with a readable placeholder such as `<SECRET>`, `<APP_NAME>` or `<PROVISIONING_PROFILE>`, so the model keeps the structure of the error without the value.
4. Only this anonymized extract is sent to the model and to our observability provider.

Two guarantees and one limit:

- **Fail-closed.** If anonymization cannot complete for any reason, the request fails. Nothing is sent to the model. There is no fallback path that sends raw content.
- **The raw log never leaves the boundary.** It is not sent to the model, not written to traces, and not stored.

:::warning Anonymization is best-effort
Detection is **best-effort and cannot be guaranteed to be 100% complete**. There is a small chance that a value which looks like ordinary log text - an unusual secret format, a value printed by a custom script - is not detected and is included in the anonymized extract sent to the model provider. Treat this the same way you treat anything printed into a build log: **do not print secrets into build output.** Use [environment variables marked as secret](/environment-variables) so the platform masks them at the source, rather than echoing them from a custom script.
:::

## Who owns the AI output?

| Input to the model | Output ownership |
| --- | --- |
| Your anonymized sensitive content | **You.** The interpretation of your build failure is yours. |
| Non-sensitive platform data | Appcircle |

Appcircle does not reuse or re-train models on output derived from your content. There is no permission you can grant that changes this - it is not an opt-in we offer.

### One exception, stated plainly: curated examples

The Build Error Interpreter is grounded by a small, hand-curated library of example error-and-fix cases that is included in the prompt for **every** organization. When you mark an interpretation with thumbs up, our AI team may use it as the starting point for a new example case, added through a normal reviewed pull request.

This is not model training - no model weights change, and nothing happens automatically. But it does mean an interpretation derived from one organization's build failure can inform the examples shown to another. So, to be exact about what that library may contain:

- Cases are **anonymized or entirely hand-written**. Real customer secrets and personal data are not permitted in them.
- Every case is reviewed by a human before it is added.
- The library is small and curated, not an accumulating store of customer output.

If you would rather your feedback never be used this way, do not use the thumbs up control, or contact Appcircle support.

## How is AI applied in Appcircle?

Five principles constrain every AI feature we ship:

1. **Recommendation, not action.** AI suggests; it does not take irreversible action on your organization, builds or credentials on its own.
2. **Human judgment is never replaced.** AI output is an input to your decision, not a substitute for it.
3. **Explainability.** AI output points at the evidence it is based on - for the Build Error Interpreter, the actual failed-step log lines are shown next to the interpretation.
4. **Honest confidence.** When the model is not confident, the feature says so and points you at the raw error output instead of inventing a cause. A confident wrong answer is the failure mode we optimize hardest against.
5. **Explicit consent.** AI processing that *Appcircle* performs on your content does not begin until someone authorized in your organization has accepted this disclaimer.

## Consent: who accepts, and when?

Consent gates the AI features **Appcircle runs on your behalf** - today, the Build Error Interpreter. It does not gate what your own AI tool does through the MCP Server; see [Can I turn AI features off?](#can-i-turn-ai-features-off) for that.

The first time anyone in your organization triggers an AI analysis, Appcircle blocks the request and asks for acceptance of this disclaimer.

- Only an **Organization Management Manager** (or the organization Owner) can accept, because acceptance is given on behalf of the whole organization.
- Acceptance is recorded once per organization, together with the accepting user and timestamp, as proof.
- After acceptance, **any** member of the organization can use the AI features - they are not asked again.

## Can I turn AI features off?

Yes - but the two categories of AI feature are switched off in two different places, and this distinction matters.

### Features Appcircle runs (the Build Error Interpreter)

- **Organization level.** These are gated by a per-organization monthly AI credit allowance. An allowance of `0` (the default) means the feature is not available in that organization and no Appcircle-run AI processing takes place. Contact Appcircle support to set or remove the allowance.
- **Never enabled implicitly.** No Appcircle-run AI processing occurs before the consent step above, and none occurs without a positive credit allowance.
- **Nothing runs in the background.** The Build Error Interpreter is triggered manually, per failed step. Appcircle does not scan your builds with AI on its own.

### Features you run (MCP Server, AI Assistants, AI Insights)

:::warning Setting AI credits to `0` does **not** disable MCP access
The AI credit allowance and the consent gate apply **only** to the features Appcircle runs. They do not restrict the Appcircle MCP Server. In an organization whose AI credit allowance is `0`, and which has never accepted this disclaimer, a member can still connect an AI assistant to Appcircle through MCP and send organization data to their own model provider.
:::

MCP access is governed by ordinary Appcircle access control, not by the AI settings:

- The MCP Server authenticates with a [Personal Access Key](/account/my-organization/security/personal-access-key), and it **inherits the permissions of the user account that created it**. It can therefore reach exactly what that member could reach through the API or the dashboard - no more.
- To restrict what MCP can retrieve, restrict the member's role and organization permissions in the usual way.
- To cut a specific integration off, revoke the Personal Access Key that it uses.

If your organization has a policy on which external AI providers may receive your data, that policy needs to be enforced through access control and internal rules - AI credits will not enforce it for you.

## Self-hosted Appcircle

The **AI Build Error Interpreter** is a **Cloud Beta**: it is available in Appcircle cloud only. A self-hosted installation does not run it and does not send any build log content to an external model provider.

## Compliance and security

Appcircle's platform security controls, certifications and data handling practices cover the AI processing **Appcircle performs**, unchanged from the rest of the platform. See [Appcircle Security](/account/my-organization/security) for details.

Two things they do not cover, stated once more so the boundary is unambiguous: how a **model provider** handles the request Appcircle sends is governed by that provider's own terms and assurances, and anything **your own AI tool** retrieves through the MCP Server is governed by your agreement with the provider you configured.

For questions about AI data handling that this page does not answer, contact Appcircle support.

import NeedHelp from '@site/docs/\_need-help.mdx';

<NeedHelp />
