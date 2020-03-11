<template>
  <div>
    <div class="header">
      <el-button type="primary" icon="el-icon-edit"  size="middle" @click="addSmarttips">添加智能提示</el-button>
    </div>

    <div class="content">
      <el-table :data="list" border style="width: 100%">
        <el-table-column label="序号" width="150">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="preReg" label="正则表达式" width="200"></el-table-column>
        <el-table-column prop="nextWord" label="提示词" width="500"></el-table-column>

        <el-table-column label="操作" width="250">
          <template>
            <el-button type="success" icon="el-icon-edit" size="middle" @click="updateSmarttips()">修改</el-button>
            <el-button  type="danger" icon="el-icon-delete" size="middle" @click="deleteSmarttips(userinfo)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getSmartTipsList , deleteSmarttips , updateSmarttips } from "@/api/api";

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
    },
    addSmarttips() {
      
     
    },
    updateSmarttips(index, row) {
      let params = { 
        preReg: row.preReg,
        nextWord: row.nextWord,
        oper: row.oper,
        tipId: row.tipId,
      }
      updateSmarttips(params).then(res =>{
        let { flag,  errMsg } = res;
            if (!flag) {
              this.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              this.getSmartTipsList()
            }
      });
    },
    deleteSmarttips(index, row) {
        this.$confirm("是否删除此条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { tipId: row.tipId };
         deleteSmarttips(params).then(res => {
            let { flag, data, errMsg } = res;
            if (!flag) {
              this.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              this.getSmartTipsList()
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  },

  

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