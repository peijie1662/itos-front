<template>
  <div>
    <el-dialog title="任务登记" width="520px" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <!-- 电话 -->
        <div>
          <el-input
            size="small"
            placeholder="电话"
            prefix-icon="el-icon-phone-outline"
            v-model="task.phone"
            style="width:150px;margin-bottom:10px;"
          ></el-input>
          <el-input
            size="small"
            placeholder="地点"
            prefix-icon="el-icon-location-outline"
            v-model="task.location"
            style="width:150px;margin-bottom:10px;margin-left:10px;"
          ></el-input>
          <el-input
            size="small"
            placeholder="联系人"
            prefix-icon="el-icon-s-custom"
            v-model="task.customer"
            style="width:150px;margin-bottom:10px;margin-left:10px;"
          ></el-input>
        </div>
        <!-- 内容 -->
        <div
          ref="content"
          contenteditable="true"
          class="content"
          @input="smartTips"
          @keydown="selTip($event)"
        ></div>
        <!-- 智能提示 -->
        <div
          v-show="showTips"
          ref="ts"
          style="position: absolute;background: #e7eaed;padding: 5px;"
        >
          <div
            v-for="(tip,index) in cur_tips"
            :key="index"
            :style="{border: index==cur_index?'1px solid red':''}"
          >{{tip}}</div>
        </div>
        <!-- 处理人员 -->
        <div>
          <el-select
            v-model="task.handler"
            size="small"
            multiple
            placeholder="处理人"
            style="width:250px;margin-top:10px;"
          >
            <el-option
              v-for="item in handlers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-upload
            :action="uploadUrl"
            :data="{'userId':userInfo.userId,'taskId':task.taskId}"
            :show-file-list="false"
            :on-success="handlerSuccess"
            style="float:right;margin-top:10px;"
          >
            <el-button size="small" type="primary">图文上传</el-button>
          </el-upload>
        </div>
        <!-- 按钮 -->
        <div style="overflow:hidden;margin-top:10px;">
          <el-button
            type="warning"
            size="mini"
            style="float:right;margin-left:10px;"
            @click="dialogVisible=false"
          >取消</el-button>
          <el-button type="success" size="mini" style="float:right;" @click="saveTask">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.content {
  height: 200px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  overflow: auto;
}
</style>

<script>
import { UPLOAD_TASK_URL, getSmartTipsList, addManualTask } from "@/api/api";
import { TASKHANDLERS, getTaskIconInContent, taskUploadDom } from "@/api/data";
import { insertContent, generateUUID } from "@/api/util";

export default {
  data() {
    return {
      uploadUrl: UPLOAD_TASK_URL,
      userInfo: "",
      dialogVisible: false,
      task: "",
      handlers: TASKHANDLERS,
      //智能提示
      showTips: false,
      all_tips: [],
      cur_tips: [],
      cur_index: 0
    };
  },
  props: ["ttask"],
  watch: {
    ttask: {
      handler(newVal) {
        if (newVal != null) {
          this.loadSmartTips();
          this.task = newVal;
          //提前生成UUID,因为上传图片可能要先用
          this.task.taskId = generateUUID();
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
        insertContent(taskUploadDom(file, this.task.taskId));
      } else {
        this.$message.error(errMsg);
      }
    },
    loadSmartTips() {
      let me = this;
      getSmartTipsList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.all_tips = data;
        }
      });
    },
    saveTask() {
      let me = this;
      me.task.content =
        me.task.category == "COMMON"
          ? me.$refs.content.innerHTML
          : me.$refs.content.textContent;
      let icon = getTaskIconInContent(me.$refs.content.textContent);
      addManualTask({
        taskId: me.task.taskId,
        abstract: icon.label,
        taskIcon: icon.id,
        phone: me.task.phone,
        location: me.task.location,
        customer: me.task.customer,
        content: me.task.content,
        oper: me.userInfo.userId,
        handler: me.task.handler ? me.task.handler.join(",") : ""
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.$refs.content.innerHTML = "";
          me.dialogVisible = false;
          me.$emit("taskUpdateOk");
        }
      });
    },
    selTip(e) {
      let me = this;
      if (me.showTips) {
        let ts_div = me.$refs.ts;
        ts_div.focus();
        //1.上下移动
        if (e.keyCode == 40) {
          e.preventDefault();
          if (me.cur_index < me.cur_tips.length - 1) {
            me.cur_index += 1;
          } else {
            me.cur_index = 0;
          }
        } else if (e.keyCode == 38) {
          e.preventDefault();
          if (me.cur_index > 0) {
            me.cur_index -= 1;
          } else {
            me.cur_index = me.cur_tips.length - 1;
          }
        }
        //2.选中
        if (e.keyCode == 13) {
          e.preventDefault();
          insertContent(me.cur_tips[me.cur_index]);
          me.showTips = false;
          me.smartTips();
        }
      }
    },
    smartTips() {
      let me = this;
      let content_div = me.$refs.content;
      let ts_div = me.$refs.ts;
      let content = content_div.textContent;
      me.showTips = false;
      me.cur_tips = [];
      //1.判断是否提示
      me.all_tips.forEach(item => {
        let reg = RegExp(item.preReg, "i");
        if (reg.test(content)) {
          me.cur_tips = item.nextWord;
        }
      });
      //2.提示
      if (me.cur_tips.length > 0) {
        let auxSpan = `<span id="loc"></span>`;
        insertContent(auxSpan);
        let loc = document.getElementById("loc");
        ts_div.style.top = `${loc.offsetTop + 20}px`;
        ts_div.style.left = `${loc.offsetLeft}px`;
        loc.remove();
        me.showTips = true;
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>