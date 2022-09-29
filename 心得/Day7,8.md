### 4.1 加入购物车按钮

发请求+路由跳转（传参）+购买信息也要传到新页面

```js
//index.vue
addShopcar(){
    //1:在点击加入购物车这个按钮的时候，做的第一件事情，将参数带给服务器（发请求），通知服务器加入购车的产品是谁
    this.$store.dispatch('addOrUpdateShopCart',{skuId:this.$route.params.skuid,skuNum:this.skuNum})
    //this.$store.dispatch('addOrUpdateShopCart'),说白了，它是在调用vuex仓库中的这个addOrUpdateShopCart函数。
    //2:你需要知道这次请求成功还是失败，如果成功进行路由跳转，如果失败，需要给用户提示
}

//detail.js
// 将产品添加到购物车中
async addOrUpdateShopCart({commit},{skuId,skuNum}){
    // 加入购物车返回的结构(发请求)
    // 前台将参数带给服务器，服务器写入数据成功，并没有返回其他数据，只返回code=200，代表成功
    let res = await reqAddOrUpdateShopCart(skuId,skuNum)
    console.log(res);
}
```



### 4.2 加入购物车成功与失败的判断

**函数加上async一定是promise**

```js
async addShopcar() {
    //1:在点击加入购物车这个按钮的时候，做的第一件事情，将参数带给服务器（发请求），通知服务器加入购车的产品是谁
    try {
        await this.$store.dispatch("addOrUpdateShopCart", {
            skuId: this.$route.params.skuid,
            skuNum: this.skuNum,
        });
        // 3.路由跳转
        this.$router.push({name:'addcartsuccess'})
        // 4.跳转时
    } catch (error) {
        alert(error.message)
    }
},
```



### 4.3 会话存储

**本地存储与会话存储区别？**

**本地存储**：持久化----5M

**会话存储**：非持久化---会话结束就消失

参数复杂

1. 一些简单的数据skuNum，通过query形式给路由组件传递过
2. 产品信息的数据【比较复杂:skuInfo】,通过会话存储（不持久化,会话结束数据在消失）

```js
this.$router.push({name:'addcartsuccess',query:{skuNum:this.skuNum}})
//4:在路由跳转的时候还需要将产品的信息带给下一级的路由组件
//一些简单的数据skuNum，通过query形式给路由组件传递过去
//产品信息的数据【比较复杂:skuInfo】,通过会话存储（不持久化,会话结束数据在消失）
//本地存储|会话存储，一般存储的是字符串
sessionStorage.setItem("SKUINFO",JSON.stringify(this.skuInfo))
```

```html
<div class="left-pic">
<img :src="skuInfo.skuDefaultImg">
</div>
<div class="right-info">
<p class="title">{{skuInfo.skuName}}</p>
<p class="attr">{{skuInfo.skuDesc}} 数量：{{$route.query.skuNum}}</p>
</div>
```

```js
computed:{
    skuInfo(){
        return JSON.parse(sessionStorage.getItem('SKUINFO'))
    }
},
```



### 4.3 购物车静态组件和修改

。。。。



### 4.4 uuid游客身份获取购物车数据

**向服务器发ajax，获取购物车数据，操作vuex三连环，组件获取数据展示数据**

##### uuid：请求携带唯一的用户临时ID

​	npm install uuid store -S

单独配置utils在内部写个生成uuid函数

```js
import {v4 as uuidv4} from 'uuid'
// 要生成一个随机字符串，且每次执行不能发生变化，游客身份持久存储localStoreage
export const getUUID=()=>{
    // 先从本地存储获取uuid（看一下本地存储里面是否有）
    let uuid_token=localStorage.getItem('UUIDTOKEN')
    //如果没有
    if(!uuid_token){
        //我生成游客临时身份
        uuid_token=uuidv4()
        //本地存储存储一次
        localStorage.setItem('UUIDTOKEN',uuid_token)
    }
    //切记有返回值,没有返回值undefined
    return uuid_token

}
```



将uuid添加到请求头

```js
// 请求拦截器.interceptors.request：发请求之前，请求拦截器可以检测到，可以请求发出去之前做一些事情
requests.interceptors.request.use((config)=>{
    // config：配置对象，对象中的headers请求头很重要
    if(store.state.detail.uuid_token){
        //请求头添加一个字段(userTempId)
        config.headers.userTempId=store.state.detail.uuid_token
    }
    return config
})//来个回调函数
```



### 4.5 购物车动态展示数据

先vuex三连环

