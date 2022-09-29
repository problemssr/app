## Day 3,4 (22-42)

### 2.1 演示卡顿现象引入防抖与节流

正常：事件触发非常频繁，而且每一次的触发，回调函数都要去执行（如果时间很短，而回调函数内部有计算，那么很可能出现浏览器卡顿）

防抖：前面的所有的触发都被取消，最后一次执行在规定的时间之后才会触发，也就是说如果连续快速的触发,只会执行最后一次

节流：在规定的间隔时间范围内不会重复触发回调，只有大于这个时间间隔才会触发回调，把频繁触发变为少量触发

```js
/**
       * 正常情况（用户慢慢操作）：鼠标进入，每个一级分类h3，都会触发鼠标进入事件
       * 非正常情况（用户操作很快）：本身全部的一级分类都应触发鼠标进入事件，但经过测试，只有部分h3触发了
       * 由于用户行为过快，导致浏览器反映不过来，若当前回调中有一些大量业务，可能出现卡顿
       */
```

------



### 2.2 函数的防抖与节流

**防抖**：前面的所有的触发都被取消，最后一次执行在规定的时间之后才会触发，也就是说**如果连续快速的触发,只会执行最后一次**

**【闭包+延迟器】**



**节流**：在规定的间隔时间范围内不会重复触发回调，只有大于这个时间间隔才会触发回调，**把频繁触发变为少量触发**

**【闭包+延迟器】**



总结：

1. 防抖：用户操作频繁，但执行一次【不按时间只执行一次】

2. 节流：用户操作频繁，但把频繁的操作变为少量的操作【在规定时间内执行一次】

   ​		   浏览器有充分时间解析代码

------



### 2.3 三级联动节流

```js
// es5写法
    // throttle回调函数别用箭头函数，会出现上下文问题
    changeindex:throttle(function(index){
       // index为鼠标移到某个一级分类的索引值
      // console.log(index);
      /**
       * 正常情况（用户慢慢操作）：鼠标进入，每个一级分类h3，都会触发鼠标进入事件
       * 非正常情况（用户操作很快）：本身全部的一级分类都应触发鼠标进入事件，但经过测试，只有部分h3触发了
       * 由于用户行为过快，导致浏览器反映不过来，若当前回调中有一些大量业务，可能出现卡顿
       */
      this.currentIndex = index;
      console.log('移入'+index);
    },50),
```

------



### 2.4 三级联动组件的路由跳转与传递参数

三级联动用户可点击的：一级分类，二级分类，三级分类，当你点击的时候，Home模块

跳到Search模块，一级会把用户选中的产品（产品名，产品ID）在路由跳转时，进行传递



路由跳转：

**声明式导航：router-link**

```js
<router-link to="/search">{{ c1.categoryName }}</router-link>
```

出现过多router-link，会出现卡顿现象

router-link：一个组件，当服务器的数据返回后，循环出很多router-link组件【创建组件实例】组件1000+



**编程式导航：push|replace方法**

```js
<a  @click="GoSearch">{{ c3.categoryName }}</a>

GoSearch(){
      this.$router.push('/search')
    }
```

不会卡顿但是回调函数过多



#### **利用事件委派 + 编程式导航**

##### 事件委派写在就近a标签中

```js
<div class="all-sort-list2" @click="GoSearch">
```

回调出现一次



###### 利用事件委派存在的问题：

1. <u>点击不是a标签也跳转（把全部的子节点【h3，dt，dl】事件委派给父亲节点）</u>
2. <u>如何获取参数【1,2,3级分类产品名，id】</u>



解决办法：编程式导航+事件委派

**绑定一个自定义属性:data-自定义名字 实现精准定位**

```js
<a :data-categoryName="c1.categoryName">{{ c1.categoryName }}</a> 
```

1. 把子节点当中a标签加上自定义属性:data-categoryName，其余子节点没有

2. 利用**event（事件对象）**中的target方法（event.target）获取当前出发的事件节点

   ```js
   let element=event.target
   ```

3. 节点属性有个dataset属性，可以获取节点的自定义属性与属性值

   **注：对象可以解构出来{}**

   ```js
   let {categoryname}=element.dataset
   //标签身上有categoryname一定是a标签
   ```

4. 确认一，二，三级分类a标签；再自定义属性:data-category3Id

   ![image-20220106131405891](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220106131405891.png)

5. 整理＋合并参数

   ```js
   let {categoryname,category1id,category2id,category3id}=
   element.dataset
         if(categoryname){
           // console.log(123);
           // 整理路由跳转参数
           let location={name:'search'}
           let query={categoryName:categoryname}
           // 确认一，二，三级分类a标签；再自定义属性
           if(category1id){
             query.category1Id=category1id
           }else if(category2id){
             query.category2id=category2id
           }else{
             query.category3id=category3id
           }
   
           // 整理参数
           location.query=query
           // 路由跳转
           this.$router.push(location)
   ```

   

### 2.5 Search模块中商品分类与过渡动画

