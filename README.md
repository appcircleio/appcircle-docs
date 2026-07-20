# Appcircle Documentation

This is the public documentation site for Appcircle, built with [Docusaurus](https://docusaurus.io/).

## Contributing

Documentation writing standards (brand and product naming, terminology, front matter, links, tags, screenshots, and more) live in [CONTRIBUTING.md](./CONTRIBUTING.md). Read it before opening a documentation pull request.

## Local Development

```bash
yarn        # install dependencies
yarn start  # start a local dev server with live reload
yarn build  # generate the static site into ./build
```

## Deployment

The site is a fully static Docusaurus build served by Cloudflare Workers. `yarn build` outputs to `./build`, which is deployed as static assets (see `wrangler.toml`).
