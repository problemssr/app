

### 3.1 监听路由变化再次发请求获取数据

监听路由变化$route

![image-20220114131331706](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220114131331706.png)

![image-20220114131353490](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220114131353490.png)

```js
watch:{
    // 监听路由信息是否发生变化，发生则再发请求
    $route(){
      Object.assign(this.searchParams,this.$route.query,this.$route.params)
      // 再发起ajax请求
      this.getData()
      // 置空1.2.3级id
      this.searchParams.category1Id=''
      this.searchParams.category2Id=''
      this.searchParams.category3Id=''
    }
  }
```

Q:为什么分类名字和keyword不用改？

A:每次路由变化时，都会赋予新的数据



### 3.3 商品柜-面包屑处理分类的操作

```js
removeCategoryName(){
      // 把服务器参数置空并再发一次请求
      // 带给服务器参数可有可无，若属性值为空的字符串还是会把相应字段带给服务器
      // 但将相应字段值改为undefined，便不会带给服务器
      this.searchParams.categoryName=undefined
      // 置空1.2.3级id
      this.searchParams.category1Id=undefined
      this.searchParams.category2Id=undefined
      this.searchParams.category3Id=undefined
      this.searchParams.category3id=undefined
      this.getData()
      // 地址栏也需要置空：路由跳转
      if(this.$route.params){
        // 本意删除query，若路径当中出现params不应该删除，路由跳转时应该带着
        this.$router.push({name:"search",params:this.$route.params})
      }
    }
```

##### 编程式导航路由跳转【自己跳自己】



### 3.4 面包屑处理关键字

###### 当面包屑中关键字清除后，需要兄弟组件Header组件中的关键字清除

###### 想到组建通信

1. props：父子
2. 自定义事件：子父
3. vuex：万能
4. 插槽：父子
5. pubsub-js：完成
6. $bus：全局事件总线

### 3.5 面包屑处理品牌信息

Q:在哪个组件发请求，为什么？

A:父组件，因为父组件中searchParams参数是带给服务器参数，子组件把点击的品牌信息给父组件传过去（子传父）-----------自定义事件

```js
<!--selector-->子组件index.vue
        <SearchSelector @trademarkInfo="trademarkInfo"/>
```

父组件js

```js
// 自定义事件回调
    trademarkInfo(trademark){
      // console.log(1111,trademark);
      // 整理品牌字段
      this.searchParams.trademark=`${trademark.tmId}:${trademark.tmName}`
      // 再次发请求
      this.getData()
    },
    // 删除品牌信息
    removeTrademark(){
      // 将品牌置空
      this.searchParams.trademark=undefined
      // 再次发请求
      this.getData()
    }
```

子组件js

```js
// 品牌处理函数
    trademarkHandler(trademark) {
      // 点击品牌（苹果），还需整理参数，向服务器发请求获取相应数据进行展示
      this.$emit("trademarkInfo", trademark);
    },
```



### 3.6 平台售卖属性操作

平台售卖属性值的展示面包屑

```js
<li class="with-x" v-for="(attrValue,index) in searchParams.props" :key="index">{{attrValue.split(':')[1]}}<i @click="removeAttr(index)">×</i></li>
```

子组件SearchSelector

```html
<!-- 平台售卖的属性的属性值：粉色，蓝色... -->
          <li v-for="(attrValue, index) in attrs.attrValueList" :key="index" @click="attrInfo(attrs,attrValue)">
            <a>{{ attrValue }}</a>
```

```js
// 平台售卖属性值的点击事件
    attrInfo(attrs,attrValue){
      // ["属性ID:属性值:属性名"]
      this.$emit("attrInfo",attrs,attrValue)
    }
```

收集平台属性的回调函数

```js
attrInfo(attr,attrValue){
      // 参数格式整理好
      let props=`${attr.attrId}:${attrValue}:${attr.attrName}`
      // 数组去重
      if(this.searchParams.props.indexOf(props)==-1){
        this.searchParams.props.push(props)
      }
      // 再次发请求
      this.getData()
    },
```

