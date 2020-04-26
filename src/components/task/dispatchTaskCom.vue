<template>
  <div>
    <div class="outer" @mouseleave="showNextStatus = false">
      <!-- 第1行，标题 -->
      <div class="section-title">
        <!-- 图标 -->
        <div style="float:left;">
          <i
            :class="task.icon.icon"
            :style="task.executedCallback?'color:red':'color:#67C23A'"
            style="font-size:30px;background:#e9ebec;"
          ></i>
        </div>
        <!-- 简介 -->
        <div style="float:left;margin-left:10px;">
          <span style="font-size:16px;user-select:none;line-height:30px;">{{task.abs}}</span>
        </div>
        <!-- 状态 -->
        <div
          style="float:right;"
          @mouseenter="statusHover = true"
          @mouseleave="statusHover = false"
          @click="showNextStatusFun()"
        >
          <i
            v-if="statusHover"
            :class="task.sta.icon"
            :style="task.sta.hoverclass"
            style="font-size:30px;"
          ></i>
          <i v-else :class="task.sta.icon" :style="task.sta.iconclass" style="font-size:30px;"></i>
        </div>
        <!-- Next状态-->
        <div v-show="showNextStatus " class="task_next_status">
          <i
            v-for="status in task.nextSta"
            :key="status.id"
            :class="status.icon"
            :style="status.iconclass"
            style="margin-left:1px;font-size:30px;border-radius:2px;"
            @click="nextStatus(task,status)"
          ></i>
        </div>
      </div>
      <!-- 第2行,登记信息 -->
      <div class="section-noborder">
        <!-- 开始执行/过期时间 -->
        <div>
          <span style="color: #a6b5c4;">开始执行：{{task.planDtStr}}</span>
          <span style="color: #a6b5c4;margin-left:30px;">过期时间：{{task.expiredTimeStr}}</span>
        </div>
      </div>
      <!-- 第3行,内容 -->
      <div style="min-height:50px;word-wrap: break-word;padding: 10px;">{{task.content}}</div>
      <!-- 第4行,处理人 -->
      <div>
        <span style="color: #a6b5c4;">处理人员：</span>
        <span style="margin-left:5px;">{{task.handlers}}</span>
      </div>
      <!-- 第5行,处理日志 -->
      <span style="color: #a6b5c4;">任务日志：</span>
      <div style="font-size:10px;color: #a6b5c4;">
        <div v-for="(item,index) in taskLog" :key="index" style="margin-top:2px;">
          <i :class="item.sta.icon" :style="item.sta.iconclass" style="margin-left:10px;"></i>
          <span>{{item.opDtStr}}</span>
          <span style="margin-left:10px;">{{item.statusdesc}}</span>
          <div v-show="item.remark != null" style="margin-left:25px;">
            <span>备注:</span>
            <div v-html="item.remark"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 执行中窗口 -->
    <processingCom :ttask="processingTask" @updateTaskSuccess="updateTaskSuccess"></processingCom>
    <!-- 完成窗口 -->
    <doneCom :ttask="doneTask" @updateTaskSuccess="updateTaskSuccess"></doneCom>
    <!-- 失败窗口 -->
    <failCom :ttask="failTask" @updateTaskSuccess="updateTaskSuccess"></failCom>    
    <!-- 取消窗口 -->
    <cancelCom :ttask="cancelTask" @updateTaskSuccess="updateTaskSuccess"></cancelCom>
    <!-- 修改窗口 -->
    <modifyCom :ttask="modifyTask" @updateTaskSuccess="updateTaskSuccess"></modifyCom>
    <!-- 换人窗口 -->
    <swapCom :ttask="swapTask" @updateTaskSuccess="updateTaskSuccess"></swapCom>
  </div>
</template>

<script>
import { getTaskLog } from "@/api/api";
import { localDateToStr } from "@/api/util";
import { getTaskIconById, getTaskStatusById, listIsEmpty } from "@/api/data";
import processingCom from "@/components/task/commonStatusCom.vue";
import doneCom from "@/components/task/commonStatusCom.vue";
import failCom from "@/components/task/commonStatusCom.vue";
import cancelCom from "@/components/task/commonStatusCom.vue";
import modifyCom from "@/components/task/modifyCom.vue";
import swapCom from "@/components/task/swapCom.vue";

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
      failTask: null,
      cancelTask: null,
      modifyTask: null,
      swapTask: null
    };
  },
  methods: {
    updateTaskSuccess() {
      this.$emit("updateTaskSuccess");
    },
    showNextStatusFun() {
      this.showNextStatus =
        !this.showNextStatus && !listIsEmpty(this.task.nextSta);
    },
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
            item.sta = getTaskStatusById(item.status);
          });
        }
      });
    },
    nextStatus(task, status) {
      task.newStatus = status;
      if (status.id == "PROCESSING") {
        this.processingTask = { ...task };
      } else if (status.id == "DONE") {
        this.doneTask = { ...task };
      } else if (status.id == "FAIL") {
        this.failTask = { ...task };        
      } else if (status.id == "CANCEL") {
        this.cancelTask = { ...task };
      } else if (status.id == "MODIFY") {
        this.modifyTask = { ...task };
      } else if (status.id == "SWAP") {
        this.swapTask = { ...task };
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
        this.task.handlers = newVal.handler.join(",");
        this.task.planDtStr = localDateToStr(this.task.planDt);
        this.task.expiredTimeStr = localDateToStr(this.task.expiredTime);
        this.loadData();
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    processingCom,
    doneCom,
    failCom,
    cancelCom,
    modifyCom,
    swapCom
  }
};
</script>

<style scoped>
.outer {
  position: relative;
}

.section {
  overflow: hidden;
  height: 100%;
  margin-top: 2px;
  border: 1px solid #ddd;
}

.section-title {
  overflow: hidden;
  height: 100%;
  margin-top: 2px;
  background: -webkit-linear-gradient(right, #e9c341, white);
}

.section-noborder {
  overflow: hidden;
  height: 100%;
  margin-top: 2px;
}

.sub_section {
  float: left;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  overflow: hidden;
}

.task_next_status {
  position: absolute;
  right: 3px;
  top: 35px;
  border: 2px dashed #20a0ff;
  border-radius: 2px;
  background: white;
}

.task_content {
  text-align: left;
  border-bottom: 1px solid #c0c4cc;
  min-height: 50px;
  overflow-x: auto;
}

.task_handler {
  text-align: left;
  border-bottom: 1px solid #c0c4cc;
  min-height: 20px;
  margin-top: 5px;
}
</style>

