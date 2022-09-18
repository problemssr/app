// 12.api接口
import { reqGoodsInfo, reqAddOrUpdateShopCart } from '@/api'
// 封装游客身份模块uuid------>生成一个随机字符串（不能变化）
import {getUUID} from '@/utils/uuid_token'
// 1.先写四件套
const state = {
    goodInfo: {},
    // 游客临时身份
    uuid_token:getUUID()
}
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
const actions = {
    // 11.获取产品信息的action（派发action，捞数据）
    async getGoodInfo({ commit }, skuId) {
        let res = await reqGoodsInfo(skuId)
        if (res.code == 200) {
            // 提交mutation，修改state
            commit('GETGOODINFO', res.data)
        }
    },
    // 将产品添加到购物车中
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        // 加入购物车返回的结构(发请求)
        // 前台将参数带给服务器，服务器写入数据成功，并没有返回其他数据，只返回code=200，代表成功
        let res = await reqAddOrUpdateShopCart(skuId, skuNum)
        console.log(res);
        //2:你需要知道这次请求成功还是失败，如果成功进行路由跳转，如果失败，需要给用户提示
        if (res.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("falie"));
        }
    }
}
// 简化数据
const getters = {
    // 简化路径导航
    categoryView(state) {
        // state.goodInfo初始值空对象，空对象的categoryView属性值为undefined
        return state.goodInfo.categoryView || {}
    },
    // 简化产品信息
    skuInfo(state) {
        return state.goodInfo.skuInfo || {}
    },
    // 简化售卖属性
    spuSaleAttrList() {
        return state.goodInfo.spuSaleAttrList || []
    }
}

// 2.对外暴露
export default {
    state,
    mutations,
    actions,
    getters
}