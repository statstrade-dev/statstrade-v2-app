import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@statstrade/edge': path.resolve(__dirname, './packages/edge/src'),
      '@statstrade/group': path.resolve(__dirname, './packages/group/src'),
      '@statstrade/component': path.resolve(__dirname, './packages/component/src'),
      '@statstrade/feature': path.resolve(__dirname, './packages/feature/src'),
      '@statstrade/web-main': path.resolve(__dirname, './site/web-main/src'),
      '@statstrade/web-superadmin': path.resolve(__dirname, './site/web-superadmin/src'),
    },
  },
  test: {
    setupFiles: ['./packages/edge/test/setup.js'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
