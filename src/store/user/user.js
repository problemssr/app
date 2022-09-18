import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo ,reqLogout} from "@/api"
import { setToken,getToken,removeToken } from "@/utils/token"
// 登录与注册模块
const state = {
    code: "",
    token: getToken(),
    userInfo: ''
}
const mutations = {
    GETCODE(state, code) {
        state.code = code
    },
    USERLOGIN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    CLEAR(state){
        // 把仓库中相关用户信息清空
        state.token='',
        state.userInfo={},
        // 本地存储数据清空
        removeToken()
    }
}
const getters = {}
const actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        let res = await reqGetCode(phone)
        if (res.code == 200) {
            commit("GETCODE", res.data)
            return 'ok'
        } else {
            Promise.reject(new Error('faile'))
        }
    },
    // 用户注册
    async userRegister({ commit }, user) {
        let res = await reqUserRegister(user)
        // console.log(res);
        if (res.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户登录
    async userLogin({ commit }, user) {
        let res = await reqUserLogin(user)
        //服务器下发token，用户唯一标识符(uuid)
        //将来经常通过带token找服务器要用户信息进行展示
        // console.log(res);
        if (res.code == 200) {
            commit('USERLOGIN', res.data.token)
            // 持久化存储token
            // localStorage.setItem("TOKEN",res.data.token)
            setToken(res.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 获取用户信息
    async getUserInfo({ commit },data) {
        let res = await reqUserInfo(data)
        // console.log(res);
        if (res.code == 200) {
            commit('GETUSERINFO', res.data)
        }
        //     return 'ok'
        // } else {
        //     // console.log(res.code);
        //     return Promise.reject(new Error('faile'))
        // }
    },
     //退出登录
    async userLogout({commit}){
        // 向服务器发一次请求，通知服务器清除token
        let res=await reqLogout()
        
        if(res.code==200){
            commit("CLEAR")
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}