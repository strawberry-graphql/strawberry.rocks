import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";

import { loader } from "@monaco-editor/react";
import { setupMonaco } from "./components/editor/setup-monaco";
import { PyodideProvider } from "./components/pyodide.tsx";

loader.init().then(setupMonaco);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PyodideProvider>
      <App />
    </PyodideProvider>
  </React.StrictMode>,
);