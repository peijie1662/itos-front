<template>
  <div>
    <el-dialog title="任务登记" width="520px" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <!-- 模版选择 -->
        <div>
          <el-select
            v-model="task.modelId"
            size="small"
            placeholder="选择模版,关联到执行终端"
            style="width:250px;margin-top:10px;"
          >
            <el-option
              v-for="item in handlers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- 内容 -->
        <div
          ref="content"
          contenteditable="true"
          class="content"
          @input="smartTips"
          @keydown="selTip($event)"
        ></div>
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
  overflow: auto;
}
</style>

<script>
//import { addDispatchTask } from "@/api/api";
import { generateUUID } from "@/api/util";

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
          this.task.taskId = generateUUID();
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {

  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>