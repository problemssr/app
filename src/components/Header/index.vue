<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-if="!username">
            <span>请</span>
            <!-- 声明式导航：要有to属性 -->
            <router-link to="/login">登录</router-link>
            <router-link class="register" to="/register">免费注册</router-link>
          </p>
          <!-- 登陆了 -->
          <p v-else>
            <a >{{username}}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <!-- 点击按钮传数据有用处 使用编程式导航 -->
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "",
  // 数据双向绑定,表单数据通过v-model或者ref收集
  data() {
    return {
      keyword: "", //将数据传出
    };
  },
  methods: {
    // *****搜素按钮的回调函数：（编程式路由）需要search路由进行跳转
    goSearch() {
      // 路由传递参数：
      // 1.字符串形式
      // this.$router.push("/search/"+this.keyword+"?k="+this.keyword.toUpperCase());
      // 2.模板字符串
      // this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)
      // 3.对象
      // this.$router.push({name:"search",params:{keyword:this.keyword},query:{k:this.keyword.toUpperCase()}}
      // ,()=>{},()=>{})

      // this.$router.push({ 
      //   name: "search", 
      //   params: { keyword: this.keyword } });需要重新搞

      // 有query参数也加上
      if(this.$route.query){
        let location= { 
        name: "search", 
        params: { keyword: this.keyword } };
        location.query=this.$route.query
        this.$router.push(location)
      }

      // this.$router.push({path:'/search',query:{k:this.keyword.toUpperCase()}})
      // console.log(this.$router);
    },
    // 退出登录
    async logout(){
      try {
        await this.$store.dispatch('userLogout')
        // 回到首页
        this.$router.push('/home')
      } catch (error) {
        alert(error.message)
      }

    }
  },
  mounted(){
    // 通过全局事件总线清除关键字
    this.$bus.$on("clear",()=>{this.keyword=""})
  },
  computed:{
    // 用户名信息
    username(){
      return this.$store.state.user.userInfo.name
    }
  }
};
</script>

<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
