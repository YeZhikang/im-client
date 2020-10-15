const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "development",
  entry: './src/App.tsx',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', 'jsx']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "[name]-[hash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: {
          loader: "ts-loader",
        },
        exclude: [path.resolve(__dirname, './node_modules')]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.png$/,
        use: [{
          loader: "file-loader",
          options: {
            name: '[path][name].[ext]',
          }
        }]
      }
    ]
  },
  devServer: {
    port: 3000,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
    new MiniCssExtractPlugin({
      filename: `[name][contenthash:8].css`
    }),
  ],
  devtool: "source-map"
}