<template>
    <div class="item">{{item}}</div>
</template>
<script>
    import titleMixin from '../mixins/title-mixin';

    export default {
        mixins: [titleMixin],
        title(){
            return this.item;
        },
        asyncData({store, route}){
            return store.dispatch('fetchItem', route.params.id);
        },
        computed: {
            item(){
                return this.$store.state.items[this.$route.params.id];
            }
        }
    }
</script>
<style scoped lang="scss">
    .item {
        background-color: burlywood;
    }
</style>