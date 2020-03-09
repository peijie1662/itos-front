<template>
  <div>
    <el-dialog title="任务模版" width="500px" :visible.sync="dialogVisible">
      <div>
        <!-- 详情内容 -->
        <div class="subcontent">
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">模版ID</span>
            <span class="dialogContent" style="left:120px;">{{taskModel.modelId}}</span>
          </div>
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">任务类型</span>
            <span class="dialogContent" style="left:120px;">{{taskModel.category}}</span>
          </div>
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">任务简介</span>
            <span class="dialogContent" style="left:120px;">{{taskModel.abs}}</span>
          </div>
          <!-- 任务内容 -->
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">任务内容</span>
          </div>
          <div ref="content" contenteditable="true" class="content" v-html="taskModel.comments"></div>
          <el-upload
            :action="uploadUrl"
            :data="{'userId':userInfo.userId,'modelId':taskModel.modelId}"
            :show-file-list="false"
            :on-success="handlerSuccess"
            style="margin-top:5px;margin-left:360px;"
            :disabled="taskModel.category == 'CMD' || taskModel.category == 'PROCEDURE'"
          >
            <el-button
              size="mini"
              type="primary"
              :disabled="taskModel.category == 'CMD' || taskModel.category == 'PROCEDURE'"
            >图文上传</el-button>
          </el-upload>
          <!-- 执行时间 -->
          <div v-show="taskModel.category != 'COMPOSE'">
            <div class="dialogLine">
              <span class="dialogtitle" style="left:20px;">执行时间</span>
              <el-input size="mini" style="left:120px;width:200px;" v-model="taskModel.planDates"></el-input>
            </div>
            <div class="dialogLine" v-if="taskModel.cycle == 'PERDAY'">
              <span class="dialogtitle" style="font-size:10px;left:20px;">每日任务时间格式：</span>
              <span class="dialogContent" style="font-size:10px;left:150px;">"HHMM",如"1530"表示"15:30"</span>
            </div>
            <div class="dialogLine" v-if="taskModel.cycle == 'PERWEEK'">
              <span class="dialogtitle" style="font-size:10px;left:20px;">每周任务时间格式：</span>
              <span
                class="dialogContent"
                style="font-size:10px;left:150px;"
              >"D,HHMM",如"1,1530"表示"周一15:30"</span>
            </div>
            <div class="dialogLine" v-if="taskModel.cycle == 'PERMONTH'">
              <span class="dialogtitle" style="font-size:10px;left:20px;">每月任务时间格式：</span>
              <span
                class="dialogContent"
                style="font-size:10px;left:150px;"
              >"W,D,HHMM",如"2,3,1530"表示"第二周周一15:30"</span>
            </div>
            <div class="dialogLine" v-if="taskModel.cycle == 'CIRCULAR'">
              <span class="dialogtitle" style="font-size:10px;left:20px;">循环任务时间格式：</span>
              <span
                class="dialogContent"
                style="font-size:10px;left:150px;"
              >单位秒,如"600"表示"下一次任务在10分钟后"</span>
            </div>
          </div>
          <!-- 过期时间 -->
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">过期时间(秒)</span>
            <el-input v-model="taskModel.expired" size="mini" style="left:120px;width:200px;"></el-input>
          </div>
        </div>
        <div style="overflow:hidden;">
          <el-button
            type="warning"
            size="mini"
            style="float:right;margin-left:10px;"
            @click="dialogVisible=false"
          >取消</el-button>
          <el-button type="success" size="mini" style="float:right;" @click="updateModel">修改</el-button>
          <el-popconfirm
            confirmButtonText="确定"
            cancelButtonText="再想想"
            icon="el-icon-info"
            iconColor="red"
            title="确定要删除这个任务模版吗？"
            @onConfirm="deleteModel"
          >
            <el-button type="danger" size="mini" style="float:right;" slot="reference">删除</el-button>
          </el-popconfirm>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateModel, deleteModel, UPLOAD_MODEL_URL } from "@/api/api";
import { insertContent } from "@/api/util";
import { modelUploadDom } from "@/api/data";

export default {
  data() {
    return {
      uploadUrl: UPLOAD_MODEL_URL,
      userInfo: "",
      dialogVisible: false,
      taskModel: ""
    };
  },
  props: ["tmodel"],
  watch: {
    tmodel: {
      handler(newVal) {
        if (newVal != null) {
          this.taskModel = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handlerSuccess(res, file) {
      let { flag, errMsg } = res;
      if (flag) {
        this.$refs.content.focus();
        insertContent(modelUploadDom(file, this.taskModel.modelId));
      } else {
        this.$message.error(errMsg);
      }
    },
    updateModel() {
      let me = this;
      me.taskModel.comments =
        me.taskModel.category == "COMMON" || me.taskModel.category == "COMPOSE"
          ? me.$refs.content.innerHTML
          : me.$refs.content.textContent;
      updateModel({
        modelId: me.taskModel.modelId,
        abs: me.taskModel.abs,
        comments: me.taskModel.comments,
        planDates: me.taskModel.planDates
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.dialogVisible = false;
          this.$emit("modelUpdateOk");
        }
      });
    },
    deleteModel() {
      let me = this;
      deleteModel({
        modelId: me.taskModel.modelId,
        abs: me.taskModel.abs
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.dialogVisible = false;
          this.$emit("modelUpdateOk");
        }
      });
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>

<style scoped>
.dialogLine {
  position: relative;
  margin-top: 5px;
  height: 30px;
  line-height: 30px;
  background-color: beige;
}
.dialogtitle {
  font-size: 16px;
  color: #409eff;
  position: absolute;
}
.dialogContent {
  font-size: 16px;
  position: absolute;
}
.subcontent {
  margin-bottom: 5px;
  padding: 5px;
  border: 1px solid rgb(175, 177, 179);
  border-radius: 5px;
}
.content {
  height: 200px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  overflow: auto;
}
</style>