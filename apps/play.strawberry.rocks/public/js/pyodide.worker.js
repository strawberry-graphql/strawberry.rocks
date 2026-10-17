const params = new URL(self.location).searchParams;
const PYODIDE_VERSION = params.get("pyodide");

async function getStrawberryRequirement(strawberryVersion) {
  if (strawberryVersion === "latest") {
    return "strawberry-graphql";
  }

  // Wheel built from a local checkout by the dev server, see
  // plugins/local-strawberry.ts
  if (strawberryVersion === "local") {
    const response = await fetch("/__local-strawberry/wheel");

    if (!response.ok) {
      throw new Error(
        `Failed to build local strawberry: ${await response.text()}`
      );
    }

    const { url } = await response.json();

    return new URL(url, self.location.origin).href;
  }

  return `strawberry-graphql==${strawberryVersion}`;
}

// Progress shown while loading, before the worker reports ready
function reportStatus(status) {
  self.postMessage({ status });
}

async function loadPyodideAndPackages(strawberryVersion) {
  reportStatus("Loading Python");

  // Pyodide 314+ only supports module workers, so load the ES module build
  const { loadPyodide } = await import(
    `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.mjs`
  );

  self.pyodide = await loadPyodide();

  await self.pyodide.loadPackage(["micropip"]);

  reportStatus(
    strawberryVersion === "local"
      ? "Building local Strawberry"
      : "Installing Strawberry"
  );

  const requirement = JSON.stringify(
    await getStrawberryRequirement(strawberryVersion)
  );

  if (strawberryVersion === "local") {
    reportStatus("Installing Strawberry");
  }

  await self.pyodide.runPythonAsync(`
    import micropip

    await micropip.install([
        "typing_extensions>=4.11.0",
    ])
    print("Installing " + ${requirement} + "...")
    await micropip.install([
        ${requirement},
        "fastapi",
        "httpx",
    ])
    print(micropip.list())
  `);
}

self.onmessage = async (event) => {
  if (event.data.type === "load") {
    const strawberryVersion = event.data.version;

    self.loading = loadPyodideAndPackages(strawberryVersion);

    // Report ready even when loading failed, so the UI stops waiting; the
    // error is returned when running code instead
    self.loading.then(
      () => self.postMessage({ ready: true }),
      (error) => {
        console.error(error);
        self.postMessage({ ready: true });
      }
    );
    return;
  }

  if (event.data.type === "run") {
    const { id, python, globals = {} } = event.data;

    try {
      await self.loading;
    } catch (error) {
      self.postMessage({
        error: `Failed to load Pyodide: ${error.message}`,
        id,
      });
      return;
    }

    const pythonGlobals = self.pyodide.toPy(globals);

    try {
      await self.pyodide.loadPackagesFromImports(python);

      const result = await self.pyodide.runPythonAsync(python, {
        globals: pythonGlobals,
      });

      self.postMessage({ result, id });
    } catch (error) {
      self.postMessage({ error: error.message, id });
    } finally {
      pythonGlobals.destroy();
    }
  }
};
