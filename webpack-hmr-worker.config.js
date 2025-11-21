/* webpack-hmr-worker.config.js */
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: ['webpack/hot/poll?100', './src/notifications-worker/worker.main.ts'],
  target: 'node',
  externals: [nodeExternals({ allowlist: ['webpack/hot/poll?100'] })],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist-worker'),
    filename: 'worker.js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