```js
import { reqCartList } from '@/api/index.js'
const state = {
    cartList: []
}
const mutations = {
    GETCARTLIST(state, cartList) {
        state.cartList = cartList
    }
}
const actions = {
    // 获取购物车列表数据
    async getCartList({ commit }) {
        let res = await reqCartList()
        if (res.code == 200) {
            commit("GETCARTLIST", res.data)
        }
    }
}
const getters = {
    cartList(state){
        return state.cartList[0]||{}
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
```

在将数据传到组件

```js
...mapGetters(["cartList"]),
    cartInfoList() {
    return this.cartList.cartInfoList || [];
},
```

在html中展示数据

```html
<ul
    class="cart-list"
    v-for="(cart, index) in cartInfoList"
    :key="index"
    >
    <li class="cart-list-con1">
        <input
               type="checkbox"
               name="chk_list"
               :checked="cart.isChecked == 1"
               />
    </li>
    <li class="cart-list-con2">
        <img :src="cart.imgUrl" />
        <div class="item-msg">{{ cart.skuName }}</div>
    </li>
    <li class="cart-list-con4">
        <span class="price">{{ cart.skuPrice }}.00</span>
    </li>
    <li class="cart-list-con5">
        <a href="javascript:void(0)" class="mins">-</a>
        <input
               autocomplete="off"
               type="text"
               minnum="1"
               class="itxt"
               :value="cart.skuNum"
               />
        <a href="javascript:void(0)" class="plus">+</a>
    </li>
    <li class="cart-list-con6">
        <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
    </li>
    <li class="cart-list-con7">
        <a href="#none" class="sindelet">删除</a>
        <br />
        <a href="#none">移到收藏</a>
    </li>
</ul>
```

```html
<div class="cart-tool">
    <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked"/>
        <span>全选</span>
    </div>
    <div class="option">
        <a href="#none">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
    </div>
    <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
            <em>总价（不含运费） ：</em>
            <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
            <a class="sum-btn" href="###" target="_blank">结算</a>
        </div>
    </div>
</div>
```

简化数据

```js
//计算产品总价
totalPrice() {
    let sum = 0;
    this.cartInfoList.forEach((item) => {
        sum+=item.skuNum*item.skuPrice
    });
    return sum
},
// 计算全选
isAllChecked(){
     // every函数 数组内值都是指定数字则为true否则为false
     return this.cartInfoList.every(item=>item.isChecked==1)
}
```

**// every函数 数组内值都是指定数字则为true否则为false**



### 4.6 处理产品数量

```html
<li class="cart-list-con5">
    <a
       href="javascript:void(0)"
       class="mins"
       @click="handler('minus', -1, cart)"
       >-</a
        >
    <input
           autocomplete="off"
           type="text"
           minnum="1"
           class="itxt"
           :value="cart.skuNum"
           @change="handler('change', $event.target.value * 1, cart)"
           />
    <a
       href="javascript:void(0)"
       class="plus"
       @click="handler('add', 1, cart)"
       >+</a
        >
</li>
```



```js
handler: throttle(async function(type, disNum, cart){
    //type:为了区分这三个元素
    //disNum形参:+ 变化量（1）  -变化量（-1）   input最终的个数（并不是变化量）
    //cart:哪一个产品【身上有id】
    // console.log(type,disNum);
    //派发action向服务器发请求，修改数量
    switch (type) {
            //加号
        case "add":
            disNum = 1;
            break;
        case "minus":
            // //判断产品的个数大于1，才可以传递给服务器-1
            // if(cart.skuNum>1){
            //   disNum=-1
            // }
            // else{
            //   //如果出现产品的个数小于等于1，传递给服务器个数0（原封不动）
            //   disNum=0
            // }
            /**
           * 简化：
           * 判断产品的个数大于1，才可以传递给服务器-1
           * 如果出现产品的个数小于等于1，传递给服务器个数0（原封不动）
           */
            disNum = cart.skuNum > 1 ? -1 : 0;
            break;
        case "change":
            // 用户输入进来的最终量，如果非法的（带有汉字|出现负数），带给服务器数字零
            // if(isNaN(disNum)||disNum<1){
            //   disNum=0
            // }else{
            //    //属于正常情况（小数：取证），带给服务器变化的量 用户输入进来的 - 产品的起始个数
            //    disNum=parseInt(disNum)-cart.skuNum
            // }
            disNum = (isNaN(disNum)||disNum<1)?0:parseInt(disNum) - cart.skuNum;
    }

    try {
        await this.$store.dispatch("addOrUpdateShopCart", {
            skuId: cart.skuId,
            skuNum: disNum,
        });
        //再一次获取服务器最新的数据进行展示
        this.getData();
    } catch (error) {
        console.log('未成功');
    }
},500),
```

