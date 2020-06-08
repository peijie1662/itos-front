<template>
  <div>
    <div class="header">
      <div style="margin-top:10px;">
        <span>选择组合任务模版</span>
        <el-select
          v-model="selComposeModelId"
          @change="selectOneModel"
          size="mini"
          style="width:200px;margin-left:10px;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in models"
            :key="item.modelId"
            :label="item.abs"
            :value="item.modelId"
          >
            <span>{{ item.abs }}</span>
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="mini"
          @click="saveComposeModelDetail"
          style="margin-left:20px;"
        >保存</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button @click="expandStep" size="mini">展开分组</el-button>
        <el-button @click="collapseStep" size="mini">收起分组</el-button>
      </div>
    </div>
    <div class="content">
      <!-- 1.候选模版 -->
      <div>
        <span>候选模版</span>
        <el-select
          v-model="filterGp"
          @change="selectOneModel"
          size="mini"
          style="width:400px;margin-left:10px;"
          placeholder="请选择"
        >
          <el-option
            v-for="gp in gps"
            :key="gp.groupId"
            :label="gp.groupName +' - '+ gp.groupDesc"
            :value="gp.groupId"
          ></el-option>
        </el-select>
      </div>
      <draggable tag="ul" v-model="candidateModels" group="{name:'mygroup'}" class="ul">
        <li v-for="item in candidateModels" :key="item.modelId" class="li">
          <sampleModelCom :mmodel="item"></sampleModelCom>
        </li>
      </draggable>
      <!-- 2.模版层 -->
      <div v-for="(item,index) in steps" :key="index">
        <span class="blocktag" @click="collapse(item)">
          <i :class="[item.collapse?'el-icon-arrow-down':'el-icon-arrow-up']"></i>
          STEP-{{item.step}}
        </span>
        <draggable
          tag="ul"
          v-model="item.models"
          group="{name:'mygroup'}"
          class="ul"
          :style="{'height':(item.collapse?'22px':'100%')}"
        >
          <li v-for="item in item.models" :key="item.modelId" class="li">
            <sampleModelCom :mmodel="item"></sampleModelCom>
          </li>
        </draggable>
      </div>
      <!-- 3.新模版 -->
      <span class="new-blocktag" @click="addStep">新层</span>
    </div>
  </div>
</template>
 
<script>
import draggable from "vuedraggable";
import {
  getComposeModelList,
  getNotComposeModelList,
  getComposeModelDetail,
  saveComposeModelDetail,
  getGroupList
} from "@/api/api";
import sampleModelCom from "@/components/model/sampleModelCom.vue";

export default {
  data() {
    return {
      models: [],//組合模版
      selComposeModelId: "", //选中组合模版
      details: [], //模版详细信息
      oriModels: [], //原始
      candidateModels: [], //候选模版
      steps: [], //模版层次
      gps: [], //分组
      filterGp: [] //选中组
    };
  },
  methods: {
    expandStep() {
      this.steps.forEach(item => {
        item.collapse = false;
      });
      this.$forceUpdate;
    },
    collapseStep() {
      this.steps.forEach(item => {
        item.collapse = true;
      });
      this.$forceUpdate;
    },
    collapse(item) {
      item.collapse = !item.collapse;
      this.$forceUpdate;
    },
    addStep() {
      let me = this;
      me.steps.push({
        step: me.steps.length + 1,
        models: [],
        collapse: false
      });
      me.$forceUpdate;
    },
    selectOneModel: async function() {
      let me = this;
      //0.读模版分组信息
      await me.loadGroupList();
      //1.读非组合模版
      await me.loadNoComposeTasks();
      //2.读组合模版详细信息
      await me.loadComposeDetail();
      //3.生成候选模版
      me.candidateModels = me.oriModels.filter(c => {
        let notInCompose = !me.details.some(d => {
          return d.modelId == c.modelId;
        });
        if (notInCompose) {
          return (
            me.filterGp.indexOf(c.groupId) >= 0 ||
            (me.filterGp.indexOf("XXX") >= 0 && !c.groupId)
          );
        } else {
          return false;
        }
      });
      //4.初始化层
      me.steps = [];
      let stepLength =
        me.details.length > 0 ? me.details.slice(-1)[0].composeLevel : 0;
      for (let i = 0; i < stepLength; i++) {
        me.addStep();
      }
      //5.生成各层模版
      let getStep = function(step) {
        return me.details
          .filter(d => {
            return d.composeLevel == step;
          })
          .flatMap(d => {
            return me.oriModels.filter(m => {
              return d.modelId == m.modelId;
            });
          });
      };
      me.steps.forEach(item => {
        item.models = getStep(item.step);
      });
    },
    loadGroupList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getGroupList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.gps = data;
            me.gps.push({
              groupId: "XXX",
              groupName: "NOGROUP",
              groupDesc: "不分组模版"
            });
            resolve();
          }
        });
      });
    },
    loadComposeModels() {
      let me = this;
      getComposeModelList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.models = data;
        }
      });
    },
    loadComposeDetail() {
      return new Promise((resolve, reject) => {
        let me = this;
        getComposeModelDetail({
          composeId: me.selComposeModelId
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
    loadNoComposeTasks() {
      return new Promise((resolve, reject) => {
        let me = this;
        getNotComposeModelList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message.error(errMsg);
            reject();
          } else {
            me.oriModels = data;
            resolve();
          }
        });
      });
    },
    saveComposeModelDetail() {
      let me = this;
      //1.检查顺序
      for (let i = 0; i < me.steps.length; i++) {
        if (me.steps[i].models.length == 0) {
          for (let m = i + 1; m < me.steps.length; m++) {
            if (me.steps[m].models.length > 0) {
              me.$message.error("请按顺序排列模版");
              return;
            }
          }
        }
      }
      //2.设置参数
      let params = [];
      me.steps.forEach(step => {
        step.models.forEach((model, index) => {
          params.push({
            composeId: me.selComposeModelId,
            composeLevel: step.step,
            modelId: model.modelId,
            orderInLevel: index
          });
        });
      });
      //3.保存
      saveComposeModelDetail({
        composeId: me.selComposeModelId,
        details: params
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$message.error(errMsg);
        } else {
          this.$message.success("保存模版组合信息成功");
        }
      });
    }
  },
  components: {
    draggable,
    sampleModelCom
  },
  mounted() {
    this.loadComposeModels();
  }
};
</script>

<style scoped>
.blocktag {
  background: #ff5500;
  color: white;
  display: inline-block;
  width: 100px;
  height: 20px;
  text-align: center;
  cursor: pointer;
}

.new-blocktag {
  color: #cbcbcb;
  display: inline-block;
  width: 100px;
  height: 20px;
  text-align: center;
  border: 2px dashed #ddd;
}

.new-blocktag:hover {
  color: #ff5500;
  background: #bbff66;
  cursor: pointer;
}

.ul {
  margin-top: 5px;
  list-style: none;
  display: block;
  position: relative;
  border: 2px dashed #ddd;
  overflow: hidden;
  padding: 10px;
  width: 90%;
  min-height: 50px;
}

.li {
  border: 1px solid #909399;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  float: left;
  margin: 3px;
}

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
</style>