<template>
  <div>
    <div class="header">
      <div style="margin-top:10px;">
        <span>组合模版</span>
        <el-select
          v-model="selComposeModelId"
          @change="selectOneModel"
          size="mini"
          style="width:250px;margin-left:10px;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in composeModels"
            :key="item.modelId"
            :label="item.abs"
            :value="item.modelId"
          >
            <span style="float: left">{{ item.abs }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.category }}</span>
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="mini"
          @click="createComposeTask"
          style="margin-left:10px;"
        >创建</el-button>
        <el-divider direction="vertical"></el-divider>
        <span>组合任务</span>
        <el-select
          v-model="selComposeTaskId"
          @change="selectOneTask"
          size="mini"
          style="width:250px;margin-left:10px;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in composeTasks"
            :key="item.taskId"
            :label="item.abs"
            :value="item.taskId"
            style="height:120px;"
          >
            <div
              style="border-bottom:1px solid #909399;font-weight:normal;"
              :style="{color: item.color}"
            >
              <div style="overflow:hidden;">
                <span style="float:left;">{{ item.abs }}</span>
                <span style="float:right;">{{ item.status }}</span>
              </div>
              <div style="overflow:hidden;">
                <span style="float:left;">开始时间:</span>
                <span style="float:right;">{{item.bgDt}}</span>
              </div>
              <div style="overflow:hidden;">
                <span style="float:left;">结束时间:</span>
                <span style="float:right;">{{item.edDt}}</span>
              </div>
            </div>
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="startComposeTask" style="margin-left:10px;">启动</el-button>
        <el-button
          type="primary"
          plain
          size="mini"
          @click="composeTaskReport"
          style="margin-left:10px;"
        >报告</el-button>
        <el-button
          type="danger"
          plain
          size="mini"
          @click="delComposeTask"
          style="margin-left:10px;"
        >删除</el-button>
      </div>
    </div>
    <div class="content">
      <div class="blocktagouter">
        <span class="blocktag">任务内容</span>
      </div>
      <div class="block" v-html="selComposeModel.comments"></div>
      <!-- 层次 -->
      <div v-for="(step,index) in steps" :key="index">
        <div class="blocktagouter">
          <span class="blocktag">STEP-{{step.step}}</span>
          <span class="blocksubtag">开始时间：{{step.bgDt}}</span>
          <span class="blocksubtag">结束时间：{{step.edDt}}</span>
        </div>
        <div class="block">
          <mini-com v-for="task in step.tasks" :key="task.model.modelId" :detail="task"></mini-com>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getComposeModelList,
  getComposeTaskByModel,
  saveOnceTask,
  startComposeTask,
  getTaskInCompose,
  getNotComposeModelList,
  getComposeModelDetail,
  composeReport,
  deleteComposeTask
} from "@/api/api";
import miniCom from "@/components/task/miniModelAndTaskCom.vue";
import { localDateToStr } from "@/api/util";
import { getTaskStatusById, countStepTime, composeReportUrl } from "@/api/data";
import { mapGetters } from "vuex";
import { enterScene, leaveScene } from "@/api/store_socket";

