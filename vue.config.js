const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  configureWebpack:{
    externals: {
      'vue': 'Vue',
      'element-ui': 'ElementUI',
      'axios': 'axios',
      'xlsx': 'XLSX',
      'echarts': 'echarts',
      'vue-router': 'VueRouter'
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
//  				warnings: false, // 若打包错误，则注释这行
    				drop_debugger: true,
    				drop_console: true,
    				pure_funcs: ["console.log"]
    			}
    		},
    		sourceMap: false,
    		parallel: true
    	})
    ]
  },
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production'
    ? '/myvuetb/'
    : '/'
}