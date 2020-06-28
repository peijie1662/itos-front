<template>
  <div>
    <div style="position:relative;text-align:center;width:120px;height:80px;font-size:8px;">
      <div :style="topTriangleStyle"></div>
      <div style="position: absolute;top: 2px;right:2px;">
        <span style="color: #cdcdcd;">{{mmodel.serviceName}}</span>
        <span :style="domainColor">{{mmodel.serviceDomain?mmodel.serviceDomain.slice(0,1):''}}</span>
      </div>
      <div style="margin-top:10px;">
        <span>{{mmodel.abs}}</span>
      </div>
      <div :style="bottomTriangleStyle"></div>
      <!-- 生成按钮 -->
      <div v-if="onceBtn" style="position: absolute;bottom: 2px;left: 2px;">
        <div style="float:left;">
          <i class="el-icon-circle-plus-outline small-btn" style="font-size:15px;" @click="newOnce"></i>
        </div>
      </div>
      <el-dialog title="临时创建新任务" :visible.sync="crtDialogVisible" width="30%">
        <div style="margin-top:10px;">
          <span>计划时间：</span>
          <el-date-picker type="datetime" v-model="planDt" size="mini" style="margin-left:5px;"></el-date-picker>
        </div>
        <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="crtDialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="createOnceTask" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { saveOnceTask } from "@/api/api";
import { getCategoryColor } from "@/api/data";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      crtDialogVisible: false,
      planDt: new Date()
    };
  },
  methods: {
    ...mapMutations(["update_showIM", "update_attentionIM"]),
    newOnce() {
      this.planDt = new Date();
      this.crtDialogVisible = true;
    },
    createOnceTask() {
      let me = this;
      saveOnceTask({
        modelId: me.mmodel.modelId,
        planDt: me.planDt,
        userId: me.userInfo.userId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          let msg =
            me.mmodel.category == "COMMON"
              ? "生成人工任务成功，请到‘任务大厅’中查看。"
              : "生成系统任务成功，请到‘系统任务’中查看。";
          me.$message.success(msg);
          me.crtDialogVisible = false;
          //打开消息窗口
          me.update_showIM(true);
          me.update_attentionIM(me.mmodel.abs);
        }
      });
    }
  },
  props: ["mmodel", "onceBtn"],
  computed: {
    ...mapGetters(["userInfo"]),
    topTriangleStyle() {
      let style = {
        width: "0",
        height: "0",
        borderTop: "20px solid red",
        borderRight: "20px solid transparent",
        borderTopRadius: "5px"
      };
      if (this.mmodel.invalid) {
        style.borderTop = "20px solid " + getCategoryColor(null);
      } else {
        style.borderTop =
          "20px solid " + getCategoryColor(this.mmodel.category);
      }
      return style;
    },
    domainColor() {
      let style = {
        color: "#ddd"
      };
      if (this.mmodel.serviceDomain == "NBCT") style.color = "#FF4500";
      if (this.mmodel.serviceDomain == "OFFICE") style.color = "#00AA88";
      return style;
    },
    bottomTriangleStyle() {
      let style = {
        width: "0",
        height: "0",
        borderBottom: "20px solid red",
        borderLeft: "20px solid transparent",
        position: "absolute",
        bottom: "0px",
        right: "0px"
      };
      if (this.mmodel.invalid) {
        style.borderBottom = "20px solid " + getCategoryColor(null);
      } else {
        style.borderBottom =
          "20px solid " + getCategoryColor(this.mmodel.category);
      }
      return style;
    }
  }
};
</script>

<style scoped>
</style>