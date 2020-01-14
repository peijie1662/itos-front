<template>
  <div>
    <el-dialog title="任务模版" width="500px" :visible.sync="dialogVisible">
      <div>
        <!-- 详情内容 -->
        <div class="subcontent">
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
          >
            <el-button size="mini" type="primary">上传文档</el-button>
          </el-upload>
          <!-- 执行时间 -->
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">执行时间</span>
          </div>
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="taskModel.planDates"
            ></el-input>
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
import { updateModel, deleteModel, STATIC_URL, UPLOAD_MODEL_URL } from "@/api/api";
import { insertContent } from "@/api/util";

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
        let url =
          STATIC_URL +
          "model_file" +
          "/" +
          this.taskModel.modelId +
          "/" +
          file.name;
        let fileUrl = `<a href=${url}>${file.name}</a>`;
        insertContent(fileUrl);
      } else {
        this.$message.error(errMsg);
      }
    },
    updateModel() {
      let me = this;
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
</style>