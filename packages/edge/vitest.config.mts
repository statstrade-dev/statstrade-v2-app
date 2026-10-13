import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appEnv = loadEnv('development', path.resolve(__dirname, '../../site/web-main'), '')

for (const [key, value] of Object.entries(appEnv)) {
  if (process.env[key] === undefined) process.env[key] = value
}

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