export default {
  data() {
    return {
      composeModels: [], //组合模版
      selComposeModelId: "", //选中组合模版
      composeTasks: [], //组合任务
      selComposeTaskId: "", //选中组合任务
      notComposeModels: [], //组合模版的备选子模版
      subTasks: [], //子任务
      details: [], //选中组合模版详细信息,需将子模版与子任务填进此结构。
      steps: [], //层次
      pdfUrl: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    selComposeModel() {
      let me = this;
      return (
        me.composeModels.filter(item => {
          return item.modelId == me.selComposeModelId;
        })[0] || ""
      );
    },
    selComposeTask() {
      let me = this;
      return (
        me.composeTasks.filter(item => {
          return item.taskId == me.selComposeTaskId;
        })[0] || ""
      );
    }
  },
  methods: {
    delComposeTask() {
      let me = this;
      deleteComposeTask({
        composeId: me.selComposeTaskId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.$message.success("组合任务已删除");
          me.steps = [];
          me.selComposeTaskId = "";
          me.selectOneTask();
        }
      });
    },
    composeTaskReport() {
      let me = this;
      composeReport({
        composeId: me.selComposeTaskId,
        composeTask: me.composeTasks.filter(item => {
          return item.taskId == me.selComposeTaskId;
        })[0],
        details: me.details
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.download();
        }
      });
    },
    selectOneModel: async function() {
      await this.loadComposeTasks();
    },
    loadComposeTasks() {
      return new Promise((resolve, reject) => {
        let me = this;
        getComposeTaskByModel({
          modelId: me.selComposeModel.modelId
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            data.forEach(item => {
              item.bgDt = localDateToStr(item.bgDt);
              item.edDt = localDateToStr(item.edDt);
              item.color = getTaskStatusById(item.status).iconclass.color;
            });
            me.composeTasks = data;
            resolve();
          }
        });
      });
    },
    loadNoComposeTasks() {
      return new Promise((resolve, reject) => {
        let me = this;
        getNotComposeModelList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.notComposeModels = data;
            resolve();
          }
        });
      });
    },
    loadTaskInCompose() {
      return new Promise((resolve, reject) => {
        let me = this;
        getTaskInCompose({
          composeId: me.selComposeTask.taskId
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.subTasks = data;
            me.subTasks.forEach(item => {
              item.bgDtStr = localDateToStr(item.bgDt);
              item.edDtStr = localDateToStr(item.edDt);
            });
            resolve();
          }
        });
      });
    },
    loadComposeDetail() {
      return new Promise((resolve, reject) => {
        let me = this;
        getComposeModelDetail({
          composeId: me.selComposeModel.modelId
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.details = data;
            resolve();
          }
        });
      });
    },
    selectOneTask: async function() {
      let me = this;
      //1.读取备选子模版
      await me.loadNoComposeTasks();
      //2.读取子任务
      await me.loadTaskInCompose();
      //3.读取模版详细信息
      await me.loadComposeDetail();
      //4.组合
      me.details.forEach(d => {
        me.notComposeModels.forEach(m => {
          if (d.modelId == m.modelId) {
            d.model = { ...m };
          }
        });
        me.subTasks.forEach(t => {
          if (d.modelId == t.modelId) {
            d.task = { ...t };
          }
        });
      });
      //5.初始化层
      me.steps = [];
      let stepLength = me.details.slice(-1)[0].composeLevel;
      for (let i = 0; i < stepLength; i++) {
        me.steps.push({
          step: me.steps.length + 1,
          bgDt: "",
          edDt: "",
          tasks: []
        });
      }
      me.$forceUpdate;
      //6.填充各层
      if (me.selComposeTask) {
        me.steps.forEach(step => {
          step.tasks = me.details.filter(d => {
            return d.composeLevel == step.step;
          });
        });
      }
      //7.统计各层时间
      if (me.selComposeTask) {
        me.steps.forEach(step => {
          countStepTime(step);
        });
      }
      //8.compose task状态刷新
      await me.loadComposeTasks();
      //9.再绑定处理方法,刷新有可能丢失
      enterScene([
        { scene: "CONTROLCENTER", sceneFun: this.handlerControlCenter }
      ]);
    },
    createComposeTask() {
      let me = this;
      saveOnceTask({
        modelId: me.selComposeModel.modelId,
        planDt: new Date(),
        userId: me.userInfo.userId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.$message.success("组合任务创建成功");
          me.selectOneModel();
        }
      });
    },
    startComposeTask() {
      let me = this;
      startComposeTask({
        taskId: me.selComposeTask.taskId,
        userId: me.userInfo.userId
      }).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.$message.success(
            "组合任务启动成功，创建第一层任务" + data + "个。"
          );
          me.selectOneTask();
        }
      });
    },
    loadComposeModels() {
      let me = this;
      getComposeModelList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.composeModels = data;
        }
      });
    },
    download() {
      const link = document.createElement("a"); // 创建a标签
      link.download = "report"; // a标签添加属性
      link.style.display = "none";
      link.target = "_blank";
      link.href = composeReportUrl(this.selComposeTaskId);
      document.body.appendChild(link);
      link.click(); // 执行下载
      URL.revokeObjectURL(link.href); // 释放url
      document.body.removeChild(link); // 释放标签
    },
    //处理控制中心场景数据
    handlerControlCenter(content) {
      console.info("CONTROLCENTER数据：" + content);
      this.selectOneTask();
    }
  },
  mounted() {
    this.loadComposeModels();
    //进入场景
    setTimeout(() => {
      enterScene([
        { scene: "CONTROLCENTER", sceneFun: this.handlerControlCenter }
      ]);
    }, 2000);
  },
  destroyed() {
    //退出场景
    leaveScene(["CONTROLCENTER"]);
  },
  components: {
    miniCom
  }
};
</script>

<style scoped>
.header {
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  min-height: 50px;
}

.content {
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  margin-top: 10px;
  min-height: 700px;
}

.blocktagouter {
  position: relative;
  overflow: hidden;
  margin-bottom: -18px;
  margin-top: 15px;
}

.blocktag {
  background: #ff5500;
  color: white;
  display: block;
  width: 100px;
  height: 20px;
  text-align: center;
  float: left;
}

.blocksubtag {
  background: #e4e7ed;
  color: #409eff;
  display: block;
  width: 250px;
  height: 20px;
  text-align: left;
  float: left;
  margin-left: 50px;
  padding-left: 10px;
}

.block {
  margin-top: 20px;
  border: 2px dashed #ddd;
  overflow: hidden;
  padding: 10px;
  width: 90%;
  min-height: 50px;
}
</style>