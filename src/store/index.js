import Vue from 'vue'
import Vuex from 'vuex'
// 需要使用插件一次
Vue.use(Vuex)

{
// // state:仓库存储数据的地方
// const state ={
//     // 1.注册一个属性
//     count:1
// }
// // mutations:修改state的唯一手段
// const mutations={
//     ADD(state){
//         // 5.修改state属性值
//         state.count++
//     }
// }
// // actions:处理action，可以书写自己的业务逻辑，让组件获取仓库数据更加方便
// const actions={
//     // 此处方法名与组件中的方法名一致
//     // 这里可以书写业务逻辑，但不能修改state
//     add({commit}){
//         // 4.解构commit，在将commit提交给mutation
//         commit("ADD")
//     }
// }
// // getters：理解为计算属性，简化仓库数据，让组件获取仓库数据更加方便
// const getters= {}
}

// 引入小仓库
import home from './home'
import search from './search'
import detail from './detail/detail'
import shopcart from './shopcart/shopcart'
import user from './user/user'
import trade from './trade/trade'

// 对外暴露store类的实例
export default new Vuex.Store({
    // 注册
    // state,
    // mutations,
    // actions,
    // getters
    // 实现vuex仓库模块式开发存储数据
    modules: {
        home,
        search,
        detail,
        shopcart,
        user,
        trade
    }
})