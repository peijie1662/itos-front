<template>
  <div>
    <el-dialog :title="task.title" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <!-- 内容 -->
        <el-transfer v-model="selVal" :data="allVal" :titles="['围观群众', '处理人员']"></el-transfer>
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
import { swapTask } from "@/api/api";
import { TASKHANDLERS } from "@/api/data";

export default {
  data() {
    return {
      userInfo: "",
      dialogVisible: false,
      task: "",
      allVal: [],
      selVal: []
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
          this.allVal = TASKHANDLERS.map(item => {
            return {
              key: item.value,
              label: item.label
            };
          });
          this.selVal = newVal.handler;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    saveTask() {
      let me = this;
      swapTask({
        taskId: me.task.taskId,
        handler: me.selVal.join(","),
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