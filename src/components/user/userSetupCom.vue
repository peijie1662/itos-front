<template>
  <div>
    <el-dialog title="我的设置" width="480px" :visible.sync="dialogVisible">
      <div>
        <!-- 1. 首页 -->
        <span>我的首页</span>
        <div class="content">
          <el-cascader
            v-model="first_page"
            :options="paths"
            :props="{ expandTrigger: 'hover' }"
            size="mini"
            style="margin-top:30px;margin-left:70px;"
          ></el-cascader>
          <el-button
            size="mini"
            style="float:right;margin-top:30px;margin-right:80px;"
            @click="saveFirstPage"
          >保存首页</el-button>
        </div>
        <!-- 2.头像 -->
        <span>我的头像</span>
        <div class="content">
          <el-image :src="face_url" fit="contain" class="face">
            <div slot="error" class="image-slot">
              <img src="@/assets/face/man.png" style="width:100px;height:100px;" />
            </div>
          </el-image>
          <el-upload
            :action="uploadUrl"
            :data="{'userId':curUser.userId}"
            :show-file-list="false"
            :on-success="handlerSuccess"
            style="float:right;margin-top:70px;margin-right:80px;"
          >
            <el-button size="mini">上传头像</el-button>
          </el-upload>
        </div>
        <!-- 3.密码 -->
        <span>密码修改</span>
        <div class="content">
          <div class="passdiv">
            <el-input
              placeholder="请输入原来密码"
              v-model="oldPass"
              show-password
              size="mini"
              style="width:200px;"
            ></el-input>
          </div>
          <div class="passdiv">
            <el-input
              placeholder="请输入新密码"
              v-model="newPass"
              show-password
              size="mini"
              style="width:200px;"
            ></el-input>
          </div>
          <div class="passdiv">
            <el-input
              placeholder="请重复新密码"
              v-model="finNewPass"
              show-password
              size="mini"
              style="width:200px;"
            ></el-input>
          </div>
          <el-button
            size="mini"
            style="float:right;margin-top:-27px;margin-right:80px;"
            @click="savePassword"
          >保存密码</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.passdiv {
  margin-top: 5px;
  margin-left: 50px;
}

.content {
  min-height: 100px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.face {
  margin-left: 150px;
  width: 100px;
  height: 100px;
  background: #f5f7fa;
  border-radius: 50%;
  overflow: hidden;
}
</style>

<script>
import {
  STATIC_URL,
  UPLOAD_FACE_URL,
  updateFirstPage,
  updatePassword
} from "@/api/api";
import routes from "@/routes";

export default {
  data() {
    return {
      dialogVisible: false,
      curUser: "",
      //
      face_url: "",
      uploadUrl: UPLOAD_FACE_URL,
      //
      first_page: [],
      paths: [],
      //
      oldPass: "",
      newPass: "",
      finNewPass: ""
    };
  },
  props: ["user"],
  watch: {
    user: {
      handler(newVal) {
        if (newVal != null) {
          //1.载入头像
          this.curUser = newVal;
          this.face_url =
            STATIC_URL +
            "/user_face/" +
            this.curUser.userId +
            ".jpg" +
            "?" +
            Math.random(100);
          //2.载入菜单
          this.getAuthority();
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    savePassword() {
      let me = this;
      if (me.oldPass.trim() == "") {
        me.$message.error("请输入原来密码。");
      }
      if (me.newPass.trim() == "") {
        me.$message.error("请输入新密码。");
      }
      if (me.newPass != me.finNewPass) {
        me.$message.error("密码重复错误，请重新输入。");
      }
      updatePassword({
        userId: me.curUser.userId,
        oldPass: me.oldPass,
        newPass: me.newPass
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.dialogVisible = false;
        }
      });
    },
    saveFirstPage() {
      let me = this;
      updateFirstPage({
        userId: me.curUser.userId,
        firstPage: me.first_page.length > 1 ? me.first_page[1] : "/"
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.$emit("updateUserSuccess");
          me.dialogVisible = false;
        }
      });
    },
    getAuthority() {
      let funIds = this.curUser.authority.split(",");
      let route_tree = routes
        .filter(item => {
          return !item.hidden;
        })
        .map(item => {
          let r = {};
          r.value = item.path;
          r.label = item.name;
          if (item.children) {
            r.children = item.children.map(child => {
              return {
                value: child.path,
                label: child.name,
                disabled: funIds.indexOf(child.meta.funId) < 0
              };
            });
            r.disabled = r.children.every(item => {
              return item.disabled;
            });
          }
          return r;
        });
      this.paths = route_tree;
      this.first_page = ["/", this.curUser.firstPage];
    },
    handlerSuccess() {
      this.face_url =
        STATIC_URL +
        "/user_face/" +
        this.curUser.userId +
        ".jpg" +
        "?" +
        Math.random(100);
      this.$emit("updateFaceSuccess");
    }
  }
};
</script>