const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
  entry: {
    './dist/assets/js/backend.blocks' : './src/index.js',
    // './dist/assets/js/frontend.blocks' : './src/frontend.js',
  },
  output: {
    filename: '[name].js',
  },
  devtool: 'none',
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
      }
    ],
  },
  plugins: [ 
    new webpack.optimize.UglifyJsPlugin( {
      compress: {
        warnings: false,
        drop_console: true,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: false,
    } ),
  ],
  stats: {
    modules: false,
    children: false
  }
};
