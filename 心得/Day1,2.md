## **Day1（1-20）**

### **1.1 cli初始化项目**

淘宝镜像（安装速度快） npm install -g cnpm --registry=https://registry.npm.taobao.org

梳理目录含义

node_modules文件夹：项目依赖文件夹

public文件夹：一般放置一些静态资源（图片），需注意：放在public文件夹中的静态资源，
webpack进行打包的时候会原封不动打包到dist文件夹中

src文件夹（程序员源代码文件夹）：
    assets文件夹：一般放置的静态资源（一般放置多个组件共用的静态资源），需注意：
    放置在assets文件夹里静态资源，在webpack打包时，webpack将静态资源当成一个模块，打包在js文件里

    components文件夹：放置非路由组件（全局组件）
    
    App.vue：唯一根组件，Vue当中的组件（.vue）
    main.js：程序的入口文件，也是整个程序最先执行的文件

.gitignore文件：配置文件，git忽略文件
babel.config.js文件：配置文件，与babel（翻译官，es6翻译成es5）相关
package.json文件：配置文件，记录项目信息（项目名称，项目依赖，项目运行）
package-lock.json文件：缓存性文件

------



### **1.2 vue其他配置**

运行时自动打开浏览器
--->package.json--->"scripts": "serve": "vue-cli-service serve --open"

eslint校验功能关闭
--->根目录下建一个vue.config.js文件(配置代理)
关闭原因：声明变量但没有使用，eslint校验工具会报错

src文件夹简写，配置别名(@)
jsconfig.json配置别名@提示 【@代表src文件夹，将来文件过多，找的时候方便很多】
{
    "compileOptions": {
        "baseUrl": "./",
        "paths": {
                    "@/*": ["src/*"]
                }
            },
    "exclude": ["node_modules","dist"]
}

------



### **1.3 项目路由分析**

vue-router
前端所谓路由：KV键值对
key：URL（地址栏中路径 http:/vue/home）
value：相应的路由组件(该地址对应显示的内容)

路由组件：
home首页路由组件，search搜索页路由组件，login登录路由，register注册路由
非路由组件：
header【home|search|login|register】
footer【在home，search，但不在login|register】

------



### **1.4 完成header，footer非路由组件**

开发项目流程：
1.画静态页面（html+css）
2.拆分组件
3.获取服务器数据（axios获取，动态展示）
4.完成相应动态业务逻辑

注：
1.创建组件时，**组件结构+组件样式+图片资源**都要齐全
2.项目采用less样式，浏览器不识别less样式，通过less、less-loader[安装版本5]进行处理less，
  把less样式变成css样式，浏览器可以识别（所以安装依赖）
3.想让组件识别less样式，需在style标签加上lang=less

#### 使用组件步骤（非路由组件）
1.创建组件或定义
2.别的组件内引入到app根组件
3.注册components
4.使用（用标签形式）

------



### **1.5 完成路由组件搭建**

vue-router
路由组件四个：home，search，login，register
-components文件夹：常放置非路由组件（or共用全局组件）
-pages|views文件夹：常放置路由组件

#### 配置路由
项目中配置的路由放置在router文件夹中

##### **路由组件与非路由组件区别？**

1. 路由组件放置在pages|views文件夹，非路由组件放置components文件夹

2. 路由组件需要在router文件夹中注册（使用的即为组件名字），非路由组件使用需以标签形式使用

   *$route*：一般获取路由信息【路径，query参数，params参数】

   *$router*：一般进行编程式导航进行路由跳转【push|replace（区别能否进行历史记录）】

3. 注册完路由，不管路由组件还是非路由组件身上都有$route、$router属性

**路由的跳转？**

1. <u>声明式导航router-link，可进行路由跳转</u>
<!-- 声明式导航：要有to属性 -->
<router-link to="/login">登录</router-link>
2. <u>编程式导航($router)push|replace，可进行路由跳转</u>

