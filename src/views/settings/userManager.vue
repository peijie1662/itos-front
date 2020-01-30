<template>
  <div>
    <div class="header">
        <el-button type="primary" size="mini" style="margin-left:20px;" @click="getUserList">查询</el-button>
    </div>
    <div class="content">
      <el-table :data="users" :header-cell-style="headerCellStyle" :cell-style="cellStyle" border>
        <el-table-column prop="userId" label="ID" width="80"></el-table-column>
        <el-table-column prop="userName" label="姓名" width="80"></el-table-column>
        <el-table-column prop="department" label="部门" width="150"></el-table-column>
        <el-table-column prop="role" label="角色" width="80"></el-table-column>
        <el-table-column prop="phone" label="手机" width="150"></el-table-column>
        <el-table-column prop="shortPhone" label="短号" width="100"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="chg(scope.$index, scope.row)"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              @click="del(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getUserList } from "@/api/api";

export default {
  data() {
    return {
      users: []
    };
  },
  methods: {
    getUserList() {
      getUserList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$$message({
            message: errMsg,
            type: "error"
          });
        } else {
          this.users = data;
        }
      });
    },
    headerCellStyle() {
      return "padding:0;";
    },
    cellStyle() {
      return "padding-top:2px;padding-bottom:2px;";
    }
  },
  mounted(){
      this.getUserList();
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
</style>