<template>
  <div>
    <div class="header">
      <el-checkbox v-model="selCheckin" @change="filter">登记</el-checkbox>
      <el-checkbox v-model="selProcessing" @change="filter">进行中</el-checkbox>
      <el-checkbox v-model="selDone" @change="filter">完成</el-checkbox>
      <el-checkbox v-model="selCancel" @change="filter">失败/取消</el-checkbox>
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
      <el-table
        :data="finTaskList"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        border
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item>
                <task-com :ttask="scope.row" class="task"></task-com>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="任务简介" width="200">
          <template slot-scope="scope">
            <span style="white-space:nowrap;">{{scope.row.abs}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <i
              :class="scope.row.sta.icon"
              :style="scope.row.sta.hoverclass"
              style="font-size:20px;"
            ></i>
            {{scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column label="内容" width="300">
          <template slot-scope="scope">
            <span style="white-space:nowrap;">{{scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handlerStr" label="执行人" width="80"></el-table-column>
        <el-table-column prop="planDtStr" label="登记时间" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { pickerOptions } from "@/api/data";
import { getManualTaskList } from "@/api/api";
import { localDateToStr } from "@/api/util";
import { getTaskStatusById } from "@/api/data";
import taskCom from "@/components/task/manualTaskCom";

export default {
  data() {
    return {
      selCheckin: true,
      selProcessing: true,
      selDone: true,
      selCancel: true,
      //
      newTask: null,
      taskList: [],
      finTaskList: [],
      //
      pickerOptions,
      dateRange: [new Date(), new Date()] //默认当天
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
          (me.selCancel &&  ((item.status == "CANCEL")||(item.status == "FAIL")))
        );
      });
    },
    loadData() {
      let me = this;
      getManualTaskList({
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
          me.taskList.forEach(task => {
            task.handlerStr = task.handler.join(",");
            task.planDtStr = localDateToStr(task.planDt);
            task.sta = getTaskStatusById(task.status);
          });
          me.filter();
        }
      });
    },
    headerCellStyle() {
      return "padding:0;";
    },
    cellStyle() {
      return "padding-top:2px;padding-bottom:2px;";
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
  padding: 5px;
  margin-bottom: 10px;
  background: white;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  box-shadow: 2px 2px 3px #909399;
}
</style>