# zuke-build.github.io

The marketing and documentation website for **[Zuke](https://github.com/zuke-build/zuke)** —
a code-first, strongly-typed build automation system for Deno & TypeScript.

🔗 **Live site:** https://zuke-build.github.io

## Dogfooding

This site is an [Astro](https://astro.build) project, but every build step is
driven by **Zuke itself** — we use the tool this site documents to build the
site. The build graph lives in [`zuke.ts`](./zuke.ts) and wraps the Node
toolchain through the typed `@zuke/npm` package.

```sh
./zuke build      # install + type-check + build into dist/
./zuke dev        # start the Astro dev server
./zuke --list     # list every target
```

The `./zuke` launcher bootstraps Deno automatically on first run, so no global
install is required.

## Developing directly with npm

If you just want to work on the site content, the underlying npm scripts are
available too:

```sh
npm install
npm run dev       # local dev server
npm run build     # static build into dist/
npm run check     # astro type-check
```

## Project structure

```
zuke.ts                  # the Zuke build (drives everything)
zuke                     # bootstrap launcher (installs Deno if needed)
astro.config.mjs         # Astro configuration
src/
  layouts/               # Base + Docs layouts
  components/            # Nav, Footer, Logo, DAG diagram, code/copy blocks
  pages/                 # index, docs/, examples/
  data/tools.ts          # the @zuke tool-wrapper catalog
  styles/global.css      # design system (dark neon dev-tool theme)
.github/workflows/       # build-with-Zuke + deploy to GitHub Pages
```

## Deployment

Pushes to `main` trigger [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml),
which runs `./zuke build` and publishes `dist/` to GitHub Pages.

> **One-time setup:** in the repository's **Settings → Pages**, set the build
> source to **GitHub Actions**.

## License

MIT
