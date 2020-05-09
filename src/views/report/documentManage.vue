<template>
  <div>
    <div class="header">
      <el-button @click="uploadDocument" type="primary" size="mini">上传文档</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button @click="newGroup" type="primary" size="mini">新文件夹</el-button>
      <el-divider direction="vertical"></el-divider>
    </div>
    <div>
      <!-- 1.未分组 -->
      <draggable
        tag="ul"
        v-model="rootFns"
        group="{name:'mygroup'}"
        @end="change"
        class="content"
        id="root"
      >
        <document-com
          v-for="(item,index) in rootFns"
          :key="index"
          :bk="item"
          class="book"
          :id="item"
        ></document-com>
      </draggable>
      <!-- 2.分组 -->
      <div
        v-for="(gp,index) in groups"
        :key="index"
        class="group"
        :style="{'height':(gp.collapse?'100%':'22px')}"
      >
        <!-- 2.1分组标题 -->
        <div style="border:1px solid #ddd;">
          <i
            :class="[gp.collapse?'el-icon-arrow-up':'el-icon-arrow-down']"
            style="background:#409EFF;color:white;"
            @click="collapse(gp)"
          ></i>
          <el-divider direction="vertical"></el-divider>
          <span>{{gp.group}}</span>
          <i class="el-icon-close group-close-btn" @click="delGroup(gp.groupId)"></i>
        </div>
        <!-- 2.2组内模版 -->
        <draggable
          v-model="gp.fns"
          group="{name:'mygroup'}"
          class="group-content"
          @end="change"
          :id="gp.group"
        >
          <document-com
            v-for="(item,index) in gp.fns"
            :key="index"
            class="book"
            :bk="item"
            :id="item"
          ></document-com>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import { getDocumentList, moveDocument } from "@/api/api";
import draggable from "vuedraggable";
import documentCom from "@/components/report/documentCom.vue";

export default {
  data() {
    return {
      rootFns: [], //未分组文件
      groups: [] //分组
    };
  },
  methods: {
    change(e) {
      console.info(e);

      let from = e.from.id;
      let to = e.to.id;
      let item = e.clone.id;
      //源目录与目标目录不同
      if (from != to) {
        let me = this;
        moveDocument({ from, to, item }).then(res => {
          let { flag, errMsg } = res;
          if (!flag) {
            me.$message({
              message: errMsg,
              type: "error"
            });
          } else {
            me.loadDocuments();
          }
        });
      }
    },
    loadDocuments() {
      let me = this;
      getDocumentList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.groups = []
          data.forEach(item => {
            if (item.group == "root_files") {
              me.rootFns = item.fns;
            } else {
              me.groups.push(item);
            }
          });
        }
      });
    },
    uploadDocument() {},
    newGroup() {},
    collapse(gp) {
      gp.collapse = !gp.collapse;
      this.groups = [...this.groups];
    }
  },
  mounted() {
    this.loadDocuments();
  },
  components: {
    draggable,
    documentCom
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
}

.group {
  margin-top: 10px;
  min-height: 100px;
  overflow: hidden;
  border: 1px solid #409eff;
}

.group-close-btn {
  position: inline-block;
  float: right;
  background: #f56c6c;
  color: white;
  margin-right: 3px;
  margin-top: 2px;
}

.group-content {
  overflow: auto;
}

.book {
  float: left;
  margin: 10px;
}
</style>