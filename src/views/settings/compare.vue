<template>
  <div>
    <div class="header">
      <el-button
        type="primary"
        size="mini"
        style="margin-left:20px;margin-top:15px;"
        @click="addCompare"
      >添加</el-button>
      <el-button
        type="primary"
        size="mini"
        style="margin-left:20px;margin-top:15px;"
        @click="loadData"
      >刷新</el-button>
    </div>
    <div class="content">
      <el-table
        :data="compares"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        border
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="比对组" prop="compareGroup" width="80"></el-table-column>
        <el-table-column label="执行终端" prop="serviceName" width="100"></el-table-column>
        <el-table-column label="路径" prop="filePath" width="200"></el-table-column>
        <el-table-column label="文件名" prop="fileName" width="100"></el-table-column>
        <el-table-column label="大小" prop="curFileSize" width="100"></el-table-column>
        <el-table-column label="修改时间" prop="curModifyTime" width="100"></el-table-column>
        <el-table-column label="刷新时间" prop="refreshDateStr" width="100"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="chgCompare(scope.row)">修改</el-button>
            <el-popconfirm title="确定要删除该比对项吗？" @onConfirm="delCompare(scope.row)">
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
    <!-- 添加比对 -->
    <new-compare-com
      :newCompare="newCompare"
      :clients="clients"
      :compareGroups="compareGroups"
      @updateSuccess="loadData"
    ></new-compare-com>
    <!-- 修改比对 -->
    <upd-compare-com
      :updCompare="updCompare"
      :clients="clients"
      :compareGroups="compareGroups"
      @updateSuccess="loadData"
    ></upd-compare-com>
  </div>
</template>

<script>
import { getCompareList, getClientList, delCompare } from "@/api/api";
import { localDateToStr } from "@/api/util";
import newCompareCom from "@/components/compare/newCompareCom.vue";
import updCompareCom from "@/components/compare/updCompareCom.vue";

export default {
  data() {
    return {
      newCompare: null,
      updCompare: null,
      compares: [],
      clients: [], //执行终端
      compareGroups: [] //比对组
    };
  },
  methods: {
    addCompare() {
      this.newCompare = {};
    },
    chgCompare(row) {
      this.updCompare = { ...row };
    },
    delCompare(row) {
      let me = this;
      delCompare({ compareId: row.compareId }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.loadData();
        }
      });
    },
    clientList() {
      let me = this;
      getClientList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.clients = data;
        }
      });
    },
    loadData() {
      let me = this;
      getCompareList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          data.forEach(item => {
            item.refreshDateStr = localDateToStr(item.refreshDate);
          });
          me.compares = data;
          let arr = data.map(item => item.compareGroup);
          me.compareGroups = [...new Set(arr)];
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
    newCompareCom,
    updCompareCom
  },
  mounted() {
    this.loadData();
    this.clientList();
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