<template>
  <div>
    <div class="header">
      <el-button 
        style="margin-left:20px;margin-top:15px;"
        type="primary" 
        icon="el-icon-edit" 
        size="mini" 
        @click="addSmarttips"
      >添加智能提示</el-button>
    </div>

    <div class="content">
      <el-table :data="list" border style="width: 100%">
        <el-table-column label="序号" width="50" type="index"> </el-table-column>
        <el-table-column prop="preReg" label="正则表达式" width="200"></el-table-column>
        <el-table-column prop="nextWordStr" label="提示词" width="500"></el-table-column>

        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="updateSmarttips(scope.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteSmarttips(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <updateSmartTip :utip="utip" @tipUpdateSucess="getSmartTipsList"></updateSmartTip>
    <addSmartTips :ntip="ntip" @tipUpdateSucess="getSmartTipsList"></addSmartTips>
  </div>
</template>

<script>
import { getSmartTipsList, deleteSmarttips } from "@/api/api";
import updateSmartTip from "@/components/smarttip/updateSmartTip";
import addSmartTips from "@/components/smarttip/addSmartTips";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [],
      utip: null,
      ntip: null
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    getSmartTipsList() {
      getSmartTipsList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          this.list = data;
          this.list.forEach(item => {
            item.nextWordStr = item.nextWord.join(" ");
          });
        }
      });
    },
    addSmarttips() {
      this.ntip = {};
    },
    updateSmarttips(row) {
      this.utip = { ...row };
    },
    deleteSmarttips(row) {
      this.$confirm("是否删除此条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { tipId: row.tipId };
          deleteSmarttips(params).then(res => {
            let { flag, errMsg } = res;
            if (!flag) {
              this.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              this.getSmartTipsList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  components: {
    updateSmartTip,
    addSmartTips
  },
  mounted() {
    this.getSmartTipsList();
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