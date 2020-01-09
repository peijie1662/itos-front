<template>
  <div>
    <div class="outer" @mouseleave="showNextStatus = false">
      <!-- 图标 -->
      <div class="task_icon">
        <i :class="task.icon.icon" :style="task.icon.iconclass" style="font-size:40px;"></i>
      </div>
      <!-- 状态 -->
      <div
        class="task_status"
        @mouseenter="statusHover = true"
        @mouseleave="statusHover = false"
        @click="showNextStatus = !showNextStatus"
      >
        <i
          v-if="statusHover"
          :class="task.sta.icon"
          :style="task.sta.hoverclass"
          style="font-size:40px;"
        ></i>
        <i v-else :class="task.sta.icon" :style="task.sta.iconclass" style="font-size:40px;"></i>
      </div>
      <!-- Next状态-->
      <div v-show="showNextStatus" class="task_next_status">
        <i
          v-for="status in task.nextSta"
          :key="status.id"
          :class="status.icon"
          :style="status.iconclass"
          style="margin-left:1px;font-size:35px;border-radius:2px;"
          @click="nextStatus(task,status)"
        ></i>
      </div>
      <!-- 简介 -->
      <div class="task_abs">
        <span style="margin-left:50px;font-size:20px;">{{task.abs}}</span>
      </div>
      <!-- 内容 -->
      <div class="task_content">
        <span>{{task.content}}</span>
      </div>
      <!-- 处理人 -->
      <div class="task_handler">
        <span style="color:black;background:#e9ebec;">处理人员</span>
        <span style="margin-left:5px;">{{task.handlers}}</span>
      </div>
      <!-- 处理日志 -->
      <div style="font-size:10px;">
        <div v-for="(item,index) in taskLog" :key="index">
          <span style="color:black;background:#e9ebec;">{{item.opDtStr}}</span>
          <br />
          <i :class="task.sta.icon" :style="task.sta.hoverclass" style="margin-left:10px;"></i>
          <span style="margin-left:10px;">{{item.statusdesc}}</span>
        </div>
      </div>
    </div>
    <!-- 执行中窗口 -->
    <processingCom :ttask="processingTask"></processingCom>
    <!-- 完成窗口 -->
    <doneCom :ttask="doneTask"></doneCom>
    <!-- 取消窗口 -->
    <cancelCom :ttask="cancelTask"></cancelCom>
    <!-- 灌水窗口 -->
    <followupCom :ttask="followupTask"></followupCom>
  </div>
</template>

<style scoped>
.outer {
  position: relative;
}

.task_icon {
  position: absolute;
  top: 2px;
  left: 2px;
}

.task_status {
  position: absolute;
  top: 2px;
  right: 2px;
}

.task_next_status {
  position: absolute;
  right: 5px;
  top: 50px;
  border: 2px dashed #20a0ff;
  border-radius: 2px;
  background: white;
}

.task_abs {
  text-align: left;
  line-height: 50px;
  border-bottom: 1px solid #c0c4cc;
  height: 50px;
  background: #e9ebec;
}

.task_content {
  text-align: left;
  border-bottom: 1px solid #c0c4cc;
  min-height: 120px;
}

.task_handler {
  text-align: left;
  border-bottom: 1px solid #c0c4cc;
  min-height: 30px;
  margin-top: 5px;
}
</style>

<script>
import { getTaskLog } from "@/api/api";
import { localDateToStr } from "@/api/util";
import {
  getTaskIconById,
  getTaskStatusById,
  getUserNameById
} from "@/api/data";
import processingCom from "@/components/commonStatusCom.vue";
import doneCom from "@/components/commonStatusCom.vue";
import cancelCom from "@/components/commonStatusCom.vue";
import followupCom from "@/components/commonStatusCom.vue";

export default {
  data() {
    return {
      statusHover: false,
      showNextStatus: false,
      task: "",
      taskLog: [],
      //
      processingTask: null,
      doneTask: null,
      cancelTask: null,
      followupTask: null
    };
  },
  methods: {
    loadData() {
      let me = this;
      getTaskLog({
        taskId: me.task.taskId
      }).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.taskLog = data;
          me.taskLog.forEach(item => {
            item.opDtStr = localDateToStr(item.opDate);
          });
        }
      });
    },
    nextStatus(task,status){
      task.newStatus = status;
      if (status.id == "PROCESSING"){
        this.processingTask = {...task}
      }else if (status.id == "DONE"){
        this.doneTask = {...task}
      }else if (status.id == "CANCEL"){
        this.cancelTask = {...task}
      }
    }
  },
  props: ["ttask"],
  watch: {
    ttask: {
      handler(newVal) {
        this.task = newVal;
        this.task.icon = getTaskIconById(newVal.taskIcon);
        this.task.sta = getTaskStatusById(newVal.status);
        this.task.nextSta = this.task.sta.next.map(item => {
          return getTaskStatusById(item);
        });
        this.task.handlers = newVal.handler
          ? newVal.handler
              .map(h => {
                return getUserNameById(h);
              })
              .join(",")
          : "";
        this.loadData();
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    processingCom,
    doneCom,
    cancelCom,
    followupCom
  }
};
</script>

