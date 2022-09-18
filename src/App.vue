<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口处 -->
    <router-view></router-view>
    <!-- 在home，search显示Footer组件，在login，register隐藏Footer组件 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
//引入
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: '',
  //注册组件
  components: {
    Header,//kv一致省略v
    Footer
  },
  mounted(){
    // 派发action|获取商品三级列表的数据
    this.$store.dispatch("categoryList")
    // 获取用户信息
    // this.$store.dispatch('getUserInfo')
  }
}
</script>

<style scoped>

</style>
