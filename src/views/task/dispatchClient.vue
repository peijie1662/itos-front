<template>
  <div>
    <div class="header">
      <div style="margin-top:10px;">
        <el-button type="primary" size="mini" @click="addClient">登记</el-button>
        <el-button type="primary" size="mini" @click="loadData">刷新</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-cascader
          v-model="qryModelKey"
          :options="gpOpt"
          :props="{ expandTrigger: 'hover',emitPath:false }"
          @change="handleQryModelKey"
          size="mini"
          placeholder="选择任务KEY"
          clearable
          style="width:400px;"
        ></el-cascader>
      </div>
    </div>
    <div class="content">
      <el-table
        :data="clients"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        border
        :row-key="getRowKeys"
        :expand-row-keys="expands"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item expanded="true">
                <div v-for="item in scope.row.models" :key="item.modelId" class="model">
                  <sample-model-com
                    :mmodel="item"
                    :style="item.modelId == qryModelKey?'background:yellow':'background:white'"
                  ></sample-model-com>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="服务名" width="150">
          <template slot-scope="scope">
            <i class="el-icon-sunny" style="color:green;" v-if="scope.row.onLine"></i>
            <i class="el-icon-moon" style="color:#F56C6C;" v-else></i>
            <span style="margin-left:5px;">{{scope.row.serviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="360"></el-table-column>
        <el-table-column prop="ip" label="IP" width="120"></el-table-column>
        <el-table-column prop="activeTimeStr" label="活动时间" width="160"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="chgClient(scope.$index)">修改</el-button>
            <el-popconfirm title="确定要删除该终端吗？" @onConfirm="delClient(scope.row)">
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
      <!-- 登记终端 -->
      <newClientCom :nclient="newClient" :mmodel="models" @updateClientSuccess="loadData"></newClientCom>
      <!-- 修改终端 -->
      <updateClientCom :uclient="updateClient" :gps="gpList" @updateClientSuccess="loadData"></updateClientCom>
    </div>
  </div>
</template>

<script>
import {
  getClientList,
  getNotComposeModelList,
  deleteClient,
  serverReloadClient,
  getGroupList
} from "@/api/api";
import { localDateToStr, arrDeepCopy } from "@/api/util";
import sampleModelCom from "@/components/model/sampleModelCom";
import newClientCom from "@/components/client/newClientCom";
import updateClientCom from "@/components/client/updateClientCom";

export default {
  data() {
    return {
      newClient: null,
      updateClient: null,
      models: [],
      clients: [],
      gpList: [],
      gpOpt: [],
      qryModelKey: "",
      expands: []
    };
  },
  methods: {
    getRowKeys(row) {
      return row.serviceName;
    },
    handleQryModelKey() {
      let me = this;
      me.expands = [];
      me.clients.forEach(client => {
        if (client.modelKey.indexOf(me.qryModelKey) >= 0) {
          me.expands.push(client.serviceName);
        }
      });
    },
    addClient() {
      this.newClient = {};
    },
    delClient(row) {
      let me = this;
      deleteClient({ serviceName: row.serviceName }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.loadData();
        }
      });
    },
    chgClient(index) {
      let me = this;
      let uc = this.clients[index];
      //禁用其它client已使用的model
      me.gpList.forEach(gp => {
        gp.children.forEach(child => {
          child.disabled = false;
          me.clients.forEach(client => {
            if (
              client.modelKey.indexOf(child.value) >= 0 &&
              client.serviceName != uc.serviceName
            ) {
              child.disabled = true;
            }
          });
        });
      });
      me.updateClient = { ...uc };
    },
    loadData: async function() {
      let me = this;
      await me.reloadServerClient();
      await me.loadNotComposeModelList();
      await me.loadClientList();
      await me.loadGroupList();
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
    loadGroupList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getGroupList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            me.gpList = data;
            me.gpList.push({
              groupId: "XXX",
              groupName: "NOGROUP",
              groupDesc: "不分组模版"
            });
            me.gpList.forEach(gp => {
              gp.value = gp.groupId;
              gp.label = gp.groupDesc;
              gp.children = [];
            });
            me.gpList.forEach(gp => {
              me.models.forEach(m => {
                if (
                  m.groupId == gp.groupId ||
                  (!m.groupId && gp.groupId == "XXX")
                ) {
                  gp.children.push({ value: m.modelId, label: m.abs });
                }
              });
            });
            me.gpOpt = arrDeepCopy(me.gpList);
            resolve();
          }
        });
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
    reloadServerClient() {
      return new Promise((resolve, reject) => {
        serverReloadClient({}).then(res => {
          let { flag, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
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
    headerCellStyle() {
      return "padding:0;";
    },
    cellStyle() {
      return "padding-top:2px;padding-bottom:2px;";
    }
  },
  components: {
    sampleModelCom,
    newClientCom,
    updateClientCom
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
  border: 1px solid #909399;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  float: left;
  margin: 3px;
  line-height: 20px;
}
</style>