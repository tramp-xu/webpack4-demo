const path = require('path')
const utils = require('./utils')
const merge = require('webpack-merge')
const config = require('../config/')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const env = config.build

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: env.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
    chunkFilename:  utils.assetsPath('js/[name].[chunkhash:8].js')
  },
  devtool: env.productionSourceMap ? env.devtool : false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/prod.env')
    }),
    // 清空 dist 文件的插件
    new CleanWebpackPlugin(),
    // 拷贝文件和文件夹
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/static'),
        ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      template: env.index,
      filename: 'index.html',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'Pixi Demo',
      minify: { // 压缩 HTML 的配置
        minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        minifyJS: true, // 压缩 HTML 中出现的 JS 代码
        removeComments: true,   // 移除注释
        collapseWhitespace: true,   // 缩去空格
        removeAttributeQuotes: true // 移除属性引号
      }
    })
  ]
})