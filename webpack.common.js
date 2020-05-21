var path = require('path')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: {
          loader: "css-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new MomentLocalesPlugin(),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: '/',
    filename: '[name].[contenthash].js'
  }
}