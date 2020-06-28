<template>
  <div>
    <div class="header">
      <el-button type="primary" size="mini" @click="saveCoordinate">保存</el-button>
    </div>
    <div class="content">
      <v-stage :config="stageConfig" ref="stage" @click="handleStageClick">
        <v-layer ref="layer">
          <!-- 服务 -->
          <v-group
            v-for="(item,index) in list"
            :key="index"
            :config="item"
            @dragstart="handleServiceDragStart "
            @dragend="handleServiceDragend"
            @click="handleServiceClick"
          >
            <v-rect :config="item.outer_rect"></v-rect>
            <v-text :config="item.server_name_text"></v-text>
            <v-text :config="item.ip_text"></v-text>
            <v-rect :config="item.heartbeat"></v-rect>
          </v-group>
          <!-- 连接线 -->
          <v-line v-for="item in connectorLineList" :key="item.sourceId" :config="item"></v-line>
          <!-- 箭头 -->
          <v-line v-for="item in connectorArrowList" :key="item.sourceId" :config="item"></v-line>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import Konva from "konva";
import { appInfoList, updCoordinate } from "@/api/api";
import {
  drawLine,
  drawArrow,
  drawService,
  drawSelService,
  drawNormalService
} from "@/views/settings/topology_util.js";

const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 800;

export default {
  data() {
    return {
      list: [],
      stageConfig: {
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT
      },
      dragID: null, //拖动的组件ID
      connectorLineList: [],
      connectorArrowList: [],
      timer: null,
      clickService: null, //点击选中
      toolbars: [],
      anim: null,

      //模拟相连数据传入
      connectors: [
        {
          sourceId: "DTP@169.169.47.9",
          targetId: "ITAF@169.169.41.26",
          direction: "H" //'H','V'
        },
        {
          sourceId: "Itop_Service@169.169.41.26",
          targetId: "ITAF@169.169.41.26",
          direction: "H" //'H','V'
        }
      ]
    };
  },
  methods: {
    handleStageClick(e) {
      if (e.target == this.$refs.stage.getNode()) {
        if (this.clickService != null) drawNormalService(this.clickService);
        this.clickService = null;
        this.toolbars = [];
      }
    },
    handleServiceClick(e) {
      if (this.clickService != null) drawNormalService(this.clickService);
      this.clickService = e.currentTarget;
      drawSelService(this.clickService);
    },
    handleServiceDragStart(e) {
      this.dragID = e.target.id();
    },
    handleServiceDragend(e) {
      let item = this.list.find(item => item.id == e.target.id());
      item.x = e.currentTarget.attrs.x;
      item.y = e.currentTarget.attrs.y;
      this.drawTopology();
      this.dragID = null;
    },
    saveCoordinate() {
      let me = this;
      updCoordinate(
        me.list.map(item => {
          return {
            serverName: item.serverName,
            ip: item.ip_text.text,
            x: item.x,
            y: item.y
          };
        })
      ).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        }
      });
    },
    drawTopology() {
      if (this.dragID == null) return;
      let stage = this.$refs.stage.getNode();
      this.connectorLineList = drawLine(stage, this.connectors).filter(
        item => item
      );
      this.connectorArrowList = drawArrow(stage, this.connectors).filter(
        item => item
      );
    },
    loadConnectorList() {
      //TODO 载入数据
      this.drawTopology();
    },
    loadAppInfoList() {
      let me = this;
      appInfoList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.list = data.map(item => {
            return drawService(item);
          });
          this.dragID = "BGEGIN";
          this.drawTopology();
          this.gragId = null;
          this.heartbeat();
        }
      });
    },
    heartbeat() {
      let me = this;
      let period = 2000;
      me.anim = new Konva.Animation(function(frame) {
        let scale =
          Math.abs(Math.sin((frame.time * 2 * Math.PI) / period)) + 0.001;
        let shapes = me.$refs.stage.getNode().find("#heartbeat");
        shapes.forEach(shape => {
          shape.scale({ x: scale, y: 1 });
        });
      }, me.$refs.layer.getNode());
      me.anim.start();
    }
  },
  mounted() {
    let me = this;
    me.loadAppInfoList();
    if (me.timer) {
      clearInterval(me.timer);
    } else {
      me.timer = setInterval(() => {
        me.drawTopology();
      }, 200);
    }
  },
  destroyed() {
    this.anim.stop();
    clearInterval(this.timer);
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