const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
  entry: {
    './dist/assets/js/backend.blocks' : './src/index.js',
    // './assets/dist/js/frontend.blocks' : './src/frontend.js',
  },
  output: {
    filename: '[name].js',
  },
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // Enables caching for faster rebuilds.
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            enforce: "pre",
            fix: true
          }
        }
      }
    ],
  },
  stats: {
    modules: false,
    children: false
  }
};
