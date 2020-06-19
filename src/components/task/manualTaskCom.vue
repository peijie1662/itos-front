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
          <span style="font-size:20px;user-select:none;line-height:30px;">{{task.abs}}</span>
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
      <div class="section">
        <!-- 电话 -->
        <div class="sub_section" style="width:150px;">
          <span>电话：{{task.phone}}</span>
        </div>
        <!-- 位置 -->
        <div class="sub_section" style="width:200px;">
          <span>位置：{{task.location}}</span>
        </div>
        <!-- 联系人 -->
        <div class="sub_section" style="width:150px;">
          <span>联系人：{{task.customer}}</span>
        </div>
        <!-- 开始执行 -->
        <div class="sub_section" style="width:250px;">
          <span>开始执行：{{task.planDtStr}}</span>
        </div>
        <!-- 过期时间 -->
        <div class="sub_section" style="width:250px;">
          <span>过期时间：{{task.expiredTimeStr}}</span>
        </div>
      </div>
      <!-- 第3行,委外修理 -->
      <div class="section" style="color:#c0c4cc;" v-if="dr && dr.drId">
        <div class="sub_section" style="width:250px;">
          <span>送修时间：{{dr.deliverDateStr}}</span>
        </div>
        <div class="sub_section" style="width:250px;">
          <span>收回时间：{{dr.receiptDateStr}}</span>
        </div>
        <div class="sub_section" style="width:250px;">
          <span>发票号码：{{dr.invoiceNumber}}</span>
        </div>
        <div class="sub_section" style="width:100px;">
          <span>金额：{{dr.amount}}</span>
        </div>
      </div>
      <!-- 第4行,内容 -->
      <div class="section" style="min-height:50px;padding: 10px;" v-html="task.content"></div>
      <!-- 第5行,处理人 -->
      <div class="section">
        <div style="color:#c0c4cc;float:left;">处理人员：</div>
        <div
          v-for="(user,index) in task.handleUsers"
          :key="index"
          style="float:left;margin-left:10px;"
        >
          <el-image :src="user.faceUrl" fit="contain" :lazy="true" class="face">
            <div slot="error" class="image-slot">
              <img src="@/assets/face/man.png" style="height:30px;width:30px;" />
            </div>
          </el-image>
          <span style="font-size:12px;">{{user.userName}}</span>
        </div>
      </div>
      <!-- 第6行,处理日志 -->
      <span style="color: #a6b5c4;">任务日志：</span>
      <div class="section" style="font-size:10px;color:#c0c4cc;">
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
    <!-- 委外窗口 -->
    <dr-com :dr="dr_param" @updateTaskSuccess="updateTaskSuccess"></dr-com>
  </div>
</template>

<script>
import { getTaskLog, getDrList } from "@/api/api";
import { localDateToStr, localDateToDate } from "@/api/util";
import {
  getTaskIconById,
  getTaskStatusById,
  listIsEmpty,
  faceUrl
} from "@/api/data";
import processingCom from "@/components/task/commonStatusCom.vue";
import doneCom from "@/components/task/commonStatusCom.vue";
import failCom from "@/components/task/commonStatusCom.vue";
import cancelCom from "@/components/task/commonStatusCom.vue";
import modifyCom from "@/components/task/modifyCom.vue";
import swapCom from "@/components/task/swapCom.vue";
import drCom from "@/components/deliverrepair/deliverRepairCom.vue";

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
      swapTask: null,
      //
      dr: null, //委外
      dr_param: null
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
    loadTaskLog() {
      return new Promise((resolve, reject) => {
        let me = this;
        getTaskLog({
          taskId: me.task.taskId
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.taskLog = data;
            me.taskLog.forEach(item => {
              item.opDtStr = localDateToStr(item.opDate);
              item.sta = getTaskStatusById(item.status);
            });
            resolve();
          }
        });
      });
    },
    loadTaskDeliverRepair() {
      return new Promise((resolve, reject) => {
        let me = this;
        getDrList({
          taskId: me.task.taskId
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.dr = data.length > 0 ? data[0] : { taskId: me.task.taskId };
            me.dr.deliverDateStr = localDateToStr(me.dr.deliverDate);
            me.dr.receiptDateStr = localDateToStr(me.dr.receiptDate);
            me.dr.deliverDate = localDateToDate(me.dr.deliverDate);
            me.dr.receiptDate = localDateToDate(me.dr.receiptDate);
            resolve();
          }
        });
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
      } else if (status.id == "DELIVERREPAIR") {
        this.dr_param = { ...this.dr };
      }
    }
  },
  props: ["ttask"],
  watch: {
    ttask: {
      handler: async function(newVal) {
        this.task = newVal;
        this.task.icon = getTaskIconById(newVal.taskIcon);
        this.task.sta = getTaskStatusById(newVal.status);
        //设置后续状态
        this.task.nextSta = this.task.sta.next
          .map(item => {
            return getTaskStatusById(item);
          })
          .filter(item => {
            return item.scope && item.scope.indexOf("MANUAL") >= 0;
          });
        //设置人物头像  
        this.task.handleUsers.forEach(user => {
          user.faceUrl = faceUrl(user.userId);
        });
        this.task.planDtStr = localDateToStr(this.task.planDt);
        this.task.expiredTimeStr = localDateToStr(this.task.expiredTime);
        await this.loadTaskLog();
        await this.loadTaskDeliverRepair();
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
    swapCom,
    drCom
  }
};
</script>

<style scoped>

.face {
  width: 30px;
  height: 30px;
  background: #f5f7fa;
  border-radius: 50%;
  overflow: hidden;
}

.outer {
  position: relative;
  line-height: unset;
}

.section-title {
  overflow: hidden;
  height: 100%;
  margin-top: 2px;
  background: -webkit-linear-gradient(right, #67c23a, white);
}

.section {
  overflow: hidden;
  height: 100%;
  margin-top: 2px;
}

.section-noborder {
  overflow: hidden;
  height: 100%;
  margin-top: 2px;
}

.sub_section {
  float: left;
  color: #c0c4cc;
  overflow: hidden;
}

.task_next_status {
  position: absolute;
  right: 2px;
  top: 32px;
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

