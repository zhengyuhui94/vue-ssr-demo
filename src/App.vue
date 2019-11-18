<template>
    <div id="app">
        <router-link to="/lala">home</router-link>
        <router-link to="/item/xiaoqi">item</router-link>
        <div class="title">{{title}}</div>
        <router-view class="view"></router-view>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                title: 'App'
            }
        }
    }
</script>
<style lang="scss" scoped>
    #app {
        .title {
            width: 100%;
            font-size: 20px;
            color: brown;
        }

        .view {
            background-color: yellowgreen;
        }
    }
</style>