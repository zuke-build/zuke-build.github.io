/**
 * Full-text search index for the docs and API reference.
 *
 * After `astro build` finishes, Pagefind crawls the static HTML in `dist/`
 * and writes a search bundle to `dist/pagefind/`. Only elements marked with
 * `data-pagefind-body` (the docs / API article body, see DocsLayout) are
 * indexed, so the landing page, nav, and footer never show up in results.
 *
 * The search UI (`src/components/Search.astro`) loads `/pagefind/pagefind.js`
 * on demand in the browser — nothing is fetched until a visitor opens search.
 *
 * `astro dev` never produces `dist/`, so in development the middleware below
 * serves the bundle from the most recent production build instead. Run
 * `npm run build` once and the dev server picks it up.
 */
import type { AstroIntegration } from "astro";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BUNDLE_DIR = "pagefind";

const CONTENT_TYPES: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
};

export default function pagefind(): AstroIntegration {
  let outDir = "";
  return {
    name: "zuke:pagefind",
    hooks: {
      "astro:config:done": ({ config }) => {
        outDir = fileURLToPath(config.outDir);
      },

      "astro:build:done": async ({ dir, logger }) => {
        const site = fileURLToPath(dir);
        // Imported lazily so the (platform-specific) binary is only resolved
        // when an index is actually built.
        const pf = await import("pagefind");
        const { index, errors } = await pf.createIndex({
          // The site is English-only; one index instead of one per <html lang>.
          forceLanguage: "en",
          // Note: anything inside the body that is not content is marked
          // `data-pagefind-ignore` in the markup rather than excluded here.
          // (Excluding a void element such as an <input> via a selector makes
          // Pagefind 1.5 drop the whole page, so don't add one.)
        });
        if (!index) {
          throw new Error(`pagefind: could not create index: ${errors.join("; ")}`);
        }
        try {
          const added = await index.addDirectory({ path: site });
          if (added.errors.length) {
            throw new Error(`pagefind: ${added.errors.join("; ")}`);
          }
          const written = await index.writeFiles({
            outputPath: path.join(site, BUNDLE_DIR),
          });
          if (written.errors.length) {
            throw new Error(`pagefind: ${written.errors.join("; ")}`);
          }
          logger.info(
            `indexed ${added.page_count} page(s) → ${path.relative(process.cwd(), written.outputPath)}`,
          );
        } finally {
          await pf.close();
        }
      },

      "astro:server:setup": ({ server, logger }) => {
        const bundle = path.join(outDir, BUNDLE_DIR);
        if (!existsSync(bundle)) {
          logger.warn(
            "no search index yet — run `npm run build` once and the dev server will serve it from dist/",
          );
        }
        server.middlewares.use(`/${BUNDLE_DIR}`, (req, res, next) => {
          const rel = decodeURIComponent((req.url ?? "/").split("?")[0]);
          const file = path.normalize(path.join(bundle, rel));
          // stay inside the bundle directory
          if (!file.startsWith(bundle + path.sep) || !existsSync(file) || !statSync(file).isFile()) {
            return next();
          }
          res.setHeader(
            "Content-Type",
            CONTENT_TYPES[path.extname(file)] ?? "application/octet-stream",
          );
          res.setHeader("Cache-Control", "no-store");
          createReadStream(file).pipe(res);
        });
      },
    },
  };
}
