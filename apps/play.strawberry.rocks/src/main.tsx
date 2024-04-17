import App from "./app.tsx";
import { setupMonaco } from "./components/editor/setup-monaco";
import { PyodideProvider } from "./components/strawberry/pyodide.tsx";
import "./index.css";
import { loader } from "@monaco-editor/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

loader.init().then(setupMonaco);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PyodideProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PyodideProvider>
  </React.StrictMode>
);
