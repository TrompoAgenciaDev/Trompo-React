import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@a': '/src/assets',
      '@as': '/src/assets/styles',
      '@ai': '/src/assets/icons',
      '@ap': '/src/assets/portfolioImg',
      '@at': '/src/assets/toolsImg',
    },
  },
});
