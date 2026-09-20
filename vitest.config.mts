import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@statstrade/edge': path.resolve(__dirname, './app-gen/edge/src'),
      '@statstrade/group': path.resolve(__dirname, './app-gen/group/src'),
      '@statstrade/component': path.resolve(__dirname, './app-lib/component/src'),
      '@statstrade/feature': path.resolve(__dirname, './app-lib/feature/src'),
      '@statstrade/nextjs': path.resolve(__dirname, './app/nextjs/src'),
    },
  },
  test: {
    setupFiles: ['./app-gen/edge/test/setup.js'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
