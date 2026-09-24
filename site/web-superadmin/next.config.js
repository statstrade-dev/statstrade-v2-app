/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('node:path')

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const plugins = [
  withTamagui({
    config: '../../packages/config/src/tamagui.config.ts',
    components: ['tamagui'],
    appDir: true,
    importsWhitelist: ['constants.js', 'colors.js'],
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    logTimings: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    },
    disableThemesBundleOptimize: true,
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
]

const configureWebpack = (config) => {
  config.resolve.alias = { ...(config.resolve.alias || {}) }
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    worker_threads: false,
  }
  delete config.resolve.alias['@xtalk/db/net']
  const xtNet = join(__dirname, '../../packages/libs/xt-net')
  config.resolve.alias['@xtalk/net/net/http-fetch.js'] = join(xtNet, 'net/http-fetch.js')
  config.resolve.alias['@xtalk/net/net/ws-native.js'] = join(xtNet, 'net/ws-native.js')
  const optionalBackend = join(__dirname, 'src/browser-optional-backend.js')
  config.resolve.alias['@xtalk/net/net/conn-sqlite.js'] = optionalBackend
  config.resolve.alias['@xtalk/net/net/conn-postgres.js'] = optionalBackend
  config.module.rules.push({
    test: /\.js$/,
    include: /node_modules\/@react-native\/assets-registry/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['next/babel', '@babel/preset-flow'],
      },
    },
  })
  return config
}

module.exports = () => {
  /** @type {import('next').NextConfig} */
  let config = {
    devIndicators: {
      position: 'bottom-right',
    },
    typescript: {
      tsconfigPath: 'tsconfig.app.json',
      ignoreBuildErrors: true,
    },
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
            {
              key: 'Content-Security-Policy',
              value: process.env.NODE_ENV === 'development'
                ? "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline' data: blob:; img-src * data: blob: 'unsafe-inline'; frame-src * data: blob: ; style-src * data: blob: 'unsafe-inline';"
                : "default-src 'self' https://js.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
            },
          ],
        },
      ];
    },
    transpilePackages: [
      '@statstrade/component',
      '@statstrade/config',
      '@statstrade/config-eslint',
      '@statstrade/edge',
      '@statstrade/feature',
      '@xtalk/db',
      '@xtalk/event',
      '@xtalk/lang',
      '@xtalk/net',
      '@xtalk/substrate',
      '@haskkor/react-native-recaptchav3',
      '@react-native/assets-registry',
      '@s77rt/react-native-date-picker',
      '@stripe/stripe-react-native',
      'react-native-reanimated',
      'react-native-reanimated-table',
      'react-native-safe-area-context',
      'react-native-svg',
      'react-native-video',
      'react-native-web',
      'expo',
      'expo-blur',
      'expo-constants',
      'expo-document-picker',
      'expo-image-picker',
      'expo-linear-gradient',
      'expo-linking',
      'expo-modules-core',
      'expo-router',
    ],
    experimental: {
      scrollRestoration: true,
    },
  }

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  const pluginWebpack = config.webpack
  config.webpack = (webpackConfig, options) => {
    const nextConfig = pluginWebpack
      ? pluginWebpack(webpackConfig, options)
      : webpackConfig
    return configureWebpack(nextConfig)
  }

  return config
}
