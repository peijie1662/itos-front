<template>
  <div>
    <el-dialog title="用户信息修改" width="520px" :visible.sync="dialogVisible">
      <div>
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
        <!-- 按钮 -->
        <div style="overflow:hidden;margin-top:10px;">
          <el-button
            type="warning"
            size="mini"
            style="float:right;margin-left:10px;"
            @click="dialogVisible=false"
          >取消</el-button>
          <el-button type="success" size="mini" style="float:right;" @click="saveContent">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.content {
  min-height: 100px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
}
</style>

<script>
import { updateContent } from "@/api/api";

export default {
  data() {
    return {
      userInfo: "",
      dialogVisible: false,
      curUser: ""
    };
  },
  props: ["user"],
  watch: {
    user: {
      handler(newVal) {
        if (newVal != null) {
          this.curUser = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    saveContent() {
      let me = this;
      updateContent({
        ...me.curUser
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
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>