/**
 * @description: 通用路由程序
 */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter(){
    const router = new Router({
        mode: 'history',
        routes: [
            {
                path: '/', 
                redirect: '/gohome'
            },
            {
                path: '/:homeText', 
                component: () => import('../components/Home.vue')
            },
            {
                path: '/item/:id', 
                component: () => import('../components/Item.vue')
            }
        ]
    });
    return router;
}