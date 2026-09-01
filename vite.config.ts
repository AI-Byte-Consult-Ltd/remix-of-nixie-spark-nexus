import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/recharts/")) return "vendor-charts";
          if (id.includes("/framer-motion/")) return "vendor-motion";
          if (id.includes("/@supabase/")) return "vendor-supabase";
          return "vendor";
        },
      },
    },
  },
}));
