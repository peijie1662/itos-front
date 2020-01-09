<template>
  <div>
    <div class="header"></div>
    <div class="content">
      <!-- 增加任务 -->
      <div class="task" style="text-align:center;line-height:135px;" @click="addTask">
        <i class="el-icon-plus" style="font-size:150px;color:#c0c4cc;margin-top:50px;"></i>
      </div>
      <!-- 任务列表 -->
      <div v-for="(task,index) in tasklist" :key="index" class="task">
        <taskCom :ttask="task"></taskCom>
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
      newTask: null,
      tasklist: []
    };
  },
  methods: {
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
          me.tasklist = data;
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
  min-height: 200px;
  box-shadow: 2px 2px 3px #909399;
}
</style>