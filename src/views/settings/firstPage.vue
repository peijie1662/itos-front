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
              <div class="left-section-manual"></div>
              <!-- 1.2系统自动任务 -->
              <div class="left-section-auto"></div>
              <!-- 1.3文档中心 -->
              <div class="left-section-pdf">
                <!-- 1.3.1服务台手册 -->
                <div class="left-manual"></div>
                <!-- 1.3.2任务文档 -->
                <div class="left-document"></div>
              </div>
            </div>
            <!-- 2.右侧面板 -->
            <div class="right-pan">
              <!-- 2.1短信服务 -->
              <div class="right-section-sms">短信服务</div>
              <!-- 2.2备件管理 -->
              <div class="right-section-store">备件管理</div>
              <!-- 2.3网络运维 -->
              <div class="right-section-network">网络运维</div>
              <!-- 2.4其它 -->
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
import { dutyList, addDuty, delDuty, getUserList } from "@/api/api";
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

    //background: -webkit-linear-gradient(bottom,green,white);
  }
};
</script>

<style scoped>
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

.left-section-auto {
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
}

.left-section-pdf {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.left-manual {
  width: 300px;
  height: 198px;
  border: 1px solid #ddd;
  float: left;
}

.left-document {
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
}

.right-section-store {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  margin: 3px;
}

.right-section-network {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  margin: 3px;
}

.right-section-others {
  width: 100%;
  height: 645px;
  border: 1px solid #ddd;
  margin: 3px;
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