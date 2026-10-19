import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:5000";

  return {
    plugins: [react(), {
      name: "research-directory-entry",
      apply: "build",
      // /research also contains PDFs. Nginx resolves that physical directory
      // before the SPA fallback, so it needs the same app entry as the web root.
      generateBundle: {
        order: "post",
        handler(_options, bundle) {
          const entry = bundle["index.html"];
          if (entry?.type === "asset") this.emitFile({ type: "asset", fileName: "research/index.html", source: entry.source });
        },
      },
    }],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "lucide-react": path.resolve(__dirname, "./src/lib/clean-icons.tsx"),
      },
    },
    server: {
      port: 3000,
      proxy: {
        "/uploads": { target: apiProxyTarget, changeOrigin: true },
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
