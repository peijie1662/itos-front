<template>
  <div>
    <el-dialog title="新用户" width="700px" :visible.sync="dialogVisible">
      <div style="position:relative;overflow:hidden;">
        <!-- 用户内容 -->
        <div class="content" style="float:left;">
          <!-- 1.编号 -->
          <div>
            <span>编号</span>
            <el-input
              v-model="curTips.tipId"
              placeholder="请输入编号"
              size="mini"
              style="margin-left:20px;margin-top:10px;width:200px;"
            ></el-input>
          </div>
          <!-- 2.正则表达式 -->
          <div>
            <span>正则</span>
            <el-input
              v-model="curTips.preReg"
              placeholder="请输入"
              size="mini"
              style="margin-left:20px;margin-top:10px;width:200px;"
            ></el-input>
          </div>
          <!-- 3.提示词 -->
          <div>
            <span>提示词</span>
            <el-input
              v-model="curTips.nextword"
              placeholder="请输入"
              size="mini"
              style="margin-left:20px;margin-top:10px;width:200px;"
            ></el-input>
          </div>
         
      <!-- 按钮 -->
      <div style="overflow:hidden;margin-top:10px;">
        <el-button
          type="warning"
          size="mini"
          style="float:right;margin-left:10px;"
          @click="dialogVisible=false"
        >取消</el-button>
        <el-button type="success" size="mini" style="float:right;" @click="saveSmarttips">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addSmarttips } from "@/api/api";

export default {
  data() {
    return {
      curTips: "",
      authority: [],
      dialogVisible: false
    };
  },
  methods: {
    saveSmarttips() {
      let me = this;
      addSmarttips({
        ...me.curTips
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.dialogVisible = false;
          me.$emit("updateSmartTipsSuccess");
        }
      });
    },
  },
  props: ["utip"],
  watch: {
    user: {
      handler(newVal) {
        if (newVal != null) {
          this.curTips = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>
.content {
  height: 450px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  padding: 10px;
}
</style>