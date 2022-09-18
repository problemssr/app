import { reqGetSearchInfo } from '@/api'
// search模块小仓库
const state = {
    // 初始状态
    searchList: {}
    // searchList属性的属性值状态1.默认是个空对象2.服务器数据回来，将服务器数据进行替换
}
const mutations = {
    // 2修改state
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
    }
}
const actions = {
    // 1提交
    async getSearchList({ commit }, params = {}) {
        // params形参：是当前用户派发action时，第二个参数传递过来的，至少是一个空对象
        let res = await reqGetSearchInfo(params)
        if (res.code == 200) {
            commit('GETSEARCHLIST', res.data)
        }
    }
}
// 计算属性，在项目中简化仓库数据
const getters = {
    goodsList(state){
        return state.searchList.goodsList||[]
    },
    trademarkList(state){
        return state.searchList.trademarkList
    },
    attrsList(state){
        return state.searchList.attrsList
    }
}
// 对外暴露才能别的组件使用
export default {
    state,
    mutations,
    actions,
    getters
}