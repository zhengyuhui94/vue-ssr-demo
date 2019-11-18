/**
 * @description: 应用程序的通用 entry 
 */
import Vue from 'vue';
import App from './App.vue';
import {createRouter} from './router';
import {createStore} from './store';
import {sync} from 'vuex-router-sync';

// 导出一个工厂函数，用于创建新的应用程序、router 和 store 实例
export function createApp(){
    const store = createStore();
    const router = createRouter();
    // 将路由状态(route state)同步到 store
    sync(store, router);
    const app = new Vue({
        router,
        store,
        // 根实例渲染应用程序组件
        render: h => h(App)
    });
    return {app, router, store};
}