删除售卖属性

```js
    removeAttr(index){
      // 再次整理参数
      this.searchParams.props.splice(index,1)
      // 再次发请求
      this.getData()
    }
```



### 3.7 排序操作

排序方式 

1: 综合,2: 价格 asc: 升序,desc: 降序 

示例: "1:desc"

**indexOf(String str):** 返回指定字符在字符串中第一次出现处的索引，如果此字符串中没有这样的字符，则返回 -1。

计算属性computed（简化写法）

```html
<li :class="{ active: isOne }">
                  <a>综合<span v-show="isOne" class="iconfont" :class="{'icon-up':isAsc,'icon-down':isDesc}"></span></a>
                </li>
```

```js
isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    isAsc(){
      return this.searchParams.order.indexOf('asc')!=-1
    },
    isDesc(){
      return this.searchParams.order.indexOf('desc')!=-1
    }
```



```js
// 排序操作
    changeorder(flag){
      let orginOrder=this.searchParams.order.split(':')[0]
      let orginSort=this.searchParams.order.split(':')[1]
      let newSort=''
      if(orginOrder==flag){
        // 这是综合
        newSort=`${orginOrder}:${orginSort=='desc'?'asc':'desc'}`
      }else{
        // 这是价格
        newSort=`${flag}:${'desc'}`
      }
      // newSort赋予searchParams.order
      this.searchParams.order=newSort
      // 在发请求
      this.getData()
    }
```



### 3.8  分页器静态组件

#### 前端三大件:轮播图、分页、日历。这属于前端开发常见三种业务

分页器变成全局组件

1. 需要知道一共展示多少条数据 ----total（额外信息：一共多少页）【100条数据】
2. 需要知道每一个需要展示几条数据------pageSize【每一页几条数据】
3. 需要知道当前在第几页-------pageNo【当前在第几页】
4. 需要知道分页器连续页面个数：5|7【奇数】![image-20220115104740546](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220115104740546.png)

**pageNo：当前第几个**

**pageSize：代表每一页展示多少条数据**

**total：代表整个分页共展示多少条数据**

**continues：代表分页连续页码个数**

【自定义分页器，开发时自己先传递假数据，调试成功在用服务器数据】



### 3.9 分页器起始与结束数字计算

【分页器重点：算出连续页面起始数字和结束数字】

已经条件: total=【99】  pageSize =【3】  pageNo=6    continues 5 

4 5 **6** 7 8

```js
// 总共多少页 
        totalPage(){
            return Math.ceil(this.total/this.pageSize)
        },
        // 算出连续页面起始数字和结束数字
        startAndEnd(){
            const {continues,pageNo,totalPage}=this
            // 定义两个变量存储开始数字和结束数字
            let start=0,end=0
            // 连续页码数字5【continues=5】，若出现不正常现象【不够5页】
            // 不正常现象【总页数没有连续页码多】
            if(continues>totalPage){
                start=1
                end=continues
            }else{
                // 正常现象【连续页面5，总页数一定大于5】
                // 起始数字
                start=pageNo-parseInt(continues/2)
                // 结束数字
                end=pageNo+parseInt(continues/2)
                // 把起始临界值不正常现象【start数字出现0|负数】纠正
                if(start<1){
                    start=1
                    end=continues
                }
                // 把结束临界值不正常现象【start数字出现0|负数】纠正
                if(end>totalPage){
                    end=totalPage
                    start=totalPage-continues+1
                }
            }
            return {start,end}
        }
```



### 3.10 分页器动态展示

**【分为上中下部分】**

v-for：数组|数字|字符串|对象

```html
<!-- 分页器 -->
<!-- total:一共的数据 pageNo：当前多少页  continues：中间连续几页 pageSize：一页展示多少数据-->
<Pagination :total="91" :pageSize="3" :pageNo="27" :continues="5"/>
```

静态组件Pagination


