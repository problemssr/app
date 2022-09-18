// 配置路由de地方
// 1.引入vue及vue-router
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes'

// 2.使用插件 ---Vue.user()
Vue.use(VueRouter)

import store from '@/store'
// console.log(VueRouter.prototype);
// 先把VueRouter原型对象的push先保存一份
let orginPush = VueRouter.prototype.push;

// 重写push|replace
// 第一个参数：告诉原来push方法，往哪里跳转（传递哪些参数）
VueRouter.prototype.push = function (location, resolve, reject) {
    // console.log(location);
    if (resolve && reject) {
        // orginPush()不能这么调用，函数上下文调用的是window
        // call||apply区别：相同点，都可以调用函数一次，都可以篡改函数上下文一次
        // 不同点：call与apply传递参数，call传递参数可以用逗号隔开，apply传递数组
        orginPush.call(this, location, resolve, reject)
    } else {
        orginPush.call(this, location, () => { }, () => { })
    }
}
// 配置路由
// 1.1暴露一个Vue-router类的实例
let router = new VueRouter({ //暴露一下new VueRouter类的实例
    // 配置路由信息routes 路由有很多routes右边是一个#数组#里面装每个对应的路由
    routes,
    // 滚动行为
    scrollBehavior() {
        // 滚动条最上方
        return { y: 0 }
    }
})

// 全局守卫：前置守卫（路由跳转之前判断）
router.beforeEach(async (to, from, next) => {
    // console.log(store.state.user.token);
    // 用户登录一定有token
    let token = store.state.user.token
    // 用户信息
    // console.log(token);
    // console.log(store);
    let name = store.state.user.userInfo.name
    if (token) {
        // 用户已经登录就不能再去login[去不了，一直在首页]
        if (to.path == '/login'||to.path=='/register') {
            next('/')
        } else {
            // 登录了去得不是login
            if (name) {
                next()
            } else {
                try {
                    //登陆了且没有用户信息
                    //在路由跳转之前获取用户信息且放行
                    await store.dispatch('getUserInfo')
                    next()
                } catch (error) {
                    //token失效从新登录
                    await store.dispatch('userLogout');
                    next('/login')
                }
            }
        }
    }
    else {
        //未登录：不能去交易(trade)相关、不能去支付相关【pay|paysuccess】、不能去个人中心(center)
        //未登录去上面这些路由-----登录
        let toPath=to.path
        if(toPath.indexOf('/trade')!=-1||toPath.indexOf('/pay')!=-1||toPath.indexOf('/center')!=-1){
             //把未登录的时候向去而没有去成的信息，存储于地址栏中【路由】
            next('/login?redirect='+toPath)
        }
        else{
            //去的不是上面这些路由（home|search|shopCart）---放行
           next()

        }
    }
})

export default router