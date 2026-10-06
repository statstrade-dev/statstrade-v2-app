import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/stories/ui-*.stories.jsx',
    '../src/stories/**/*.csf.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    // '@storybook/addon-react-native-web',
  ],
  framework: '@storybook/react-vite',
  core: {
    builder: '@storybook/builder-vite',
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    return {
      ...config,
      build: {
        commonjsOptions: {
          transformMixedEsModules: true,
        },
        emptyOutDir: false,
      },
      envPrefix: ['VITE_', 'STORYBOOK_', 'NEXT_PUBLIC_'],
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias || {}),
          // The component source imports the generated CommonJS runtime, but
          // Storybook needs the browser-native ESM runtime for named imports.
          '@xtalk/lang/common-data.js': path.resolve(__dirname, '../../../packages/edge/src/lib/xt/lang/common-data.jsx'),
          '@xtalk/lang/common-lib.js': path.resolve(__dirname, '../../../packages/edge/src/lib/xt/lang/common-lib.jsx'),
          '@xtalk/lang/common-sort-by.js': path.resolve(__dirname, '../../../packages/edge/src/lib/xt/lang/common-sort-by.jsx'),
          '@xtalk/lang/common-string.js': path.resolve(__dirname, '../../../packages/edge/src/lib/xt/lang/common-string.jsx'),
          'react-native': 'react-native-web',
          'react-native-svg': 'react-native-svg-web',
          '@s77rt/react-native-date-picker': path.resolve(__dirname, '../src/ext/shims/DatePicker.tsx'),
          'react-native-video': path.resolve(__dirname, '../src/ext/shims/Video.tsx'),
          'react-native-gesture-handler': path.resolve(__dirname, '../src/ext/shims/GestureHandler.tsx'),
          'react-native-device-info': path.resolve(__dirname, '../src/ext/shims/DeviceInfo.ts'),
          'expo-constants': path.resolve(__dirname, '../src/ext/shims/ExpoConstants.ts'),
          'expo-linking': path.resolve(__dirname, '../src/ext/shims/ExpoLinking.ts'),
          'expo-modules-core': path.resolve(__dirname, '../src/ext/shims/ExpoModulesCore.ts'),
          'expo-linear-gradient': path.resolve(__dirname, '../src/ext/shims/ExpoLinearGradient.jsx'),
          'react-native-screens': path.resolve(__dirname, '../src/ext/shims/Screens.tsx'),
          'react-native-safe-area-context': path.resolve(__dirname, '../src/ext/shims/SafeAreaContext.tsx'),
          'react-native-maps': path.resolve(__dirname, '../src/ext/shims/Maps.tsx'),
          'react-native-reanimated': path.resolve(__dirname, '../src/ext/shims/Reanimated.ts'),
          // Next.js app router hooks aren't available in Storybook, alias to a shim
          'next/navigation': path.resolve(__dirname, '../src/ext/shims/NextNavigation.ts'),
        },

      },
    };
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
    check: false,
  },
};

export default config;
