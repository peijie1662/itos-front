<template>
  <div>
    <el-dialog title="改变状态" width="520px" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <div>
          <span>备注</span>
        </div>
        <!-- 备注 -->
        <div class="content">

        </div>
        <!-- 按钮 -->
        <div style="overflow:hidden;margin-top:10px;">
          <el-button
            type="warning"
            size="mini"
            style="float:right;margin-left:10px;"
            @click="dialogVisible=false"
          >取消</el-button>
          <el-button type="success" size="mini" style="float:right;" @click="saveTask">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.content {
  height: 200px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
}
</style>

<script>

export default {
  data() {
    return {
      userInfo: "",
      dialogVisible: false,
      task: ""
    };
  },
  props: ["ttask"],
  watch: {
    ttask: {
      handler(newVal) {
        if (newVal != null) {
          this.task = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    saveTask() {
      ///let me = this;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>