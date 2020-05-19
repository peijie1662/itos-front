<template>
  <div>
    <el-collapse-transition>
      <div class="outer">
        <!-- 1.标题 -->
        <div class="title">
          <div
            :class="showTab == 'USERS'?'sub-title-sel':'sub-title'"
            @mouseenter="showTab = 'USERS'"
          >在线用户</div>
          <div
            :class="showTab == 'LOGS'?'sub-title-sel':'sub-title'"
            @mouseenter="showTab = 'LOGS'"
          >系统消息</div>
        </div>
        <!-- 2.1 用户列表 -->
        <div v-if="showTab == 'USERS'" class="content">
          <div
            v-for="(item,index) in users"
            :key="index"
            style="border: 1px solid #ddd;margin: 3px;"
          >
            <img
              src="@/assets/face/man.png"
              style="height:45px;width:45px;margin-top: 5px;margin-left: 5px;"
            />
            <span style="margin-left:10px;font-size:20px;">{{item.userName}}</span>
            <span style="margin-left:10px;font-size:20px;">{{item.userId}}</span>
            <span style="margin-left:10px;font-size:10px;color: #c8c8c8">{{item.ip}}</span>
          </div>
        </div>
        <!-- 2.2 系统日志 -->
        <div v-if="showTab == 'LOGS'" class="content">
          <div v-for="(item,index) in sysLog" :key="index" style="margin-top:5px;padding: 5px;">
            <div v-if="item">
              <span style="color:#c8c8c8;">{{item.substr(0,20)}}</span>
              <br />
              {{item.substr(20)}}
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
//<i class="el-icon-close"></i>
import { getOnlineUserList } from "@/api/api";
import { enterScene, leaveScene, userOnline } from "@/api/store_socket";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      showTab: "LOGS",
      timer: "",
      users: []
    };
  },
  methods: {
    ...mapMutations(["update_sysLog"]),
    handlerSysLog(content) {
      console.info("SYSLOG数据:" + content);
      this.update_sysLog(content);
    },
    handlerOnlineUser(content) {
      console.info("ONLINEUSER数据:" + content);
    },
    loadUsers() {
      let me = this;
      getOnlineUserList().then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.users = data;
        }
      });
    }
  },
  computed: {
    ...mapGetters(["userInfo", "sysLog"])
  },
  mounted() {
    let me = this;
    //1.进入场景
    enterScene([
      { scene: "SYSLOG", sceneFun: me.handlerSysLog },
      { scene: "ONLINEUSER", sceneFun: me.onlineUser }
    ]);
    //2.同步用户登录信息到后台,延时1秒，刷新时可能还未连接。
    setTimeout(() => {
      userOnline();
    }, 1000);
    //3.定时刷新用户
    if (me.timer) {
      clearInterval(me.timer);
    } else {
      me.timer = setInterval(() => {
        me.loadUsers();
      }, 5000);
    }
  },
  destroyed() {
    //退出场景
    leaveScene(["SYSLOG", "ONLINEUSER"]);
  }
};
</script>

<style scoped>
.title {
  height: 50px;
  border: 1px solid #ddd;
  position: relative;
}

.sub-title {
  width: 100px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border: 1px solid #ddd;
  float: left;
}

.sub-title-sel {
  width: 100px;
  height: 48px;
  color: #20a0ff;
  line-height: 48px;
  text-align: center;
  border: 1px solid #20a0ff;
  float: left;
}

.content {
  margin-top: 5px;
  height: 500px;
  overflow-y: scroll;
  border: 1px solid #ddd;
}

.outer {
  height: 700px;
  width: 400px;
  background: white;
  border: #20a0ff 1px solid;
}
</style>