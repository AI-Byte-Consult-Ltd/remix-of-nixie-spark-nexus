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
          // recharts is only imported by ui/chart.tsx, used only by the
          // already-lazy-loaded NicsTraderApp route. Verified (see PR notes)
          // that every package below is exclusively part of recharts' own
          // dependency tree — none of them are shared with code that loads
          // eagerly — so routing them here keeps them out of every other
          // page's initial bundle instead of silently falling into "vendor".
          if (
            /\/(recharts|d3-array|d3-color|d3-ease|d3-format|d3-interpolate|d3-path|d3-scale|d3-shape|d3-time|d3-time-format|d3-timer|decimal\.js-light|dom-helpers|eventemitter3|fast-equals|internmap|lodash|prop-types|react-is|react-smooth|react-transition-group|recharts-scale|tiny-invariant|victory-vendor)\//.test(
              id,
            )
          )
            return "vendor-charts";
          if (id.includes("/framer-motion/") || id.includes("/motion-dom/") || id.includes("/motion-utils/"))
            return "vendor-motion";
          if (id.includes("/@supabase/")) return "vendor-supabase";
          return "vendor";
        },
      },
    },
  },
}));