```html
<button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">
    上一页
</button>
<button v-if="startAndEnd.start > 1" @click="$emit('getPageNo', 1)">
    1
</button>
<button v-if="startAndEnd.start > 2">···</button>

<button
        v-for="(page, index) in startAndEnd.end"
        :key="index"
        v-if="page >= startAndEnd.start"
        @click="$emit('getPageNo', page)"
        >
    {{ page }}
</button>

<button v-if="startAndEnd.end < totalPage - 1">···</button>
<button v-if="startAndEnd.end < totalPage"  @click="$emit('getPageNo',totalPage)">{{ totalPage }}</button>
<button :disabled="pageNo==totalPage" @click="$emit('getPageNo', pageNo + 1)">下一页</button>
```

$emit*触发自定义事件*

```js
自定义事件
getPageNo(pageNo){
      // 获取当前第几页
      // 整理参数
      this.searchParams.pageNo=pageNo
      // 发请求
      this.getData()
    },
```



### 3.11 滚动行为

##### 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```



开发详情页面

1. 静态组件（详情页组件还没注册为路由组件）

   需要带参（产品ID）＋路由跳转（跳到详情页面）

   跳转时要把页面置顶

2. 发请求

3. vuex

4. 动态展示组件



### 3.12 产品详情获取（发请求）

API--->请求接口

vuex--->获取产品详情

vuex需新增一个模块为detail（store--->detail.js）

```js
//detail.js

// 1.先写四件套
const state={}
const mutations={}
const actions={}
const getters={}

// 2.对外暴露
export default{
    state,
    mutations,
    actions,
    getters
}
```

再回大仓库合并

```js
//index.js

//引入小仓库
import detail from './detail'
//注册export default内
modules: {
    home,
    search,
    detail
}
```

接着在小仓库中发请求捞数据

```js
// 12.api接口
import { reqGoodsInfo } from '@/api'

// 1.先写四件套
const state = {
    goodInfo: {}
}
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
const actions = {
    // 11.获取产品信息的action（派发action，捞数据）
    async getGoodInfo({ commit }, skuId) {
        let res = await reqGoodsInfo(skuId)
        if (res.code == 200) {
            // 提交mutation，修改state
            commit('GETGOODINFO', res.data)
        }
    }

}
const getters = {}

// 2.对外暴露
export default {
    state,
    mutations,
    actions,
    getters
}
```

在组件内部派发actions

```js
//pages文件夹->Detail文件夹->index.vue

mounted(){
    // 派发action获取产品信息
    this.$store.dispatch('getGoodInfo', this.$route.params.skuid)
}
```



### 3.13 产品详情展示动态数据

组件向仓库要数据，展示数据

```html
<h3 class="InfoName">{{skuInfo.skuName}}</h3>
<p class="news">{{skuInfo.skuDesc}}</p>
<div class="priceArea">
    <div class="priceArea1">
        <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
        <div class="price">
            <i>¥</i>
            <em>{{skuInfo.price}}</em>
            <span>降价通知</span>
        </div>
```



### 3.14 zoom放大镜

```html
detail index.vue
<Zoom :skuImageList="skuImageList"/>

zoom.vue
<div class="spec-preview">
    <img :src="imgObj.imgUrl" />
    <div class="event"></div>
    <div class="big">
      <img :src="imgObj.imgUrl" />
    </div>
    <div class="mask"></div>
  </div>
```

```js
// detail index.vue
computed:{
    ...mapGetters(['categoryView','skuInfo']),
        // 给子组件数据
        skuImageList(){
        return this.skuInfo.skuImageList||[]
    }
}

// zoom.vue
export default {
    name: "Zoom",
    props:['skuImageList'],
    computed:{
      imgObj(){
        return this.skuImageList[0]||{}
      }
    }
  }
```



### 3.15 detail.vue展示商品售卖属性

![image-20220116102209421](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220116102209421.png)

```html
<dl v-for="(spuSaleAttr, index) in spuSaleAttrList" :key="index">
    <dt class="title">{{ spuSaleAttr.saleAttrName }}</dt>
    <dd
        changepirce="0"
        :class="{active:spuSaleAttrValue.isChecked==1}"
        v-for="(
               spuSaleAttrValue, index
               ) in spuSaleAttr.spuSaleAttrValueList"
        :key="index"
        >
        {{spuSaleAttrValue.saleAttrValueName}}
    </dd>
</dl>
```

