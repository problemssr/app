<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">
      上一页
    </button>
    <button v-if="startAndEnd.start > 1" @click="$emit('getPageNo', 1)" :class="{active:pageNo==1}">
      1
    </button>
    <button v-if="startAndEnd.start > 2">···</button>

    <button
      v-for="(page, index) in startAndEnd.end"
      :key="index"
      v-if="page >= startAndEnd.start"
      @click="$emit('getPageNo', page)"
      :class="{active:pageNo==page}"
    >
      {{ page }}
    </button>

    <button v-if="startAndEnd.end < totalPage - 1">···</button>
    <button
      v-if="startAndEnd.end < totalPage"
      @click="$emit('getPageNo', totalPage)"
      :class="{active:pageNo==totalPage}"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo == totalPage"
      @click="$emit('getPageNo', pageNo + 1)"
    >
      下一页
    </button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["total", "pageSize", "pageNo", "continues"],
  // 计算属性
  computed: {
    // 总共多少页
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    // 算出连续页面起始数字和结束数字
    startAndEnd() {
      const { continues, pageNo, totalPage } = this;
      // 定义两个变量存储开始数字和结束数字
      let start = 0,
        end = 0;
      // 连续页码数字5【continues=5】，若出现不正常现象【不够5页】
      // 不正常现象【总页数没有连续页码多】
      if (continues > totalPage) {
        start = 1;
        end = totalPage;
      } else {
        // 正常现象【连续页面5，总页数一定大于5】
        // 起始数字
        start = pageNo - parseInt(continues / 2);
        // 结束数字
        end = pageNo + parseInt(continues / 2);
        // 把起始临界值不正常现象【start数字出现0|负数】纠正
        if (start < 1) {
          start = 1;
          end = continues;
        }
        // 把结束临界值不正常现象【start数字出现0|负数】纠正
        if (end > totalPage) {
          end = totalPage;
          start = totalPage - continues + 1;
        }
      }
      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
.active{
    background: green !important;
}
</style>
