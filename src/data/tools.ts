/**
 * The Zuke tool-wrapper ecosystem — typed packages published to JSR under the
 * `@zuke/*` scope. Each wraps a real CLI with a fluent, strongly-typed API so
 * build steps are refactor-safe and editor-completable.
 */
export interface ToolGroup {
  category: string;
  blurb: string;
  tools: { name: string; pkg: string; desc: string }[];
}

export const toolGroups: ToolGroup[] = [
  {
    category: "Runtimes & package managers",
    blurb: "Install, run, and publish across every major JS toolchain.",
    tools: [
      { name: "Deno", pkg: "@zuke/deno", desc: "run, test, check, fmt, lint, coverage" },
      { name: "Node", pkg: "@zuke/node", desc: "run scripts, npx, version pinning" },
      { name: "npm", pkg: "@zuke/npm", desc: "install, ci, run scripts, publish" },
      { name: "Bun", pkg: "@zuke/bun", desc: "install, add, run, x, bun test" },
      { name: "pnpm", pkg: "@zuke/pnpm", desc: "frozen installs, dlx, --filter" },
      { name: "Yarn", pkg: "@zuke/yarn", desc: "Classic & Berry: install, add, dlx" },
      { name: "npx", pkg: "@zuke/npx", desc: "download & run a package binary in one step" },
    ],
  },
  {
    category: "Bundlers & monorepo",
    blurb: "Bundle apps and orchestrate monorepos from a typed pipeline.",
    tools: [
      { name: "Vite", pkg: "@zuke/vite", desc: "dev, build, preview" },
      { name: "tsup", pkg: "@zuke/tsup", desc: "zero-config bundling" },
      { name: "tsdown", pkg: "@zuke/tsdown", desc: "fast TS bundling on Rolldown" },
      { name: "Turbo", pkg: "@zuke/turbo", desc: "run, prune" },
      { name: "Nx", pkg: "@zuke/nx", desc: "run, runMany, affected" },
    ],
  },
  {
    category: "TypeScript runners & compilers",
    blurb: "Execute, type-check, and compile TypeScript with or without a build step.",
    tools: [
      { name: "tsx", pkg: "@zuke/tsx", desc: "run TS on Node, watch" },
      { name: "tsc", pkg: "@zuke/tsc", desc: "the stock TypeScript compiler, --build" },
      { name: "tsc-alias", pkg: "@zuke/tsc-alias", desc: "rewrite path aliases after tsc" },
      { name: "tsgo", pkg: "@zuke/tsgo", desc: "the native Go TypeScript compiler" },
    ],
  },
  {
    category: "Frameworks & code generation",
    blurb: "Scaffold app frameworks and generate typed clients from a schema.",
    tools: [
      { name: "Nest", pkg: "@zuke/nest", desc: "NestJS: build, start, generate" },
      { name: "openapi-ts", pkg: "@zuke/openapi-ts", desc: "OpenAPI → typed TS client" },
      { name: "Orval", pkg: "@zuke/orval", desc: "generate API clients & mocks" },
      { name: "docs", pkg: "@zuke/docs", desc: "generate API documentation" },
    ],
  },
  {
    category: "AI coding, review & self-healing",
    blurb: "Fold the major AI coding CLIs into a build, gate it on a model-assessed review, or let a fixer heal failures.",
    tools: [
      { name: "Claude Code", pkg: "@zuke/claude", desc: "headless run, model & tool limits, MCP" },
      { name: "OpenAI Codex", pkg: "@zuke/codex", desc: "codex exec headless, MCP config" },
      { name: "Gemini CLI", pkg: "@zuke/gemini", desc: "headless prompt, MCP & extensions" },
      { name: "AI review", pkg: "@zuke/ai", desc: "code-review gate with a structured risk score" },
      { name: "Self-healing", pkg: "@zuke/ai", desc: "diagnose, suggest & auto-fix failed builds, then re-run to verify" },
    ],
  },
  {
    category: "Lint, format & quality",
    blurb: "Keep the tree clean with linters, formatters, and dead-code checks.",
    tools: [
      { name: "oxlint", pkg: "@zuke/oxlint", desc: "ultra-fast Rust linter" },
      { name: "ESLint", pkg: "@zuke/eslint", desc: "configs, --fix, caching" },
      { name: "Biome", pkg: "@zuke/biome", desc: "check, format, lint, ci" },
      { name: "dprint", pkg: "@zuke/dprint", desc: "fmt, check" },
      { name: "cspell", pkg: "@zuke/cspell", desc: "spell-check your sources" },
      { name: "Knip", pkg: "@zuke/knip", desc: "find unused files & exports" },
      { name: "dpdm", pkg: "@zuke/dpdm", desc: "detect circular deps & dependency trees" },
    ],
  },
  {
    category: "Test, coverage & browsers",
    blurb: "Run unit and end-to-end suites, then upload coverage to your dashboard.",
    tools: [
      { name: "Jest", pkg: "@zuke/jest", desc: "projects, coverage thresholds" },
      { name: "Vitest", pkg: "@zuke/vitest", desc: "watch, coverage, UI" },
      { name: "Playwright", pkg: "@zuke/playwright", desc: "test, codegen, reports" },
      { name: "Cypress", pkg: "@zuke/cypress", desc: "run, open, verify" },
      { name: "Codecov", pkg: "@zuke/codecov", desc: "upload coverage via codecovcli, flags, token from env" },
    ],
  },
  {
    category: "Containers & orchestration",
    blurb: "Build images and ship to clusters from a typed pipeline.",
    tools: [
      { name: "Docker", pkg: "@zuke/docker", desc: "build, tag, push, run" },
      { name: "Docker Compose", pkg: "@zuke/docker-compose", desc: "up, down, logs" },
      { name: "kubectl", pkg: "@zuke/kubectl", desc: "apply, get, rollout, logs" },
      { name: "Helm", pkg: "@zuke/helm", desc: "install, upgrade, template, lint" },
      { name: "Kustomize", pkg: "@zuke/kustomize", desc: "build, editSetImage" },
    ],
  },
  {
    category: "Cloud & infrastructure",
    blurb: "Provision and deploy with infra-as-code, typed end to end.",
    tools: [
      { name: "gcloud", pkg: "@zuke/gcloud", desc: "deploy, run, IAM" },
      { name: "Terraform", pkg: "@zuke/terraform", desc: "init, plan, apply, destroy" },
      { name: "OpenTofu", pkg: "@zuke/tofu", desc: "open-source Terraform" },
    ],
  },
  {
    category: "Version control, registry & CI",
    blurb: "Script Git, GitHub, and publishing straight from your build.",
    tools: [
      { name: "Git", pkg: "@zuke/git", desc: "commit, tag, push, gitInfo()" },
      { name: "GitHub CLI", pkg: "@zuke/gh", desc: "releases, PRs, workflows" },
      { name: "Husky", pkg: "@zuke/husky", desc: "install & manage git hooks" },
      { name: "JSR", pkg: "@zuke/jsr", desc: "publish, add, remove" },
      { name: "release-please", pkg: "@zuke/release-please", desc: "release PRs & GitHub releases" },
    ],
  },
  {
    category: "Supply-chain security",
    blurb: "Scan workflows, secrets, and dependencies as part of the gate.",
    tools: [
      { name: "Security", pkg: "@zuke/security", desc: "zizmor, gitleaks, trivy, semgrep, osv-scanner" },
    ],
  },
];

/** The first-party engine and plugin packages — everything that isn't a CLI wrapper. */
export const corePackages = [
  { name: "@zuke/core", desc: "the Build base class, target() graph, $ shell, and cicd()" },
  { name: "@zuke/cli", desc: "the global zuke command: setup, run, list, graph, generate-ci" },
  { name: "@zuke/cmd", desc: "the typed process layer the wrappers are built on" },
  { name: "@zuke/console", desc: "markup, rules, boxes & tables — the levelled logger behind Zuke's output" },
  { name: "@zuke/otel", desc: "OpenTelemetry export plugin — run & target spans over OTLP, joined across resume" },
];

/** Total distinct @zuke package count, for display (some packages, e.g.
 * @zuke/ai, appear under more than one capability, so dedupe by name). */
export const packageCount = new Set([
  ...toolGroups.flatMap((g) => g.tools.map((t) => t.pkg)),
  ...corePackages.map((p) => p.name),
]).size;
