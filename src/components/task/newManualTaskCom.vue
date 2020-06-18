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
        <!-- 智能提示标签 -->
        <div>
          <el-alert
            v-for="(tag,index) in tags"
            :key="index"
            type="success"
            @close="handleClose(tag)"
            style="margin-top:5px;white-space: pre-wrap;"
          >{{tag.name}}</el-alert>
        </div>
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
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
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

<script>
import {
  UPLOAD_TASK_URL,
  getSmartTipsList,
  addManualTask,
  machineNameAssociate,
  getUserList
} from "@/api/api";
import { getTaskIconInContent, taskUploadDom } from "@/api/data";
import { insertContent, generateUUID } from "@/api/util";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      uploadUrl: UPLOAD_TASK_URL,
      dialogVisible: false,
      task: "",
      handlers: [],
      //智能提示
      showTips: false,
      all_tips: [],
      cur_tips: [],
      cur_index: 0,
      tags: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
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
          this.task.handler = [this.userInfo.userId];
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
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
    machineNameAssociate(machineName) {
      let me = this;
      let tagExist = me.tags.some(item => {
        return item.name.split(",")[0] == machineName;
      });
      if (!tagExist) {
        machineNameAssociate({
          machineName
        }).then(res => {
          let { flag, data } = res;
          if (flag) {
            //不要重复加入提示
            let hasItem = me.tags.some(item => {
              return item.name.indexOf(machineName) >= 0;
            });
            let m = machineName.toUpperCase();
            if (!hasItem) {
              if (
                (m.startsWith("H") ||
                  m.startsWith("F-H") ||
                  m.startsWith("D") ||
                  m.startsWith("F-D") ||
                  m.startsWith("P") ||
                  m.startsWith("F-P")) &&
                !m.startsWith("DGJ")
              ) {
                me.tags.push({
                  name:
                    "设备:" +
                    data.machineName +
                    "     用户:" +
                    data.userName +
                    "     位置:" +
                    data.location +
                    "\n型号:" +
                    data.modelName +
                    "     IP:" +
                    data.ip,
                  type: "success"
                });
              } else {
                me.tags.push({
                  name:
                    "设备:" +
                    data.machineName +
                    "     司机:" +
                    data.driverName +
                    "     电话:" +
                    data.driverPhone +
                    "\nIP:" +
                    data.machineIp +
                    "     编号:" +
                    data.machineNo,
                  type: "success"
                });
              }
            }
          }
        });
      }
    },
    saveTask() {
      let me = this;
      me.task.content = me.$refs.content.innerHTML;
      //在内容中加入提示
      let tagHtml = "";
      me.tags.forEach(item => {
        tagHtml +=
          "<div style ='width:70%;font-size:8px;color:gray;white-space: pre-wrap;border:1px dashed gray;margin:5px;'>" +
          item.name +
          "</div>";
      });
      let icon = getTaskIconInContent(me.task.content);
      addManualTask({
        taskId: me.task.taskId,
        abstract: icon.label,
        taskIcon: icon.id,
        phone: me.task.phone,
        location: me.task.location,
        customer: me.task.customer,
        content: me.task.content + tagHtml,
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
          me.task.taskId = generateUUID(); //这里ID要改变，否则再触发就重复了
          me.$emit("taskUpdateOk");
        }
        me.tags = [];
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
        let matchs = reg.exec(content);
        if (matchs) {
          me.cur_tips = item.nextWord;
          me.machineNameAssociate(matchs[0].toUpperCase());
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
    },
    loadUserList() {
      let me = this;
      getUserList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.handlers = data;
        }
      });
    }
  },
  mounted() {
    this.loadUserList();
  }
};
</script>

<style scoped>
.tags {
  height: 50px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  overflow: auto;
  margin-bottom: 10px;
}

.content {
  height: 200px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  overflow: auto;
}
</style>