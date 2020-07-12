<template>
  <div>
    <el-dialog title="场景编辑" width="800px" :visible.sync="dialogVisible">
      <el-tabs v-model="activeTab">
        <!-- 1.场景服务 -->
        <el-tab-pane label="场景服务" name="app">
          <div class="header">
            <el-select
              v-model="newSceneAppId"
              size="mini"
              style="width:200px;margin-left:10px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in allApps"
                :key="item.serviceId"
                :label="item.serviceName"
                :value="item.serviceId"
              >
                <div>
                  <span style="float:left;">{{item.serviceName}}</span>
                  <span style="float:right;">{{item.serviceAbs}}</span>
                </div>
              </el-option>
            </el-select>
            <el-button size="mini" @click="saveNewSceneApp" style="margin-left:20px;">添加</el-button>
          </div>
          <div class="content">
            <el-table
              :data="sceneApps"
              :header-cell-style="headerCellStyle"
              :cell-style="cellStyle"
              border
              style="font-size:10px;"
            >
              <el-table-column type="index" width="50" label="No."></el-table-column>
              <el-table-column prop="serviceName" width="100" label="服务名"></el-table-column>
              <el-table-column prop="serviceAbs" width="100" label="简介"></el-table-column>
              <el-table-column label="地址" width="150">
                <template slot-scope="scope">{{scope.row.ip}}:{{scope.row.port}}</template>
              </el-table-column>
              <el-table-column prop="serviceType" width="100" label="类型"></el-table-column>
              <el-table-column prop="domain" width="80" label="区域"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-popconfirm title="确定要删除该服务吗？" @onConfirm="delSceneApp(scope.row)">
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
        </el-tab-pane>
        <!-- 场景连接 -->
        <el-tab-pane label="场景连接" name="con">
          <div class="header">
            <el-select
              v-model="sourceId"
              size="mini"
              style="width:200px;margin-left:10px;"
              placeholder="起始服务"
            >
              <el-option
                v-for="item in allApps"
                :key="item.serviceId"
                :label="item.serviceName"
                :value="item.serviceId"
              >
                <div>
                  <span style="float:left;">{{item.serviceName}}</span>
                  <span style="float:right;">{{item.serviceAbs}}</span>
                </div>
              </el-option>
            </el-select>
            <el-select
              v-model="targetId"
              size="mini"
              style="width:200px;margin-left:10px;"
              placeholder="终点服务"
            >
              <el-option
                v-for="item in allApps"
                :key="item.serviceId"
                :label="item.serviceName"
                :value="item.serviceId"
              >
                <div>
                  <span style="float:left;">{{item.serviceName}}</span>
                  <span style="float:right;">{{item.serviceAbs}}</span>
                </div>
              </el-option>
            </el-select>
            <el-select
              v-model="direction"
              size="mini"
              style="width:100px;margin-left:10px;"
              placeholder="方向"
            >
              <el-option label="水平方向" value="HORIZONTAL"></el-option>
              <el-option label="垂直方向" value="VERTICAL"></el-option>
            </el-select>
            <el-button size="mini" @click="saveNewSceneCon" style="margin-left:20px;">添加</el-button>
          </div>
          <div class="content">
            <el-table
              :data="sceneCons"
              :header-cell-style="headerCellStyle"
              :cell-style="cellStyle"
              border
              style="font-size:10px;"
            >
              <el-table-column type="index" width="50" label="No."></el-table-column>
              <el-table-column prop="sourceName" width="100" label="起始"></el-table-column>
              <el-table-column prop="targetName" width="100" label="终点"></el-table-column>
              <el-table-column width="100" label="方向">     
                <template slot-scope="scope">{{scope.row.direction=="HORIZONTAL"?"水平":"垂直"}}</template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-popconfirm title="确定要删除该连接吗？" @onConfirm="delSceneCon(scope.row)">
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
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAppInfo,
  addSceneApp,
  listSceneApp,
  delSceneApp,
  listSceneCon,
  addSceneCon,
  delSceneCon
} from "@/api/api";

export default {
  data() {
    return {
      activeTab: "app",
      newSceneAppId: "",
      sourceId: "",
      targetId: "",
      direction: "",
      allApps: [], //所有服务列表
      sceneApps: [], //场景服务
      sceneCons: [], //场景连接
      dialogVisible: false
    };
  },
  props: ["scene"],
  watch: {
    scene: {
      handler: async function(newVal) {
        if (newVal != null) {
          await this.loadAppInfoList();
          await this.loadSceneApp();
          await this.loadSceneCon();
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    //载入所有服务列表
    loadAppInfoList() {
      let me = this;
      listAppInfo({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.allApps = data;
        }
      });
    },
    //载入场景服务
    loadSceneApp() {
      return new Promise((resolve, reject) => {
        let me = this;
        listSceneApp({
          scene: me.scene.scene
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.sceneApps = data;
            resolve();
          }
        });
      });
    },
    //添加服务到场景
    saveNewSceneApp() {
      let me = this;
      if (!me.newSceneAppId) {
        me.$message.warning("未选择服务");
        return;
      }
      addSceneApp({
        serviceId: me.newSceneAppId,
        scene: me.scene.scene,
        x: 10,
        y: 10
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.loadSceneApp();
          me.$emit("updateSuccess");
        }
      });
    },
    //删除场景服务
    delSceneApp(row) {
      let me = this;
      delSceneApp({
        scene: me.scene.scene,
        serviceId: row.serviceId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.loadSceneApp();
          me.$emit("updateSuccess");
        }
      });
    },
    //载入场景连接
    loadSceneCon() {
      return new Promise((resolve, reject) => {
        let me = this;
        listSceneCon({
          scene: me.scene.scene
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.sceneCons = data;
            resolve();
          }
        });
      });
    },
    //添加连接到场景
    saveNewSceneCon() {
      let me = this;
      if (!me.sourceId || !me.targetId) {
        me.$message.warning("未选择起点和终点服务");
        return;
      }
      addSceneCon({
        scene: me.scene.scene,
        sourceId: me.sourceId,
        targetId: me.targetId,
        preText: "",
        sufText: "",
        direction: me.direction,
        lineType: "BROKEN" //折线
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.loadSceneCon();
          me.$emit("updateSuccess");
        }
      });
    },
    //删除场景连接
    delSceneCon(row) {
      let me = this;
      delSceneCon({
        scene: me.scene.scene,
        sourceId: row.sourceId,
        targetId: row.targetId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.loadSceneCon();
          me.$emit("updateSuccess");
        }
      });
    },
    headerCellStyle() {
      return "padding:0;";
    },
    cellStyle() {
      return "padding-top:2px;padding-bottom:2px;";
    }
  }
};
</script>

<style scoped>
.header {
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  min-height: 30px;
}
.content {
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  margin-top: 10px;
  min-height: 300px;
}
</style>