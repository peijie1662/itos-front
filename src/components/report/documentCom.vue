<template>
  <div class="outer">
    <!-- 文件夹名称 -->
    <div style="text-align:center;">
      <i class="iconfont icon-tushu icon" style="font-size:25px;color:#678cac;"></i><br>
      <span style="font-size:10px;">{{book}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: ""
    };
  },
  props: ["bk"],
  watch: {
    bk: {
      handler(newVal) {
        if (newVal != null) {
          this.book = newVal;
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>
.outer {
}
</style>