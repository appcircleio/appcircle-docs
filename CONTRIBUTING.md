# Contributing to Appcircle Documentation

Thank you for helping improve the Appcircle documentation. This file is the single, tool-agnostic reference for how we write docs in this repository. It applies to everyone: outside contributors, Appcircle team members, and AI assistants alike.

AI tool configurations (for example `CLAUDE.md`) point to this file instead of keeping their own copy of the rules, so there is one source of truth for documentation quality.

## Table of Contents

- [How to Contribute](#how-to-contribute)
- [Local Development](#local-development)
- [Writing Standards](#writing-standards)
- [Screenshot and Visual Standards](#screenshot-and-visual-standards)
- [Contributing a New Integration](#contributing-a-new-integration)

## How to Contribute

1. Fork the repository and create a branch for your change.
2. Write or update documentation following the [Writing Standards](#writing-standards) below.
3. Open a pull request with a clear description of what changed and why.

Reviewers check every documentation pull request against the standards in this file, so reviewing your own work against them first speeds up the process.

## Local Development

This site is built with [Docusaurus](https://docusaurus.io/).

```bash
yarn
```

Install dependencies, then start a local dev server with live reload:

```bash
yarn start
```

Generate the static production build into the `build` directory:

```bash
yarn build
```

## Writing Standards

These standards keep the documentation clear, consistent, and discoverable for a mixed audience of experienced and first-time CI/CD users. Each rule states what to do and, where useful, why it matters and how it looks.

Appcircle also has an official workflow-step documentation guideline. For step documentation requirements, see the [workflow step documentation guide](https://docs.appcircle.io/workflows/how-to-create-a-new-workflow-step#4-documentation).

### 1. Use Correct and Approved Brand and Product Names

Always use the official capitalization and spelling for brands, products, platforms, and technologies. Incorrect naming reduces trust and breaks search.

- Correct: GitLab, Bitbucket, Azure DevOps, macOS, iOS, Xcode
- Incorrect: gitlab, bitBucket, azure devops, MacOS, IOS, xCode

### 2. Maintain Terminology and Format Consistency

Use the same terms, abbreviations, and formats across the whole documentation set, and follow existing conventions.

- Use "Appcircle server" (not "Appcircle Server").
- Use "Appcircle dashboard" (not "web UI").
- Use "authentication" (not "auth").
- If a page already uses `x86_64`, do not introduce `x86-64`.

### 3. Use Direct, Action-Oriented Instructions

Write steps in the imperative mood. Address the reader as "you" in explanatory text, but use plain commands for actions. Keep the tone neutral and confident.

- Correct: Select **Build** to start a new build.
- Correct: Run `./install.sh` from the `appcircle-server` directory.
- Incorrect: You can start a build by selecting the **Build** button if you want to.

### 4. Write for Non-Experts First

Assume limited CI/CD and mobile platform knowledge. Briefly explain concepts the first time they appear. Many readers are QA engineers, managers, or developers new to mobile CI/CD.

- Incorrect: Configure the iOS signing assets.
- Correct: Configure iOS signing assets, such as certificates and provisioning profiles, which are required before distribution.

### 5. Explain Both How and Why

Whenever possible, explain why a step exists, not just how to perform it. Understanding intent builds reader confidence and reduces support requests.

- Correct: Select **Xcode 15** to ensure compatibility with the latest iOS SDK.

### 6. Keep Paragraphs Short and Focused

Use short paragraphs, each covering a single idea, to improve readability and scanning. Remove trailing whitespace from all lines.

### 7. Avoid Ambiguous or Dismissive Language

Avoid words such as "just", "simply", or "easily". They can feel dismissive to a reader who is struggling with a step. Keep wording precise and neutral.

### 8. Keep Code Examples Generic and User-Agnostic

Avoid personal names, usernames, and environment-specific paths in examples. Generic examples are reusable and easier to follow.

### 9. Specify Code Block Language Hints

Always add a language tag to fenced code blocks. Untagged blocks lose syntax highlighting and degrade the copy-paste experience.

Correct:

```bash
./install.sh
```

Incorrect:

```
./install.sh
```

Common tags: `bash`, `yaml`, `json`, `swift`, `kotlin`, `xml`, `toml`, `text` (for plain output).

### 10. Use Consistent Example Naming

Use the canonical sample project name `spacetech` and its derivatives (`spacetech-ios`, `spacetech-android`, `com.example.spacetech`) across all examples. Do not invent a new project name per page.

- Correct: `spacetech`, `spacetech-android`, `com.example.spacetech`
- Incorrect: `myapp`, `demoproject`, `acme-mobile`, developer-specific names

### 11. Prevent Duplicate Content

Avoid repeating the same explanation across pages; reference an existing section instead. Duplicate content hurts SEO and maintainability.

### 12. Always Include Front Matter

Each page must start with a Docusaurus front matter block. Front matter powers SEO, navigation, and categorization. Keep `title` and `description` unique across the documentation to avoid SEO conflicts.

```yaml
---
title: Unique document title
description: SEO-friendly description under 160 characters.
tags: [relevant, tags]
---
```

### 13. Use Proper Heading Hierarchy

Use one H1 per page. Docusaurus generates it from the front matter `title`, so start in-body content at `##`. Do not skip heading levels.

- Correct: `## Overview` then `### Prerequisites` then `### Steps`
- Incorrect: `## Overview` then `#### Prerequisites`

### 14. Apply a Structured Tag Strategy

Use at least two lowercase tags per page. Before adding a new tag, check `docs/tags.yml` and reuse an existing entry if a similar one exists. Add a new tag only when none fits:

```yaml
"access-management":
  label: Access Management
  description: Manage access to your projects and organizations.
  permalink: /access-management
```

Tags are case-sensitive: `Build` and `build` are different tags.

### 15. Use Absolute Paths for Internal Links

Use absolute documentation paths starting from the documentation root. Do not include the `/docs` segment or the `.md` extension.

- Correct: `/build/build-process-management/build-profile-branch-operations`
- Incorrect: `/docs/build/build-process-management/build-profile-branch-operations.md`
- Incorrect: `../../build/build-process-management/build-profile-branch-operations`

### 16. Use Descriptive Link Text

Write link text that makes sense out of context. Avoid "click here", "this page", and bare URLs in prose. Descriptive link text improves accessibility, SEO, and scannability.

- Correct: See the [build profile configuration guide](/build/build-process-management/build-profile-branch-operations).
- Incorrect: For details, `[click here](/build/build-process-management/build-profile-branch-operations)`.

### 17. Ensure Page Discoverability

Every new page must be linked from at least one of: its parent `index.md`, a related feature page, or the FAQ. A page reachable only by direct URL is not considered done.

### 18. Add Version Constraints and Compatibility Notes

State version requirements and compatibility boundaries with the appropriate Docusaurus admonition (triple-colon syntax):

- `:::info` for minimum supported version and default-behavior notes.
- `:::warning` for breaking changes, unsupported configurations, and deprecations.
- `:::danger` for actions that risk data loss or downtime.

```markdown
:::warning
This configuration is not supported on Appcircle server versions earlier than 4.0.
:::
```

### 19. Include FAQ and Support Sections Where Applicable

Add FAQ entries for common issues and a **Need Help** section at the end of the page. This helps readers self-serve and reduces support load.

### 20. Ensure Cross-Page Consistency

When you update a page, review and update related pages so the documentation stays consistent.

### 21. Maintain Index Pages

Every directory with multiple subpages (including every collapsible section in the sidebar) needs an `index.md`. Missing index files cause breadcrumb positioning errors that SEO crawlers flag, and they break navigation and discoverability. When you add a subtopic to an existing category, update the parent `index.md` so the new page appears in the navigation with a short description.

```text
docs/
├── category/
│   ├── index.md   (required for correct breadcrumbs)
│   ├── subpage-1.md
│   └── subpage-2.md
```

### 22. Add Redirects for Changed URLs

When you change a page URL, add a redirect so existing links keep working. Missing redirects cause broken help links and hurt SEO.

## Screenshot and Visual Standards

Consistent visuals improve trust, clarity, and accessibility. Follow these rules for every screenshot:

- Resolution: 1440x900 pixels, full size (no cropping); use pointers and shapes to highlight areas.
- Theme: Light theme.
- Organization: "Appcircle Team". Do not show personal names, personal organization names, or emails.
- Profile names: use a descriptive, generic format such as "Example Publish Profile".
- Pointer and shape color: `#f69c21`. Use pointers and shapes that match the format shown in the reference image below.
- File name: unique and descriptive, for example `BE-4000-example.png`.
- Always include alt text for accessibility and SEO.
- Use dummy or example portal URLs; do not show internal environment URLs.
- Visible application icons should relate to Appcircle.

Reference for the expected pointer and shape format:

![Screenshot pointer and shape format reference](https://cdn.appcircle.io/docs/assets/BE-4019-example.png)

Add alt text with the `Screenshot` component:

```jsx
<Screenshot
  url="https://cdn.appcircle.io/docs/assets/enable-sso_v3.png"
  alt="Enable SSO for Organizations"
/>
```

## Contributing a New Integration

If you want to contribute a new Appcircle integration (a workflow step) rather than only documentation, follow the dedicated guide: [How to Create an Integration](https://docs.appcircle.io/workflows/how-to-create-an-integration). It walks through building the integration and its required documentation.

When you document the integration, apply the [Writing Standards](#writing-standards) above.