**总结：判断输入，发请求**



### 4.7 删除购物车产品操作

http请求方式

![image-20220118111450064](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220118111450064.png)

```js
//删除某一个产品的操作
deleteCartById(cart){
    try {
        this.$store.dispatch("deleteCartListBySkuId", cart.skuId)
        this.getData()
    } catch (error) {
        alert(error.message)
    }
},
```



### 4.8 修改某一个产品的勾选状态

```js
// 修改某一个产品的勾选状态
    async updateChecked(cart, event) {
      // let isChecked=event.target.checked?'1':'0'
      // this.$store.dispatch('updateChecked',{skuId:cart.skuId,isChecked})
      try {
        //如果修改数据成功，再次获取服务器数据（购物车）
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("updateChecked", {
          skuId: cart.skuId,
          isChecked,
        });
        this.getData();
      } catch (error) {
        //如果失败提示
        alert(error.message);
      }
    },
```



### 4.9 删除选中全部产品操作

![image-20220118143155919](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220118143155919.png)

**context的结构**

![image-20220118144043727](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220118144043727.png)

#### //context:

1. #### 小仓库

2. #### commit【提交mutations修改state】 

3. #### getters【计算属性】 

4. #### dispatch【派发action】 

5. #### state【当前仓库数据】

```html
<a @click="deleteAllCheckedCart">删除选中的商品</a>
```



```js
//删除全部选中的产品
//这个回调函数咱门没办法收集到一些有用数据
async deleteAllCheckedCart() {
    try {
        //派发一个action
        await this.$store.dispatch("deleteAllCheckedCart");
        //再发请求获取购物车列表
        this.getData();
    } catch (error) {
        alert(error.message);
    }

}
```



**Promise.all([p1,p2,p3])**

**p1|p2|p3:每一个都是Promise对象，若有一个Promise失败，则全失败，否者为成功**

**只要全部的p1|p2....都成功，返回结果即为成功**

```js
shopcart.js

//删除全部勾选的产品
deleteAllCheckedCart({ dispatch, getters }) {
    //context:小仓库，commit【提交mutations修改state】 getters【计算属性】 dispatch【派发action】 state【当前仓库数据】
    let PromiseAll = [];
    //获取购物车中全部的产品（是一个数组）
    getters.cartList.cartInfoList.forEach(item => {
        let promise = item.isChecked == 1 ? dispatch("deleteCartListBySkuId", item.skuId) : ""
        PromiseAll.push(promise)
    });
    //只要全部的p1|p2....都成功，返回结果即为成功
    //如果有一个失败，返回即为失败结果
    return Promise.all(PromiseAll)
}
```



### 4.10 全部产品勾选状态修改

```html
<input class="chooseAll" type="checkbox" :checked="isAllChecked" @change="updateAllCartChecked"/>
```

```js
//修改全部产品的选中状态
    async updateAllCartChecked(event){
      try {
        let isChecked=event.target.checked?'1':'0'
        // 派发action
        await this.$store.dispatch("updateAllCartChecked",isChecked)
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    }
```



```js
shopcart.js
//修改全部产品的状态
updateAllCartChecked({dispatch,state},isChecked){
    let PromiseAll=[]
    state.cartList[0].cartInfoList.forEach((item) => {
        let promise=dispatch('updateChecked',{skuId:item.skuId,isChecked})
        PromiseAll.push(promise)
    });
    return Promise.all(PromiseAll)
}
```



### 4.11 登录注册静态组件

assets文件夹---------放置全部组件共用静态资源

在样式中也可使用@【src别名】，但在前面加~

```css
background-image: url(~@/assets/images/icons.png);
```

获取验证码

```js
// 获取验证码
getCode() {
    const { phone } = this;
    phone && this.$store.dispatch("getCode", phone);
    this.code = this.$store.state.user.code;
    // console.log(this.code);
},
```



### 4.12 注册业务

```html
<div class="content">
    <label>手机号:</label>
    <input type="text" placeholder="请输入你的手机号" v-model="phone" />
    <span class="error-msg">错误提示信息</span>
</div>
<div class="content">
    <label>验证码:</label>
    <input type="text" placeholder="请输入验证码" v-model="code" />
    <button style="width: 100px; height: 38px" @click="getCode">
        获取验证码
    </button>
    <span class="error-msg">错误提示信息</span>
</div>
<div class="content">
    <label>登录密码:</label>
    <input
           type="password"
           placeholder="请输入你的登录密码"
           v-model="password"
           />
    <span class="error-msg">错误提示信息</span>
</div>
<div class="content">
    <label>确认密码:</label>
    <input
           type="password"
           placeholder="请输入确认密码"
           v-model="password1"
           />
    <span class="error-msg">错误提示信息</span>
</div>
```

