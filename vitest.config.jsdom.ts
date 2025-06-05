import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dynamicImport from 'vite-plugin-dynamic-import';
import checker from 'vite-plugin-checker';

export default defineConfig(() => ({
  plugins: [
    react(),
    tsconfigPaths(),
    dynamicImport(),
    checker({
      typescript: true,
    }),
  ],
  define: {
    global: {},
  },
  server: {
    port: 8088,
  },
  preview: {
    port: 9099,
  },
  build: {
    outDir: 'build',
  },
  test: {
    exclude: [
      // default
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      // custom
      '**/src/**/*.fork.spec.ts',
      '**/tmp/**',
    ],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.tsx',
    css: true,
  },
}));
