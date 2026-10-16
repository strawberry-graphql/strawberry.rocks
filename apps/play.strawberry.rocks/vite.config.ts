import { localStrawberry } from "./plugins/local-strawberry";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  return {
    plugins: [
      react(),
      // Dev only: set STRAWBERRY_PATH=/path/to/strawberry (e.g. in
      // .env.local) to run a local Strawberry checkout in the playground
      localStrawberry(
        env.STRAWBERRY_PATH && path.resolve(__dirname, env.STRAWBERRY_PATH)
      ),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
