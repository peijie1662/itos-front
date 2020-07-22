<template>
  <div>
    <div class="first-tab">
      <!-- 1.左侧面板 -->
      <div class="left-pan">
        <!-- 1.1服务台任务 -->
        <div class="left-section-manual">
          <!-- Manual标题 -->
          <div class="left-section-manual-title">
            <div style="float: left;line-height:50px;">
              <i
                class="iconfont icon-weixiudan icon"
                style="font-size:40px;margin-left:10px;color: #67C23A;"
              ></i>
            </div>
            <div style="float: left;line-height:50px;">
              <span style="font-size:22px;margin-left:30px;color: #67C23A;">服务台任务</span>
            </div>
            <div style="float: right;line-height:50px;">
              <i class="iconfont icon-jiantou2 icon" style="font-size:30px;color:white;"></i>
            </div>
          </div>
          <!-- Manual内容 -->
          <div style="overflow:hidden;">
            <!-- Manual介绍 -->
            <el-card
              shadow="hover"
              style="width:250px;height:200px;margin-top:20px;margin-left: 20px;
                      color:#7a8f9a;float:left;"
            >
              <span>服务台今日任务</span>
              <ul>
                <li>服务台共登记10个任务,已成功完成8个任务，正在完成2个任务。</li>
                <li>普通模版生成7个任务,已成功完成7个任务。</li>
              </ul>
            </el-card>
            <!-- 统计图 -->
            <div style="width:500px;overflow:hidden;margin-top:20px;">
              <ve-pie :data="manualChartData" :settings="manualChartSettings"></ve-pie>
            </div>
          </div>
        </div>
        <!-- 1.2系统自动任务 -->
        <div class="left-section-auto">
          <!-- Auto标题 -->
          <div class="left-section-auto-title">
            <div style="float: left;line-height:50px;">
              <i
                class="iconfont icon-zidongguanli icon"
                style="font-size:40px;margin-left:10px;color: #E6A23C;"
              ></i>
            </div>
            <div style="float: left;line-height:50px;">
              <span style="font-size:22px;margin-left:30px;color: #E6A23C;">系统自动任务</span>
            </div>
            <div style="float: right;line-height:50px;">
              <i class="iconfont icon-jiantou2 icon" style="font-size:30px;color:white;"></i>
            </div>
          </div>
          <!-- Auto介绍 -->
          <el-card
            shadow="hover"
            style="width:250px;height:200px;margin-top:20px;margin-left: 20px;
                      color:#7a8f9a;float:left;"
          >
            <span>本周系统任务</span>
            <ul>
              <li>本周共生成203个任务,已成功完成200个任务，已失败3个任务。</li>
            </ul>
          </el-card>
          <!-- 统计图 -->
          <div style="width:500px;overflow:hidden;margin-top:20px;margin-left:50px;">
            <ve-histogram :data="autoChartData" height="270px" />
          </div>
        </div>
        <!-- 1.3文档中心 -->
        <div class="left-section-pdf">
          <!-- 1.3.1服务台手册 -->
          <div class="left-pdf-manual">
            <!-- 标题 -->
            <div class="left-pdf-manual-title"></div>
            <div>
              <i
                class="iconfont icon-tushuguanlibrary12 icon"
                style="font-size:30px;position: absolute;top: 15px;left: 30px;color:#559088;"
              ></i>
            </div>
            <div style="position: absolute;top:20px;left:80px;">
              <span style="font-size:20px;color: #559088;">IT运维文档</span>
            </div>
            <!-- 内容 -->
            <div style="position: absolute;top:50px;left:0px;">
              <ul style="list-style:none;">
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#559088;"></i>IT服务台手册
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#559088;"></i>值班人员注意事项
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#559088;"></i>办公网重启文档
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#559088;"></i>ITOS系统使用指南
                </li>
              </ul>
            </div>
            <!-- 更多 -->
            <div style="position: absolute;bottom:10px;right:50px;">
              <a href="#" style="color:#559088;">更多文档...</a>
            </div>
          </div>
          <!-- 1.3.2任务文档 -->
          <div class="left-pdf-document">
            <!-- 标题 -->
            <div class="left-pdf-document-title"></div>
            <div>
              <i
                class="iconfont icon-tushu1 icon"
                style="font-size:30px;position: absolute;top: 15px;left: 30px;color:#deb683;"
              ></i>
            </div>
            <div style="position: absolute;top:20px;left:80px;">
              <span style="font-size:20px;color: #deb683;">服务台报告</span>
            </div>
            <!-- 内容 -->
            <div style="position: absolute;top:50px;left:0px;">
              <ul style="list-style:none;">
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#deb683;"></i>2020-03服务台月报
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#deb683;"></i>2020-02服务台月报
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#deb683;"></i>2020-01服务台月报
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#deb683;"></i>2019-12服务台月报
                </li>
              </ul>
            </div>
            <!-- 更多 -->
            <div style="position: absolute;bottom:10px;right:50px;">
              <a href="#" style="color:#deb683;">更多报表...</a>
            </div>
          </div>
          <!-- 1.3.3自动任务 -->
          <div class="left-pdf-auto">
            <!-- 标题 -->
            <div class="left-pdf-auto-title"></div>
            <div>
              <i
                class="iconfont icon-tushuguan icon"
                style="font-size:30px;position: absolute;top: 15px;left: 30px;color:#678cac;"
              ></i>
            </div>
            <div style="position: absolute;top:20px;left:80px;">
              <span style="font-size:20px;color: #678cac;">自动任务报告</span>
            </div>
            <!-- 内容 -->
            <div style="position: absolute;top:50px;left:0px;">
              <ul style="list-style:none;">
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#678cac;"></i>2020-04-05自动任务日报
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#678cac;"></i>2020-04-04自动任务日报
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#678cac;"></i>2020-04-03自动任务日报
                </li>
                <li>
                  <i class="iconfont icon-tushu icon" style="font-size:20px;color:#678cac;"></i>2020-04-02自动任务日报
                </li>
              </ul>
            </div>
            <!-- 更多 -->
            <div style="position: absolute;bottom:10px;right:50px;">
              <a href="#" style="color:#678cac;">更多报表...</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 2.右侧面板 -->
      <div class="right-pan">
        <!-- 2.1短信服务 -->
        <div class="right-section-sms">
          <div style="float: left;line-height:50px;">
            <i class="iconfont icon-duanxinpingtai icon" style="font-size:50px;margin-left:50px;"></i>
          </div>
          <div style="float: left;line-height:50px;">
            <span style="font-size:22px;margin-left:30px;">短信服务</span>
          </div>
          <div style="float: left;line-height:50px;">
            <i class="iconfont icon-jiantou2 icon" style="font-size:30px;"></i>
          </div>
        </div>
        <!-- 2.2备件管理 -->
        <div class="right-section-store">
          <div style="float: left;line-height:50px;">
            <i class="iconfont icon-wuziguanli_icox icon" style="font-size:50px;margin-left:50px;"></i>
          </div>
          <div style="float: left;line-height:50px;">
            <span style="font-size:22px;margin-left:30px;">备件管理</span>
          </div>
          <div style="float: left;line-height:50px;">
            <i class="iconfont icon-jiantou2 icon" style="font-size:30px;"></i>
          </div>
        </div>
        <!-- 2.3网络运维 -->
        <div class="right-section-network">
          <div style="float: left;line-height:50px;">
            <i class="iconfont icon-iconset0280 icon" style="font-size:50px;margin-left:50px;"></i>
          </div>
          <div style="float: left;line-height:50px;">
            <span style="font-size:22px;margin-left:30px;">网络运维</span>
          </div>
          <div style="float: left;line-height:50px;">
            <i class="iconfont icon-jiantou2 icon" style="font-size:30px;"></i>
          </div>
        </div>
        <!-- 2.4系统开发 -->
        <div class="right-section-develop">
          <div style="float: left;line-height:50px;">
            <i class="iconfont icon-wangluo-1 icon" style="font-size:50px;margin-left:50px;"></i>
          </div>
          <div style="float: left;line-height:50px;">
            <span style="font-size:22px;margin-left:30px;">系统开发</span>
          </div>
          <div style="float: left;line-height:50px;">
            <i class="iconfont icon-jiantou2 icon" style="font-size:30px;"></i>
          </div>
        </div>
        <!-- 2.5APP -->
        <div class="right-section-app">
          <div id="qrcode" ref="qrcode" style="margin-top:5px;margin-left:10px;float: left;"></div>
          <div style="float: left;">
            <div style="margin-top:20px;margin-left:20px;">
              <span style="font-size: 15px;">使用App访问ITOS</span>
              <i class="iconfont icon-jiantou2 icon" style="font-size:15px;margin-left:10px;"></i>
            </div>
            <div style="margin-top:5px;margin-left:20px;">
              <span style="font-size:10px;color:#a6b5c4;">随时随地关注和处理IT运维信息</span>
            </div>
          </div>
        </div>
        <!-- 2.6系统动态 -->
        <div class="right-section-others">
          <div style="margin-top:10px;overflow: hidden;">
            <div style="margin-left:10px;float: left;">
              <span style="color: #a6b5c4;">系统动态</span>
            </div>
            <div style="margin-right:10px;float: right;">
              <a href="#" style="color: #a6b5c4;">更多...</a>
            </div>
          </div>
          <div>
            <vue-seamless-scroll :data="itosLogs" class="seamless-warp">
              <ul style="list-style:none;">
                <li v-for="(item,index) in itosLogs" :key="index" style="margin-top:10px;">
                  <span style="font-size:10px;color:#a6b5c4;">{{item.opDate}}</span>
                  <br />
                  <i :class="item.status.icon" :style="{'color': item.status.iconclass.color}"></i>
                  <span style="font-size:8px;">{{item.statusDesc}}</span>
                </li>
              </ul>
            </vue-seamless-scroll>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { APP_URL, getItosLog } from "@/api/api";
