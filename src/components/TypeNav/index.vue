<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <!-- <h1>{{categoryList}}</h1> -->
    <div class="container">
      <div @mouseleave="leaveindex" @mouseenter="entershow">
        <!-- 大div表示事件的委派 -->
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画 -->
        <transition name="sort">
        <!-- 三级联动 -->
        <!-- 使用响应式属性控制显示与隐藏 -->
        <div class="sort" v-show="show">
          <!-- 利用事件委派GoSearch+编程式导航实现路由跳转与传递参数 -->
          <div class="all-sort-list2" @click="GoSearch">
            <div
              class="item"
              v-for="(c1, index) in categoryList.slice(0, 15)"
              :key="c1.categoryId"
              :class="{ cur: currentIndex == index }"
            >
              <h3 @mouseenter="changeindex(index)">
                <!-- <a @click="GoSearch">{{ c1.categoryName }}</a>  不好用-->
                <a
                  :data-categoryName="c1.categoryName"
                  :data-category1Id="c1.categoryId"
                  >{{ c1.categoryName }}</a
                >
                <!-- <router-link to="/search">{{ c1.categoryName }}</router-link> -->
              </h3>
              <!-- 二级，三级分类 -->
              <div
                class="item-list clearfix"
                :style="{ display: currentIndex == index ? 'block' : 'none' }"
              >
                <div
                  class="subitem"
                  v-for="c2 in c1.categoryChild"
                  :key="c2.categoryId"
                >
                  <dl class="fore">
                    <dt>
                      <a
                        :data-categoryName="c2.categoryName"
                        :data-category2Id="c2.categoryId"
                        >{{ c2.categoryName }}</a
                      >
                      <!-- <router-link to="/search">{{ c2.categoryName }}</router-link> -->
                    </dt>
                    <dd>
                      <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                        <a
                          :data-categoryName="c3.categoryName"
                          :data-category3Id="c3.categoryId"
                          >{{ c3.categoryName }}</a
                        >
                        <!-- <router-link to="/search">{{ c3.categoryName }}</router-link> -->
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
// 引用辅助函数mapstate拿仓库数据
import { mapState } from "vuex";
// 25引入方式：把lodash所有函数引入
// import _ from 'lodash'
// 最好引入方式：按需引入111
import throttle from "lodash/throttle.js";

export default {
  name: "TypeNav", //给本组件起名字
  data() {
    return {
      // 存储用户鼠标移动哪一位
      currentIndex: -1,
      show: true,
    };
  },
  // 组件挂载完毕，向服务器发请求，获取服务器数据，展示数据
  mounted() {
    // 通知vuex发请求，获取数据，存储仓库中
    // this.$store.dispatch("categoryList");
    // 不是Home路由组件，将其隐藏
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      // 右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
      // 注入一个参数state，即为大仓库的数据
      // categoryList:(state)=>state.home.categoryList 简写
      categoryList: (state) => {
        // state为大仓库的数据
        // console.log(state);
        return state.home.categoryList; //做为新计算出来此属性的属性值
      },
    }),
  },
  methods: {
    // 鼠标移入修改响应式数据currentIndex属性
    // changeindex(index) {

    // },es6
    // es5写法
    // throttle回调函数别用箭头函数，会出现上下文问题
    changeindex: throttle(function (index) {
      // index为鼠标移到某个一级分类的索引值
      // console.log(index);
      /**
       * 正常情况（用户慢慢操作）：鼠标进入，每个一级分类h3，都会触发鼠标进入事件
       * 非正常情况（用户操作很快）：本身全部的一级分类都应触发鼠标进入事件，但经过测试，只有部分h3触发了
       * 由于用户行为过快，导致浏览器反映不过来，若当前回调中有一些大量业务，可能出现卡顿
       */
      this.currentIndex = index;
      // console.log('移入'+index);
    }, 50),
    // 一级分类鼠标移出时间回调
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
    GoSearch(event) {
      let node = event.target;
      console.log(node.dataset);
      let { categoryname, category1id, category2id, category3id } =
        node.dataset;
      if (categoryname) {
        // console.log(123);
        // 整理路由跳转参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 确认一，二，三级分类a标签；再自定义属性
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2id = category2id;
        } else {
          query.category3id = category3id;
        }
        // 判断是否有params参数，有则传过去
        if(this.$route.params){
          location.params=this.$route.params
        }
        // 整理参数，给location配置对象加query属性
        location.query = query;
        // 路由跳转
        this.$router.push(location);
      }
      // this.$router.push('/search')
      // this.$router.push(name:"search",query:{categoryName:'xx',2Id:'xx'})
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .cur {
          background-color: yellow;
        }

        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }
      }
    }

    // 过渡动画样式
    // 过渡动画开始状态（进入）
    .sort-enter{
      height: 0;
    }
    // 过渡动画结束状态（进入）
    .sort-enter-to{
      height: 461px;
    }
    // 定义动画时间，速率
    .sort-enter-active{
      transition: all .01s linear;
    }
  }
}
</style>
