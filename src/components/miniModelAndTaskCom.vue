<template>
  <div>
    <div class="outer">
      <!-- 顶部三角 -->
      <div :style="topTriangleStyle"></div>
      <!-- 详情按钮 -->
      <div style="position: absolute;top: 2px;right: 2px;">
        <i class="el-icon-more small-btn" @click="modelDetail"></i>
      </div>
      <!-- 简介 -->
      <div style="text-align: center;">
        <span style="line-height:50px;font-size:18px;">{{taskModel.abs}}</span>
      </div>
      <!-- 底部三角 -->
      <div :style="bottomTriangleStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>

</style>