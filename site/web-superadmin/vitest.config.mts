import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    loader: 'jsx',
  },
  ssr: {
    noExternal: ['@sqlite.org/sqlite-wasm'],
  },
  resolve: {
    alias: {
      '@statstrade/edge': path.resolve(__dirname, '../../packages/edge/src'),
      '@statstrade/component/layout/layout-base.jsx': path.resolve(__dirname, '../../test/vitest-stubs/layout-base-vitest-stub.jsx'),
      '@statstrade/component/layout/common/frame-devtool.jsx': path.resolve(__dirname, '../../test/vitest-stubs/frame-devtool-vitest-stub.js'),
      '@statstrade/component': path.resolve(__dirname, '../../packages/component/src'),
      '@statstrade/web-superadmin/a03/s03/global-table.jsx': path.resolve(__dirname, '../../test/vitest-stubs/global-table-vitest-stub.js'),
      '@statstrade/web-superadmin': path.resolve(__dirname, './src'),
      '@xtalk/db/node/runtime.js': path.resolve(__dirname, '../../test/vitest-stubs/sharedworker-runtime-vitest-stub.js'),
      '@sqlite.org/sqlite-wasm': path.resolve(__dirname, '../../test/vitest-stubs/sqlite-wasm-vitest-stub.js'),
      'tamagui': path.resolve(__dirname, '../../test/vitest-stubs/tamagui-vitest-stub.js'),
      '@tamagui/lucide-icons': path.resolve(__dirname, '../../test/vitest-stubs/tamagui-icons-vitest-stub.js'),
      'react-native': 'react-native-web',
    },
  },
  test: {
    setupFiles: ['packages/edge/test/setup.js'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
