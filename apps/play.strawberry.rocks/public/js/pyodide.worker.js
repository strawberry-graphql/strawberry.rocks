importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");

async function loadPyodideAndPackages() {
    self.pyodide = await loadPyodide();

    await self.pyodide.loadPackage(["micropip"]);

    await self.pyodide.runPythonAsync(`
    import micropip

    print("Installing packages...")
  `);
}

let pyodideReadyPromise = loadPyodideAndPackages().then(() => {
    self.postMessage({ ready: true });
});

self.onmessage = async (event) => {
    await pyodideReadyPromise;

    const { id, python, ...context } = event.data;

    for (const key of Object.keys(context)) {
        self[key] = context[key];
    }

    try {
        await self.pyodide.loadPackagesFromImports(python);

        const result = pyodide.runPython(python);

        self.postMessage({ result, id });
    } catch (error) {
        self.postMessage({ error: error.message, id });
    }
};
