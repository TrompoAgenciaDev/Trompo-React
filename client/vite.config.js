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

    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split(".").pop();
          if (ext === "css") return "assets/[name].[hash].css";
          return "assets/[name].[hash][extname]";
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