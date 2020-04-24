<template>
  <div>
    <div>
      <el-tabs v-model="activeName">
        <!-- 网站地图 -->
        <el-tab-pane label="网站地图" name="sitemap">
          <div class="first-tab">
            <!-- 1.左侧面板 -->
            <div class="left-pan">
              <!-- 1.1服务台任务 -->
              <div class="left-section-manual">
                <!-- manual标题 -->
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
                <!-- manual内容 -->
              </div>
              <!-- 1.2系统自动任务 -->
              <div class="left-section-auto">
                <!-- auto标题 -->
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

              </div>
              <!-- 1.3文档中心 -->
              <div class="left-section-pdf">
                <!-- 1.3.1服务台手册 -->
                <div class="left-pdf-manual"></div>
                <!-- 1.3.2任务文档 -->
                <div class="left-pdf-document"></div>
              </div>
            </div>
            <!-- 2.右侧面板 -->
            <div class="right-pan">
              <!-- 2.1短信服务 -->
              <div class="right-section-sms">
                <div style="float: left;line-height:50px;">
                  <i
                    class="iconfont icon-duanxinpingtai icon"
                    style="font-size:50px;margin-left:50px;"
                  ></i>
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
                  <i
                    class="iconfont icon-wuziguanli_icox icon"
                    style="font-size:50px;margin-left:50px;"
                  ></i>
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
                  <i
                    class="iconfont icon-iconset0280 icon"
                    style="font-size:50px;margin-left:50px;"
                  ></i>
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
              <!-- 2.6其它 -->
              <div class="right-section-others">其它</div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 值班签到 -->
        <el-tab-pane label="值班签到" name="duty">
          <div class="second-tab">
            <el-calendar>
              <template slot="dateCell" slot-scope="{date, data}">
                <div
                  class="duty-tag"
                  :class="data.day == today? 'duty-today':''"
                  @click="setDuty(data.day)"
                >
                  <div>
                    <span>{{ data.day.split('-').slice(1).join('-') }}</span>
                  </div>
                  <div>
                    <span>{{duty(data.day)}}</span>
                  </div>
                </div>
              </template>
            </el-calendar>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { APP_URL, dutyList, addDuty, delDuty, getUserList } from "@/api/api";
import { valueToLabel } from "@/api/data";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activeName: "sitemap",
      dutys: "",
      users: [],
      today: "2020-02-13" //TODO
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
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
    setDuty(date) {
      let me = this;
      let ds = me.duty(date);
      if (ds.indexOf(me.userInfo.userName) > -1) {
        delDuty({
          userId: me.userInfo.userId,
          dutyDate: date
        }).then(res => {
          let { flag, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
          } else {
            me.$message.success("你的值班信息已取消。");
            me.getDutyList();
          }
        });
      } else {
        addDuty({
          userId: me.userInfo.userId,
          dutyDate: date
        }).then(res => {
          let { flag, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
          } else {
            me.$message.success("你的值班信息已添加。");
            me.getDutyList();
          }
        });
      }
    },
    getDutyList() {
      return new Promise((resolve, reject) => {
        dutyList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            this.dutys = data;
            resolve();
          }
        });
      });
    },
    getUserList() {
      return new Promise((resolve, reject) => {
        getUserList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            this.users = data.map(item => {
              return {
                value: item.userId,
                label: item.userName
              };
            });
            resolve();
          }
        });
      });
    },
    duty(day) {
      let ds = this.dutys[day];
      if (ds) {
        return ds
          .map(item => {
            return valueToLabel(this.users, item.userId);
          })
          .join(",");
      } else {
        return "";
      }
    }
  },
  mounted: async function() {
    await this.getUserList();
    await this.getDutyList();
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
}

.left-section-manual-title {
  height: 50px;
  background: -webkit-linear-gradient(right, #67c23a, white);
}

.left-section-auto {
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
}

.left-section-auto-title {
  height: 50px;
  background: -webkit-linear-gradient(right, #E6A23C, white);
}

.left-section-pdf {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.left-pdf-manual {
  width: 300px;
  height: 198px;
  border: 1px solid #ddd;
  float: left;
}

.left-pdf-document {
  width: 530px;
  height: 198px;
  border: 1px solid #ddd;
  float: left;
  margin-left: 8px;
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
  height: 645px;
  border: 1px solid #ddd;
  margin: 3px;
  overflow: hidden;
}

.second-tab {
  width: 1000px;
  height: 800px;
}

.duty-tag {
  color: black;
  padding: 0px;
  height: 100%;
}

.duty-tag :hover {
  color: #1989fa;
}

.duty-today {
  background: #d9ecff;
}

.is-selected {
  color: #1989fa;
}

.face {
  height: 10px;
  width: 10px;
}
</style>