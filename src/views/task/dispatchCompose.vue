<template>
  <div>
    <div class="header">
      <span>选择组合任务模版</span>
      <el-select v-model="selModel" size="mini" style="left:120px;width:250px;" placeholder="请选择">
        <el-option
          v-for="item in models"
          :key="item.modelId"
          :label="item.abs"
          :value="item.modelId"
        >
          <span style="float: left">{{ item.abs }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.category }}</span>
        </el-option>
      </el-select>
    </div>
    <div class="content">
      <!-- 模版列表 -->
      <draggable tag="ul" v-model="listdata" group="{name:'mygroup'}" class="ul">
        <li v-for="item in listdata" :key="item.id" class="li">{{item.name}}</li>
      </draggable>
      <!-- 调用组件 -->
      <draggable tag="ul" v-model="selList" group="{name:'mygroup'}" class="ul">
        <li v-for="item in selList" :key="item.id" class="li">{{item.name}}</li>
      </draggable>
    </div>
  </div>
</template>
 
<script>
import draggable from "vuedraggable";
import { getComposeModelList } from "@/api/api";

export default {
  name: "draggabletest",
  components: {
    draggable
  },
  data() {
    return {
      models: [],
      selModel: "",
      listdata: [
        {
          id: 1,
          name: "叶落森1"
        },
        {
          id: 2,
          name: "叶落森2"
        },
        {
          id: 3,
          name: "叶落森3"
        },
        {
          id: 4,
          name: "叶落森4"
        },
        {
          id: 5,
          name: "叶落森5"
        }
      ],
      selList: [
        {
          id: 6,
          name: "叶落森6"
        },
        {
          id: 7,
          name: "叶落森7"
        }
      ]
    };
  },
  methods: {
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
    }
  },
  mounted() {
    this.loadComposeTasks();
  }
};
</script>

<style scoped>
.ul {
  list-style: none;
  display: block;
  position: relative;
  margin-top: 20px;
  margin-left: 50px;
  border: 2px dashed #409eff;
  overflow: hidden;
  padding: 10px;
}

.li {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  float: left;
  margin-left: 20px;
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