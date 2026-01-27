const params = new URL(self.location).searchParams;
const PYODIDE_VERSION = params.get("pyodide");

importScripts(
  `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`
);

async function loadPyodideAndPackages(strawberryVersion) {
  self.pyodide = await loadPyodide();

  await self.pyodide.loadPackage(["micropip"]);

  const versionSuffix =
    strawberryVersion === "latest" ? "" : `==${strawberryVersion}`;

  await self.pyodide.runPythonAsync(`
    import micropip

    await micropip.install([
        "typing_extensions>=4.11.0",
        "ssl",
    ])
    print("Installing strawberry-graphql${versionSuffix}...")
    await micropip.install([
        "strawberry-graphql${versionSuffix}",
        "fastapi",
        "httpx",
    ])
    print(micropip.list())
  `);
}

self.onmessage = async (event) => {
  if (event.data.type === "load") {
    const strawberryVersion = event.data.version;

    loadPyodideAndPackages(strawberryVersion).then(() => {
      self.postMessage({ ready: true });
    });
    return;
  }

  if (event.data.type === "run") {
    const { id, python, ...context } = event.data;

    for (const key of Object.keys(context)) {
      self[key] = context[key];
    }

    try {
      await self.pyodide.loadPackagesFromImports(python);

      const result = await pyodide.runPythonAsync(python);

      self.postMessage({ result, id });
    } catch (error) {
      self.postMessage({ error: error.message, id });
    }
  }
};
