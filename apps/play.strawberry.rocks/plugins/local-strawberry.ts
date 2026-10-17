import { execFile } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { Plugin } from "vite";

const execFileAsync = promisify(execFile);

const ROUTE = "/__local-strawberry";
const CHANGED_EVENT = "local-strawberry:changed";

/**
 * Dev-only: lets the playground run a local Strawberry checkout instead of a
 * release from PyPI.
 *
 * `GET /__local-strawberry/wheel` builds a fresh wheel of the checkout with
 * `uv build` and returns its URL, which the Pyodide worker installs with
 * micropip. Whenever a Python file in the checkout changes, the client is
 * notified so it can reload Pyodide with the new code.
 */
export function localStrawberry(strawberryPath: string | undefined): Plugin {
  const root = strawberryPath ? path.resolve(strawberryPath) : null;
  const available =
    root !== null && existsSync(path.join(root, "pyproject.toml"));

  // Build id -> directory. Builds are kept until the server restarts, so a
  // wheel URL stays valid even when another build (e.g. from a second tab)
  // finishes before micropip downloads it.
  const builds = new Map<string, string>();
  let buildsDir = "";

  async function buildWheel(root: string) {
    await mkdir(buildsDir, { recursive: true });

    const outDir = await mkdtemp(path.join(buildsDir, "build-"));
    const buildId = path.basename(outDir);

    builds.set(buildId, outDir);

    await execFileAsync("uv", ["build", "--wheel", "--out-dir", outDir, root]);

    const wheel = (await readdir(outDir)).find((file) => file.endsWith(".whl"));

    if (!wheel) {
      throw new Error(`uv build did not produce a wheel in ${outDir}`);
    }

    return `${ROUTE}/${buildId}/${wheel}`;
  }

  function cleanUp() {
    rmSync(buildsDir, { recursive: true, force: true });
    builds.clear();
  }

  return {
    name: "local-strawberry",
    // Always defined, so production builds get `false`
    config(_, { command }) {
      return {
        define: {
          __LOCAL_STRAWBERRY__: JSON.stringify(
            command === "serve" && available
          ),
        },
      };
    },

    configureServer(server) {
      if (!root) {
        return;
      }

      if (!available) {
        server.config.logger.warn(
          `  Local Strawberry: no pyproject.toml in ${root}, ignoring`
        );
        return;
      }

      server.config.logger.info(`  Local Strawberry: ${root}`);

      // Lives in Vite's cache dir and is wiped on start, so builds left
      // behind by a killed server don't pile up
      buildsDir = path.join(server.config.cacheDir, "local-strawberry");
      cleanUp();
      server.httpServer?.once("close", cleanUp);

      server.middlewares.use(ROUTE, async (req, res) => {
        const url = req.url ?? "/";

        res.setHeader("Cache-Control", "no-store");

        // Only the playground itself may trigger builds, not other sites
        // open in the browser
        const fetchSite = req.headers["sec-fetch-site"];

        if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }

        try {
          if (url === "/wheel") {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ url: await buildWheel(root) }));
            return;
          }

          const [buildId, wheel] = url.slice(1).split("/");
          const buildDir = builds.get(buildId);

          if (
            !buildDir ||
            !wheel?.endsWith(".whl") ||
            wheel !== path.basename(wheel)
          ) {
            res.statusCode = 404;
            res.end("Not found");
            return;
          }

          res.setHeader("Content-Type", "application/octet-stream");
          res.end(await readFile(path.join(buildDir, wheel)));
        } catch (error) {
          const message =
            (error as { stderr?: string }).stderr || String(error);

          server.config.logger.error(`[local-strawberry] ${message}`);
          res.statusCode = 500;
          res.end(message);
        }
      });

      const packageDir = path.join(root, "strawberry");
      let timeout: NodeJS.Timeout | undefined;

      server.watcher.add(packageDir);
      server.watcher.on("all", (_event, file) => {
        if (!file.startsWith(packageDir + path.sep) || !file.endsWith(".py")) {
          return;
        }

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          server.ws.send({ type: "custom", event: CHANGED_EVENT });
        }, 300);
      });
    },
  };
}
