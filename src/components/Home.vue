<template>
    <div class="home">
        <div>{{homeText}}</div>
        <div @click="handle">click me</div>
    </div>
</template>
<script>
    import titleMixin from '../mixins/title-mixin';

    export default {
        mixins: [titleMixin],
        title(){
            return this.homeText;
        },
        asyncData({store, route}){
            let homeText = '小七，回家咯~';
            
            if(route.params.homeText){
                homeText = route.params.homeText;
            }
            return store.dispatch('fetchHomeText', homeText);
        },
        methods: {
            handle(){
                this.$store.dispatch('fetchHomeText', '小七，你咋还没回家~').then((res) => {
                    console.log(res);
                });
            }
        },
        computed: {
            homeText(){
                return this.$store.state.homeText;
            }
        }
    }
</script>
<style scoped lang="scss">
    .home {
        background-color: yellow;
    }
</style>