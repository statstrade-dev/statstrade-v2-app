import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const here = path.dirname(fileURLToPath(import.meta.url))
export default defineConfig({resolve: {alias: {
'@statstrade/edge/lib/xt/db/node/runtime.jsx': path.resolve(here, '../../test/vitest-stubs/sharedworker-runtime-vitest-stub.js'),
'@statstrade/component/layout/common/frame-devtool.jsx': path.resolve(here, '../../test/vitest-stubs/frame-devtool-vitest-stub.js'),
'@statstrade/edge': path.resolve(here, '../../packages/edge/src'),
'@statstrade/web-superadmin': path.resolve(here, '../web-superadmin/src'),
'@statstrade/web-admindebug': path.resolve(here, './src'),
vitest: path.resolve(here, '../../node_modules/vitest/dist/index.js')}}, test: {include: [path.resolve(here, '../../../../test/scripts/admindebug-*.test.mjs')], poolOptions: {threads: {singleThread: true}}}})