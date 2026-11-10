import { defineConfig } from 'vitest/config'
import { transformWithEsbuild } from 'vite'

export default defineConfig({
  plugins: [{
    name: 'generated-jsx-in-js',
    async transform(code, id) {
      if (id.endsWith('.js') && !id.includes('/node_modules/')) {
        return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' })
      }
    },
  }],
  test: {
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
