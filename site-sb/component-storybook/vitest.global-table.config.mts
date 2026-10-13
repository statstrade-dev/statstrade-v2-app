import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    loader: 'jsx',
  },
  resolve: {
    alias: {
      '@statstrade/edge/lib/statstrade-superadmin/a03/s03/global-table.jsx':
        path.resolve(__dirname, '../../site/web-superadmin/src/a03/s03/global-table.jsx'),
      '@statstrade/edge/lib/js/react/ext-page.js':
        path.resolve(__dirname, '../../test/vitest-stubs/global-table-ext-page-vitest-stub.js'),
      '@statstrade/edge': path.resolve(__dirname, '../../packages/edge/src'),
      '@xtalk/db/node/client-base.js':
        path.resolve(__dirname, '../../test/vitest-stubs/global-table-client-base-vitest-stub.js'),
      '@xtalk/substrate/page-core.js':
        path.resolve(__dirname, '../../test/vitest-stubs/global-table-page-core-vitest-stub.js'),
      '@xtalk/substrate/substrate.js':
        path.resolve(__dirname, '../../test/vitest-stubs/global-table-substrate-vitest-stub.js'),
      'react-native': path.resolve(__dirname, '../../test/vitest-stubs/react-native-global-table-vitest-stub.js'),
      'tamagui': path.resolve(__dirname, '../../test/vitest-stubs/tamagui-vitest-stub.js'),
      '@tamagui/lucide-icons': path.resolve(__dirname, '../../test/vitest-stubs/tamagui-icons-vitest-stub.js'),
    },
  },
  test: {
    include: ['src/stories/superadmin/a03/s03/global-table-test.stories.jsx'],
    setupFiles: ['../../packages/edge/test/setup.js'],
    poolOptions: {
      threads: { singleThread: true },
    },
  },
})
