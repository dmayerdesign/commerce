const { resolve } = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

require('dotenv').config({ path: resolve(process.cwd(), '.variables') })
if (!process.env.ENVIRONMENT && !process.env.PORT) {
  require('dotenv').config()
}

const pathToTsconfig = resolve(__dirname, 'server/tsconfig.server.json')

module.exports = {
  target: 'node',
  entry: './server/src/main.ts',
  mode: process.env.ENVIRONMENT.toLowerCase() || 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: pathToTsconfig,
        }
      },
      {
        test: /\.pug?$/,
        use: 'raw-loader',
        exclude: /node_modules/,
      }
    ]
  },
  output: {
    filename: 'server.js',
    path: resolve(__dirname, 'dist/server'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.pug' ],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: pathToTsconfig,
        extensions: [ '.tsx', '.ts', '.js', '.pug' ]
      }),
    ],
  },
  devtool: 'inline-source-map',
}
