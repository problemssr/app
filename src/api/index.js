// api进行统一管理
import requests from "./request";
import mockRequest from './mockAjax'
// 三级联动接口
// /api/product/getBaseCategoryList get 无参数

// export对外暴露（就是别的模块可以引入）
// export const reqCategoryList = ()=>{
//     // 发请求（axios函数形式发请求返回结果是promise对象）
//      return requests({url:'/product/getBaseCategoryList',method:'get'})
// }
export const reqCategoryList = () => requests({ url: '/product/getBaseCategoryList', method: 'get' })

// 获取banner（Home首页轮播图接口）
export const reqGetBannerList = () => mockRequest.get('/banner')

// 获取floor数据
export const reqFloorList = () => mockRequest.get('/floor')

// 获取search模块数据 地址：/api/list 请求方式：post 参数：带参数
/**
 * {
  "category3Id": "61",
  "categoryName": "手机",
  "keyword": "小米",
  "order": "1:desc",
  "pageNo": 1,
  "pageSize": 10,
  "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
  "trademark": "4:小米"
}
 */
export const reqGetSearchInfo = (params) => requests({ url: '/list', method: 'post', data: params })

// 获取产品详情接口 /api/item/{ skuId } 请求方式：get
export const reqGoodsInfo = (skuId) => requests({ url: `/item/${skuId}`, method: 'get' })

// 将产品添加到购物车中（获取更新某一个产品的个数） /api/cart/addToCart/{ skuId }/{ skuNum } 请求方式：post 参数：带参数
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'post' })

// 获取购物车列表 /api/cart/cartList 请求方式：get
export const reqCartList = () => requests({ url: '/cart/cartList', method: 'get' })

// 删除购物车产品 /api/cart/deleteCart/{skuId} 请求方式：delete
export const reqDeleteCartById = (skuId) => requests({ url: `/cart/deleteCart/${skuId}`, method: 'delete' })

// 切换商品选中状态 /api/cart/checkCart/{skuId}/{isChecked}  请求方式：get
export const reqUpdateCheckedById = (skuId, isChecked) => requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'get' })

// 获取验证码 /api/user/passport/sendCode/{phone} 请求方式：get
export const reqGetCode = (phone) => requests({ url: `/user/passport/sendCode/${phone}`, method: 'get' })

// 注册用户 /api/user/passport/register 请求方式：post （phone password code）
export const reqUserRegister = (data) => requests({ url: '/user/passport/register', data, method: 'post' })

// 登录 /api/user/passport/login 请求方式：post （phone password）
export const reqUserLogin = (data) => requests({ url: '/user/passport/login', data, method: 'post' })

// 获取用户信息【需要带着用户的token向服务器要数据】 /api/user/passport/auth/getUserInfo 请求方式：get
export const reqUserInfo = () => requests({ url: '/user/passport/auth/getUserInfo', method: 'get' })

// 退出登录 /api/user/passport/logout 请求方式：get
export const reqLogout = () => requests({ url: '/user/passport/logout', method: 'get' })

// 获取用户地址信息 /api/user/userAddress/auth/findUserAddressList 请求方式：get
export const reqAddressInfo = () => requests({ url: '/user/userAddress/auth/findUserAddressList', method: 'get' })

// 获取订单交易页信息 /api/order/auth/trade 请求方式：get
export const reqOrderInfo = () => requests({ url: '/order/auth/trade', method: 'get' })

// 提交订单 /api/order/auth/submitOrder?tradeNo={tradeNo} 请求方式：post
export const reqSubmitOrder=(tradeNo,data)=>requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,method:'post',data})

// 获取订单支付信息 /api/payment/weixin/createNative/{orderId} 请求方式：get
export const reqPayInfo=(orderId)=>requests({url:`/payment/weixin/createNative/${orderId}`,method:'get'})

// 查询支付订单状态 /api/payment/weixin/queryPayStatus/{orderId} 请求方式：get
export const reqPayStatus=(orderId)=>requests({url:'/payment/weixin/queryPayStatus/'+orderId,method:'get'})

// 获取我的订单列表 /api/order/auth/{page}/{limit} 请求方式：get
export const reqMyOrderList=(page,limit)=>requests({url:`/order/auth/${page}/${limit}`,method:'get'})