写完接口写仓库

仓库user.js

```js
import { reqGetCode,reqUserRegister } from "@/api"
// 登录与注册模块
const state = {
    code: ""
}
const mutations = {
    GETCODE(state, code) {
        state.code = code
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
    async userRegister({commit},user){
        let res=await reqUserRegister(user)
        if(res.code==200){
            return 'ok'
        }else{
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
```



```js
register index.vue的js

export default {
    name: "Register",
    data() {
        return {
            // 收集表单数据----手机号
            phone: "",
            // 验证码
            code: "",
            // 登录密码
            password: "",
            // 确认密码
            password1: "",
            //是否同意
            agree: true,
        };
    },
    methods: {
        //用户注册
        async userRegister() {
            try {
                const { phone, code, password, password1 } = this
                phone && code && password == password1 && await this.$store.dispatch("userRegister", { phone, code, password });
                //注册成功进行路由的跳转
                this.$router.push('/login')
            } catch (error) {
                alert(error.message)
            }
        },
    },
};
```





### 4.12 登录业务（token）

阻止默认事件：@click.**prevent**="userLogin"

**token【令牌：字符串，服务器下发给用户的身份凭证】**

//服务器下发token，用户唯一标识符(uuid)
//将来经常通过带token找服务器要用户信息进行展示

**vuex仓库存储数据不是持久化**

```js
请求头
// 请求拦截器.interceptors.request：发请求之前，请求拦截器可以检测到，可以请求发出去之前做一些事情
requests.interceptors.request.use((config)=>{
    // config：配置对象，对象中的headers请求头很重要
    if(store.state.detail.uuid_token){
        //请求头添加一个字段(userTempId)
        config.headers.userTempId=store.state.detail.uuid_token
    }
    // 带着token给服务器
    if(store.state.user.token){
        config.headers.token=store.state.user.token
    }
    return config
})//来个回调函数
```

```js
api/index.js
// 获取用户信息【需要带着用户的token向服务器要数据】 /api/user/passport/auth/getUserInfo 请求方式：get
export const reqUserInfo = () => requests({ url: '/user/passport/auth/getUserInfo', method: 'get' })
```

```js
methods: {
    // 用户登录
    async userLogin() {
        try {
            //登录成功
            const { phone, password } = this;
            (phone && password)&&await this.$store.dispatch("userLogin", { phone, password });
            //登录的路由组件：看路由当中是否包含query参数，有：调到query参数指定路由，没有：调到home
            this.$router.push("/home");
        } catch (error) {
            alert(error.message);
        }
    },
},
```

存在问题

1)登录过后首页用户信息的展示

1.1当用户注册完成，用户登录【用户名+密码】向服务器发请求（组件派发action:userLogin) ,登录成功获取到token，仓储与仓库当中（非持久化的），路由跳转跳转到home首页。

1.2因此在首页当中（mounted）派发action(getUserInfo)获取用户信息，一级动态展示header组件内容。

1.3一刷新home首页，获取不到用户信息（token: vuex非持久化存储)

2)持久化存储token





### 4.13 退出登录

1.发请求，通知服务器退出登录【清除数据：token】

2.清除项目中数据【userInfo，token】

**action中不能操作state要三连环**

```js
async logout(){
    try {
        await this.$store.dispatch('userLogout')
        // 回到首页
        this.$router.push('/home')
    } catch (error) {
        alert(error.message)
    }
```



### 4.14 导航守卫

导航:表示路由正在发生改变。进行路由跳转

守卫:你把它当中·紫禁城护卫·

全局守卫

举例子:紫禁城【皇帝、太后、妃子】，紫禁城大门守卫全要排查

全局守卫：前置守卫（路由跳转之前判断）

```js
router.beforeEach((to, from, next) => {
	//to:可以获取要跳转到哪个路由信息
    //from:可以获取你从哪个路由而来的信息
    //next:放行函数 
    	//next() 直接放行
    	//next(path) 放行到指定路由位置
    	//next(false) 中断当前路由
    
})
```



项目当中任何路由变化都可以检测到，通过条件判断可不可以进行路由跳转。
前置守卫：路由跳转之前可以做一些事情。

```js
router index.js
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
        next()
    }
})

export default router
```



后置守卫：路由跳转已经完成在执行。





路由独享守卫

举例子:紫禁城【皇帝、太后、妃子】，是相应的【皇帝、太后、妃子】路上守卫

组件内守卫:我要去皇帝屋子

举例子:老师已经到到皇帝屋子外面了（进入了）守卫



