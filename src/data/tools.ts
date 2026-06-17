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
      { name: "Deno", pkg: "@zuke/deno", desc: "test, check, fmt, lint, publish" },
      { name: "npm", pkg: "@zuke/npm", desc: "ci, install, run scripts, publish" },
      { name: "Bun", pkg: "@zuke/bun", desc: "install, run, bun test" },
      { name: "pnpm", pkg: "@zuke/pnpm", desc: "frozen installs, --filter workspaces" },
      { name: "Yarn", pkg: "@zuke/yarn", desc: "Classic & Berry support" },
    ],
  },
  {
    category: "Containers & orchestration",
    blurb: "Build images and ship to clusters from a typed pipeline.",
    tools: [
      { name: "Docker", pkg: "@zuke/docker", desc: "build, tag, push" },
      { name: "Docker Compose", pkg: "@zuke/docker-compose", desc: "up, down, services" },
      { name: "kubectl", pkg: "@zuke/kubectl", desc: "apply, rollout, contexts" },
    ],
  },
  {
    category: "Lint & format",
    blurb: "Keep the tree clean with first-class linters and formatters.",
    tools: [
      { name: "oxlint", pkg: "@zuke/oxlint", desc: "ultra-fast Rust linter" },
      { name: "ESLint", pkg: "@zuke/eslint", desc: "configs, --fix, caching" },
      { name: "dprint", pkg: "@zuke/dprint", desc: "pluggable formatting" },
      { name: "cspell", pkg: "@zuke/cspell", desc: "spell-check your sources" },
    ],
  },
  {
    category: "Test & browsers",
    blurb: "Run unit and end-to-end suites with coverage wired in.",
    tools: [
      { name: "Jest", pkg: "@zuke/jest", desc: "projects, coverage thresholds" },
      { name: "Vitest", pkg: "@zuke/vitest", desc: "watch, coverage, UI" },
      { name: "Playwright", pkg: "@zuke/playwright", desc: "cross-browser e2e" },
    ],
  },
  {
    category: "TypeScript runners",
    blurb: "Execute and type-check TypeScript without a build step.",
    tools: [
      { name: "tsx", pkg: "@zuke/tsx", desc: "run TS directly on Node" },
      { name: "tsgo", pkg: "@zuke/tsgo", desc: "the native Go TypeScript compiler" },
    ],
  },
  {
    category: "Cloud & infrastructure",
    blurb: "Provision and deploy with infra-as-code, typed end to end.",
    tools: [
      { name: "gcloud", pkg: "@zuke/gcloud", desc: "deploy, run, IAM" },
      { name: "Terraform", pkg: "@zuke/terraform", desc: "init, plan, apply" },
      { name: "OpenTofu", pkg: "@zuke/tofu", desc: "open-source Terraform" },
    ],
  },
  {
    category: "Version control & CI",
    blurb: "Script Git and GitHub straight from your build.",
    tools: [
      { name: "Git", pkg: "@zuke/git", desc: "tag, commit, rev-parse" },
      { name: "GitHub CLI", pkg: "@zuke/gh", desc: "releases, PRs, workflows" },
    ],
  },
  {
    category: "Supply-chain security",
    blurb: "Scan workflows and secrets as part of the gate.",
    tools: [
      { name: "Security", pkg: "@zuke/security", desc: "zizmor, actionlint, gitleaks" },
    ],
  },
];

/** The engine packages that power every build. */
export const corePackages = [
  { name: "@zuke/core", desc: "the Build base class, target() graph, and $ shell" },
  { name: "@zuke/cli", desc: "the global `zuke` command: setup, run, list" },
  { name: "@zuke/cmd", desc: "the typed process layer the wrappers are built on" },
];
