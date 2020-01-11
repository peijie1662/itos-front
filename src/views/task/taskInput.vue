<template>
  <div>
    <div class="header">
      <div
        style="width:350px;margin-top:20px;margin-left:20px;border-right: 2px solid #c0c4cc;float:left;"
      >
        <el-checkbox v-model="selCheckin" @change="filter">登记</el-checkbox>
        <el-checkbox v-model="selProcessing" @change="filter">进行中</el-checkbox>
        <el-checkbox v-model="selDone" @change="filter">完成</el-checkbox>
        <el-checkbox v-model="selCancel" @change="filter">删除</el-checkbox>
      </div>
      <div
        style="width:350px;margin-top:20px;margin-left:20px;border-right: 2px solid #c0c4cc;float:left;"
      >
        <el-radio v-model="regular" label="Y" @change="chgDisplayMode">整齐排列</el-radio>
        <el-radio v-model="regular" label="N" @change="chgDisplayMode">放飞自我</el-radio>
      </div>
    </div>
    <div class="content">
      <!-- 增加任务 -->
      <div class="task" style="text-align:center;line-height:135px;height:220px;" @click="addTask">
        <i class="el-icon-plus" style="font-size:150px;color:#c0c4cc;margin-top:50px;"></i>
      </div>
      <!-- 任务列表 -->
      <div
        v-for="(task,index) in finTaskList"
        :key="index"
        class="task"
        :style="regular == 'Y'?task_regular:task_free"
      >
        <taskCom :ttask="task" @updateTaskSuccess="loadData"></taskCom>
      </div>
    </div>
    <!-- 创建任务 -->
    <newTaskCom :ttask="newTask" @taskUpdateOk="loadData"></newTaskCom>
  </div>
</template>

<script>
import { getManualTaskList } from "@/api/api";
import taskCom from "@/components/taskCom";
import newTaskCom from "@/components/newTaskCom.vue";

export default {
  data() {
    return {
      regular: "Y",
      task_regular: {
        height: "220px",
        overflow: "scroll"
      },
      task_free: {
        minHeight: "200px"
      },
      //
      selCheckin: true,
      selProcessing: true,
      selDone: false,
      selCancel: false,
      //
      newTask: null,
      taskList: [],
      finTaskList: []
    };
  },
  methods: {
    chgDisplayMode() {},
    filter() {
      let me = this;
      me.finTaskList = me.taskList.filter(item => {
        return (
          (me.selCheckin && item.status == "CHECKIN") ||
          (me.selProcessing && item.status == "PROCESSING") ||
          (me.selDone && item.status == "DONE") ||
          (me.selCancel && item.status == "CANCEL")
        );
      });
    },
    addTask() {
      this.newTask = {};
    },
    loadData() {
      let me = this;
      getManualTaskList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.taskList = data;
          me.filter();
        }
      });
    }
  },
  components: {
    taskCom,
    newTaskCom
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
.header {
  position: relative;
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  min-height: 50px;
}

.content {
  position: relative;
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  -moz-column-count: 3; /* Firefox */
  -webkit-column-count: 3; /* Safari 和 Chrome */
  column-count: 3;
  -moz-column-gap: 1em;
  -webkit-column-gap: 1em;
  column-gap: 1em;
  margin: 1em auto;
  min-height: 680px;
}

.task {
  padding: 5px;
  margin-bottom: 5px;
  page-break-inside: avoid;
  -moz-page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  background: white;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  box-shadow: 2px 2px 3px #909399;
}

.task_regular {
  height: 200px;
}

.task_free {
  min-height: 200px;
}
</style>