import { getTaskStatusById } from "@/api/data";
import { localDateToStr } from "@/api/util";

export default {
  data() {
    return {
      itosLogs: [], //系统日志
      //
      manualChartSettings: {
        radius: 60,
        offsetY: 110
      },
      manualChartData: {
        columns: ["类型", "任务数量"],
        rows: [
          { 类型: "龙门吊", 任务数量: 11 },
          { 类型: "桥吊", 任务数量: 5 },
          { 类型: "堆高机", 任务数量: 6 },
          { 类型: "集卡", 任务数量: 31 },
          { 类型: "电脑", 任务数量: 35 },
          { 类型: "网络", 任务数量: 2 }
        ]
      },
      autoChartData: {
        columns: ["日期", "任务", "已完成", "未完成"],
        rows: [
          { 日期: "1/1", 任务: 100, 已完成: 88, 未完成: 12 },
          { 日期: "1/2", 任务: 110, 已完成: 99, 未完成: 11 },
          { 日期: "1/3", 任务: 99, 已完成: 99, 未完成: 0 },
          { 日期: "1/4", 任务: 56, 已完成: 56, 未完成: 0 },
          { 日期: "1/5", 任务: 200, 已完成: 196, 未完成: 4 },
          { 日期: "1/6", 任务: 123, 已完成: 110, 未完成: 13 },
          { 日期: "1/6", 任务: 123, 已完成: 110, 未完成: 13 }
        ]
      }
    };
  },
  methods: {
    useqrcode() {
      let qrcode = new QRCode("qrcode", {
        width: 70, //图像宽度
        height: 70, //图像高度
        colorDark: "#000000", //前景色
        colorLight: "#ffffff", //背景色
        typeNumber: 4,
        correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      });
      qrcode.clear(); //清除二维码
      qrcode.makeCode(APP_URL); //生成另一个新的二维码
    },
    loadItosLog() {
      return new Promise((resolve, reject) => {
        getItosLog({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            this.itosLogs = data.map(item => {
              return {
                opDate: localDateToStr(item.opDate),
                status: getTaskStatusById(item.status),
                statusDesc: item.statusDesc
              };
            });
            resolve();
          }
        });
      });
    }
  },
  mounted: async function() {
    await this.loadItosLog();
    this.useqrcode();
  }
};
</script>

