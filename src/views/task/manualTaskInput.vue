<template>
  <div>
    <div class="header">
      <el-checkbox v-model="selCheckin" @change="loadData">登记</el-checkbox>
      <el-checkbox v-model="selProcessing" @change="loadData">进行中</el-checkbox>
      <el-checkbox v-model="selDone" @change="loadData">完成</el-checkbox>
      <el-checkbox v-model="selCancel" @change="loadData">失败/取消</el-checkbox>
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
      <el-button type="primary" @click="addTask" size="mini" style="margin-top:15px;">登记</el-button>
      <el-button type="primary" @click="loadData" size="mini" style="margin-top:15px;">刷新</el-button>
    </div>
    <div class="content">
      <!-- 任务列表 -->
      <div v-for="(task,index) in taskList" :key="index" class="task">
        <taskCom :ttask="task" @updateTaskSuccess="loadData"></taskCom>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="curPage"
        :page-size="pageSize"
        layout="total,sizes, prev, pager, next"
        background
        :total="total"
      ></el-pagination>
    </div>
    <!-- 创建任务 -->
    <newTaskCom :ttask="newTask" @taskUpdateOk="loadData"></newTaskCom>
  </div>
</template>

<script>
import { pickerOptions } from "@/api/data";
import { getManualTaskPage, getManualTaskCount, getUserList } from "@/api/api";
import taskCom from "@/components/task/manualTaskCom";
import newTaskCom from "@/components/task/newManualTaskCom.vue";

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
      users: [], //用户信息
      //
      pickerOptions,
      dateRange: [new Date(), new Date()], //默认当天
      //
      total: 0,
      curPage: 1,
      pageSize: 20
    };
  },
  computed: {
    statuss() {
      let ss = [];
      if (this.selCheckin) ss.push("CHECKIN");
      if (this.selProcessing) ss.push("PROCESSING");
      if (this.selDone) ss.push("DONE");
      if (this.selCancel) {
        ss.push("CANCEL");
        ss.push("FAIL");
      }
      return ss;
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.manualTaskList();
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.manualTaskList();
    },
    addTask() {
      this.newTask = {};
    },
    userList() {
      let me = this;
      return new Promise((resolve, reject) => {
        getUserList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.users = data;
            resolve();
          }
        });
      });
    },
    manualTaskList() {
      let me = this;
      return new Promise((resolve, reject) => {
        getManualTaskPage({
          dateRange: me.dateRange, //1.时间范围
          statuss: me.statuss.map(item => "'" + item + "'").join(","), //2.状态范围
          curPage: me.curPage,
          pageSize: me.pageSize
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            data.forEach(item => {
              item.handleUsers = item.handler.map(userId => {
                return me.users.filter(user => {
                  return user.userId == userId;
                })[0];
              });
            });
            me.taskList = data;
            resolve();
          }
        });
      });
    },
    manualTaskCount() {
      let me = this;
      return new Promise((resolve, reject) => {
        getManualTaskCount({
          dateRange: me.dateRange, //1.时间范围
          statuss: me.statuss.map(item => "'" + item + "'").join(",") //2.状态范围
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.total = data[0].COUNT;
            resolve();
          }
        });
      });
    },
    loadData: async function() {
      await this.userList();
      await this.manualTaskCount();
      await this.manualTaskList();
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