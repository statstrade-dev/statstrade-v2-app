import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@statstrade/edge': path.resolve(__dirname, './src'),
    },
  },
  test: {
    setupFiles: ['./test/setup.js'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
