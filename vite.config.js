import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: [
        resolve(__dirname, 'index.html'),
      ],
      output: {
        entryFileNames: (chunkInfo) => {
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@/': '/src/',
    },
  },
  publicDir: 'public',
});

