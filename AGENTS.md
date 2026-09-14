# AGENTS.md

Guidance for working in this repository. Read this before making changes.

This is the marketing and documentation website for
**[Zuke](https://github.com/zuke-build/zuke)** — an [Astro](https://astro.build)
site whose every build step is driven by Zuke itself (see [`zuke.ts`](./zuke.ts)).

> This file, `AGENTS.md`, is the single source of truth for both humans and
> agents. `CLAUDE.md` is a thin pointer whose entire content is `@AGENTS.md`, so
> Claude Code loads this file and there is exactly one copy to maintain.
>
> [`PRODUCT.md`](./PRODUCT.md) is the brand and positioning brief — who the
> visitor is, what the page must make them believe, and the design principles
> and anti-references to hold to. Read it before writing any user-facing copy.

## Visual validation (non-negotiable)

**Every change that touches rendered output must be verified in both themes at
desktop, tablet, and phone widths before it is committed.** This is a
publishing surface: a layout that breaks at 390px, or a colour that vanishes on
the paper theme, is live the moment `main` deploys. `astro check` passing is not
evidence that a page *looks* right — it cannot see a collapsed grid, an
overflowing panel, or unreadable text.

The site ships **two themes** (`:root[data-theme="dark"]`, the signature
terminal look, and `:root[data-theme="light"]`, "paper") and its CSS carries
breakpoints at 1040, 940, 860, 760, 720, 600, 560, 400, 380 and 340px. So check
at least:

| Class   | Width   | Why                                                  |
| ------- | ------- | ---------------------------------------------------- |
| Desktop | 1280px  | the multi-column layouts in their intended form       |
| Tablet  | 820px   | between the 860 and 760 breakpoints                   |
| Phone   | 390px   | the common phone width, below the 400 breakpoint      |
| Narrow  | 360px   | worth a look — there are rules down to 340px          |

A change passes when, in **both** themes at **every** width:

- the page has **no horizontal overflow** (`scrollWidth === clientWidth`);
- every multi-column grid has collapsed to one column rather than squeezing;
- no panel, table, or code block spills outside its container;
- text still meets **WCAG 2.1 AA** contrast — 4.5:1 for body text, 3:1 for
  large text, per `PRODUCT.md`. Colours tuned by eye against the dark
  background routinely fail this on the paper theme.

### Two traps this repo has actually hit

1. **Media-query ordering.** The `<style>` blocks are plain CSS with no
   preprocessor, so a `@media (max-width: …)` override placed *above* the base
   rule loses to it — same specificity, later wins. Put responsive overrides
   **after** the base rules they override, and confirm the collapse visually
   rather than assuming the rule applied.
2. **Dark-tuned colours on the paper theme.** Hard-coded hex accents (severity
   chips, status tints) are picked against the dark ground and can land near
   2:1 on light. Prefer the design tokens in
   [`src/styles/global.css`](./src/styles/global.css); when a literal colour is
   genuinely needed, add a `:root[data-theme="light"]` variant and check the
   ratio.

### How to check

A human can resize the browser and use the theme toggle in the nav. To verify
it mechanically, build and preview, then drive the preview with Playwright:

```sh
./zuke build
npx astro preview --port 4321
```

The theme resolves from `prefers-color-scheme` when no choice is stored (see
the no-flash script in [`src/layouts/Base.astro`](./src/layouts/Base.astro)), so
Playwright's `colorScheme` option selects it — no need to script the toggle.
Install Playwright into a scratch directory rather than adding it to
`package.json`; it is a verification tool, not a dependency of this site. Some
agent environments ship Chromium already (commonly at
`/opt/pw-browsers/chromium`, with `PLAYWRIGHT_BROWSERS_PATH` set) — point
`executablePath` at it instead of downloading another copy; otherwise a plain
`npx playwright install chromium` is fine.

```js
import { chromium } from "playwright";

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const theme of ["dark", "light"]) {
  for (const width of [1280, 820, 390]) {
    const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
    const p = await ctx.newPage();
    await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
    await p.emulateMedia({ reducedMotion: "reduce" });   // reveals settle instantly
    const overflow = await p.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) throw new Error(`${theme} @ ${width}px overflows by ${overflow}px`);
    await p.screenshot({ path: `/tmp/${theme}-${width}.png`, fullPage: true });
    await ctx.close();
  }
}
await b.close();
```

Then **look at the screenshots** — the overflow assertion catches one failure
mode, not all of them. Check every page a change touches, not only the landing
page.

### Reduced motion

The site leans on scroll reveals (`data-reveal`), ambient glows and gradients.
`prefers-reduced-motion: reduce` must degrade to a **visible default** — content
may never be gated on a transition that never fires. Verify new revealed
content with `reducedMotion: "reduce"` as above.

## Generated files — never edit by hand

Four files are regenerated from the Zuke repository by `zuke syncWebsite` on
every release, which opens a PR against this repo. Editing them here is
pointless: the next release overwrites the change.

| File                   | Source                                    |
| ---------------------- | ----------------------------------------- |
| `public/llms.txt`      | the Zuke repo's `apiDocs` flow            |
| `public/llms-full.txt` | the Zuke repo's `apiDocs` flow            |
| `src/data/api.json`    | the Zuke repo's `apiReference` flow       |
| `src/data/tools.ts`    | `build/website_tools.ts` in the Zuke repo |

Everything else — the landing page, every docs and examples page,
`src/data/users.ts` — is hand-maintained here. `packageCount` is derived from
the synced `tools.ts`, so never hard-code a package count in copy.

## Content accuracy

The site documents another repository, so prose can drift from the tool while
still type-checking and building cleanly. When adding or changing a factual
claim, verify it against the Zuke repository — `docs/`, `README.md`,
`CHANGELOG.md`, `SECURITY.md`, and each package's `CHANGELOG.md` — rather than
from memory. Prefer a claim traceable to one of those files, and avoid
overstating anything Zuke's own documents state more narrowly (security posture
especially: do not upgrade "independent review" into "third-party audit").

