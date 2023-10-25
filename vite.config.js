import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    plugins: [
      react(),
      eslint({
        exclude: [/virtual:/, /node_modules/],
      }),
    ],
    resolve: {
      alias: {
        "~": resolve(__dirname, "./src"),
      },
    },
    preview: {
      host: "localhost",
      port: 4173, // Default port for build preview
    },
    server: {
      open: true,
      https: env.VITE_CLIENT_PROTOCOL === "https",
      host: env.VITE_CLIENT_BASE_HOST,
      port: env.VITE_CLIENT_BASE_PORT,
    },
  };
});
