const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
function resolve(dir) {
  return path.join(__dirname, dir)
}

let configureWebpack = {}
if(process.env.NODE_ENV === 'production') {
  configureWebpack = {
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'element-plus': 'ElementPlus',
      'xlsx': 'XLSX'
    },
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            // warnings: false,
            drop_debugger: true,
            drop_console: true,
            pure_funcs: ["console.log"]
          }
        },
        sourceMap: false,
        parallel: true
      })
    ]
  }
}
module.exports = {
  configureWebpack,
  productionSourceMap: false,
  devServer: {
    port: 7007,
  },
  publicPath: '/Editable_table/' // deploy to github page
}