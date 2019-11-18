/**
 * @description: 服务端 entry，每次渲染重复调用此函数
 * @description: 只创建和返回应用程序实例
 */
import {createApp} from './app';

export default context => {
    // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有内容在渲染前，
    // 就已经准备就绪
    return new Promise((resolve, reject) => {
        const {app, router, store} = createApp();
        const {url} = context;

        // 设置服务端路由跳转的位置 
        router.push(url);

        // 等待 router 将异步组件和钩子函数解析完成之后，再执行
        router.onReady(() => {
            // 返回目标位置或是当前路由匹配的组件数组
            const matchedComponents = router.getMatchedComponents();
            // 匹配不到的路由，执行 reject 函数，返回 404
            if(!matchedComponents.length){
                return reject({
                    code: 404
                });
            }
            // 对所有匹配的路由组件调用 asyncData 方法，预取数据
            Promise.all(matchedComponents.map(Component => {
                if(Component.asyncData){
                    return Component.asyncData({
                        store,
                        route: router.currentRoute
                    });
                }
            })).then(() => {
                // 在所有预取钩子调用成功之后，
                // 状态已经全部填充到渲染应用程序的 store 中。
                // 此时将状态添加到上下文，
                // 并且 template 选项用于 renderer 时，
                // 状态将自动序列化为 window.__INITIAL_STATE__，并注入到 HTML 中
                context.state = store.state;
                // Promise resolve 应用程序实例，以便它可以渲染 
                resolve(app);
            }).catch(reject);
        }, reject);
    });
}


