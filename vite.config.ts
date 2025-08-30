import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(() => {
  const outputFileName = process.env.VITE_OUTPUT_FILE_NAME || 'fusion-deposit-widget';
  
  return {
    plugins: [
      react(), 
      tailwindcss(),
      checker({
        typescript: true,
      }),
    ],
    test: {
      environment: 'jsdom',
    },
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
          entryFileNames: `public/${outputFileName}.js`,
          assetFileNames: `public/${outputFileName}[extname]`,
        },
      },
    },
  }
})
