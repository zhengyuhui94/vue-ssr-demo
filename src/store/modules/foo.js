export default {
    namespaced: true,
    // state 必须是一个函数，
    // 因此可以创建多个实例化模块
    state: () => ({
        count: 0
    }),
    mutations: {
        inc: state => state.count++
    },
    actions: {
        inc({commit}){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    commit('inc')
                    resolve('成功了');
                }, 1000);
            });
        }
    }
}