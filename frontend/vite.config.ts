import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import path from 'path';
import checker from 'vite-plugin-checker';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), checker({
    typescript: true,
    eslint: {
      useFlatConfig: true,
      lintCommand: 'eslint "./src/**/*.{ts,tsx}" --ext .ts,.tsx',
      
    },
    overlay: false,
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
