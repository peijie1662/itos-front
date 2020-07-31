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
        style="width:250px;"
      ></el-date-picker>
      <el-divider direction="vertical"></el-divider>
      <!-- 选择执行终端 -->
      <el-select
        v-model="selClientList"
        multiple
        collapse-tags
        placeholder="请选择执行终端"
        size="mini"
        @change="loadData"
        style="width:150px;"
      >
        <el-option
          v-for="item in clientList"
          :key="item.serviceName"
          :label="item.serviceName"
          :value="item.serviceName"
        ></el-option>
      </el-select>
      <el-divider direction="vertical"></el-divider>
      <!-- 选择任务 -->
      <el-select
        v-model="selAbsList"
        multiple
        collapse-tags
        placeholder="请选择任务"
        size="mini"
        @change="loadData"
        style="width:150px;"
      >
        <el-option-group v-for="group in absList" :key="group.label" :label="group.label">
          <el-option
            v-for="item in group.options"
            :key="item.abs"
            :label="item.abs"
            :value="item.modelId"
          ></el-option>
        </el-option-group>
      </el-select>
      <el-divider direction="vertical"></el-divider>
      <el-checkbox v-model="hideContent">隐藏内容</el-checkbox>
      <el-divider direction="vertical"></el-divider>
      <el-button type="primary" @click="loadData" size="mini" style="margin-top:15px;">刷新</el-button>
    </div>
    <div class="content">
      <!-- 任务列表 -->
      <div v-for="(task,index) in taskList" :key="index" class="task">
        <taskCom :ttask="task" :hideContent="hideContent" @updateTaskSuccess="loadData"></taskCom>
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
  </div>
</template>

<script>
import { pickerOptions } from "@/api/data";
import {
  getDispatchTaskPage,
  getDispatchTaskCount,
  getClientList,
  getAbsList
} from "@/api/api";
import { groupBy } from "@/api/util";
import taskCom from "@/components/task/dispatchTaskCom";

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
      //
      pickerOptions,
      dateRange: [new Date(), new Date()], //默认当天
      //
      clientList: [],
      selClientList: [],
      //
      absList: [],
      selAbsList: [],
      //
      total: 0,
      curPage: 1,
      pageSize: 20,
      //
      hideContent: true
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
      this.loadTaskList();
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.loadTaskList();
    },
    addTask() {
      this.newTask = {};
    },
    loadClientList() {
      let me = this;
      getClientList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.clientList = data;
        }
      });
    },
    async loadData() {
      await this.loadTaskList();
      await this.loadTaskCount();
    },
    loadTaskList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getDispatchTaskPage({
          dateRange: me.dateRange, //1.时间范围
          clients: me.selClientList.map(item => "'" + item + "'").join(","), //2.终端范围
          statuss: me.statuss.map(item => "'" + item + "'").join(","), //3.状态范围
          abss: me.selAbsList.map(item => "'" + item + "'").join(","), //4.简介范围
          curPage: me.curPage,
          pageSize: me.pageSize
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.taskList = data;
            resolve();
          }
        });
      });
    },
    loadTaskCount() {
      return new Promise((resolve, reject) => {
        let me = this;
        getDispatchTaskCount({
          dateRange: me.dateRange, //1.时间范围
          clients: me.selClientList.map(item => "'" + item + "'").join(","), //2.终端范围
          statuss: me.statuss.map(item => "'" + item + "'").join(","), //3.状态范围
          abss: me.selAbsList.map(item => "'" + item + "'").join(",") //4.简介范围
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
    loadAbsList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getAbsList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            let opts = [];
            groupBy(data, item => {
              return item.groupDesc;
            }).forEach((v, k) => {
              opts.push({
                label: k,
                options: v
              });
            });
            me.absList = opts;
            resolve();
          }
        });
      });
    }
  },
  components: {
    taskCom
  },
  mounted() {
    this.loadData();
    this.loadAbsList();
    this.loadClientList();
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
}
</style>