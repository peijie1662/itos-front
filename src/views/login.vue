<template>
  <div style="position:relative;">
    <!-- 左边简介 -->
    <div class="animatediv">
      <p
        class="animatetitle"
        style="margin-top:100px;margin-left:100px;"
      >IT Operation And Maintenance System</p>
      <p class="animatetitle-01" style="margin-top:50px;margin-left:100px;">NBCT资讯科技部运维系统</p>
      <p
        class="animatetitle-02"
        style="margin-top:20px;margin-left:100px;"
      >. 使用内容感知，智能提示，图文混排提升输入体验。</p>
      <p
        class="animatetitle-03"
        style="margin-top:20px;margin-left:100px;"
      >. 任务管理，任务调度，任务终端，组成灵活可靠的任务系统。</p>
      <p class="animatetitle-04" style="margin-top:20px;margin-left:100px;">. 文档存储，分类查阅，方便的资料查询中心。</p>
    </div>
    <!-- 右边登录窗口 -->
    <div style="float:left;margin-top:50px;">
      <el-form
        :model="ruleForm2"
        :rules="rules2"
        ref="ruleForm2"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-container"
      >
        <canvas id="canvas" style="margin-left: 30px;"></canvas>
        <section class="title">
          <i class="iconfont icon-icon_crab_coloured icon" style="color:#85b84f;font-size:30px;"></i>
          <h3>资讯科技部运维系统</h3>ITOMS
        </section>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm2.userId" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm2.password"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleSubmit2"
            :loading="logining"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import { APP_URL, login } from "@/api/api";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      logining: false, //是否已登录
      ruleForm2: {
        userId: "",
        password: ""
      },
      rules2: {
        userId: [
          { required: true, message: "请输入用户", trigger: "blur" } //blur 触摸污染
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  methods: {
    ...mapMutations(["update_userInfo"]),
    useqrcode() {
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, APP_URL, function(error) {
        if (error) {
          console.info(error);
        } else {
          console.log("QRCode success!");
        }
      });
    },
    handleSubmit2() {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          this.logining = true;
          this.ruleForm2.userId = this.ruleForm2.userId.toUpperCase();
          let authParams = {
            userId: this.ruleForm2.userId,
            password: this.ruleForm2.password
          };
          login(authParams).then(res => {
            this.logining = false;
            let { flag, data, errMsg } = res;
            if (!flag) {
              this.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              let user = data[0];
              this.update_userInfo(user);
              if (user.firstPage) {
                this.$router.push({ path: user.firstPage });
              } else {
                this.$router.push({ path: "/home" });
              }
            }
          });
        } else {
          this.$message({
            message: "提交到服务器时出错,网络或服务器故障",
            type: "error"
          });
          return false;
        }
      });
    }
  },
  mounted() {
    this.useqrcode();
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 200px;
  height: 500px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}

.animatediv {
  padding: 50px;
  float: left;
  width: 60%;
  height: 600px;
}

div {
  .animatetitle,
  .animatetitle-01,
  .animatetitle-02,
  .animatetitle-03,
  .animatetitle-04 {
    position: relative;
    height: 50px;
    color: transparent;
    animation: fadeIn 2s 1.6s forwards;

    &::before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: scaleX(0);
      transform-origin: left;
      animation: slideRight 2s cubic-bezier(0.75, 0, 0, 1) forwards;
    }
  }

  .animatetitle {
    margin: 0;
    font-family: Wawati SC;
    font-size: 35px;
    line-height: 35px;

    &::before {
      background: #ff4081;
    }
  }

  .animatetitle-01 {
    margin: 10px 0 0 0;
    font-family: Lato, sans-serif;
    font-size: 20px;
    line-height: 30px;
    letter-spacing: 5px;
    text-transform: uppercase;
    animation-delay: 3.2s;

    &::before {
      background: #03a9f4;
      animation-delay: 2s;
    }
  }

  .animatetitle-02 {
    margin: 10px 0 0 0;
    font-family: Lato, sans-serif;
    font-size: 12px;
    line-height: 30px;
    letter-spacing: 5px;
    text-transform: uppercase;
    animation-delay: 5.2s;

    &::before {
      background: #03a9f4;
      animation-delay: 4s;
    }
  }

  .animatetitle-03 {
    margin: 10px 0 0 0;
    font-family: Lato, sans-serif;
    font-size: 12px;
    line-height: 30px;
    letter-spacing: 5px;
    text-transform: uppercase;
    animation-delay: 7.2s;

    &::before {
      background: #03a9f4;
      animation-delay: 6s;
    }
  }

  .animatetitle-04 {
    margin: 10px 0 0 0;
    font-family: Lato, sans-serif;
    font-size: 12px;
    line-height: 30px;
    letter-spacing: 5px;
    text-transform: uppercase;
    animation-delay: 9.2s;

    &::before {
      background: #03a9f4;
      animation-delay: 8s;
    }
  }
}

@keyframes fadeIn {
  to {
    color: black;
  }
}

@keyframes slideRight {
  50% {
    transform: scaleX(1);
    transform-origin: left;
  }

  50.1% {
    transform-origin: right;
  }

  to {
    transform-origin: right;
  }
}
</style>