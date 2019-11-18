const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig  = require('./webpack.base.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(baseConfig, {
    entry: path.resolve(__dirname, '../src/entry-client.js'),
    output: {
        filename: 'client/[name].js',
        chunkFilename: 'client/[name].js'
    },
    plugins: [
        // 在输出目录中生成 vue-ssr-client-manifest.json
        new VueSSRClientPlugin(),
        // 抽离多个入口 chunk 的公共模块到一个独立文件中
        new webpack.optimize.SplitChunksPlugin(),
        // 创建一个在编译时可以配置的全局变量
        new webpack.DefinePlugin({
            VUE_ENV: 'client'
        })
    ]
});