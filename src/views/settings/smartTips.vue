<template>
  <div>
    <div class="header">
      <el-button size="small" @click="addSmarttips()">新增</el-button>
    </div>

    <div class="content">
      <el-table :data="list" border style="width: 100%">
        <el-table-column label="序号" width="150">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="preReg" label="正则表达式" width="200"></el-table-column>
        <el-table-column prop="nextWord" label="提示词" width="200"></el-table-column>

        <el-table-column label="操作" width="150">
          <template>
            <el-button size="small" @click="addSmarttips()">新增</el-button>
            <el-button size="small" @click="addSmarttips()">新增</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getSmartTipsList } from "@/api/api";

export default {
  data() {
    return {
      userinfo: "",
      list: []
    };
  },
  methods: {
    getSmartTipsList() {
      let params = { oper: this.userinfo.userId };
      getSmartTipsList(params).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$$message({
            message: errMsg,
            type: "error"
          });
        } else {
          this.list = data;
        }
      });
    }
  },

  addSmarttips() {},
  deleteSmarttips() {},
  updateSmarttips() {},

  components: {},
  mounted() {
    this.getSmartTipsList();
    this.userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>

<style scoped>
.header {
  position: relative;
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  min-height: 50px;
}

.content {
  position: relative;
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  min-height: 680px;
  margin-top: 10px;
}

.task {
  width: 70%;
  padding: 5px;
  margin-bottom: 10px;
  background: white;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  box-shadow: 2px 2px 3px #909399;
}
</style>