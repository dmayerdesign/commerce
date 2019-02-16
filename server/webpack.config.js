const path = require('path');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.pug?$/,
        use: 'pug-loader',
        exclude: /node_modules/,
      }
    ]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist/server'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.pug' ]
  },
  devtool: 'inline-source-map',
}
