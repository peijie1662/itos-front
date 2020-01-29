<template>
  <div>
    <div class="outer" v-if="task == null">
      <span style="margin-left:3px;">{{dval.model.abs}}</span>
      <br />
      <span style="font-size:8px;margin-left:3px;">(未生成任务,等待中...)</span>
    </div>
    <div class="outer" v-else @mouseleave="showNextStatus = false">
      <!-- 内容第1行 -->
      <div class="block">
        <!-- 图标 -->
        <div>
          <i
            :class="task.icon.icon"
            :style="task.icon.iconclass"
            style="font-size:20px;float:left;"
          ></i>
        </div>
        <!-- 简介 -->
        <span
          style="display:block;margin-left:5px;margin-top:3px;font-size:8px;float:left;"
        >{{task.abs}}</span>
        <!-- 状态 -->
        <div
          @mouseenter="statusHover = true"
          @mouseleave="statusHover = false"
          @click="showNextStatusFun()"
          style="float:right;"
        >
          <i
            v-if="statusHover"
            :class="task.sta.icon"
            :style="task.sta.hoverclass"
            style="font-size:20px;"
          ></i>
          <i v-else :class="task.sta.icon" :style="task.sta.iconclass" style="font-size:20px;"></i>
        </div>
      </div>
      <!-- Next状态-->
      <div v-show="showNextStatus" style="position:absolute;top:20px;right:2px;z-index:999;">
        <i
          v-for="status in task.nextSta"
          :key="status.id"
          :class="status.icon"
          :style="status.iconclass"
          style="margin-left:1px;font-size:20px;border-radius:2px;"
          @click="nextStatus(task,status)"
        ></i>
      </div>
      <!-- 内容第2行 状态 -->
      <div class="block">
        <span class="block-tag">Status:</span>
        <span :style="task.sta.hoverclass" class="block-txt" style="width:60px;">{{task.status}}</span>
      </div>
      <!-- 内容第2行 执行者 -->
      <div class="block">
        <span class="block-tag">Terminal:</span>
        <span :style="task.sta.hoverclass" class="block-txt" style="width:60px;">RDS-01</span>
      </div>
      <!-- 内容第3行 执行IP -->
      <div class="block">
        <span class="block-tag">IP:</span>
        <span :style="task.sta.hoverclass" class="block-txt" style="width:100px;">169.169.41.226</span>
      </div>
      <!-- 内容第4行 开始时间-->
      <div class="block">
        <span class="block-tag">开始:</span>
        <span :style="task.sta.hoverclass" class="block-txt" style="width:120px;">{{task.bgDtStr}}</span>
      </div>
      <!-- 内容第5行 结束时间-->
      <div class="block">
        <span class="block-tag">结束:</span>
        <span :style="task.sta.hoverclass" class="block-txt" style="width:120px;">{{task.edDtStr}}</span>
      </div>      
    </div>
    <!-- 执行中窗口 -->
    <processingCom :ttask="processingTask" @updateTaskSuccess="updateTaskSuccess"></processingCom>
    <!-- 完成窗口 -->
    <doneCom :ttask="doneTask" @updateTaskSuccess="updateTaskSuccess"></doneCom>
    <!-- 取消窗口 -->
    <cancelCom :ttask="cancelTask" @updateTaskSuccess="updateTaskSuccess"></cancelCom>
    <!-- 修改窗口 -->
    <modifyCom :ttask="modifyTask" @updateTaskSuccess="updateTaskSuccess"></modifyCom>
    <!-- 换人窗口 -->
    <swapCom :ttask="swapTask" @updateTaskSuccess="updateTaskSuccess"></swapCom>
  </div>
</template>

<script>
import { getTaskIconById, getTaskStatusById, listIsEmpty } from "@/api/data";
import processingCom from "@/components/commonStatusCom.vue";
import doneCom from "@/components/commonStatusCom.vue";
import cancelCom from "@/components/commonStatusCom.vue";
import modifyCom from "@/components/modifyCom.vue";
import swapCom from "@/components/swapCom.vue";

export default {
  data() {
    return {
      dval: "",
      task: "",
      statusHover: false,
      showNextStatus: false,
      //
      processingTask: null,
      doneTask: null,
      cancelTask: null,
      modifyTask: null,
      swapTask: null
    };
  },
  methods: {
    showNextStatusFun() {
      this.showNextStatus =
        !this.showNextStatus && !listIsEmpty(this.task.nextSta);
    },
    updateTaskSuccess() {
      this.$emit("updateTaskSuccess");
    },
    nextStatus(task, status) {
      task.newStatus = status;
      if (status.id == "PROCESSING") {
        this.processingTask = { ...task };
      } else if (status.id == "DONE") {
        this.doneTask = { ...task };
      } else if (status.id == "CANCEL") {
        this.cancelTask = { ...task };
      } else if (status.id == "MODIFY") {
        this.modifyTask = { ...task };
      } else if (status.id == "SWAP") {
        this.swapTask = { ...task };
      }
    }
  },
  props: ["detail"],
  watch: {
    detail: {
      handler(newVal) {
        if (newVal != null) {
          this.dval = newVal;
          this.task = newVal.task;
          if (this.task) {
            this.task.icon = getTaskIconById(newVal.task.taskIcon);
            this.task.sta = getTaskStatusById(newVal.task.status);
            this.task.nextSta = this.task.sta.next.map(item => {
              return getTaskStatusById(item);
            });
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    processingCom,
    doneCom,
    cancelCom,
    modifyCom,
    swapCom
  }
};
</script>

<style scoped>
.outer {
  width: 150px;
  height: 120px;
  border: 1px solid #909399;
  position: relative;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  float: left;
  margin-left: 10px;
}
.block {
  position: relative;
  overflow: hidden;
  border-bottom: 1px dashed #909399;
}
.block-tag {
  font-size: 8px;
  margin-left: 2px;
}
.block-txt {
  float: right;
  font-size: 8px;
}
</style>