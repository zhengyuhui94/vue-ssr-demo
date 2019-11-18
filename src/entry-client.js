/**
 * @description: 客户端 entry 创建应用程序，并将其挂载到 DOM 中
 */
import {createApp} from './app';

const {app, router, store} = createApp();

// 替换 store 的根状态
if(window.__INITIAL_STATE__){
    store.replaceState(window.__INITIAL_STATE__);
}

// 等到 router 将异步路由组件和钩子函数解析完成后，再执行
router.onReady(() => {
    // 添加路由钩子函数，用于处理 asyncData，
    // 在初始路由 resolve 后执行，
    // 避免二次预取已有的数据。
    // 此处是在初始路由准备就绪之后，注册的钩子，因此不会再次获取服务器提取的数据
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);

        // 只关心非预渲染的组件
        // 对比它们，找出两个匹配列表的差异组件
        let diffed = false;
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c));
        });
        // 若没有差异组件，直接跳过以下步骤
        if(!activated.length){
            return next();
        }

        console.log('如果有加载指示器，就在这里触发');

        // 对匹配的组件进行预取数据
        Promise.all(activated.map(c => {
            if(c.asyncData){
                return c.asyncData({
                    store,
                    route: to
                });
            }
        })).then(() => {
            console.log('在此处停止加载指示器');
            next();
        }).catch(next);
    });
    // 挂载应用程序组件到真实 DOM 中
    app.$mount('#app');
});