```js
...mapGetters(["categoryView", "skuInfo", "spuSaleAttrList"]),

// detail.js
// 简化售卖属性
spuSaleAttrList(){
    return state.goodInfo.spuSaleAttrList||[]
}
```





![image-20220116103932088](C:\Users\22982\AppData\Roaming\Typora\typora-user-images\image-20220116103932088.png)

### 3.16 商品售卖属性值排他操作

```html
//Detail--->index.vue

<dd
    changepirce="0"
    :class="{active:spuSaleAttrValue.isChecked==1}"
    v-for="(spuSaleAttrValue, index) in  spuSaleAttr.spuSaleAttrValueList" :key="index" @click="changeActive(spuSaleAttrValue,spuSaleAttr.spuSaleAttrValueList)">
```

```js
//Detail--->index.vue

// 产品售卖属性值是否高亮
changeActive(SaleAttrValue,arr){
    // 排他
    arr.forEach(item => {
        item.isChecked='0'
    });
    // 点击的那个售卖属性值高亮
    SaleAttrValue.isChecked='1'
}
```



### 3.17 放大镜操作

swiper三部曲：

1. 需要组件引包 

   ```js
   import Swiper from "swiper";
   ```

2. 在main.js引入样式 

   ```js
   // 引包swiper
   import 'swiper/css/swiper.css'
   ```
   
3. 结构完整

4. new Swiper实例

   ```js
   // imageList.vue
   watch: {
       // 监听数据:保证数据ok，但不保证v-for遍历是否完事
       skuImageList() {
        //this.$nextTick:在修改数据之后立即使用这个方法，获取更新后的 DOM。 
           this.$nextTick(() => {
               new Swiper(this.$refs.cur, {
                   // loop:true,
                   // 如果需要前进后退按钮
                   navigation: {
                       nextEl: ".swiper-button-next",
                       prevEl: ".swiper-button-prev",
                   },
                   // 显示几个图片设置
                   slidesPerView : 3,//'auto'
                   // 每次切换图片个数
                   slidesPerGroup:2
               });
           });
       },
   },
   ```



组件通信：

1. 兄弟通信：$bus（全局事件总线），pubsub（不用）

   ```js
   // imagelist.vue
   changeCurrentIndex(index){
       this.currentIndex=index
       // 通知兄弟组件，当前索引值为几 .$emit发送
       this.$bus.$emit('getIndex',this.currentIndex)
   }
   ```

   ```js
   handler(event) {
       // ref:在js精准获取元素
       let mask=this.$refs.mask
       let big=this.$refs.big
   
       let left=event.offsetX-mask.offsetWidth/2
       let top=event.offsetY-mask.offsetHeight/2
       // 修改left和top属性值
       if(left<=0) left=0
       if(left>=mask.offsetWidth) left=mask.offsetWidth
       if(top<=0) top=0
       if(top>=mask.offsetHeight) top=mask.offsetHeight
       mask.style.left= left+'px'
       mask.style.top=top+'px'
   
       big.style.left= -2*left+'px'
       big.style.top= -2*top+'px'
   },
   ```

   

2. 子父通信：自定义事件

3. 父子通信：props



### 3.18 购买商品个数

收集表单数据

1. v-model
2. ref

```html
<div class="controls">
    <input autocomplete="off" class="itxt" v-model="skuNum" @change="changeSkuNum"/>
    <a href="javascript:" class="plus" @click="skuNum++">+</a>
    <a href="javascript:" class="mins" @click="skuNum>1?skuNum--:1">-</a>
</div>
```



```js
// 表单元素修改产品个数
changeSkuNum(event){
    let value=event.target.value * 1
    // 处理非法输入（NaN或者<1）
    if(isNaN(value)||value<1){
        this.skuNum=1
    }
    else{
        // 正常（>1并且整数）
        this.skuNum=parseInt(value)
    }
}
```