编程式导航：声明式导航可以做的，编程式导航都可以做，但编程式导航除了进行路由跳转，还可做一些其他的业务逻辑

------



### **1.6 Footer组件显示与隐藏**
**显示与隐藏组件：v-if（操作dom在节点树上是有无，耗性能）|v-show（用样式将元素显示或者隐藏等同display：none|block）**
Footer组件：在home，search显示Footer组件
Footer组件：在login，register隐藏Footer组件

低级写法：根据组件身上的$route获取当前路由信息，通过路由path参数判断Footer显示还是隐藏
eg.v-show="$route.path=='/home'||$route.path=='/search'"
高级写法：利用<u>路由原信息meta属性</u>，router文件夹->index.js->配置meta元信息（自定义kv）
eg.v-show="$route.meta.show"
总结：配置路由时，可给路由添加路由元信息【meta】，路由需要配置对象，routes数组内的k值不能乱写

------



### **1.7 路由传参**

**路由的跳转几种方式？**

1. 声明式导航：router-link（to属性），实现路由跳转
2. 编程时导航：利用组件实例的$router.push|replace方法，实现路由跳转（加自己的业务）

**路由传参，参数有几种写法？**

1. params参数：属于路径当中一部分，需注意，配置路由时，需占位"/:keyword"
2. query参数：不属于路径当中一部分，类似ajax中的queryString  /home?k=v&kv=，不需占位

**路由传参问题集合**

1. 路由传递参数（对象写法）path是否可以结合params参数一起使用？

   答：不可以，路由跳转传参是，对象写法可以是name，path形式，但注意，path不能与params参数一起用会报错

   this.$router.push({path:'/search',query:{k:this.keyword.toUpperCase()}})

   

2. 如何指定params参数可传可不传？

   eg.配置路由时，占位了（/:keyword）（params参数），但路由跳转时没传递params

   路径出现问题

   this.$router.push({name:'search',query:{k:this.keyword.toUpperCase()}});

   http://localhost:8080/#/?k=DSAFASD（/search没了）问题点

   http://localhost:8080/#/search?k=DSAFASD

   若路由需要params参数，但没传params参数，url有问题

   如何指定params参数可传可不传？在配置路由（index.js）时，在占位后面加个？(表示params可传可不传)     **/:keyword?**

   正则中？表达出现次数为0次或1次

   

3. params参数可以传递也可以不传递，但若传递是空串，如何解决？

   this.$router.push({name:'search',params:{keyword:''},query:{k:this.keyword.toUpperCase()}})

   使用undefined解决：parmas参数可传可不传（空字符串）

   this.$router.push({name:'search',params:{keyword:''||undefined},query:{k:this.keyword.toUpperCase()}})

   

4. 路由组件能不能传递props数据？

   能，三种写法

   ​	  // 布尔值写法：只传params

   ​	  props:true,  

   ​	  // 对象写法:额外传给路由组件一些props

   ​      props:{a:1,b:2},  

   ​      *// 函数写法：可以params参数，query参数，通过props传递给路由组件*

   ​      *// props:($route)=>{*

   ​      *//   return {keyword:$route.params.keyword,k:$route.query.k}*

   ​      *// }复杂*

   ​      props:($route)=>({keyword:$route.params.keyword,k:$route.query.k})

------



### 1.8 重写push和replace方法

1.编程式路由跳转到当前路由（参数不变），多次执行会抛出NavigationDuplicated的警告错误？

--路由跳转两种形式：声明式导航，编程式导航

--声明式导航无此问题，因为vue-router底层已处理好

--编程式导航是"vue-router": "^3.5.3"：最新的vue-router引入了promise



push方法

function push(){
    <!-- Promise有成功和失败的回调 -->
    return new Promise((resolve,reject)=>{})
}

1. 解决办法在编程式路由跳转的push方法传递成功与失败的回调函数()=>{},()=>{}，可捕获到当前错误，本方法治标不治本，在别的组件使用push|replace，编程式路由还有同样错误

