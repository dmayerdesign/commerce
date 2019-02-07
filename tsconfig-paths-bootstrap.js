const tsConfig = require('./tsconfig.json')
const tsConfigPaths = require('tsconfig-paths')
const { resolve } = require('path')

const baseUrl = resolve(__dirname, 'dist/server')

tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
})
