<template>
  <div>
    <div class="header">
      <div
        style="width:350px;margin-top:20px;margin-left:20px;border-right: 2px solid #c0c4cc;float:left;"
      >
        <el-checkbox v-model="selAdmin" @change="filter">管理员</el-checkbox>
        <el-checkbox v-model="selSd" @change="filter">胜达同事</el-checkbox>
        <el-checkbox v-model="selNbct" @change="filter">NBCT同事</el-checkbox>
      </div>
      <el-button
        type="primary"
        size="mini"
        style="margin-left:50px;margin-top:15px;"
        @click="getUserList"
      >查询</el-button>
      <el-button
        type="primary"
        size="mini"
        style="margin-left:20px;margin-top:15px;"
        @click="addUser"
      >添加</el-button>
    </div>
    <div class="content">
      <el-table
        :data="finUsers"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        border
      >
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
              @click="chgUserContent(scope.row)"
            >修改</el-button>
            <el-button
              type="warning"
              plain
              size="mini"
              @click="setAuthority(scope.row)"
            >权限</el-button>
            <el-button
              type="warning"
              plain
              size="mini"
              @click="setSubscription(scope.row)"
            >短信</el-button>
            <el-popconfirm title="确定要删除该用户吗？" @onConfirm="delUser(scope.row)">
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
    <subscription-com :user="subUser" @updateUserSuccess="getUserList"></subscription-com>
  </div>
</template>

<script>
import { getUserList, delUser } from "@/api/api";
import AuthorityCom from "@/components/user/authorityCom.vue";
import UserCom from "@/components/user/userCom.vue";
import NewUserCom from "@/components/user/newUserCom.vue";
import subscriptionCom from "@/components/user/subscriptionCom.vue";

export default {
  data() {
    return {
      selSd: true,
      selNbct: true,
      selAdmin: true,
      users: [],
      finUsers: [],
      authorityUser: null,
      contentUser: null,
      newUser: null,
      subUser: null
    };
  },
  methods: {
    filter() {
      let me = this;
      me.finUsers = me.users.filter(item => {
        return (
          (me.selAdmin && item.role == "ADMIN") ||
          (me.selSd && item.department == "SD") ||
          (me.selNbct && item.department == "NBCT")
        );
      });
    },
    addUser() {
      this.newUser = {};
    },
    delUser(row) {
      let me = this;
      delUser({
        userId: row.userId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.getUserList();
        }
      });
    },
    setAuthority(row) {
      this.authorityUser = { ...row };
    },
    setSubscription(row) {
      this.subUser = { ...row };
    },
    chgUserContent(row) {
      this.contentUser = { ...row };
    },
    getUserList() {
      getUserList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message.error(errMsg);
        } else {
          this.users = data;
          this.filter();
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
    NewUserCom,
    subscriptionCom
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