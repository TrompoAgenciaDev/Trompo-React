import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from 'vite-plugin-svgr';


export default defineConfig({
  base: "/",
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": "/src",
      "@a": "/src/assets",
      "@as": "/src/assets/styles",
      "@ai": "/src/assets/icons",
      "@ap": "/src/assets/portfolioImg",
    },
  },
});
