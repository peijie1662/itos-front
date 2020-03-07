<template>
  <div>
    <div class="block">
      <el-tabs v-model="activeName">
        <!-- 运维动态 -->
        <el-tab-pane label="运维动态" name="statistics">
          <div class="first-tab"></div>
        </el-tab-pane>
        <!-- 值班签到 -->
        <el-tab-pane label="值班签到" name="duty">
          <div class="first-tab">
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

export default {
  data() {
    return {
      activeName: "duty",
      dutys: "",
      users: [],
      userInfo: "",
      today: "2020-02-13"
    };
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
  computed: {},
  mounted: async function() {
    await this.getUserList();
    await this.getDutyList();
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>

<style scoped>
.first-tab {
  width: 1000px;
  height: 680px;
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

.block {
  border-radius: 10px;
  border: 1px solid #c0c4cc;
  padding: 10px;
  min-height: 100px;
}

.is-selected {
  color: #1989fa;
}

.face {
  height: 10px;
  width: 10px;
}
</style>