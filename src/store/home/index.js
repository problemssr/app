import { reqCategoryList, reqGetBannerList, reqFloorList } from '@/api'
// home模块小仓库
const state = {
    // state中数据默认值不乱写，服务器返回对象or数组【根据接口返回值初始化】
    categoryList: [],
    // 轮播图数据
    bannerList: [],
    // floor组件数据
    floorlist: []
}
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state, floorlist) {
        state.floorlist = floorlist
    }
}
const actions = {
    // 通过api接口函数调用，向服务器发请求，获取服务器数据
    // async和await必须同时存在 等到服务器拿到数据在结束
    async categoryList({ commit }) {
        let result = await reqCategoryList();
        // let result = new Promise((resolve, reject) => {
        //     resolve(reqCategoryList())
        // }).then((res) => { console.log(res.data); })

        // console.log(result);
        if (result.code == 200) {
            commit("CATEGORYLIST", result.data)
        }

    },
    // 获取首页轮播图数据
    async getBannerList({ commit }) {
        let res = await reqGetBannerList();
        // console.log(res);
        if (res.code == 200) {
            commit('GETBANNERLIST', res.data)
        }
    },
    // 获取floor数据
    async getFloorList({ commit }) {
        let res = await reqFloorList()
        if (res.code == 200) {
            // 提交mutation
            commit('GETFLOORLIST', res.data)
        }
    }
}
// 计算属性
const getters = {

}
// 对外暴露才能别的组件使用
export default {
    state,
    mutations,
    actions,
    getters
}