##### mounted：组件挂载完毕

```js
// 组件挂载完毕，向服务器发请求，获取服务器数据，展示数据
  mounted() {
    // 通知vuex发请求，获取数据，存储仓库中
    this.$store.dispatch("categoryList");
    // 不是Home路由组件，将其隐藏
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
```



商品分类移入移出

```js
leaveindex() {
      // 鼠标移出currentIndex，变为-1
      this.currentIndex = -1;
      // search路由才执行
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
    entershow() {
      if (this.$route.path != "/home") {
        this.show = true;
      }
    },
```



商品分类过渡动画

```js
过渡动画：前提组件|元素务必要有v-if|v-show才可以进行过渡动画
```

```js
<transition name="sort">···</transition>
```

使用name属性之后要写sort-enter....而不是v-enter...



### 2.6 typeNav商品分类列表优化

![image-20220106232100426](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220106232100426.png)

​	请求多次，性能不好

​	请求一次：把typeNav派发action放在根组件

**在App根组件发请求【根组件mounted】执行一次**

```js
//App.vue下
mounted(){
    // 派发action|获取商品三级列表的数据
    this.$store.dispatch("categoryList")
  }
```

**this指定本组件**



### 2.7 合并参数（parmas和query参数）

问题

![image-20220106235051284](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220106235051284.png)

![image-20220106235109117](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220106235109117.png)

```js
typenav组件
GoSearch函数
// 判断是否有params参数，有则传过去
        if(this.$route.params){
          location.params=this.$route.params
        }
```

```js
header组件
gosearch函数
// 有query参数也加上
      if(this.$route.query){
        let location= { 
        name: "search", 
        params: { keyword: this.keyword } };
        location.query=this.$route.query
        this.$route.push(location)
      }
```



### 2.8 mockjs模拟数据

开发home首页当中ListContainer组件和Floor组件

###### 注：服务器返回数据（接口）只有商品分类（三级联动）数据，对于ListContainer组件和Floor组件数据服务器没提供

##### 使用mock数据（模拟）：模拟数据使用插件mockjs

使用步骤：

1. 在src目录创建mock文件夹

2. 准备json数据（假数据） mock文件夹--->xx.json(**注：格式化**)

3. 把mock数据需要的静态资源（图片）放入public文件中【public文件夹在打包时会把相应资源原封不动打包到dist文件夹中】

4. 创建mockServer.js通过mockjs插件实现模拟数据

   * **json数据引入[json数据没对外暴露，但可以引入]**
   * **webpack默认对外暴露：图片，json数据**

   ```js
   // 引入mockjs模块
   import Mock from 'mockjs'
   // json数据引入[json数据没对外暴露，但可以引入]
   // webpack默认对外暴露：图片，json数据
   import banner from './banner.json'
   import floor from './floor.json'
   
   // mock数据：第一个参数请求地址，第二个参数请求数据
   Mock.mock("/mock/banner",{code:200,data:banner})//模拟轮播图数据
   Mock.mock("/mock/floor",{code:200,data:floor})
   ```

   

5. mockServer.js文件在入口文件main.js中引入（至少需要执行一次，才能模拟数据）

```js
// 引入mockServe.js----mock数据
import '@/mock/mockServe'
```



### 2.9 获取Banner轮播图数据

向mockjs要数据，把数据放入仓库以及在组件中获取到仓库中的数据

vuex的3连用



### 2.10 swiper基本使用

1. 引包（相应JS|CSS）

2. #### **页面结构务必要有**

3. 在2前提下：new Swiper实例【轮播图添加动态效果】

```js
var mySwiper = new Swiper ('.swiper', {
    loop: true, // 循环模式选项
    
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })        
```





### 2.11  ListContainer组件开发重点

#### swiper插件：制作轮播图（移动端|PC）

1. 安装Swiper插件：cnpm install --save swiper@5
2. 引包（js在组件内|css在全局main.js）
3. new Swiper【不能放在mounted中，因为mounted加载的结构不全（结构回来了，结构数据（是服务器数据）没回来）】

update当数据发生变化的时候会触发



### 2.12 完美轮播图（watch+$nectTick）

mounted：组件挂载完毕，正常情况组件结构（DOM）已存在

Q:swiper直接在mounted写不可以，因为结构不完整

##### watch：数据监听：监听已有数据变化

##### $nectTick：在下次DOM更新 *循环结束后* 执行延迟回调，在 *修改数据之后* 立即使用这个方法，获取更新后的DOM；保证页面结构一定有，和很多插件一起使用【都需要dom存在】

```js
watch:{
    // 写法：对象or函数
    // 监听bannerlist数据变化，cz本数据发生过变化——————由空数组变为数组包含4个元素
    // 以下对象写法
    bannerList:{
      handler(newValue,oldValue){
        // 通过watch监听bannerlist属性的属性值变化
        // 执行handle方法，代表组件实例身上这个属性的属性值已经有了【数组4个元素】
        this.$nextTick(()=>{
          // 执行此回调函数，保证服务器数据已经回来了，v-for执行完毕了【也就是轮播图结构（for循环）已经出来了】
          new Swiper(".swiper-container", {
            loop: true, // 循环模式选项
  
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
  
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },

        })
        });
      }
    }
  }
```

