<template>
  <div>
    <el-dialog title="任务模版" width="500px" :visible.sync="dialogVisible">
      <div>
        <!-- 详情内容 -->
        <div class="subcontent">
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">任务类型</span>
            <el-select
              v-model="taskModel.category"
              size="mini"
              style="left:120px;width:250px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in categorys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">执行周期</span>
            <el-select
              v-model="taskModel.cycle"
              size="mini"
              style="left:120px;width:250px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in cycles"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">任务简介</span>
            <el-input
              v-model="taskModel.abs"
              placeholder="请输入内容"
              size="mini"
              style="left:120px;width: 250px;"
            ></el-input>
          </div>
          <!-- 任务内容 -->
          <div class="dialogLine">
            <span class="dialogtitle" style="left:20px;">任务内容</span>
          </div>
          <div ref="content" contenteditable="true" class="content"></div>
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
          <el-button type="success" size="mini" style="float:right;" @click="saveModel">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { STATIC_URL, UPLOAD_MODEL_URL, addModel } from "@/api/api";
import { CATEGORYS, CYCLES } from "@/api/data";
import { insertContent, generateUUID } from "@/api/util";

export default {
  data() {
    return {
      uploadUrl: UPLOAD_MODEL_URL,
      userInfo: "",
      categorys: CATEGORYS,
      cycles: CYCLES,
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
          this.taskModel.modelId = generateUUID();
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
    saveModel() {
      let me = this;
      me.taskModel.comments = me.$refs.content.innerHTML;
      addModel({ ...me.taskModel }).then(res => {
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

.content {
  height: 200px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  overflow: auto;
}

.subcontent {
  margin-bottom: 5px;
  padding: 5px;
  border: 1px solid rgb(175, 177, 179);
  border-radius: 5px;
}
</style>