const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const config = require('../config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const env = config.dev

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = merge(common, {
  mode: 'development',
  devtool: env.devtool,
  devServer: {
    historyApiFallback: true, // 返回 index.html
    hot: true,  // 热加载
    compress: true, // 压缩
    host: HOST || env.host,
    port: PORT || env.port,
    open: env.autoOpenBrowser, // 打开浏览器
    publicPath: env.assetsPublicPath,
    proxy: env.proxyTable
  },

  plugins: [
    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 打包自动生成 index.html 插件
    new HtmlWebpackPlugin({
      template: 'index.html',
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