#### 注：处理异步async，await，promise



### 2.13 获取floor组件mock数据

#### ref：用来给元素或子组件注册引用信息

切记：仓库中state数据格式按服务器返回数据写

Q:getfloorlist这个action在哪里触发

A:在home路由组件发，不能再floor组件内部发action，要v-for遍历floor组件

floor组件（子）和home组件（父）是父子关系

##### v-for可在自定义组件使用

组件通信方式有哪些？？

1. props：父子组件通信
2. 自定义事件：@on @emit 可实现子给父通信
3. pubsub-js：vue中几乎不用 全能
4. 插槽
5. vuex
6. $bus

##### Q：第一次写swiper时，在mounted写不可以，但写小轮播图又可以了？

##### A：第一次写轮播图时，在当前组件内部发请求，动态渲染结构【服务器数据还没回来】，所以之前不可以

* 本次写轮播图可以因为请求是父组件发的，父组件通过props传递过来的，而且结构都已存在的情况下执行mounted

###### floor组件：在组件内部没有发请求，数据是父组件给的



### 2.14 封装轮播图成全局组件

Attention：同一组件出现二次及以上使用全局组件，好处注册一次可在任意地方使用，共用组件|非路由组件放到components文件夹中



### 2.15 Search模块静态组件

1. ###### 先静态页面+静态组件拆分出来

2. ###### 发请求（API）

3. ###### vuex（三连环）

4. ###### 组件获取仓库数据，动态展示数据



### 2.16 search模块vuex操作

1. 发请求

   获取search模块数据 地址：/api/list 请求方式：post 参数：带参数

   ```js
   export const reqGetSearchInfo= (params)=>requests({url:'/list',method:'post',data:params})
   ```

   调用在main.js调用

   ```js
   // 引入reqGetSearchInfo接口
   import {reqGetSearchInfo} from '@/api/index.js'
   console.log(reqGetSearchInfo({}));
   ```

2. vuex三连环（store文件夹---->search.js）

   ```js
   import { reqGetSearchInfo } from '@/api'
   // search模块小仓库
   const state = {
       // 初始状态
       searchList: {}
   }
   const mutations = {
       // 2修改state
       GETSEARCHLIST(state, searchList) {
           state.searchList = searchList
       }
   }
   const actions = {
       // 1提交
       async getSearchList({ commit }, params = {}) {
           // params形参：是当前用户派发action时，第二个参数传递过来的，至少是一个空对象
           let res = await reqGetSearchInfo(params)
           if (res.code == 200) {
               commit('GETSEARCHLIST', res.data)
           }
       }
   }
   // 计算属性，在项目中简化数据
   const getters = {}
   // 对外暴露才能别的组件使用
   export default {
       state,
       mutations,
       actions,
       getters
   }
   ```

   

### 2.17 search模块中动态展示产品列表

##### 面包屑：尾部有x的组件

##### mapState：把仓库中的state数据映射成组件身上的数据

```js
computed: {
    ...mapState({
      goodsList:state=>state.search.searchList.goodsList
    }),
  },
```



##### 计算属性computed：利用已有的属性的属性值造就出一个新的属性

searchList属性的属性值状态？

1. 默认是个空对象undefined
2. 服务器数据回来，将服务器数据进行替换

##### 计算属性getters，在项目中简化仓库数据

```js
const getters = {
    goodsList(state){
        return state.searchList.goodsList||[]
    },
    trademarkList(state){
        return state.searchList.trademarkList
    },
    attrsList(state){
        return state.searchList.attrsList
    }
}
```

##### mapGetters写法：传递的数组，因为getters计算是没有划分模块【home，search】

```js
computed: {
    // mapGetters写法：传递的
    ...mapGetters(["goodsList"]),
  },
```



### 2.18 search模块根据不同的参数获取数据展示

```js
//dom结构
<div class="value logos">
        <ul class="logo-list">
          <li v-for="(trademark,index) in trademarkList" :key="index">{{trademark.tmName}}</li>
          <li><img src="./images/phone06.png" /></li>
        </ul>
      </div>

<div class="type-wrap" v-for="(attrs,index) in attrsList" :key="index">
      <div class="fl key">{{attrs.attrName}}</div>
      <div class="fl value">
        <ul class="type-list">
          <li v-for="(attr,index) in attrs.attrValueList" :key="index">
            <a>{{attr}}</a>
          </li>
        </ul>
      </div>
      <div class="fl ext"></div>
    </div>
```

```js
<script>
import {mapGetters} from 'vuex'
  export default {
    name: 'SearchSelector',
    computed:{
      ...mapGetters(['attrsList','trademarkList'])
    }
  }
</script>
```



### 
