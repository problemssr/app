<template>
  <!-- 轮播图 -->
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(carousel, index) in list" :key="index">
        <img :src="carousel.imgUrl" />
      </div>
      <!-- <div class="swiper-slide">
                    <img src="./images/floor-1-b02.png" />
                  </div>
                  <div class="swiper-slide">
                    <img src="./images/floor-1-b03.png" />
                  </div> -->
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "Carousel",
  props: ["list"],
  watch: {
    list: {
      // 立即监听：首先立即监听一次
      immediate: true,
      // 不加immediate不行原因：list数据没变化（数据父组件给的，对象数据都给了）
      handler() {
        // 只能监听数据有了，但v-for动态渲染结构我们没办法确定，因此需要nextTick
        this.$nextTick(() => {
          // 执行此回调函数，保证服务器数据已经回来了，v-for执行完毕了【也就是轮播图结构（for循环）已经出来了】
          new Swiper(this.$refs.cur, {
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
          });
        });
      },
    },
  },
};
</script>

<style scoped></style>
