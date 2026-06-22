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
      { name: "npm", pkg: "@zuke/npm", desc: "install, ci, run scripts, publish" },
      { name: "Bun", pkg: "@zuke/bun", desc: "install, add, run, x, bun test" },
      { name: "pnpm", pkg: "@zuke/pnpm", desc: "frozen installs, dlx, --filter" },
      { name: "Yarn", pkg: "@zuke/yarn", desc: "Classic & Berry: install, add, dlx" },
    ],
  },
  {
    category: "Bundlers & monorepo",
    blurb: "Bundle apps and orchestrate monorepos from a typed pipeline.",
    tools: [
      { name: "Vite", pkg: "@zuke/vite", desc: "dev, build, preview" },
      { name: "tsup", pkg: "@zuke/tsup", desc: "zero-config bundling" },
      { name: "Turbo", pkg: "@zuke/turbo", desc: "run, prune" },
      { name: "Nx", pkg: "@zuke/nx", desc: "run, runMany, affected" },
    ],
  },
  {
    category: "TypeScript runners",
    blurb: "Execute and type-check TypeScript without a build step.",
    tools: [
      { name: "tsx", pkg: "@zuke/tsx", desc: "run TS on Node, watch" },
      { name: "tsgo", pkg: "@zuke/tsgo", desc: "the native Go TypeScript compiler" },
    ],
  },
  {
    category: "AI coding & review",
    blurb: "Fold the major AI coding CLIs into a build, or gate it on a model-assessed review.",
    tools: [
      { name: "Claude Code", pkg: "@zuke/claude", desc: "headless run, model & tool limits, MCP" },
      { name: "OpenAI Codex", pkg: "@zuke/codex", desc: "codex exec headless, MCP config" },
      { name: "Gemini CLI", pkg: "@zuke/gemini", desc: "headless prompt, MCP & extensions" },
      { name: "AI review", pkg: "@zuke/ai", desc: "code-review gate with a structured risk score" },
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
    category: "Test & browsers",
    blurb: "Run unit and end-to-end suites with coverage wired in.",
    tools: [
      { name: "Jest", pkg: "@zuke/jest", desc: "projects, coverage thresholds" },
      { name: "Vitest", pkg: "@zuke/vitest", desc: "watch, coverage, UI" },
      { name: "Playwright", pkg: "@zuke/playwright", desc: "test, codegen, reports" },
      { name: "Cypress", pkg: "@zuke/cypress", desc: "run, open, verify" },
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

/** The engine packages that power every build. */
export const corePackages = [
  { name: "@zuke/core", desc: "the Build base class, target() graph, $ shell, and cicd()" },
  { name: "@zuke/cli", desc: "the global zuke command: setup, run, list, graph, generate-ci" },
  { name: "@zuke/cmd", desc: "the typed process layer the wrappers are built on" },
];

/** Total wrapper + engine package count, for display. */
export const packageCount =
  toolGroups.reduce((n, g) => n + g.tools.length, 0) + corePackages.length;
