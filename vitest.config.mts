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
    noExternal: ['@sqlite.org/sqlite-wasm', 'react-native-web'],
  },
  resolve: {
    alias: {
      '@statstrade/edge': path.resolve(__dirname, './packages/edge/src'),
      '@statstrade/group': path.resolve(__dirname, './packages/group/src'),
      '@statstrade/component': path.resolve(__dirname, './packages/component/src'),
      '@statstrade/feature': path.resolve(__dirname, './packages/feature/src'),
      '@statstrade/web-main': path.resolve(__dirname, './site/web-main/src'),
      '@statstrade/web-superadmin': path.resolve(__dirname, './site/web-superadmin/src'),
      '@sqlite.org/sqlite-wasm': path.resolve(__dirname, './test/vitest-stubs/sqlite-wasm-vitest-stub.js'),
      '@tamagui/lucide-icons': path.resolve(__dirname, './test/vitest-stubs/lucide-icons-vitest-stub.js'),
      'expo-image-picker': path.resolve(__dirname, './test/vitest-stubs/expo-image-picker-vitest-stub.js'),
      'react-native-svg': path.resolve(__dirname, './test/vitest-stubs/react-native-svg-vitest-stub.js'),
      'react-native-video': path.resolve(__dirname, './test/vitest-stubs/react-native-video-vitest-stub.js'),
      '@stripe/react-stripe-js': path.resolve(__dirname, './test/vitest-stubs/stripe-react-vitest-stub.js'),
      '@stripe/stripe-js': path.resolve(__dirname, './test/vitest-stubs/stripe-js-vitest-stub.js'),
      'react-native': 'react-native-web',
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