2. **this**：该组件实例（search）

   

   **this.$router**属性：当前这个属性，属性值VueRouter类的一个实例，当入口文件注册路由的时候，给组件实例添加的$router，给组件实例添加$router|$route

   

   function VueRouter(){}

   

   **push**:VueRouter类的一个实例

   //原型对象prototype的方法

   VueRouter.protoype.push=function(){

   ​		//函数上下文为VueRouter类的一个实例

   }

   组件实例

   let $router = new VueRouter();

   $router.push(xxx);

   this.$router.push();

   this是此组件实例，其中有个$router属性，此属性是VueRouter类一个实例，此实例借用原型对象的方法，原型对象的方法上下文==VueRouter类一个实例

------



### 1.9 Home模块组件拆分（第二阶段拆分出静态组件）

*开发业务的流程*

1. *完成静态页面*
2. *拆分出静态组件*
3. *获取服务器的数据进行展示*
4. *动态展示数据及相应js业务逻辑*（简称动态业务）

拆分组件：

- [x] 顶部header和底部footer拆分成一个非路由组件（之前已完成）

  Home模块下的

- [ ] 《全部商品分类》的三级联动拆分成一个组件

- [ ] 《轮播图+快报》拆分成一个组件

- [ ] 《今日推荐》拆分成一个组件

- [ ] 《热卖排行》拆分成一个组件

- [ ] 《猜你喜欢》拆分成一个组件

- [ ] 《手机通讯+家用电器》拆分成一个组件（手机通讯被复用了）

- [ ] 《各大品牌logo》拆分成一个组件

------



### 1.10 完成TypeNav三级联动全局组件

**注：某个组件在很多模块都在使用，将其注册为全局组件**

----由于三级联动在home，search，detail使用，将三级联动注册成全局组件

​     好处：只需注册一次，就可在项目任意地方使用

**流程：main.js内引入（import）注册vue.component()**

------



### 1.11 完成home组件其他静态组件

拆分组件流程：

1. html结构+css样式+图片资源
2. 在将组件引入，注册，使用

------



### 1.12 Postman工具测试接口（第三阶段获取服务器数据）

---经过postman测试，接口无问题

---服务器返回数据code字段200，代表服务器返回数据成功

---整个项目接口前缀都有/api

------



### 1.13 axios二次封装（第四阶段向服务器发请求获取服务器数据并展示数据）

向服务器发请求：XMLHTTPRequest，fetch，JQ，axios

**Q：为什么二次封装axios**

请求拦截器：在发请求之前处理一些业务

响应拦截器：当服务器数据返回以后，可处理一些事情



**在项目中经常出现api文件夹（放置axios请求）**

接口当中路径都有/api

baseURL:"/api"

作用：http://xx.xx:8080（发请求路径上都带有--->）/api，变成基础路径

------



### 1.14 api接口统一管理

小项目：在组件生命周期函数中发请求

大项目：axios.get('xxx')

**api文件夹--创个index.js来管理api**



**Q：跨域问题**

**跨域：协议，域名，端口号不同的请求**

前端项目本地服务器：http://localhost:8080/#/home

后台服务器：http://39.98.123.211



**解决跨域：JSONP，CROS，代理**

代理格式 vue.config.js

```js
devServer: {

​    proxy: {

​     '/api': {

​      target: 'http://39.98.123.211',

​      *// pathRewrite: { '^/api': '' },*

​     },

​    },

   },
```

------



### 1.15 nprogress进度条使用

cnpm install --save nprogress 

![image-20220102002302121](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220102002302121.png)

start方法：进度条开始     

done方法：进度条结束

进度条颜色可修改 node_modules->nprogress->nprogress.css->.bar

------



### 1.16 vuex模块开发

**vuex状态管理库**

vue官方提供插件，状态管理库，集中式管理项目中组件共用的数据

*切记：不是所有项目都用vuex，若小项目就不需要vuex*

​		  *若用在大项目，组件多，组件与组件间的关系复杂，数据维护很费劲，使用vuex*



