// @ts-check
import { defineConfig } from "astro/config";

// `zuke-build.github.io` is an organization root Pages site, so it is served
// from the domain root — `base` stays at "/".
export default defineConfig({
  site: "https://zuke-build.github.io",
  trailingSlash: "ignore",
  markdown: {
    shikiConfig: {
      theme: "night-owl",
    },
  },
});
