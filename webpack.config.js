const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    basic: './src/basic/index.js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: 'babel-loader'
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
        include: path.resolve(__dirname, 'src')
      }

      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]',
      //         outputPath: 'assets/'
      //         // limit: 2048,
      //         // fallback: 'file-loader'
      //       }
      //     }
      //   ]
      // }
    ]
  },
  // https://github.com/jantimon/html-webpack-plugin/issues/218
  plugins: [
    // new CopyWebpackPlugin([
    //   { from: 'src/astardemo/assets', to: 'assets' }
    // ]),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['basic'],
      filename: 'basic.html',
      template: 'src/basic/index.html'
    }),
    // To be used for JSX support
    new webpack.ProvidePlugin({
      Snabbdom: 'snabbdom-pragma'
    })
  ],

  devServer: {
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT,
    // does not capture runtime errors of the application
    overlay: true
  }
}