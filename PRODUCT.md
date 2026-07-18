# Product

## Register

brand

## Platform

web

## Users

Backend and full-stack developers who own their project's builds and CI/CD — a broad audience rather than a single narrow segment. They work day to day in TypeScript and are comfortable on the command line, and they arrive already carrying the pain of string-keyed task runners and hand-maintained YAML pipelines that drift, break on rename, and can't be refactored. Their job on this site is to size Zuke up fast: decide whether a code-first, strongly-typed build system is worth adopting, and if so, install it and run a first build the same visit. The marketing surface (the landing page) and the people who use the product are the same person, so the page speaks to a working developer as a peer, not to a buyer.

## Product Purpose

Zuke is a code-first, strongly-typed build automation system for Deno and TypeScript. Targets are declared as class fields, dependencies are wired with a fluent typed API, and Zuke resolves the graph and runs everything in topological order with zero runtime dependencies. This site exists to convert an evaluating developer into a hands-on user: success is a visitor who installs the CLI, scaffolds a `zuke.ts`, and runs their first target. Everything on the page — the live code samples, the build-log and CI mockups, the tool catalog — serves that single conversion, not brand awareness for its own sake.

## Positioning

CI/CD as code, generated and verified. You declare your pipeline once in real TypeScript, and Zuke generates the GitHub Actions / GitLab / Azure YAML and checks it stays in sync on every run — the build and its CI are one typed source of truth, not two things you keep aligned by hand. This is the claim every section reinforces.

## Conversion & proof

- Primary CTA: install the CLI and run a build (`deno install … @zuke/cli` → `zuke setup` → run a target). The whole page points here.
- Secondary CTA: browse examples — real `zuke.ts` builds, including this site's own build graph rendered to HTML — for visitors who want proof before they install.
- The line a visitor remembers after 10 seconds: your build and your CI are the same typed code, and Zuke keeps them honest.
- Belief ladder (what a visitor must accept, in order, before installing):
  1. String-keyed task runners and hand-written CI YAML are fragile — a rename breaks them and nothing catches it.
  2. A build defined as ordinary typed TypeScript is refactor-safe: references are real values the compiler checks.
  3. Zuke generates the CI/CD YAML from that same typed build and verifies it's up to date, so the pipeline can't silently drift.
  4. It's low-risk to try: zero runtime dependencies, published on JSR, and the launcher installs Deno for you on first run.
- Proof on hand: this site dogfoods Zuke (it builds itself via `zuke.ts`); a rendered build graph and worked examples stand in for testimonials. No customer logos or case studies supplied yet — add them to `.impeccable/assets/proof/` when available.

## Brand Personality

Precise, confident, technical. Zuke speaks to developers as peers who value correctness: exact language, real code over adjectives, claims backed by a runnable example. The visual voice is a dark, neon developer-tool aesthetic — cyan-to-violet accents, crisp monospace for code, restrained ambient motion — that signals "engineered" without shouting. Confident, not hyped: it shows the mechanism (typed targets, generated YAML, a real build log) and lets the substance carry the pitch.

## Anti-references

- Overhyped AI-startup energy: vague "revolutionary" claims, magic-AI language with no mechanism behind it, hype standing in for engineering. Zuke has AI features, but they're shown as concrete, gated build primitives — never as the whole personality.
- Cluttered docs-wiki: the marketing surface must not read like an unstyled readme or a wall of dense reference text. Marketing persuades; docs explain; keep them distinct.
- The generic "AI made that" website: cream/beige backgrounds, hero-metric templates, identical icon-card grids, a tiny uppercase tracked eyebrow above every section, gradient text as decoration. Distinctiveness is the bar — a visitor should ask how it was built, not which generator made it.

## Design Principles

- **Show the mechanism.** Every claim earns its place with real code, a live output mockup, or a rendered graph. Prefer a runnable example to an adjective.
- **Practice what you preach.** The site is built by Zuke itself; that dogfooding is proof, and the page should keep surfacing it.
- **Types are the story.** Refactor-safety, generated-and-verified CI, and typed tool wrappers are the throughline — reinforce it, don't bury it under feature breadth.
- **Confident, never hyped.** Substance over superlatives. The AI capabilities are gated, concrete primitives, not the brand's whole voice.
- **Distinct on purpose.** Actively avoid the AI-slop defaults; the neon dev-tool identity is a deliberate stance to protect, not a template to fill.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body text ≥4.5:1 and large text ≥3:1 against the dark background; visible keyboard focus states on all interactive elements; semantic landmarks and heading order. The site leans on ambient glows, gradients, and scroll reveals, so a genuine `prefers-reduced-motion` path is required, not optional — reveals must degrade to a visible default, not gate content on a transition that never fires.
