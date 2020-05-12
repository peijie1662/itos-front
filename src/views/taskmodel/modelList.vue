<template>
  <div>
    <div class="header">
      <el-button @click="addModel" type="primary" size="mini">添加模版</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button @click="addGroup" type="primary" size="mini">添加分组</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button @click="expandGroup" size="mini">展开分组</el-button>
      <el-button @click="collapseGroup" size="mini">收起分组</el-button>
    </div>
    <!-- 1.未分组 -->
    <draggable
      tag="ul"
      v-model="noGpModels"
      group="{name:'mygroup'}"
      class="content"
      @change="change({models: noGpModels,groupId: ''})"
    >
      <model-com
        v-for="item in noGpModels"
        :key="item.modelId"
        class="model"
        :tmodel="item"
        @modelUpdateOk="loadData"
      ></model-com>
    </draggable>
    <!-- 2.分组 -->
    <div
      v-for="(gp,index) in gpList"
      :key="gp.groupId"
      class="group"
      :style="{'height':(gp.collapse?'100%':'22px')}"
    >
      <!-- 2.1分组标题 -->
      <div style="border:1px solid #ddd;">
        <i
          :class="[gp.collapse?'el-icon-arrow-up':'el-icon-arrow-down']"
          style="background:#409EFF;color:white;"
          @click="collapse(gp)"
        ></i>
        <el-divider direction="vertical"></el-divider>
        <span>{{gp.groupName}}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{gp.groupDesc}}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{gp.models.length}}</span>
        <i class="el-icon-close group-close-btn" @click="delGroup(gp.groupId)"></i>

        <i class="el-icon-bottom group-arrow-btn" @click="sortGroupDown(index)"></i>
        <i class="el-icon-top group-arrow-btn" @click="sortGroupUp(index)"></i>
      </div>
      <!-- 2.2组内模版 -->
      <draggable
        v-model="gp.models"
        group="{name:'mygroup'}"
        class="group-content"
        @change="change(gp)"
      >
        <model-com
          v-for="item in gp.models"
          :key="item.modelId"
          class="model"
          :tmodel="item"
          @modelUpdateOk="loadData"
        ></model-com>
      </draggable>
    </div>
    <!-- 创建模版 -->
    <new-model-com :tmodel="newModel" @modelUpdateOk="loadData"></new-model-com>
    <!-- 添加分组 -->
    <new-group-com :ngp="newGp" @groupUpdateSucess="loadData"></new-group-com>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { localDateToDate, upInArr, downInArr } from "@/api/util";
import {
  getModelList,
  getGroupList,
  delModelGroup,
  updateModelGroup,
  sortingGroup
} from "@/api/api";
import modelCom from "@/components/model/modelCom.vue";
import newModelCom from "@/components/model/newModelCom.vue";
import newGroupCom from "@/components/modelgroup/newGroupCom.vue";

export default {
  data() {
    return {
      newGp: null, //新模版
      gpList: [], //组列表,包含组内模版
      newModel: null, //新分组
      modelList: [], //模版列表
      noGpModels: [], //未分组模版
      expands: []
    };
  },
  methods: {
    sortGroupDown(index) {
      let me = this;
      downInArr(me.gpList, index);
      sortingGroup(
        me.gpList.map(item => {
          return item.groupId;
        })
      ).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        }
      });
    },
    sortGroupUp(index) {
      let me = this;
      upInArr(me.gpList, index);
      sortingGroup(
        me.gpList.map(item => {
          return item.groupId;
        })
      ).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        }
      });
    },
    saveExpands() {
      let me = this;
      me.expands = [];
      me.gpList.forEach(gp => {
        if (gp.collapse) {
          me.expands.push(gp.groupName);
        }
      });
      sessionStorage.setItem("gpexpands", JSON.stringify(me.expands));
    },
    expandGroup() {
      this.gpList.forEach(gp => {
        gp.collapse = true;
      });
      this.gpList = [...this.gpList];
      this.saveExpands();
    },
    collapseGroup() {
      this.gpList.forEach(gp => {
        gp.collapse = false;
      });
      this.gpList = [...this.gpList];
      this.saveExpands();
    },
    change(gp) {
      let me = this;
      //更新UI
      me.gpList = [...me.gpList];
      //保存数据
      let ms = gp.models.map((item, idx) => {
        return {
          modelId: item.modelId,
          groupId: gp.groupId,
          index: idx
        };
      });
      updateModelGroup({ models: ms }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        }
      });
    },
    delGroup(id) {
      let me = this;
      me.$confirm("此操作将删除该分组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delModelGroup({ groupId: id }).then(res => {
          let { flag, errMsg } = res;
          if (!flag) {
            me.$message({
              message: errMsg,
              type: "error"
            });
          } else {
            me.loadData();
          }
        });
      });
    },
    collapse(gp) {
      gp.collapse = !gp.collapse;
      this.gpList = [...this.gpList];
      this.saveExpands();
    },
    addGroup() {
      this.newGp = {};
    },
    addModel() {
      this.newModel = {};
    },
    loadData: async function() {
      let me = this;
      await me.loadModelList();
      await me.loadGroupList();
      //将模版分类到组中
      me.noGpModels = [];
      me.modelList.forEach(model => {
        let isGp = false;
        me.gpList.forEach(gp => {
          if (model.groupId == gp.groupId) {
            gp.models.push(model);
            isGp = true;
          }
        });
        if (!isGp) {
          me.noGpModels.push(model);
        }
      });
    },
    loadModelList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getModelList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            me.modelList = data;
            me.modelList.forEach(m => {
              m.startDate = localDateToDate(m.startDate);
            });
            resolve();
          }
        });
      });
    },
    loadGroupList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getGroupList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            me.gpList = data;
            me.gpList.forEach(gp => {
              gp.models = [];
              gp.collapse = me.expands.indexOf(gp.groupName) >= 0;
            });
            resolve();
          }
        });
      });
    }
  },
  mounted() {
    this.loadData();
    let expands = sessionStorage.getItem("gpexpands");
    if (expands) {
      this.expands = JSON.parse(expands);
    }
  },
  components: {
    modelCom,
    newModelCom,
    newGroupCom,
    draggable
  }
};
</script>

<style scoped>
.group {
  margin-top: 10px;
  min-height: 50px;
  overflow: hidden;
  border: 1px solid #409eff;
}

.group-close-btn {
  position: inline-block;
  float: right;
  background: #f56c6c;
  color: white;
  margin-right: 3px;
  margin-top: 2px;
}

.group-arrow-btn {
  position: inline-block;
  float: right;
  background: #ddd;
  color: white;
  margin-right: 3px;
  margin-top: 2px;
}

.group-content {
  overflow: auto;
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
  overflow: auto;
}
.model {
  float: left;
  margin: 5px;
}
.addmodel {
  font-size: 100px;
  text-shadow: 0 0 2px black;
  color: white;
  cursor: pointer;
}
.addmodelouter {
  width: 160px;
  height: 120px;
  border: 1px solid #909399;
  text-align: center;
  line-height: 120px;
  cursor: pointer;
}
.addmodelouter:hover {
  background: #409eff;
}
</style>