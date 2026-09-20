/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const babel = require('@babel/core');

module.exports = {
  input: [
    'app/**/src/**/*.{js,jsx,ts,tsx}',
    'app-lib/**/src/**/*.{js,jsx,ts,tsx}',
    // Exclude test and storybook if you want:
    '!**/src/**/*.test.{js,jsx,ts,tsx}',
    '!app-lib/edge-storybook/**',
  ],
  output: './',
  options: {
    debug: false,
    removeUnusedKeys: false, // set true if you want aggressive cleanup
    sort: true,
    func: {
      list: ['t', 'i18next.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fallbackKey: (ns, value) => {
        // Use the default text as key (optional). Return false to disable.
        return value;
      },
    },
    lngs: ['en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'], // <-- update to your languages
    ns: ['common', 'home'], // <-- update to your namespaces
    defaultLng: 'en',
    defaultNs: 'common',
    defaultValue: (lng, ns, key) => {
      // Leave value empty by default (so translators fill it)
      return '';
    },
    resource: {
      loadPath: path.resolve(
        __dirname,
        'app/nextjs/public/locales/{{lng}}/{{ns}}.json'
      ),
      savePath: path.resolve(
        __dirname,
        'app/nextjs/public/locales/{{lng}}/{{ns}}.json'
      ),
      jsonIndent: 2,
      lineEnding: '\n',
    },
    keySeparator: false, // allows keys like "home.title"
    nsSeparator: ':',
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
  // Optional custom transform to support more patterns or logging
  transform: function customTransform(file, enc, done) {
    const filename = file.path || '';
    const code = file.contents.toString(enc);

    // Transpile TS/TSX to plain JS so the scanner can parse without TS syntax errors
    let compiled = code;
    try {
      const isTSX = /\.(tsx)$/i.test(filename);
      const babelResult = babel.transformSync(code, {
        filename,
        presets: [
          [require.resolve('@babel/preset-typescript'), { isTSX, allExtensions: true }],
          // Only apply React preset for TSX/JSX so <Trans> is preserved as JSX text for parser
          isTSX && [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
        ].filter(Boolean),
        // We do not need source maps here
        sourceMaps: false,
        babelrc: false,
        configFile: false,
        // Keep JSX in place for parseTransFromString
        plugins: [],
        // Ensure comments/strings are preserved
        retainLines: true,
        compact: false,
        assumptions: { iterableIsArray: true },
      });
      if (babelResult && babelResult.code) compiled = babelResult.code;
    } catch (e) {
      // If Babel fails for any reason, fall back to original content
      compiled = code;
    }

    // Parse t(...) usages
    this.parser.parseFuncFromString(
      compiled,
      { list: ['t', 'i18next.t'] },
      (key, options) => {
        this.parser.set(key, options);
      }
    );

    // Parse <Trans> usages
    this.parser.parseTransFromString(compiled, {}, (key, options) => {
      this.parser.set(key, options);
    });

    done();
  },
};