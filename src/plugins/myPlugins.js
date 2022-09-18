// vue插件一定暴露一个对象
let myPlugins={}

myPlugins.install=function(Vue,options){
    // Vue.prototype.$bus:任何组件都可使用
    // Vue.directive()全局指令
    // Vue.filter
    Vue.directive(options.AAA,()=>{
        
    })
}

export default myPlugins