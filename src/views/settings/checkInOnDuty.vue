<template>
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
</template>

<script>
import { dutyList, addDuty, delDuty, getUserList } from "@/api/api";
import { valueToLabel } from "@/api/data";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      users: [],
      today: "2020-02-13", //TODO
      dutys: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    loadUserList() {
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
            me.loadDutyList();
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
            me.loadDutyList();
          }
        });
      }
    },
    loadDutyList() {
      let me = this;
      return new Promise((resolve, reject) => {
        dutyList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.dutys = data;
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
  }
};
</script>

<style  scoped>
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
</style>