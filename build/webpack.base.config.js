const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV
const isProd = NODE_ENV === 'production';

module.exports = {
    mode: NODE_ENV,
    devtool: isProd ? 'none' : 'cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: isProd
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(css|scss)$/,
                use: isProd ? ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'vue-style-loader'
                }) : ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: '[name].[ext]?[hash]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: isProd ? [
        new VueLoaderPlugin(),
        new UglifyJsPlugin({
            test: /\.js($|\?)/i,
            parallel: 4
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
            filename: 'common.[chunkhash].css'
        })
    ]: [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin()
    ]
}