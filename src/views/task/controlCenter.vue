<template>
  <div>
    <div class="header"></div>
    <div class="content">
      <span class="blocktag">STEP-1</span>
      <div class="block"></div>
      <span class="blocktag">STEP-2</span>
      <div class="block"></div>
      <span class="blocktag">STEP-3</span>
      <div class="block"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.header {
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  min-height: 50px;
}

.content {
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  margin-top: 10px;
  min-height: 700px;
}

.blocktag {
  background: #909399;
  color: white;
  display: block;
  width: 100px;
  height: 20px;
  text-align: center;
  margin-top: 20px; 
  margin-bottom: -15px;
}

.block {
  margin-top: 20px;
  border: 2px dashed #409eff;
  overflow: hidden;
  padding: 10px;
  min-height: 100px;
}
</style>