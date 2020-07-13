<template>
  <div>
    <div class="header">
      <el-button size="mini" @click="handleSysCode" style="margin-left:20px;">场景代码</el-button>
      <el-divider direction="vertical"></el-divider>
      <span>选择场景</span>
      <el-select
        v-model="selScene"
        @change="loadSceneTopology"
        size="mini"
        style="width:200px;margin-left:10px;"
        placeholder="请选择"
      >
        <el-option v-for="item in scenes" :key="item.id" :label="item.id" :value="item.id">
          <span>{{ item.id }}</span>
        </el-option>
      </el-select>
      <el-button size="mini" @click="handleSceneEdit" style="margin-left:20px;">编辑</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button size="mini" @click="handleDownload" style="margin-left:20px;">图片</el-button>
    </div>
    <div class="content">
      <v-stage :config="stageConfig" ref="stage" @click="handleStageClick">
        <v-layer ref="layer">
          <!-- 服务 -->
          <v-group
            v-for="(item,index) in sceneApps"
            :key="index"
            :config="item"
            @dragend="handleServiceDragend"
            @click="handleServiceClick"
          >
            <v-rect :config="item.outer_rect"></v-rect>
            <v-text :config="item.service_name_text"></v-text>
            <v-text :config="item.service_abs_text"></v-text>
            <v-text :config="item.ip_text"></v-text>
            <v-text :config="item.type_text"></v-text>
            <v-text :config="item.domain_text"></v-text>
            <v-circle :config="item.heartbeat"></v-circle>
          </v-group>
          <!-- 连接线 -->
          <v-line v-for="item in connectorLineList" :key="item.sourceId" :config="item"></v-line>
          <!-- 箭头 -->
          <v-line v-for="item in connectorArrowList" :key="item.sourceId" :config="item"></v-line>
          <!-- 标签 -->
          <v-text
            v-for="item in sceneLabs"
            :key="item.labId"
            :config="item"
            @dragend="handleLabelDragend"
          ></v-text>
        </v-layer>
      </v-stage>
    </div>
    <div id="menu">
      <div>
        <button id="del-btn">删除</button>
      </div>
    </div>
    <sys-code-com :sysCode="sysCode"></sys-code-com>
    <scene-edit-com :scene="editScene" @updateSuccess="loadSceneTopology"></scene-edit-com>
  </div>
</template>

<script>
import { downloadURI } from "@/api/util";
import {
  listSysCode,
  listSceneApp,
  updCoordinate,
  listSceneCon,
  listSceneLab,
  updLabCoordinate
} from "@/api/api";
import {
  drawLine,
  drawArrow,
  drawService,
  drawSelService,
  drawNormalService,
  drawLabel
} from "@/views/appinfo/topology_util.js";
import sysCodeCom from "@/components/public/sysCodeCom";
import sceneEditCom from "@/components/appinfo/sceneEditCom";

const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 800;

