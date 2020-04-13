<template>
  <div>
    <div class="header">
      <el-checkbox v-model="selCheckin" @change="filter">登记</el-checkbox>
      <el-checkbox v-model="selProcessing" @change="filter">进行中</el-checkbox>
      <el-checkbox v-model="selDone" @change="filter">完成</el-checkbox>
      <el-checkbox v-model="selCancel" @change="filter">删除</el-checkbox>
      <el-divider direction="vertical"></el-divider>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        :picker-options="pickerOptions"
        @change="loadData"
      ></el-date-picker>
      <el-divider direction="vertical"></el-divider>
      <el-button type="primary" @click="loadData" size="mini" style="margin-top:15px;">刷新</el-button>
    </div>
    <div class="content">
      <!-- 任务列表 -->
      <div v-for="(task,index) in finTaskList" :key="index" class="task">
        <taskCom :ttask="task" @updateTaskSuccess="loadData"></taskCom>
      </div>
    </div>
  </div>
</template>

<script>
import { pickerOptions } from "@/api/data";
import { getDispatchTaskAll } from "@/api/api";
import taskCom from "@/components/dispatchTaskCom";

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
      finTaskList: [],
      //
      pickerOptions,
      dateRange: [new Date(),new Date()] //默认当天      
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
      getDispatchTaskAll({
        dateRange: me.dateRange
      }).then(res => {
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
    taskCom
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
  margin-top: 10px;
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