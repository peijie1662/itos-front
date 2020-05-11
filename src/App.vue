<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import socket from "@/api/socket";

export default {
  name: "app",
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
      let route = sessionStorage.getItem("curRoute");
      if (route && route != "/login") {
        this.$router.push(route);
      }
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
      sessionStorage.setItem("curRoute", this.$router.currentRoute.path);
    });
    //初始化WebSocket
    socket.initPrd()
    socket.initOffice()
  },
  mounted() {
    this.timer = setInterval(() => {
      //console.info("hahah");
    }, 5000);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
    });
  },
  destroyed() {
    //关闭WebSocket
    socket.close();
  }
};
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
  list-style: none;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.el-submenu [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}

.el-menu-item [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}

.toolbar {
  background: #f2f2f2;
  padding: 10px;
  //border:1px solid #dfe6ec;
  margin: 10px 0px;
  .el-form-item {
    margin-bottom: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>