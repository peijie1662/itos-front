<template>
  <div>
    <el-dialog :title="task.title" width="520px" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <!-- 内容 -->
        <div ref="content" contenteditable="true" class="content">
          <span>{{task.content}}</span>
        </div>
        <div>
          <span>备注</span>
        </div>
        <!-- 备注 -->
        <div ref="remark" contenteditable="true" class="remark"></div>
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
.remark {
  min-height: 50px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
}

.content {
  min-height: 100px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
}
</style>

<script>
import { modifyTask } from "@/api/api";

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
          this.task.title = `${newVal.newStatus.desc} (${newVal.newStatus.id})`;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    saveTask() {
      let me = this;
      modifyTask({
        taskId: me.task.taskId,
        status: me.task.newStatus.id,
        content: me.$refs.content.textContent,
        remark: me.$refs.remark.textContent,
        oper: me.userInfo.userId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.$emit("updateTaskSuccess");
          me.dialogVisible = false;
        }
      });
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>