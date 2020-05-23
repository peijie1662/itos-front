<template>
  <div>
    <el-dialog title="用户权限设置" width="520px" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <!-- 权限 -->
        <div class="content">
          <el-tree
            ref="tree"
            :data="authority"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
          ></el-tree>
        </div>
        <!-- 按钮 -->
        <div style="overflow:hidden;margin-top:10px;">
          <el-button
            type="warning"
            size="mini"
            style="float:right;margin-left:10px;"
            @click="dialogVisible=false"
          >取消</el-button>
          <el-button type="success" size="mini" style="float:right;" @click="saveAuthority">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import routes from "@/routes";
import { updateAuthority } from "@/api/api";

export default {
  data() {
    return {
      curUser: "",
      authority: [],
      dialogVisible: false
    };
  },
  methods: {
    saveAuthority() {
      let me = this;
      updateAuthority({
        userId: me.curUser.userId,
        authority: me.$refs.tree.getCheckedKeys().join(",")
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
      //1.载入菜单数据
      let route_tree = routes
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
      //2.注入用户数据
      let funIds = this.curUser.authority
        ? this.curUser.authority.split(",")
        : [];
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(funIds);
      });
      this.authority = route_tree;
    }
  },
  props: ["user"],
  watch: {
    user: {
      handler(newVal) {
        if (newVal != null) {
          this.curUser = newVal;
          this.dialogVisible = true;
          this.getAuthority();
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
  min-height: 100px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
}
</style>