When adding a docs page, add it to the sidebar in
[`src/layouts/DocsLayout.astro`](./src/layouts/DocsLayout.astro) and to the
index in `src/pages/docs/index.astro`, and confirm every in-page anchor you
link to actually exists in the built HTML.

## Commands

The build is Zuke's own; `./zuke` bootstraps Deno on first run.

| Task                        | Command              |
| --------------------------- | -------------------- |
| Install, type-check, build  | `./zuke build`       |
| Dev server                  | `./zuke dev`         |
| Preview the built site      | `./zuke preview`     |
| List every target           | `./zuke --list`      |
| Type-check only             | `npm run check`      |

`./zuke build` is exactly what CI runs (`.github/workflows/pr.yml` and
`deploy.yml`), so run it before pushing. The PR job is named **`Build the
site`** and is the required status check on `main` — renaming it silently
un-gates the branch.

Full-text search is a Pagefind index built after `astro build` (see
`src/integrations/pagefind.ts`); `astro dev` does not build it, so the dev
server serves whatever the last `dist/` build produced.

## Repository layout

```
zuke.ts                  # the Zuke build (drives everything)
zuke                     # bootstrap launcher (installs Deno if needed)
astro.config.mjs         # Astro configuration
src/
  layouts/               # Base + Docs + API layouts
  components/            # Nav, Footer, Logo, DAG diagram, code/copy blocks, Search
  integrations/          # Astro integrations (Pagefind full-text search index)
  pages/                 # index, docs/, api/, examples/
  data/                  # tools.ts + api.json (generated), users.ts (hand-maintained)
  styles/global.css      # design system — theme tokens live here
.github/workflows/       # build-with-Zuke + deploy to GitHub Pages
```
