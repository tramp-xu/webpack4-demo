const path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    host: 'localhost',
    port: 8080,
    autoOpenBrowser: true,
    errorOverlay: false, // 报错全屏遮盖屏幕
    devtool: 'cheap-module-source-map',
    proxyTable: {}
  },

  // build 打包阶段
  build: {
    index: path.resolve(__dirname, '../index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    devtool: 'source-map'
  }
}
