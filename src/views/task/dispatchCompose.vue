<template>
  <div>
    <div class="header">
      <div style="margin-top:10px;">
        <span>选择组合任务模版</span>
        <el-select
          v-model="selComposeModel"
          @change="selectOneModel"
          size="mini"
          style="width:250px;margin-left:10px;"
          placeholder="请选择"
        >
          <el-option v-for="item in models" :key="item.modelId" :label="item.abs" :value="item">
            <span style="float: left">{{ item.abs }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.category }}</span>
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
      <span class="blocktag">候选模版</span>
      <draggable tag="ul" v-model="candidateModels" group="{name:'mygroup'}" class="ul">
        <li v-for="item in candidateModels" :key="item.modelId" class="li">
          <div style="position:relative;height:100%;text-align:center;">
            <div :style="topTriangleStyle(item)"></div>
            <span>{{item.abs}}</span>
            <div :style="bottomTriangleStyle(item)"></div>
          </div>
        </li>
      </draggable>
      <!-- STEP01 -->
      <span class="blocktag">STEP-1</span>
      <draggable tag="ul" v-model="step01" group="{name:'mygroup'}" class="ul">
        <li v-for="item in step01" :key="item.modelId" class="li">
          <div style="position:relative;height:100%;text-align:center;">
            <div :style="topTriangleStyle(item)"></div>
            <span>{{item.abs}}</span>
            <div :style="bottomTriangleStyle(item)"></div>
          </div>
        </li>
      </draggable>
      <!-- STEP02 -->
      <span class="blocktag">STEP-2</span>
      <draggable tag="ul" v-model="step02" group="{name:'mygroup'}" class="ul">
        <li v-for="item in step02" :key="item.modelId" class="li">
          <div style="position:relative;height:100%;text-align:center;">
            <div :style="topTriangleStyle(item)"></div>
            <span>{{item.abs}}</span>
            <div :style="bottomTriangleStyle(item)"></div>
          </div>
        </li>
      </draggable>
      <!-- STEP03 -->
      <span class="blocktag">STEP-3</span>
      <draggable tag="ul" v-model="step03" group="{name:'mygroup'}" class="ul">
        <li v-for="item in step03" :key="item.modelId" class="li">
          <div style="position:relative;height:100%;text-align:center;">
            <div :style="topTriangleStyle(item)"></div>
            <span>{{item.abs}}</span>
            <div :style="bottomTriangleStyle(item)"></div>
          </div>
        </li>
      </draggable>
    </div>
  </div>
</template>
 
<script>
import draggable from "vuedraggable";
import { getCategoryColor } from "@/api/data";
import {
  getComposeModelList,
  getNotComposeModelList,
  getComposeModelDetail,
  saveComposeModelDetail
} from "@/api/api";

export default {
  data() {
    return {
      models: [],
      selComposeModel: "", //选中组合模版
      details: [], //模版详细信息
      oriModels: [], //原始
      candidateModels: [], //候选模版
      step01: [], //第1层次模版
      step02: [], //第2层次模版
      step03: [] //第3层次模版
    };
  },
  methods: {
    topTriangleStyle(model) {
      let mstyle = {
        width: "0",
        height: "0",
        borderTop: "30px solid red",
        borderRight: "30px solid transparent",
        borderTopRadius: "5px"
      };
      if (model.invalid) {
        mstyle.borderTop = "30px solid " + getCategoryColor(null);
      } else {
        mstyle.borderTop = "30px solid " + getCategoryColor(model.category);
      }
      return mstyle;
    },
    bottomTriangleStyle(model) {
      let mstyle = {
        width: "0",
        height: "0",
        borderBottom: "30px solid red",
        borderLeft: "30px solid transparent",
        position: "absolute",
        bottom: "0px",
        right: "0px"
      };
      if (model.invalid) {
        mstyle.borderBottom = "30px solid " + getCategoryColor(null);
      } else {
        mstyle.borderBottom = "30px solid " + getCategoryColor(model.category);
      }
      return mstyle;
    },
    selectOneModel: async function() {
      let me = this;
      //1.读非组合模版
      await me.loadNoComposeTasks();
      //2.读组合模版详细信息
      await me.loadComposeDetail();
      //3.生成候选模版
      me.candidateModels = me.oriModels.filter(c => {
        return !me.details.some(d => {
          return d.modelId == c.modelId;
        });
      });
      //4.生成各层模版
      me.step01 = me.oriModels.filter(c => {
        return me.details.some(d => {
          return d.modelId == c.modelId && d.composeLevel == 1;
        });
      });
      me.step02 = me.oriModels.filter(c => {
        return me.details.some(d => {
          return d.modelId == c.modelId && d.composeLevel == 2;
        });
      });
      me.step03 = me.oriModels.filter(c => {
        return me.details.some(d => {
          return d.modelId == c.modelId && d.composeLevel == 3;
        });
      });
    },
    loadComposeTasks() {
      let me = this;
      getComposeModelList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.models = data;
        }
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
            this.$message({
              message: errMsg,
              type: "error"
            });
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
            this.$message({
              message: errMsg,
              type: "error"
            });
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
      if ((l1 == 0 && (l2 > 0 || l3 > 0)) || (l2 == 0 && l3 > 0)) {
        me.$message({
          message: "请按顺序排列模版。",
          type: "error"
        });
        return;
      }
      let params = [];
      if (l1 > 0) {
        me.step01.forEach(item => {
          params.push({
            composeId: me.selComposeModel.modelId,
            composeLevel: 1,
            modelId: item.modelId
          });
        });
      }
      if (l2 > 0) {
        me.step02.forEach(item => {
          params.push({
            composeId: me.selComposeModel.modelId,
            composeLevel: 2,
            modelId: item.modelId
          });
        });
      }
      if (l3 > 0) {
        me.step03.forEach(item => {
          params.push({
            composeId: me.selComposeModel.modelId,
            composeLevel: 3,
            modelId: item.modelId
          });
        });
      }
      saveComposeModelDetail({
        composeId: me.selComposeModel.modelId,
        details: params
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          this.$message({
            message: "保存模版组合信息成功。",
            type: "success"
          });
        }
      });
    }
  },
  components: {
    draggable
  },
  mounted() {
    this.loadComposeTasks();
  }
};
</script>

<style scoped>
.blocktag {
  background: #909399;
  color: white;
  display: block;
  width: 100px;
  height: 20px;
  text-align: center;
  margin-bottom: -15px;
}

.ul {
  list-style: none;
  display: block;
  position: relative;
  margin-top: 20px;
  border: 2px dashed #409eff;
  overflow: hidden;
  padding: 10px;
  min-height: 100px;
}

.li {
  width: 120px;
  height: 100px;
  border: 1px solid #909399;
  position: relative;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  float: left;
  margin-left: 10px;
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