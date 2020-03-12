<template>
  <div>
    <div>
      <el-row class="container">
        <el-col :span="24" class="header">
          <el-col :span="10" class="logo" :class="isCollapse?'logo-collapse-width':'logo-width'"></el-col>
          <el-col :span="10">
            <div class="tools" @click.prevent="collapse">
              <i class="el-icon-menu" style="font-size:35px;margin-top:15px;">
                <span style="margin-left:10px;font-size:20px;">IT OPERATION AND MAINTENANCE SYSTEM</span>
                <span style="margin-left:5px;font-size:15px;">资讯科技部运维系统</span>
                <i
                  class="iconfont icon-icon_crab_line icon"
                  style="font-size:15px;margin-left:5px;"
                ></i>
              </i>
            </div>
          </el-col>
          <el-col :span="4" class="userinfo">
            <div
              class="headertag"
            >部门:{{userInfo.department}} / 工号:{{userInfo.workId}} / 用户:{{userInfo.userName}}</div>
            <el-dropdown trigger="hover">
              <span class="el-dropdown-link userinfo-inner">
                <el-image :src="face_url" fit="contain" :lazy="true" class="face">
                  <div slot="error" class="image-slot">
                    <img src="@/assets/face/man.png" style="height:45px;width:45px;" />
                  </div>
                </el-image>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="toggleIM">我的消息</el-dropdown-item>
                <el-dropdown-item @click.native="showSetup">设置</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>
        <el-col :span="24" class="main">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            unique-opened
            router
            :collapse="isCollapse"
          >
            <template v-for="(item,index) in $router.options.routes">
              <el-submenu :index="index+''" v-if="(!item.leaf)&&(!item.hidden)" :key="index">
                <template slot="title">
                  <i :class="item.iconCls"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item
                  v-for="child in item.children"
                  :index="child.path"
                  :key="child.path"
                  :disabled="child.meta.dis"
                >
                  <span slot="title">{{child.name}}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                v-if="item.leaf&&item.children.length>0&&!item.hidden"
                :index="item.children[0].path"
                :key="index"
                :disabled="item.children[0].meta.dis"
              >
                <i :class="item.iconCls"></i>
                <span slot="title">{{item.children[0].name}}</span>
              </el-menu-item>
            </template>
          </el-menu>
          <section class="content-container">
            <div class="grid-content bg-purple-light">
              <el-col :span="24" class="breadcrumb-container">
                <strong class="title">{{$route.name}}</strong>
                <el-breadcrumb separator="/" class="breadcrumb-inner">
                  <el-breadcrumb-item
                    v-for="item in $route.matched"
                    :key="item.path"
                  >{{ item.name }}</el-breadcrumb-item>
                </el-breadcrumb>
              </el-col>
              <el-col :span="24" class="content-wrapper">
                <transition name="fade" mode="out-in">
                  <router-view></router-view>
                </transition>
              </el-col>
            </div>
          </section>
        </el-col>
      </el-row>
    </div>
    <el-collapse-transition>
      <div class="leftfloat" v-if="showIM">
        <i
          class="el-icon-close"
          style="position: absolute; top :15px; right:15px; font-size:18px;z-index: 99;"
          @click="toggleIM"
        ></i>
        <el-tabs>
          <el-tab-pane label="在线用户" name="inline_user">
            <div v-for="(item,index) in online_users" :key="index">{{item}}</div>
          </el-tab-pane>
          <el-tab-pane label="系统日志" name="sys_log">
            <div v-for="(item,index) in sys_logs" :key="index">{{item}}</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-collapse-transition>
    <UserSetupCom :user="setupUser" @updateFaceSuccess="chgFaceSuccess"></UserSetupCom>
  </div>
</template>

<script>
import { STATIC_URL, WS_URL } from "@/api/api";
import UserSetupCom from "@/components/user/userSetupCom.vue";

export default {
  data() {
    return {
      userInfo: {},
      setupUser: null,
      showIM: false,
      isCollapse: false,
      path: WS_URL,
      socket: "",
      online_users: [],
      sys_logs: [],
      face_url: ""
    };
  },
  methods: {
    chgFaceSuccess() {
      this.face_url =
        STATIC_URL +
        "/user_face/" +
        this.userInfo.userId +
        ".jpg" +
        "?" +
        Math.random(100);
    },
    onSubmit() {
      console.log("submit!");
    },
    handleselect: function() {},
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("user");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.isCollapse = !this.isCollapse;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },
    toggleIM() {
      this.showIM = !this.showIM;
    },
    showSetup() {
      this.setupUser = { ...this.userInfo };
    },
    init() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(WS_URL);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        //关闭
        this.socket.onclose = this.close;
      }
    },
    open() {
      this.userInfo.scenes = ['SYSLOG','ONLINEUSER'];
      this.socket.send("USERLOGIN^" + JSON.stringify(this.userInfo));
    },
    error() {
      console.log("连接错误");
    },
    getMessage(msg) {
      console.log(msg.data);
      this.sys_logs.push(msg.data);
      
      

    },
    send(msg) {
      this.socket.send(msg);
    },
    close() {
      console.log("socket已经关闭");
    }
  },
  mounted() {
    //1.用户信息
    var userInfo = sessionStorage.getItem("userinfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }
    //2.用户头像
    this.face_url =
      STATIC_URL +
      "user_face/" +
      this.userInfo.userId +
      ".jpg?" +
      Math.random(100);
    //3.WS连接
    this.init();
  },
  destroyed() {
    this.socket.close();
  },
  components: {
    UserSetupCom
  }
};
</script>

<style scoped lang="scss">
$color-primary: #20a0ff; //#18c79c

.face {
  width: 45px;
  height: 45px;
  background: #f5f7fa;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 5px;
}

.leftfloat {
  display: block;
  position: fixed;
  width: 250px;
  height: 500px;
  right: 50px;
  top: 200px;
  border: 1px solid #20a0ff;
  border-radius: 5px;
  background: rgba($color: white, $alpha: 0.8);
  padding: 5px;
}

.headertag {
  position: absolute;
  top: 12px;
  right: 110px;
  color: white;
}

.charttag {
  position: absolute;
  top: 12px;
  right: 30px;
  color: white;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
      }
    }
    .logo {
      width: 200px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 200px;
    }
    .logo-collapse-width {
      width: 64px;
    }
    .tools {
      padding: 0px 23px;
      width: 800px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 200px;
      width: 200px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 64px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }

    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>