import App from "./app.tsx";
import { setupMonaco } from "./components/editor/setup-monaco";
import { PyodideProvider } from "./components/strawberry/pyodide.tsx";
import "./index.css";
import { loader } from "@monaco-editor/react";
import React from "react";
import ReactDOM from "react-dom/client";

loader.init().then(setupMonaco);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PyodideProvider>
      <App />
    </PyodideProvider>
  </React.StrictMode>
);
