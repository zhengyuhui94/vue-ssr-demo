/**
 * @description: title-mixin
 */
function getTitle(vm){
    // 组件可以提供一个 title 选项
    // 此选项可以是一个字符串或函数
    const {title} = vm.$options;
    if(title){
        return typeof title === 'function'
        ? title.call(vm)
        : title
    }
}

const serverTitleMixin = {
    created(){
        const title = getTitle(this);
        if(title){
            // 可以通过 this.$ssrContext 来直接访问组件中的服务器端渲染上下文
            // 并根据上下文中的数据，来渲染相应的 dom
            this.$ssrContext.title = title;
        }
    }
};

const clientTitleMixin = {
    mounted(){
        const title = getTitle(this);
        if(title){
            // 设置标题文档
            document.title = title;
        }
    }
};

export default process.env.VUE_ENV === 'server'
    ? serverTitleMixin
    : clientTitleMixin;