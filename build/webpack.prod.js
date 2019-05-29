const path = require('path')
const utils = require('./utils')
const merge = require('webpack-merge')
const config = require('../config/')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin') // 使用 runtimeChunk 提取 manifest，使用 script-ext-html-webpack-plugin等插件内联到index.html减少请求

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
  optimization: {
    moduleIds: 'hashed', // 等于HashedModuleIdsPlugin 固定 moduleId
    runtimeChunk: {   // 提取 manifest
      name: 'manifest'
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          warnings: false,
          mangle: {
            toplevel: true
          }
        }
      }),
      new ScriptExtHtmlWebpackPlugin({
        //`runtime` must same as runtimeChunk name. default is `runtime`
        inline: /runtime\..*\.js$/
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          autoprefixer: false,
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              }
            }
          ]
        }
      }),
      new webpack.NamedChunksPlugin(chunk => {
        // 结合自定义 nameResolver 来固定 chunkId
        if (chunk.name) {
          return chunk.name
        }
        const modules = Array.from(chunk.modulesIterable)
        if (modules.length > 1) {
          const hash = require('hash-sum')
          const joinedHash = hash(modules.map(m => m.id).join('_'))
          let len = nameLength
          while (seen.has(joinedHash.substr(0, len))) len++
          seen.add(joinedHash.substr(0, len))
          return `chunk-${joinedHash.substr(0, len)}`
        } else {
          return modules[0].id
        }
      }),
    ],
    splitChunks: {
      chunks: 'all',
      // minSize: 30000,
      // minChunks: 1,
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: 10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve("src/components"),
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        },  
        styles: {
          name: 'styles',
          test: /\.(less|css|scss)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  },  
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
    
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
      chunkFilename:  utils.assetsPath('js/[name].[chunkhash:8].js')
    }),
    
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