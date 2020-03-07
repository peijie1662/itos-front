<template>
  <div>
    <div class="header">
      <div style="margin-top:10px;">
        <el-button type="primary" size="mini">登记终端</el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="clients" :header-cell-style="headerCellStyle" :cell-style="cellStyle" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item>
                <div v-for="item in scope.row.models" :key="item.modelId" class="model">
                  <sampleModelCom :mmodel="item"></sampleModelCom>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="serviceName" label="服务名" width="120"></el-table-column>
        <el-table-column prop="description" label="描述" width="360"></el-table-column>
        <el-table-column prop="ip" label="IP" width="120"></el-table-column>
        <el-table-column prop="activeTimeStr" label="活动时间" width="160"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="updateClient(scope.$index, scope.row)"
            >修改</el-button>
            <el-popconfirm title="确定要删除该用户吗？" @onConfirm="delClient(scope.$index, scope.row)">
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
  </div>
</template>

<script>
import { getClientList, getNotComposeModelList } from "@/api/api";
import { localDateToStr } from "@/api/util";
import sampleModelCom from "@/components/sampleModelCom.vue";

export default {
  data() {
    return {
      models: [],
      clients: []
    };
  },
  methods: {
    loadData: async function() {
      let me = this;
      await me.loadNotComposeModelList();
      await me.loadClientList();
      me.clients = me.clients.map(item => {
        item.models = [];
        item.modelKey.forEach(key => {
          let ms = me.models.filter(model => {
            return model.modelId == key;
          });
          item.models = item.models.concat(ms);
        });
        item.activeTimeStr = localDateToStr(item.activeTime);
        return item;
      });
    },
    loadNotComposeModelList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getNotComposeModelList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            me.models = data;
            resolve();
          }
        });
      });
    },
    loadClientList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getClientList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            me.clients = data;
            resolve();
          }
        });
      });
    },
    delClient() {},
    updateClient() {},
    headerCellStyle() {
      return "padding:0;";
    },
    cellStyle() {
      return "padding-top:2px;padding-bottom:2px;";
    }
  },
  components: {
    sampleModelCom
  },
  mounted() {
    this.loadData();
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

.model {
  width: 120px;
  height: 100px;
  border: 1px solid #909399;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  float: left;
  margin-left: 10px;
}
</style>