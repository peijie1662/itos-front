<template>
  <div>
    <el-dialog :title="task.title" width="520px" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <!-- 内容 -->
        <div ref="content" contenteditable="true" class="content" v-html="task.content"></div>
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogVisible: false,
      task: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
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
      me.task.content =
        me.task.category == "COMMON"
          ? me.$refs.content.innerHTML
          : me.$refs.content.textContent;
      modifyTask({
        taskId: me.task.taskId,
        status: me.task.newStatus.id,
        content: me.task.content,
        remark: me.$refs.remark.innerHTML,
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
  }
};
</script>