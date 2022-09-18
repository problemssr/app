// 3.引入一级路由组件
// import Home from "@/pages/Home"
import Search from "@/pages/Search"
import ShopCart from "@/pages/ShopCart"
// 引入二级路由组件
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'

// 路由配置信息
export default [
    {
        path: "/home",
        component: ()=>import('@/pages/Home'),
        meta: { show: true }
    },
    {
        path: "/detail/:skuid",
        component: ()=>import('@/pages/Detail'),
        meta: { show: true }
    },
    {
        path: "/addcartsuccess",
        name: 'addcartsuccess',
        component: ()=>import('@/pages/AddCartSuccess'),
        meta: { show: true }
    },
    {
        path: "/shopcart",
        name: 'shopcart',
        component: ShopCart,
        meta: { show: true }
    },
    {
        path: "/trade",
        name: 'trade',
        component: ()=>import('@/pages/Trade'),
        meta: { show: true },
        // 路由独享守卫
        beforeEnter: (to, from, next)=>{
            // 去交易页面，必须从购物车而来
            if(from.path=='/shopcart'){
                next()
            }else{
                // 其他的路由组件而来，停留在当前
                // next(false): 中断当前的导航。（从哪来回哪去）
                // 如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
                next(false)
            }
        }
    },
    {
        path: "/pay",
        name: 'pay',
        component: ()=>import('@/pages/Pay'),
        meta: { show: true },
        beforeEnter:(to,from,next)=>{
            // 去支付页，从交易页来的
            if(from.path=='/trade'){
                next()
            }else{
                 // 其他的路由组件而来，停留在当前
                next(false)
            }
        }
    },
    {
        path: "/paysuccess",
        name: 'paysuccess',
        component: ()=>import('@/pages/PaySuccess'),
        meta: { show: true }
    },
    {
        path: "/center",
        name: 'center',
        component: ()=>import('@/pages/Center'),
        meta: { show: true },
        // 二级路由组件
        children:[
            {
                path:'myorder',
                component:MyOrder
            },
            {
                path:'grouporder',
                component:GroupOrder
            },
            {
                path:'/center',
                redirect:'/center/myorder'
            }
        ]
    },
    {
        path: "/search/:keyword?",
        component: Search,
        meta: { show: true },
        name: "search",
        // props三种写法
        // props:true,//布尔值写法：params
        // props:{a:1,b:2},//对象写法:额外传给路由组件一些props
        // 函数写法：可以params参数，query参数，通过props传递给路由组件
        // props:($route)=>{
        //     return {keyword:$route.params.keyword,k:$route.query.k}
        // }复杂
        props: ($route) => ({ keyword: $route.params.keyword, k: $route.query.k })

    },
    {
        path: "/login",
        component: ()=>import('@/pages/Login'),
        meta: { show: false }
    },
    {
        path: "/register",
        component: ()=>import('@/pages/Register'),
        meta: { show: false }
    },
    // 重定向，在项目跑起来时访问/，立马定向到首页
    {
        path: '*',
        redirect: "/home"
    }
]