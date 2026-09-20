import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ],
  },
  server: {

  },
  define: {
    'process.env': process.env,
    global: 'window',
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      loader: {
        '.js': 'jsx'
      },
    },
  },
});
