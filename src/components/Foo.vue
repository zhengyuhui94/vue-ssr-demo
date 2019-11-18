<template>
    <div class="foo">{{fooCount}}</div>
</template>
<script>
    // 导入 foo 组件的 store 的状态
    import fooStoreModule from '../store/modules/foo';

    export default {
        asyncData({store, route}){
            // 使用 store.registerModule 惰性注册这个模块
            store.registerModule('foo', fooStoreModule);
            return store.dispatch('foo/inc');
        },
        computed: {
            fooCount(){
                return this.$store.state.foo.count;
            }
        },
        // 当多次访问路由时，
        // 避免在客户端重复注册模块
        destroyed(){
            this.$store.unregisterModule('foo');
        }
    }
</script>
<style scoped>

</style>