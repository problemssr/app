<template>
  <div>
    <!-- 三级联动全局组件：三级联动已注册成全局组件，因此不需要再次引入 -->
    <TypeNav />
    <!-- 3.使用组件 -->
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <Floor v-for="(floor) in floorlist" :key="floor.id" :list="floor"/>
    <Brand />
    <!-- <button @click="add">点我+1</button>
        <span>仓库数据____{{count}}</span>
        <button @click="sub">点我-1</button> -->
  </div>
</template>

<script>
// 1.引入其余组件
import ListContainer from "@/pages/Home/ListContainer";
import Recommend from "@/pages/Home/Recommend";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";

// 获取vuex中的数据使用mapstate
import { mapState } from "vuex";

export default {
  name: "",
  // 2.注册组件
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    // 派发action获取floor组件数据
    this.$store.dispatch("getFloorList");
    // 获取用户信息
    this.$store.dispatch('getUserInfo')
  },
  computed: {
    ...mapState({
      floorlist: (state) => state.home.floorlist,
    }),
  },
  // 计算属性
  // computed:{
  //     // 2.用mapState从vuex接受传数组
  //     ...mapState(['count'])
  // },
  // methods:{
  //     add(){
  //         // 3.派发action
  //         this.$store.dispatch('add')
  //     },
  //     sub(){

  //     }
  // }
};
</script>

<style scoped></style>
