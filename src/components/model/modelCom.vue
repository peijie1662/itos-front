<template>
  <div>
    <div class="outer">
      <!-- 顶部三角 -->
      <div :style="topTriangleStyle"></div>
      <!-- 详情按钮 -->
      <div style="position: absolute;top: 2px;right: 2px;">
        <i class="el-icon-more small-btn" @click="modelDetail"></i>
      </div>
      <!-- 简介 -->
      <div style="text-align: center;">
        <span style="font-size:12px;">{{taskModel.abs}}</span>
      </div>
      <!-- 底部三角 -->
      <div :style="bottomTriangleStyle"></div>
      <div style="position: absolute;bottom: 2px;left: 2px;">
        <!-- 生成按钮 -->
        <div v-if="taskModel.category != 'COMPOSE'" style="float:left;">
          <i class="el-icon-circle-plus-outline small-btn" @click="newOnce"></i>
        </div>
        <!-- 有效按钮 -->
        <div v-if="taskModel.category != 'COMPOSE'" style="float:left;">
          <i
            :class="[taskModel.invalid?'el-icon-document-delete':'el-icon-document-checked','small-btn']"
            @click="chgInvalidStatus"
          ></i>
        </div>
        <!-- 分组按钮 -->
        <div style="float:left;">
          <i class="el-icon-paperclip small-btn" @click="selectGroup"></i>
        </div>
      </div>
    </div>
    <!-- 生成新任务窗口 -->
    <el-dialog title="临时创建新任务" :visible.sync="crtDialogVisible" width="30%">
      <div>
        <span>输入任务执行时间：</span>
        <el-date-picker type="datetime" v-model="planDt"></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="crtDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="createOnceTask" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分组窗口 -->
    <el-dialog title="选择分组" :visible.sync="gpDialogVisible" width="30%">
      <div>
        <span>选择分组：</span>
        <el-select v-model="selGp" placeholder="请选择" size="mini">
          <el-option
            v-for="item in gps"
            :key="item.groupName"
            :label="item.groupName"
            :value="item.groupId"
          ></el-option>
          <el-option key="noGroup" label="不分组" value="noGroup"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gpDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="chgModelGroup" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 模版详情 -->
    <model-detail-com :tmodel="detailModel" @modelUpdateOk="modelUpdateOk"></model-detail-com>
  </div>
</template>

<script>
import { saveOnceTask, chgModelStatus, updateModelGroup } from "@/api/api";
import { getCategoryColor } from "@/api/data";
import modelDetailCom from "@/components/model/modelDetailCom.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      crtDialogVisible: false,
      gpDialogVisible: false,
      selGp: "",
      planDt: new Date(),
      detailModel: null,
      taskModel: "",
      topTriangleStyle: {
        width: "0",
        height: "0",
        borderTop: "30px solid red",
        borderRight: "30px solid transparent",
        borderTopRadius: "5px"
      },
      bottomTriangleStyle: {
        width: "0",
        height: "0",
        borderBottom: "30px solid red",
        borderLeft: "30px solid transparent",
        position: "absolute",
        bottom: "0px",
        right: "0px"
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    chgModelGroup() {
      let me = this;
      updateModelGroup({
        models: [
          {
            modelId: me.taskModel.modelId,
            groupId: me.selGp == "noGroup" ? "" : me.selGp,
            index: 99
          }
        ]
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.$emit("modelUpdateOk");
        }
      });
    },
    selectGroup() {
      let me = this;
      if (me.taskModel.groupId) {
        me.selGp = me.gps.filter(item => {
          return item.groupId == me.taskModel.groupId;
        })[0].groupName;
      } else {
        me.selGp = "noGroup";
      }
      me.gpDialogVisible = true;
    },
    newOnce() {
      this.planDt = new Date();
      this.crtDialogVisible = true;
    },
    modelDetail() {
      this.detailModel = { ...this.taskModel };
    },
    modelUpdateOk() {
      this.$emit("modelUpdateOk");
    },
    createOnceTask() {
      let me = this;
      saveOnceTask({
        modelId: me.taskModel.modelId,
        planDt: me.planDt,
        userId: me.userInfo.userId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          let msg =
            me.taskModel.category == "COMMON"
              ? "生成人工任务成功，请到‘任务大厅’中查看。"
              : "生成系统任务成功，请到‘系统任务’中查看。";
          me.$message({
            message: msg,
            type: "success"
          });
          me.crtDialogVisible = false;
        }
      });
    },
    chgInvalidStatus() {
      let me = this;
      let msg = me.taskModel.invalid
        ? "是否确定启用该模版？"
        : "是否确定停用该模版？";
      me.$confirm(msg, "模版状态", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          chgModelStatus({
            modelId: me.taskModel.modelId,
            invalid: !me.taskModel.invalid ? "Y" : "N"
          }).then(res => {
            let { flag, errMsg } = res;
            if (!flag) {
              me.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              me.setModelColor();
              me.$emit("modelUpdateOk");
            }
          });
        })
        .catch(() => {});
    },
    setModelColor() {
      let me = this;
      if (me.taskModel.invalid) {
        this.topTriangleStyle.borderTop =
          "30px solid " + getCategoryColor(null);
        this.bottomTriangleStyle.borderBottom =
          "30px solid " + getCategoryColor(null);
      } else {
        this.topTriangleStyle.borderTop =
          "30px solid " + getCategoryColor(me.taskModel.category);
        this.bottomTriangleStyle.borderBottom =
          "30px solid " + getCategoryColor(me.taskModel.category);
      }
    }
  },
  props: ["tmodel", "gps"],
  watch: {
    tmodel: {
      handler(newVal) {
        this.taskModel = newVal;
        this.setModelColor();
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    modelDetailCom
  }
};
</script>

<style scoped>
.outer {
  width: 150px;
  height: 100px;
  border: 1px solid #909399;
  position: relative;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.small-btn {
  font-size: 20px;
  color: #909399;
}

.small-btn:hover {
  color: white;
  background: #409eff;
}
</style>