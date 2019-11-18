const webpack = require('webpack');
const fs = require('fs');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const hotMiddlewareScript = 'webpack-hot-middleware/client';
// 获取客户端和服务端的 webpack 配置
const clientWebpackConfig = require('./webpack.client.config');
const serverWebpackConfig = require('./webpack.server.config');

module.exports = function setDevServer(app, templatePath, callback){
    let template = fs.readFileSync(templatePath, 'utf-8');
    let serverBundle;
    let clientManifest;

    // 外部获取的 renderer.js 的 render 方法调用
    let readyRender;
    const readyPromise = new Promise(resolve => {
        // resolve 是 render(req, res)，进行 html 字符串的生成
        readyRender = resolve;
        resolve();
    });

    // 更新方法
    const update = () => {
        if(serverBundle && clientManifest){
            readyRender();
            callback(serverBundle, {
                template,
                clientManifest
            });
        }
    };

    // 监听模板文件的修改
    fs.watch(templatePath, () => {
        template = fs.readFileSync(templatePath, 'utf-8');
        update();
    });

    // 入口文件引入热加载中间件脚本
    clientWebpackConfig.entry = [hotMiddlewareScript, clientWebpackConfig.entry];
    // 添加热加载插件
    clientWebpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );
    // 获取 webpack Compiler 实例
    const clientCompiler = webpack(clientWebpackConfig);
    // 通过 webpack-dev-middleware 和 webpack-hot-middleware 实现模块热加载，
    // 当文件更新时，浏览器展示的数据实现自动更新
    const devMiddleware = webpackDevMiddleware(clientCompiler, {
        publicPath: clientWebpackConfig.output.publicPath,
        noInfo: true,
        writeToDisk: true
    });
    app.use(devMiddleware);
    // 监听客户端文件变更
    clientCompiler.plugin('done', stats => {
        if (stats.errors && stats.errors.length) {
            return;
        }
        clientManifest = require('../dist/vue-ssr-client-manifest.json');
        update();
    });
    app.use(webpackHotMiddleware(clientCompiler));

    // 获取 webpack Compiler 实例
    const serverCompiler = webpack(serverWebpackConfig);
    // 监听服务端文件变更
    serverCompiler.watch({}, (err, stats) => {
        if(err){
            throw err;
        }
        serverBundle = require('../dist/vue-ssr-server-bundle.json');
        update();
    });

    return readyPromise;
}







