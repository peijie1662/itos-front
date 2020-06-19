<template>
  <div>
    <div class="header">
      <el-input placeholder="搜索PDF内容" style="width:300px;" size="mini"></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left:10px;">搜索</el-button>
      <el-divider direction="vertical"></el-divider>
    </div>
    <div class="content">
      <div class="bookshelf" v-for="(gp ,index) in gpList" :key="index">
        <div class="title">
          <span style="margin-left:10px;">{{gp.id}}</span>
        </div>
        <div>
          <div
            v-for="(book,index) in gp.books"
            :key="index"
            style="width:160px;margin:5px;float:left;overflow:hidden;"
            @click="download"
          >
            <!-- 书名 -->
            <div style="width:80px;height:100px;background:#67C23A;margin:0 auto;"></div>
            <div style="text-align: center;width:160px;">
              <a
                :href="documentUrl(book.fileName)"
                target="_blank"
                style="font-size:9px;color:#606266;white-space:nowrap;"
              >{{book.fileName}}</a>
            </div>
            <div style="text-align: center;color:darkgrey;font-size:8px;">{{book.abs}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { documentList, groupList } from "@/api/api";
import { documentUrl } from "@/api/data";

export default {
  data() {
    return {
      category: "",
      docList: [],
      gpList: []
    };
  },
  computed: {},
  methods: {
    documentUrl(fileName) {
      return documentUrl(fileName);
    },
    groupList() {
      return new Promise((resolve, reject) => {
        let me = this;
        groupList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            data.forEach(gp => {
              me.docList.forEach(doc => {
                if (gp.id == doc.groupId) {
                  gp.books = gp.books || [];
                  gp.books.push(doc);
                }
              });
            });
            me.gpList = data;
            resolve();
          }
        });
      });
    },
    documentList() {
      return new Promise((resolve, reject) => {
        let me = this;
        documentList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.docList = data;
            resolve();
          }
        });
      });
    },
    loadData: async function() {
      let me = this;
      await me.documentList();
      await me.groupList();
    }
  },
  mounted() {
    this.loadData();
  },
  components: {}
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
  min-height: 50px;
  border-radius: 10px;
  margin: 5px;
  overflow: hidden;
}

.bookshelf .title {
  height: 25px;
  color: darkgrey;
  line-height: 25px;
  font-size: 15px;
}
</style>