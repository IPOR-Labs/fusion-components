import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      checker({
        typescript: true,
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    root: '.',
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        input: 'build.html',
        output: {
          inlineDynamicImports: true,
          entryFileNames: 'fusion-deposit-widget.js',
          assetFileNames: 'fusion-deposit-widget[extname]',
        },
      },
    },
  }
})