export default {
  data() {
    return {
      stageConfig: {
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT
      },
      connectorLineList: [],
      connectorArrowList: [],
      timer: null,
      clickService: null, //点击选中
      scenes: [], //场景
      selScene: null, //选中场景
      sysCode: null, //代码
      sceneApps: [], //场景服务
      sceneCons: [], //场景连接
      sceneLabs: [], //场景标签
      newSceneAppId: null, //场景新服务ID
      editScene: null //编辑场景
    };
  },
  methods: {
    //初始化右键菜单
    initMenu() {
      let stage = this.$refs.stage.getNode();
      let menuNode = document.getElementById("menu");
      //删除服务
      document.getElementById("del-btn").addEventListener("click", () => {});
      window.addEventListener("click", () => {
        menuNode.style.display = "none";
      });
      stage.on("contextmenu", function(e) {
        e.evt.preventDefault();
        if (e.target === stage) {
          return;
        }
        menuNode.style.display = "initial";
        var containerRect = stage.container().getBoundingClientRect();
        menuNode.style.top =
          containerRect.top + stage.getPointerPosition().y - 50 + "px";
        menuNode.style.left =
          containerRect.left + stage.getPointerPosition().x + "px";
      });
    },
    //场景代码维护
    handleSysCode() {
      this.sysCode = { category: "TOPOLOGYSCENE", title: "拓扑场景" };
    },
    //载入场景代码
    loadScene() {
      return new Promise((resolve, reject) => {
        let me = this;
        listSysCode({
          category: "TOPOLOGYSCENE"
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.scenes = data;
            resolve();
          }
        });
      });
    },
    //载入场景服务
    loadSceneApp() {
      return new Promise((resolve, reject) => {
        let me = this;
        listSceneApp({
          scene: me.selScene
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.sceneApps = data.map(item => {
              return drawService(item);
            });
            resolve();
          }
        });
      });
    },
    //载入场景连接
    loadSceneCon() {
      return new Promise((resolve, reject) => {
        let me = this;
        listSceneCon({
          scene: me.selScene
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
    //载入场景标签
    loadSceneLab() {
      return new Promise((resolve, reject) => {
        let me = this;
        listSceneLab({
          scene: me.selScene
        }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.sceneLabs = data.map(item => {
              return drawLabel(item);
            });
            resolve();
          }
        });
      });
    },
    //载入场景所有信息
    loadSceneTopology: async function() {
      let me = this;
      await me.loadSceneApp();
      await me.loadSceneCon();
      await me.loadSceneLab();
    },
    //编辑场景信息
    handleSceneEdit() {
      let me = this;
      if (me.selScene) {
        me.editScene = { scene: me.selScene };
      } else {
        me.$message.warning("请先选择要编辑的场景");
      }
    },
    //单击背景时去掉选中状态
    handleStageClick(e) {
      if (e.target == this.$refs.stage.getNode()) {
        if (this.clickService != null) drawNormalService(this.clickService);
        this.clickService = null;
      }
    },
    //单击选中服务
    handleServiceClick(e) {
      if (this.clickService != null) drawNormalService(this.clickService);
      this.clickService = e.currentTarget;
      drawSelService(this.clickService);
    },
    //拖动结束时保存服务位置
    handleServiceDragend(e) {
      let me = this;
      updCoordinate([
        {
          scene: me.selScene,
          serviceId: e.currentTarget.attrs.id,
          x: e.currentTarget.attrs.x,
          y: e.currentTarget.attrs.y
        }
      ]).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        }
      });
    },
    //拖动结束时保存标签位置
    handleLabelDragend(e) {
      let me = this;
      updLabCoordinate([
        {
          scene: me.selScene,
          labId: e.currentTarget.attrs.id,
          x: e.currentTarget.attrs.x,
          y: e.currentTarget.attrs.y
        }
      ]).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        }
      });
    },
    //绘制连线箭头等附属件
    drawTopology() {
      let me = this;
      let stage = me.$refs.stage.getNode();
      //绘制连线
      me.connectorLineList = drawLine(stage, me.sceneCons).filter(item => item);
      //绘制箭头
      me.connectorArrowList = drawArrow(stage, me.sceneCons).filter(
        item => item
      );
      //心跳
      me.sceneApps.forEach(app => {
        app.heartbeat.stroke =
          app.heartbeat.stroke == "#00FF00" ? "#409EFF" : "#00FF00";
      });
    },
    //下载图片
    handleDownload() {
      let stage = this.$refs.stage.getNode();
      let dataURL = stage.toDataURL({ pixelRatio: 3 });
      downloadURI(dataURL, "stage.png");
    }
  },
  mounted() {
    let me = this;
    me.initMenu();
    //场景代码
    me.loadScene();
    //动态刷新连线等图形
    if (me.timer) {
      clearInterval(me.timer);
    } else {
      me.timer = setInterval(() => {
        me.drawTopology();
      }, 200);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  components: {
    sysCodeCom,
    sceneEditCom
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

#menu {
  display: none;
  position: absolute;
  width: 60px;
  background-color: white;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
}

#menu button {
  width: 100%;
  background-color: white;
  border: none;
  margin: 0;
  padding: 10px;
}

#menu button:hover {
  background-color: lightgray;
}
</style>