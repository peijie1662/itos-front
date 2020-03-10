<template>
  <div>
    <el-dialog title="新用户" width="700px" :visible.sync="dialogVisible">
      <div style="position:relative;overflow:hidden;">
        <!-- 用户内容 -->
        <div class="content" style="float:left;">
          <!-- 1.部门 -->
          <div>
            <span>部门</span>
            <el-select
              v-model="curUser.department"
              placeholder="请选择"
              size="mini"
              :clearable="true"
              style="margin-left:20px;width:200px;"
            >
              <el-option
                v-for="item in [{value:'SD',label:'胜达'},{value:'NBCT',label:'NBCT'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <!-- 2.用户ID -->
          <div>
            <span>编号</span>
            <el-input
              v-model="curUser.userId"
              placeholder="请输入ID"
              size="mini"
              style="margin-left:20px;margin-top:10px;width:200px;"
            ></el-input>
          </div>
          <!-- 2.姓名 -->
          <div>
            <span>姓名</span>
            <el-input
              v-model="curUser.userName"
              placeholder="请输入"
              size="mini"
              style="margin-left:20px;margin-top:10px;width:200px;"
            ></el-input>
          </div>
          <!-- 3.工号 -->
          <div>
            <span>工号</span>
            <el-input
              v-model="curUser.workId"
              placeholder="请输入"
              size="mini"
              style="margin-left:20px;margin-top:10px;width:200px;"
            ></el-input>
          </div>
          <!-- 4. 手机-->
          <div>
            <span>手机</span>
            <el-input
              v-model="curUser.phone"
              placeholder="请输入"
              size="mini"
              style="margin-left:20px;margin-top:10px;width:200px;"
            ></el-input>
          </div>
          <!-- 5. 短号-->
          <div>
            <span>短号</span>
            <el-input
              v-model="curUser.shortPhone"
              placeholder="请输入"
              size="mini"
              style="margin-left:20px;margin-top:10px;width:200px;"
            ></el-input>
          </div>
          <!-- 6. 角色-->
          <div>
            <span>角色</span>
            <el-select
              v-model="curUser.role"
              placeholder="请选择"
              size="mini"
              :clearable="true"
              style="margin-left:20px;margin-top:10px;width:200px;"
            >
              <el-option
                v-for="item in [{value:'ADMIN',label:'管理员'},{value:'JUNIOR',label:'初级用户'},{value:'SENIOR',label:'高级用户'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <!-- 权限信息 -->
        <div class="content" style="float:right;width:300px;">
          <el-tree
            ref="tree"
            :data="authority"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
          ></el-tree>
        </div>
      </div>
      <!-- 按钮 -->
      <div style="overflow:hidden;margin-top:10px;">
        <el-button
          type="warning"
          size="mini"
          style="float:right;margin-left:10px;"
          @click="dialogVisible=false"
        >取消</el-button>
        <el-button type="success" size="mini" style="float:right;" @click="saveUser">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import routes from "@/routes";
import { addUser } from "@/api/api";

export default {
  data() {
    return {
      curUser: "",
      authority: [],
      dialogVisible: false
    };
  },
  methods: {
    saveUser() {
      let me = this;
      me.curUser.authority = me.$refs.tree.getCheckedKeys().join(",");
      addUser({
        ...me.curUser
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.dialogVisible = false;
          me.$emit("updateUserSuccess");
        }
      });
    },
    getAuthority() {
      this.authority = routes
        .filter(item => {
          return !item.hidden;
        })
        .map(item => {
          let r = {};
          r.id = item.funId;
          r.label = item.name;
          if (item.children) {
            r.children = item.children.map(child => {
              return {
                id: child.meta.funId,
                label: child.name
              };
            });
          }
          return r;
        });
    }
  },
  props: ["user"],
  watch: {
    user: {
      handler(newVal) {
        if (newVal != null) {
          this.curUser = newVal;
          this.getAuthority();
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>
.content {
  height: 450px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  padding: 10px;
}
</style>