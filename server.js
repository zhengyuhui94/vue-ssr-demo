const express = require('express');
const fs = require('fs');
const path = require('path');
const {createBundleRenderer} = require('vue-server-renderer');
const isProd = process.env.NODE_ENV === 'production';
const app = express();

// 开发模式下的话，需要进行热重载，每次重载都需要重新调用
// 生产环境下，不进行文件修改，只需调用一次即可
function createRenderer(bundle, options){
    return createBundleRenderer(bundle, Object.assign(options, {
        // 对于每次渲染，bundle renderer 只创建一个 V8 上下文执行整个 bundle
        runInNewContext: false
    }));
}

let renderer;
let readyPromise;
const templatePath = path.resolve(__dirname, 'src/index.template.html');
if(isProd){
    // 服务端 bundle
    const serverBuldle = require('./dist/vue-ssr-server-bundle.json');
    // client bundle
    // 此对象包含了 webpack 整个构建过程的信息，从而可以让 bundle renderer 自动推导需要在 HTML 模板中注入的内容
    const clientManifest = require('./dist/vue-ssr-client-manifest.json'); 
    // 依赖模板
    const template = fs.readFileSync(templatePath, 'utf-8');
    renderer = createRenderer(serverBuldle, {
        // 当在这里使用 template 时，
        // context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
        template,
        clientManifest 
    });
}else{
    readyPromise = require('./build/setup-dev-server')(
        app, 
        templatePath,
        (serverBuldle, options) => {
            renderer = createRenderer(serverBuldle, options);
        }
    );
}

app.use(express.static(path.join(__dirname, 'dist')));

function render(req, res){
    const context = {
        title: 'vue-ssr', // default title
        url: req.url
    }
    
    // 在调用 renderToString 时，
    // 它将自动执行【由 bundle 创建的应用程序实例】所导出的函数（传入上下文 context 作为函数参数），
    // 然后渲染它
    /* renderer.renderToString(context, (err, html) => {
        if(err){
            if(err.code === 404){
                res.status(404).end('Page not found');
            }else{
                res.status(500).end('Internal Server Error');
                console.error(`error during render : ${req.url}`);
            }
        }else{
            res.set('Content-Type', 'text/html');
            res.end(html);
        }
    }); */

    // preload 预加载资源，让浏览器提前加载指定资源【加载后并不执行】，需要执行时再执行
    // preload 将加载和执行分离开，不阻塞渲染和 document 的 onload 事件
    // 采用流式传输，可以尽快获得"第一个 chunk"，并发送给客户端
    // 第一个 chunk 被发出时，子组件可能不被实例化，它们的生命周期钩子也不会被调用
    // 这意味着，子组件依赖的数据不能放到生命周期钩子函数中，
    // 这些数据会不可用【因为生命周期钩子函数不会被调用】
    const stream = renderer.renderToStream(context);
    let html = '';
    stream.on('data', data => {
        html += data.toString();
    });
    stream.on('end', () => {
        res.set('Content-Type', 'text/html');
        res.end(html);
    });
    stream.on('error', err => {
        if(err.code === 404){
            res.status(404).end('Page not found');
        }else{
            res.status(500).end('Internal Server Error');
            console.error(`error during render : ${req.url}`);
        }
    });
}

app.get('*', (req, res) => {
    if(isProd){
        render(req, res);
    }else{
        readyPromise.then(() => {
            render(req, res);
        });
    }
    console.log('创建bundle render实例，并调用renderToString方法，返回生成的html字符串');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`监听${process.env.PORT || 3000}端口`);
});