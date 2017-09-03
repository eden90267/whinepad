const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';
const DEV_MODE = ENV === 'development';
console.log('DEV_MODE:', DEV_MODE);


const config = {
  context: path.resolve('src'),
  entry: {
    app: ['./js/app.jsx'],
    discover: ['./js/discover.jsx'],
    vendor: ['react', 'react-dom', 'react-router'],
  },
  output: {
    filename: 'js/[name].js?[hash]',
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
  },
  resolve: {
    modules: [
      path.resolve('src/js'),
      path.resolve('src/css'),
      path.resolve('src/img'),
      path.resolve('node_modules'),
    ],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: path.resolve('src/js'),
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
        include: path.resolve(__dirname, 'src/css'),
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 2048,
            name: '[path][name].[ext]?[hash:10]',
          },
        }],
        include: path.resolve(__dirname, 'src/img'),
        exclude: /node_modules/,
      },
      {
        test: /\.pug$/,
        use: 'pug-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      template: 'index.pug',
      filename: 'index.html',
      chunks: ['vendor', 'app'],
      data: {
        DEV_MODE,
      },
    }),
    new HtmlWebpackPlugin({
      template: 'discovery.pug',
      filename: 'discovery.html',
      chunks: ['vendor', 'discover'],
      data: {
        DEV_MODE,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEV_MODE ? "'development'" : '"production"',
    }),
  ],
  devServer: {
    contentBase: 'dist',
    historyApiFallback: true,
    port: 3000,
    stats: {
      chunks: false,
    },
  },
};

module.exports = config;
