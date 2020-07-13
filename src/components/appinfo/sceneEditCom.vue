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
              :default-sort="{prop: 'serviceName'}"
              style="font-size:10px;"
            >
              <el-table-column type="index" width="50" label="No."></el-table-column>
              <el-table-column prop="serviceName" width="100" label="服务名" sortable></el-table-column>
              <el-table-column prop="serviceAbs" width="100" label="简介" sortable></el-table-column>
              <el-table-column label="地址" width="150" sortable>
                <template slot-scope="scope">{{scope.row.ip}}:{{scope.row.port}}</template>
              </el-table-column>
              <el-table-column prop="serviceType" width="100" label="类型" sortable></el-table-column>
              <el-table-column prop="domain" width="80" label="区域" sortable></el-table-column>
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
              <el-option label="右->左" value="RL"></el-option>
              <el-option label="下->上" value="BT"></el-option>
              <el-option label="下->左" value="BL"></el-option>
              <el-option label="右->下" value="RB"></el-option>
              <el-option label="上->左" value="TL"></el-option>
              <el-option label="右->上" value="RT"></el-option>
            </el-select>
            <el-button size="mini" @click="saveNewSceneCon" style="margin-left:20px;">添加</el-button>
          </div>
          <div class="content">
            <el-table
              :data="sceneCons"
              :header-cell-style="headerCellStyle"
              :cell-style="cellStyle"
              border
              :default-sort="{prop: 'sourceName'}"
              style="font-size:10px;"
            >
              <el-table-column type="index" width="50" label="No."></el-table-column>
              <el-table-column prop="sourceName" width="100" label="起始" sortable></el-table-column>
              <el-table-column prop="targetName" width="100" label="终点" sortable></el-table-column>
              <el-table-column prop="direction" width="100" label="方向"></el-table-column>
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
        <!-- 场景标签 -->
        <el-tab-pane label="场景标签" name="label">
          <div class="header">
            <el-input v-model="newLab" placeholder="标签内容" size="mini" style="width:200px;"></el-input>
            <el-button size="mini" @click="saveNewSceneLab" style="margin-left:20px;">添加</el-button>
          </div>
          <div class="content">
            <el-table
              :data="sceneLabs"
              :header-cell-style="headerCellStyle"
              :cell-style="cellStyle"
              border
              :default-sort="{prop: 'text'}"
              style="font-size:10px;"
            >
              <el-table-column type="index" width="50" label="No."></el-table-column>
              <el-table-column prop="x" width="50" label="X"></el-table-column>
              <el-table-column prop="y" width="50" label="Y"></el-table-column>
              <el-table-column prop="text" width="200" label="文本内容" sortable></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-popconfirm title="确定要删除该标签吗？" @onConfirm="delSceneLab(scope.row)">
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
  delSceneCon,
  listSceneLab,
  addSceneLab,
  delSceneLab
} from "@/api/api";

export default {
  data() {
    return {
      activeTab: "app",
      newSceneAppId: "",
      sourceId: "",
      targetId: "",
      direction: "",
      newLab: "",
      allApps: [], //所有服务列表
      sceneApps: [], //场景服务
      sceneCons: [], //场景连接
      sceneLabs: [], //场景标签
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
          await this.loadSceneLab();
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
    //添加场景标签
    saveNewSceneLab() {
      let me = this;
      if (!me.newLab) {
        me.$message.warning("未输入文本");
        return;
      }
      addSceneLab({
        scene: me.scene.scene,
        text: me.newLab,
        x: 10,
        y: 10,
        width: 999
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.loadSceneLab();
          me.$emit("updateSuccess");
        }
      });
    },
    //载入场景标签
    loadSceneLab() {
      return new Promise((resolve, reject) => {
        let me = this;
        listSceneLab({
          scene: me.scene.scene
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.sceneLabs = data;
            resolve();
          }
        });
      });
    },
    //删除场景标签
    delSceneLab(row) {
      let me = this;
      delSceneLab({
        scene: me.scene.scene,
        labId: row.labId
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.loadSceneLab();
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