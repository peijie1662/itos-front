<template>
  <div>
    <div class="header">
      <el-button @click="uploadDocument" type="primary" size="mini">上传文档</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button @click="newGroup" size="mini">文档分组</el-button>
      <el-button @click="newCategory" size="mini">文档分类</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button @click="loadData" type="primary" size="mini">刷新</el-button>
    </div>
    <div class="content">
      <el-table :data="list" :header-cell-style="headerCellStyle" :cell-style="cellStyle" border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="文件名" width="200">
          <template slot-scope="scope">
            <a
              :href="documentUrl(scope.row.fileName)"
              target="_blank"
              style="color:#606266;white-space:nowrap;"
            >{{scope.row.fileName}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="groupId" label="分组" width="150"></el-table-column>
        <el-table-column prop="category" label="分类" width="80"></el-table-column>
        <el-table-column label="简介" width="250">
          <template slot-scope="scope">
            <span style="white-space:nowrap;">{{scope.row.abs}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oper" label="上传" width="60"></el-table-column>
        <el-table-column prop="opDateStr" label="时间" width="160"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="chgDocumentInfo(scope.row)">修改</el-button>
            <el-popconfirm title="确定要删除该文档吗？" @onConfirm="delDocument(scope.row)">
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
    <!-- 上传文档 -->
    <new-document-com :newDoc="newDoc" @updateSuccess="loadData"></new-document-com>
    <!-- 新建分组 -->
    <new-group-com :newGp="newGp" @updateSuccess="loadData"></new-group-com>
    <!-- 新建分类 -->
    <new-category-com :newCg="newCg" @updateSuccess="loadData"></new-category-com>
    <!-- 修改文档 -->
    <upd-document-com :updDoc="updDoc" @updateSuccess="loadData"></upd-document-com>
  </div>
</template>

<script>
import { documentList, delDocument } from "@/api/api";
import { localDateToStr } from "@/api/util";
import { documentUrl } from "@/api/data";
import newDocumentCom from "@/components/document/newDocumentCom.vue";
import newGroupCom from "@/components/document/newGroupCom.vue";
import newCategoryCom from "@/components/document/newCategoryCom.vue";
import updDocumentCom from "@/components/document/updDocumentCom.vue";

export default {
  data() {
    return {
      newDoc: null,
      updDoc: null,
      newGp: null,
      newCg: null,
      category: "",
      list: []
    };
  },
  computed: {},
  methods: {
    documentUrl(fileName) {
      return documentUrl(fileName);
    },
    newGroup() {
      this.newGp = {};
    },
    newCategory() {
      this.newCg = {};
    },
    chgDocumentInfo(row) {
      this.updDoc = { ...row };
    },
    delDocument(row) {
      let me = this;
      delDocument({ fileName: row.fileName }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.loadData();
        }
      });
    },
    uploadDocument() {
      this.newDoc = {};
    },
    loadData() {
      documentList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          data.forEach(item => {
            item.opDateStr = localDateToStr(item.opDate);
          });
          this.list = data;
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
  mounted() {
    this.loadData();
  },
  components: {
    newDocumentCom,
    newGroupCom,
    newCategoryCom,
    updDocumentCom
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
  position: relative;
  overflow: hidden;
  min-height: 800px;
}

.bookshelf {
  border: 1px solid #ddd;
  width: 300px;
  height: 400px;
}
</style>