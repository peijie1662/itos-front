<template>
  <div>
    <div class="header">
      <div style="margin-top:10px;">
        <span>组合模版</span>
        <el-select
          v-model="selComposeModel"
          @change="selectOneModel"
          size="mini"
          style="width:250px;margin-left:10px;"
          placeholder="请选择"
        >
          <el-option v-for="item in models" :key="item.modelId" :label="item.abs" :value="item">
            <span style="float: left">{{ item.abs }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.category }}</span>
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="mini"
          @click="startComposeTask"
          style="margin-left:10px;"
        >创建任务</el-button>
        <el-divider direction="vertical"></el-divider>
        <span>组合任务</span>
        <el-select
          v-model="selComposeModel"
          @change="selectOneModel"
          size="mini"
          style="width:250px;margin-left:10px;"
          placeholder="请选择"
        >
          <el-option v-for="item in models" :key="item.modelId" :label="item.abs" :value="item">
            <span style="float: left">{{ item.abs }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.category }}</span>
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="mini"
          @click="startComposeTask"
          style="margin-left:10px;"
        >启动任务</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="startComposeTask"
          style="margin-left:10px;"
        >任务报告</el-button>
      </div>
    </div>
    <div class="content">
      <span class="blocktag">任务内容</span>
      <div class="block"></div>
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
import { getComposeModelList } from "@/api/api";

export default {
  data() {
    return {
      models: [],
      selComposeModel: "" //选中组合模版
    };
  },
  methods: {
    startComposeTask() {},
    loadComposeModels() {
      let me = this;
      getComposeModelList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.models = data;
        }
      });
    }
  },
  mounted() {
    this.loadComposeModels();
  }
};
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
  width: 70%;
  min-height: 100px;
}
</style>