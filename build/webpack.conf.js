'use strict'
const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // Dev Server settings
    host: '127.0.0.1',
    port: 8080,

    // Source Maps
    devtool: 'cheap-module-eval-source-map'
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsSubDirectory: 'static',
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsPublicPath: '/hrms/',

    // Source Maps
    productionSourceMap: true,
    devtool: '#source-map'
  }
}
