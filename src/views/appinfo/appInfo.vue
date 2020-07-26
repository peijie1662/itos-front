<template>
  <div>
    <div class="header">
      <el-button
        type="primary"
        size="mini"
        style="margin-left:50px;margin-top:15px;"
        @click="listAppInfo"
      >查询</el-button>
      <el-button
        type="primary"
        size="mini"
        style="margin-left:20px;margin-top:15px;"
        @click="addAppInfo"
      >添加</el-button>
    </div>
    <div class="content">
      <el-table
        :data="apps"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        border
        :default-sort="{prop: 'domain,serviceType'}"
        style="font-size:10px;"
      >
        <el-table-column type="index" width="50" label="No."></el-table-column>
        <el-table-column prop="serviceName" width="100" label="服务名" sortable></el-table-column>
        <el-table-column prop="serviceAbs" width="100" label="简介"></el-table-column>
        <el-table-column label="地址" width="150" sortable>
          <template slot-scope="scope">{{scope.row.ip}}:{{scope.row.port}}</template>
        </el-table-column>
        <el-table-column prop="serviceType" width="100" label="类型" sortable></el-table-column>
        <el-table-column prop="domain" width="80" label="区域" sortable></el-table-column>
        <el-table-column prop="serviceDesc" width="260" label="描述"></el-table-column>
        <el-table-column prop="visible" width="50" label="可见"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="updAppInfo(scope.row)"
            >修改</el-button>
            <el-popconfirm title="确定要删除该用户吗？" @onConfirm="delAppInfo(scope.row)">
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
    <new-app-info :newAppInfo="newAppInfo" @updateAppSuccess="listAppInfo"></new-app-info>
    <chg-app-info :chgAppInfo="chgAppInfo" @updateAppSuccess="listAppInfo"></chg-app-info>
  </div>
</template>

<script>
import { listAppInfo, delAppInfo } from "@/api/api";
import newAppInfo from "@/components/appinfo/newAppInfo";
import chgAppInfo from "@/components/appinfo/chgAppInfo";

export default {
  data() {
    return {
      apps: [],
      newAppInfo: null,
      chgAppInfo: null
    };
  },
  methods: {
    addAppInfo() {
      this.newAppInfo = {};
    },
    delAppInfo(row) {
      let me = this;
      delAppInfo({
        serviceId: row.serviceId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.listAppInfo();
        }
      });
    },
    updAppInfo(row) {
      this.chgAppInfo = { ...row };
    },
    listAppInfo() {
      listAppInfo({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message.error(errMsg);
        } else {
          this.apps = data;
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
    newAppInfo,
    chgAppInfo
  },
  mounted() {
    this.listAppInfo();
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