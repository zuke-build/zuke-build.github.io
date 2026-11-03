// The language SDKs the site documents. Hand-maintained: one entry per SDK.
//
// Adding a language is an entry here plus its synced reference data under
// src/data/ and its guide under src/pages/docs/<id>/. The API reference routes
// (/api for the first entry, /api/<id> for the rest), the API sidebar, the
// language switchers and the docs sidebar group are all derived from this list.
import typescriptApi from "./api.json";
import pythonApi from "./api-python.json";

/** One class member in a generated reference. */
export interface ApiMember {
  name: string;
  kind: string;
  optional: boolean;
  signature: string;
  doc: string;
}

/** One symbol in a generated reference. */
export interface ApiSymbol {
  name: string;
  kind: string;
  doc: string;
  signature: string;
  deprecated: boolean;
  members?: ApiMember[];
}

/** One package (or module) in a generated reference. */
export interface ApiPackage {
  name: string;
  dir: string;
  summary: string;
  symbols: ApiSymbol[];
}

/** The `api.json` contract every SDK's generator emits (schema version 1). */
export interface ApiReference {
  version: number;
  generated: string;
  packages: ApiPackage[];
}

export interface Sdk {
  /** URL segment and key: `/api/<id>`, `/docs/<id>`. */
  id: string;
  /** The language's name, as a tab or a heading shows it. */
  label: string;
  /** The Shiki language its signatures and samples are highlighted as. */
  lang: string;
  /** The build file a project of this SDK keeps. */
  buildFile: string;
  /** The generated reference, synced from the SDK's repository. */
  api: ApiReference;
  /** Where the API reference lives: `/api` or `/api/<id>`. */
  apiBase: string;
  /** What the reference is generated from, for the overview's lead (trusted HTML). */
  apiSource: string;
  /** The package registry a package page links to. */
  registry: (pkg: ApiPackage) => { href: string; label: string };
  /** The registry, for the sidebar. */
  registryHome: { href: string; label: string };
  /** The SDK's source repository. */
  repo: string;
  /** Its guide's pages; empty for the SDK the main guide is written in. */
  docs: { href: string; label: string }[];
}

export const sdks: Sdk[] = [
  {
    id: "typescript",
    label: "TypeScript",
    lang: "ts",
    buildFile: "zuke.ts",
    api: typescriptApi,
    apiBase: "/api",
    apiSource: "with <code>deno doc</code> from the <code>@zuke/*</code> packages",
    registry: (pkg) => ({ href: `https://jsr.io/${pkg.name}`, label: `${pkg.name} on JSR ↗` }),
    registryHome: { href: "https://jsr.io/@zuke", label: "JSR packages ↗" },
    repo: "https://github.com/zuke-build/zuke",
    docs: [],
  },
  {
    id: "python",
    label: "Python",
    lang: "python",
    buildFile: "build.py",
    api: pythonApi,
    apiBase: "/api/python",
    apiSource: "from the docstrings of the <code>zuke</code> package on PyPI",
    registry: () => ({ href: "https://pypi.org/project/zuke/", label: "zuke on PyPI ↗" }),
    registryHome: { href: "https://pypi.org/project/zuke/", label: "zuke on PyPI ↗" },
    repo: "https://github.com/zuke-build/zuke-python",
    docs: [
      { href: "/docs/python", label: "Python quickstart" },
      { href: "/docs/python/authoring", label: "Authoring in Python" },
      { href: "/docs/python/context", label: "Bodies, context & tools" },
    ],
  },
];