**五大核心模块**

**1.state**:**仓库存储数据的地方**

const state ={}

**2.mutations:修改state的唯一手段**

const mutations={}

**3.actions:处理action，可以书写自己的业务逻辑，让组件获取仓库数据更加方便**

const actions={}

**4.getters：理解为计算属性，简化仓库数据，让组件获取仓库数据更加方便**

const getters= {}

**5.modules：模块式开发**



**vuex基本使用**

1. 先配置vuex（src-store-index.js）

   ```js
   import Vue from 'vue'
   import Vuex from 'vuex'
   // 需要使用插件一次
   Vue.use(Vuex)
   ```

   

2. 在入口文件main.js注册vuex

   ```js
   // 引入仓库
   import store from '@/store'
   
   // 注册仓库：组件实例身上属性会增加$store属性
     store
   ```

   

3. 在state内注册一个属性（index.js）

   ```js
   const state ={
       // 1.注册一个属性
       count:1
   }
   ```

   

4.  用mapState从vuex接受传数组

   ```js
   // 计算属性
       computed:{
           // 2.用mapState从vuex接受传数组
           ...mapState(['count'])
       },
   ```

   

5. 派发action

   ```js
   add(){
               // 3.派发action
               this.$store.dispatch('add')
           },
   ```

   

6. 解构commit，在将commit提交给mutations

   ```js
   // actions:处理action，可以书写自己的业务逻辑，让组件获取仓库数据更加方便
   const actions={
       // 此处方法名与组件中的方法名一致
       // 这里可以书写业务逻辑，但不能修改state
       add({commit}){
           // 4.解构commit，在将commit提交给mutation
           commit("ADD")
       }
   }
   ```

   

7. 修改state属性值

   ```js
   // mutations:修改state的唯一手段
   const mutations={
       ADD(state){
           // 5.修改state属性值
           state.count++
       }
   }
   ```

   

**-----vuex实现模块式开发-----**

*若项目过大，组件过多，接口很多，数据也很多*,可以让vuex实现模块式开发



模拟state存储数据

{

​	count:1,

​	pay:{a:1},

​	detail:{b:2}

}



模块式开发

**大模块**

{

​	home:{},**小模块**

​	search:{}**小模块**

}

------



### 1.17 完成TypeNav三级联动组件的动态展示数据

#### 习惯：将所有全局组件放入components文件夹下

```js
// 引用辅助函数mapstate拿仓库数据
import {mapState} from 'vuex'
export default {
  name: "TypeNav", //给本组件起名字
  // 组件挂载完毕，向服务器发请求，获取服务器数据，展示数据
  mounted(){
    // 通知vuex发请求，获取数据，存储仓库中
    this.$store.dispatch('categoryList')
  },
  computed:{
    ...mapState({
      // 右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
      // 注入一个参数state，即为大仓库的数据
      // categoryList:(state)=>state.home.categoryList 简写
      categoryList:(state)=>{
        // state为大仓库的数据
        // console.log(state);
        return state.home.categoryList //做为新计算出来此属性的属性值
      }
    })
  }
};
```

------



### 1.18 三级联动动态背景颜色

1.采用样式完成

2.通过js完成

```js
 // 鼠标移入修改响应式数据currentIndex属性
    changeindex(index) {
      // index为鼠标移到某个一级分类的索引值
      // console.log(index);
      this.currentIndex = index;
    },
    // 一级分类鼠标移出时间回调
    leaveindex() {
      // 鼠标移出currentIndex，变为-1
      this.currentIndex = -1;
    },
```

[
    {
        id:1,categoryName:'图书',
        child:[
             {id:3.14,
              categoryName:'影像'，
              child:[
                   {id:4,categoryName:'华为'}
              ]
             }
        ]
    }
]

------



### 1.19 通过JS控制二三级分类显示与隐藏

```js
<div class="item-list clearfix" 
	:style="{display:currentIndex==index?'block':none}">
```

------



### 

