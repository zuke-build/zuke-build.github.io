// @ts-check
import { defineConfig } from "astro/config";
import pagefind from "./src/integrations/pagefind.ts";

// `zuke-build.github.io` is an organization root Pages site, so it is served
// from the domain root — `base` stays at "/".
export default defineConfig({
  site: "https://zuke-build.github.io",
  trailingSlash: "ignore",
  // The API reference moved from /docs/api to the standalone /api section.
  redirects: {
    "/docs/api": "/api",
    "/docs/api/[pkg]": "/api/[pkg]",
  },
  markdown: {
    shikiConfig: {
      theme: "night-owl",
    },
  },
  // Full-text search over the docs + API reference (see src/integrations).
  integrations: [pagefind()],
});
