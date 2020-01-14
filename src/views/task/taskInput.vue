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
      <div>
        <el-button
          type="primary"
          @click="addTask"
          size="mini"
          style="margin-top:15px;margin-left:50px;"
        >登记任务</el-button>
      </div>
    </div>
    <div class="content">
      <!-- 任务列表 -->
      <div v-for="(task,index) in finTaskList" :key="index" class="task">
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
  min-height: 680px;
}

.task {
  width: 70%;
  padding: 5px;
  margin-bottom: 10px;
  background: white;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  box-shadow: 2px 2px 3px #909399;
}
</style>