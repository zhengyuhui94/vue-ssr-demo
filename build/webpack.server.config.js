const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig  = require('./webpack.base.config');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = merge(baseConfig, {
    entry: path.resolve(__dirname, '../src/entry-server.js'),
    target: 'node',
    output: {
        filename: 'client/[name].js',
        // 使用 commonjs 风格导出模块
        libraryTarget: 'commonjs2'
    },
    externals: nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块，
        // 会因为服务端不存在 document 而报错
        whitelist: /\.(css|vue|sass)$/
    }),
    plugins: [
        new CleanWebpackPlugin(),
        // 将服务端的整个输出，
        // 构建为单个 json 文件的插件，
        // 默认输出文件名为 vue-ssr-server-bundle.json
        new VueSSRServerPlugin(),
        // 创建一个在编译时可以配置的全局变量
        new webpack.DefinePlugin({
            VUE_ENV: 'server'
        })
    ]
});