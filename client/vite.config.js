import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    svgr(),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  define: {
    "import.meta.env.BUILD_TIME": JSON.stringify(Date.now()),
  },

  resolve: {
    alias: {
      "@": "/src",
      "@a": "/src/assets",
      "@as": "/src/assets/styles",
      "@ai": "/src/assets/icons",
      "@ap": "/src/assets/portfolioImg",
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    cssCodeSplit: true,
    target: "esnext",
    minify: "terser",
    chunkSizeWarningLimit: 800,
    reportCompressedSize: false,

    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split(".").pop();
          if (ext === "css") return "assets/[name].[hash].css";
          return "assets/[name].[hash][extname]";
        },
        manualChunks: (id) => {
          // Separar vendor de React y React DOM
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id === "node_modules/react" ||
            id === "node_modules/react-dom" ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react";
          }
          // Separar vendor de Framer Motion
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/motion/")) {
            return "vendor-framer";
          }
          // Separar vendor de React Router
          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run/router")) {
            return "vendor-router";
          }
          // Separar otros vendors grandes
          if (id.includes("node_modules")) {
            // Agrupar otros node_modules en vendor-general
            return "vendor-general";
          }
        },
      },
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },

  server: {
    open: true,
    compress: true,
    port: 5173,
  },
});