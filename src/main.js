import Vue from 'vue'
import App from './App.vue'
// 111三级联动的组件---全局组件
import TypeNav from './components/TypeNav'
import Carousel from './components/Carousel'
import Pagination from './components/Pagination'
import {MessageBox} from 'element-ui'
// 112 注册全局组件使用Vue.component()方法：第一个参数-全局组件名字 第二个组件-哪个组件
Vue.component(TypeNav.name,TypeNav)
Vue.component(Carousel.name,Carousel)
Vue.component(Pagination.name,Pagination)
// ElementUI注册组件时，还有种写法挂载到原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// ***********路由组件入口处
// 2引入路由
import router from '@/router'
// 引入仓库
import store from '@/store'

// 测试
// import {reqCategoryList} from '@/api'
// reqCategoryList()

// 引入mockServe.js----mock数据
import '@/mock/mockServe'

// 引入reqGetSearchInfo接口
// import {reqGetSearchInfo} from '@/api/index.js'
// console.log(reqGetSearchInfo({}));
// reqGetSearchInfo({})

// 引入全部api的接口
import * as API from '@/api'

// 引包swiper
import 'swiper/css/swiper.css'

// 引入Vue-lazyload
import VueLazyLoad from 'vue-lazyload'
import mwzi from '@/assets/1.jpg'
// 注册插件
Vue.use(VueLazyLoad,{
  // 懒加载默认的图片
  loading:mwzi
})

// 引入自定义插件
import myPlugins from '@/plugins/myPlugins'
Vue.use(myPlugins,{AAA:'AAA'})

// 引入表单校验插件
import "@/plugins/validate"


new Vue({
  // 根组件挂载到挂载点（public->index->app）
  render: h => h(App),
  // $bus：全局事件总线配置
  beforeCreate(){
    Vue.prototype.$bus=this
    Vue.prototype.$API=API
  },
  //3注册路由：KV一致省略V【router小写】
  // 注册路由信息：当这里书写router时，组件身上都有$route,$router属性
  router,
  // 注册仓库：组件实例身上属性会增加$store属性
  store
}).$mount('#app')
