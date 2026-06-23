/**
 * Zuke build for the Zuke website.
 *
 * The site is an Astro project, but every build step is driven by Zuke itself —
 * we dogfood the tool that this very website documents. Node tooling is invoked
 * through the typed `@zuke/npm` wrapper, and ad-hoc shell through `$`.
 *
 *   ./zuke            # run the default target (build)
 *   ./zuke build      # install deps + type-check + build into dist/
 *   ./zuke dev        # start the Astro dev server
 *   ./zuke --list     # list every target
 */
import { Build, run, target } from "jsr:@zuke/core";
import { $ } from "jsr:@zuke/core/shell";
import { NpmTasks } from "jsr:@zuke/npm";

class SiteBuild extends Build {
  clean = target()
    .description("Remove the previous build output (dist/).")
    .executes(async () => {
      await $`rm -rf dist`.noThrow();
    });

  install = target()
    .description("Clean-install Node dependencies from the lockfile.")
    .executes(async () => {
      await NpmTasks.ci();
    });

  check = target()
    .description("Type-check the Astro project.")
    .dependsOn(this.install)
    .executes(async () => {
      await NpmTasks.run((s) => s.script("check"));
    });

  build = target()
    .description("Build the static site into dist/.")
    .dependsOn(this.clean, this.check)
    .executes(async () => {
      await NpmTasks.run((s) => s.script("build"));
    });

  preview = target()
    .description("Serve the built site locally for a final look.")
    .dependsOn(this.build)
    .executes(async () => {
      await NpmTasks.run((s) => s.script("preview"));
    });

  dev = target()
    .description("Start the Astro dev server with hot reload.")
    .dependsOn(this.install)
    .executes(async () => {
      await NpmTasks.run((s) => s.script("dev"));
    });

  // The default target runs when no target name is passed to `./zuke`.
  default = target()
    .description("Default: build the site.")
    .dependsOn(this.build)
    .executes(() => {});
}

await run(SiteBuild);
