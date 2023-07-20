import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      __APP_ENV__: env.APP_ENV,
      global: {},
    },
    plugins: [react(), eslint()],
    resolve: {
      alias: {
        "~": resolve(__dirname, "./src"),
      },
    },
    server: {
      open: true,
      https: env.VITE_CLIENT_PROTOCOL === "https",
      host: env.VITE_CLIENT_BASE_HOST,
      port: env.VITE_CLIENT_BASE_PORT,
    },
  };
});
