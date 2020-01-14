<template>
  <div>
    <div class="header"></div>
    <div class="content">
      <!-- 增加模版 -->
      <div class="addmodelouter model" @click="addModel">
        <span class="addmodel">+</span>
      </div>
      <modelCom
        v-for="(item,index) in modellist"
        :key="index"
        class="model"
        :tmodel="item"
        @modelUpdateOk="loadData"
      ></modelCom>
    </div>
    <!-- 创建模版  -->
    <newModelCom :tmodel="newModel" @modelUpdateOk="loadData"></newModelCom>
  </div>
</template>

<script>
import { getModelList } from "@/api/api";
import modelCom from "@/components/modelCom.vue";
import newModelCom from "@/components/newModelCom.vue";

export default {
  data() {
    return {
      newModel: null,
      modellist: []
    };
  },
  methods: {
    addModel() {
      this.newModel = {};
    },
    loadData() {
      let me = this;
      getModelList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.modellist = data;
        }
      });
    }
  },
  mounted() {
    this.loadData();
  },
  components: {
    modelCom,
    newModelCom
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
.model {
  float: left;
  margin: 10px;
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