<style  scoped>
.first-tab {
  position: relative;
}

.left-pan {
  width: 70%;
  min-height: 800px;
  float: left;
}

.left-section-manual {
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  overflow: hidden;
}

.left-section-manual-title {
  height: 50px;
  background: -webkit-linear-gradient(right, #67c23a, white);
  overflow: hidden;
}

.left-section-auto {
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  overflow: hidden;
}

.left-section-auto-title {
  height: 50px;
  background: -webkit-linear-gradient(right, #e6a23c, white);
  overflow: hidden;
}

.left-section-pdf {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.left-pdf-manual {
  width: 250px;
  height: 198px;
  border: 1px solid #ddd;
  float: left;
  overflow: hidden;
  position: relative;
}

.left-pdf-manual-title {
  width: 0px;
  height: 0px;
  border-top: 80px solid #c1e4de;
  border-right: 80px solid transparent;
}

.left-pdf-document {
  width: 250px;
  height: 198px;
  border: 1px solid #ddd;
  float: left;
  margin-left: 8px;
  overflow: hidden;
  position: relative;
}

.left-pdf-document-title {
  width: 0px;
  height: 0px;
  border-top: 80px solid #f4e0bd;
  border-right: 80px solid transparent;
}

.left-pdf-auto {
  width: 250px;
  height: 198px;
  border: 1px solid #ddd;
  float: left;
  margin-left: 8px;
  overflow: hidden;
  position: relative;
}

.left-pdf-auto-title {
  width: 0px;
  height: 0px;
  border-top: 80px solid #b7d6ec;
  border-right: 80px solid transparent;
}

.right-pan {
  width: 29%;
  min-height: 800px;
  float: left;
  margin-left: 3px;
}

.right-section-sms {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  margin: 3px;
  background: #ffb84f;
  color: #ffeed4;
  overflow: hidden;
}

.right-section-store {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  margin: 3px;
  background: #c1e4de;
  color: #559088;
  overflow: hidden;
}

.right-section-develop {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  margin: 3px;
  background: #f4e0bd;
  color: #deb468;
  overflow: hidden;
}

.right-section-network {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  margin: 3px;
  background: #b7d6ec;
  color: #508bac;
  overflow: hidden;
}

.right-section-app {
  width: 100%;
  height: 80px;
  border: 1px solid #ddd;
  margin: 3px;
  overflow: hidden;
}

.right-section-others {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  margin: 3px;
  overflow: hidden;
}

.seamless-warp {
  height: 450px;
  overflow: hidden;
}

.is-selected {
  color: #1989fa;
}

.face {
  height: 10px;
  width: 10px;
}
</style>