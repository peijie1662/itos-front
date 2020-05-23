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
          style="margin-left:50px;"
        >保存</el-button>
      </div>
    </div>
    <div class="content">
      <!-- 候选模版 -->
      <div>
        <span >候选模版</span>
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
      <!-- STEP01 -->
      <span class="blocktag">STEP-1</span>
      <draggable tag="ul" v-model="step01" group="{name:'mygroup'}" class="ul">
        <li v-for="item in step01" :key="item.modelId" class="li">
          <sampleModelCom :mmodel="item"></sampleModelCom>
        </li>
      </draggable>
      <!-- STEP02 -->
      <span class="blocktag">STEP-2</span>
      <draggable tag="ul" v-model="step02" group="{name:'mygroup'}" class="ul">
        <li v-for="item in step02" :key="item.modelId" class="li">
          <sampleModelCom :mmodel="item"></sampleModelCom>
        </li>
      </draggable>
      <!-- STEP03 -->
      <span class="blocktag">STEP-3</span>
      <draggable tag="ul" v-model="step03" group="{name:'mygroup'}" class="ul">
        <li v-for="item in step03" :key="item.modelId" class="li">
          <sampleModelCom :mmodel="item"></sampleModelCom>
        </li>
      </draggable>
      <!-- STEP04 -->
      <span class="blocktag">STEP-4</span>
      <draggable tag="ul" v-model="step04" group="{name:'mygroup'}" class="ul">
        <li v-for="item in step04" :key="item.modelId" class="li">
          <sampleModelCom :mmodel="item"></sampleModelCom>
        </li>
      </draggable>
      <!-- STEP05 -->
      <span class="blocktag">STEP-5</span>
      <draggable tag="ul" v-model="step05" group="{name:'mygroup'}" class="ul">
        <li v-for="item in step05" :key="item.modelId" class="li">
          <sampleModelCom :mmodel="item"></sampleModelCom>
        </li>
      </draggable>
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
      models: [],
      selComposeModelId: "", //选中组合模版
      details: [], //模版详细信息
      oriModels: [], //原始
      candidateModels: [], //候选模版
      step01: [], //第1层次模版
      step02: [], //第2层次模版
      step03: [], //第3层次模版
      step04: [], //第4层次模版
      step05: [], //第5层次模版
      //
      gps: [], //分组
      filterGp: [] //选中组
    };
  },
  methods: {
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
      //4.生成各层模版
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
      me.step01 = getStep(1);
      me.step02 = getStep(2);
      me.step03 = getStep(3);
      me.step04 = getStep(4);
      me.step05 = getStep(5);
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
      let l1 = me.step01.length;
      let l2 = me.step02.length;
      let l3 = me.step03.length;
      let l4 = me.step04.length;
      let l5 = me.step05.length;
      if (
        (l1 == 0 && l2 + l3 + l4 + l5 > 0) ||
        (l2 == 0 && l3 + l4 + l5 > 0) ||
        (l3 == 0 && l4 + l5 > 0) ||
        (l4 == 0 && l5 > 0)
      ) {
        me.$message.error("请按顺序排列模版");
        return;
      }
      let params = [];
      if (l1 > 0) {
        me.step01.forEach((item, index) => {
          params.push({
            composeId: me.selComposeModelId,
            composeLevel: 1,
            modelId: item.modelId,
            orderInLevel: index
          });
        });
      }
      if (l2 > 0) {
        me.step02.forEach((item, index) => {
          params.push({
            composeId: me.selComposeModelId,
            composeLevel: 2,
            modelId: item.modelId,
            orderInLevel: index
          });
        });
      }
      if (l3 > 0) {
        me.step03.forEach((item, index) => {
          params.push({
            composeId: me.selComposeModelId,
            composeLevel: 3,
            modelId: item.modelId,
            orderInLevel: index
          });
        });
      }
      if (l4 > 0) {
        me.step04.forEach((item, index) => {
          params.push({
            composeId: me.selComposeModelId,
            composeLevel: 4,
            modelId: item.modelId,
            orderInLevel: index
          });
        });
      }
      if (l5 > 0) {
        me.step05.forEach((item, index) => {
          params.push({
            composeId: me.selComposeModelId,
            composeLevel: 5,
            modelId: item.modelId,
            orderInLevel: index
          });
        });
      }
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
  display: block;
  width: 100px;
  height: 20px;
  text-align: center;
}

.ul {
  margin-top: 5px;
  list-style: none;
  display: block;
  position: relative;
  border: 2px dashed #409eff;
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