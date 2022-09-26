// 引入mockjs模块
import Mock from 'mockjs'
// json数据引入[json数据没对外暴露，但可以引入]
// webpack默认对外暴露：图片，json数据
import banner from './banner.json'
import floor from './floor.json'

// mock数据：第一个参数请求地址，第二个参数请求数据
Mock.mock("/mock/banner", { code: 200, data: banner })//模拟轮播图数据
Mock.mock("/mock/floor", { code: 200, data: floor })
