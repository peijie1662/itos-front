<template>
  <div>
    <div class="header">
      <el-button type="primary" size="mini" style="margin-left:20px;" @click="getUserList">查询</el-button>
      <el-button type="primary" size="mini" style="margin-left:20px;" @click="addUser">添加</el-button>
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
              @click="chgUserContent(scope.$index, scope.row)"
            >修改</el-button>
            <el-button
              type="warning"
              plain
              size="mini"
              @click="setAuthority(scope.$index, scope.row)"
            >权限</el-button>
            <el-popconfirm title="确定要删除该用户吗？" @onConfirm="delUser(scope.$index, scope.row)">
              <el-button
                type="danger"
                plain
                size="mini"
                slot="reference"
                style="margin-left:10px;"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AuthorityCom :user="authorityUser" @updateUserSuccess="getUserList"></AuthorityCom>
    <UserCom :user="contentUser" @updateUserSuccess="getUserList"></UserCom>
    <NewUserCom :user="newUser" @updateUserSuccess="getUserList"></NewUserCom>
  </div>
</template>

<script>
import { getUserList, delUser } from "@/api/api";
import AuthorityCom from "@/components/authorityCom.vue";
import UserCom from "@/components/userCom.vue";
import NewUserCom from "@/components/newUserCom.vue";

export default {
  data() {
    return {
      users: [],
      authorityUser: null,
      contentUser: null,
      newUser: null
    };
  },
  methods: {
    addUser(){
      this.newUser = {}; 
    },
    delUser(index) {
      let me = this;
      delUser({
        userId: me.users[index].userId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.getUserList();
        }
      });
    },
    setAuthority(index) {
      this.authorityUser = { ...this.users[index] };
    },
    chgUserContent(index) {
      this.contentUser = { ...this.users[index] };
    },
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
  components: {
    AuthorityCom,
    UserCom,
    NewUserCom
  },
  mounted() {
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