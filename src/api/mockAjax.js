// 对于axios二次封装（为了请求拦截器和响应拦截器）
import axios from "axios"
// 17 引入进度条
import nprogress from "nprogress"
// console.log(nprogress);
// 17 引入进度条样式
import "nprogress/nprogress.css"

// 1.利用axios对象的方法create，去创建一个axios实例
// 2.request就是axios，只不过需要配置
const requests=axios.create({
    // 配置对象
    // 基础路径：发请求时，路径会出现api
    baseURL:"/mock",//基于哪个路径
    timeout:5000,//请求超时的时间5s
})

// 请求拦截器.interceptors.request：发请求之前，请求拦截器可以检测到，可以请求发出去之前做一些事情
requests.interceptors.request.use((config)=>{
    // config：配置对象，对象中的headers请求头很重要
    return config
})//来个回调函数

// 响应拦截器
requests.interceptors.response.use((res)=>{
    // 服务器响应失败成功的回调函数：服务器响应数据回来以后，响应拦截器可以检测到，做一些事情
    // 进度条开始
    nprogress.start()
    return res.data

},()=>{
    // 服务器响应失败的回调函数
    // 进度条结束
    nprogress.done()
    return Promise.reject(new Error('faile'))
})//来个成功，失败的回调函数

// 对外暴露
export default requests