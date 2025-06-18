// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DIST_FOLDER = 'dist';

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'src', 'index'),

    output: {
      path: path.resolve(__dirname, DIST_FOLDER),
      filename: isProd ? 'bundle.[contenthash].js' : 'bundle.js',
      clean: true,
    },

    mode: argv.mode,

    devtool: isProd ? false : 'inline-source-map',

    devServer: {
          static: {
             publicPath: path.resolve(__dirname, DIST_FOLDER),
             watch: true
          },
          host: 'localhost',
          port: 9000,
          open: true
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx'],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
      new CopyPlugin({
        patterns: [
            {
                context: path.resolve(__dirname, 'public', 'images'),
                from: '**/*',
                to: 'images/[name][ext]',
                noErrorOnMissing: true,
            },
        ],
      }),
    ],

    optimization: {
      minimize: isProd,
    },
  };
};
