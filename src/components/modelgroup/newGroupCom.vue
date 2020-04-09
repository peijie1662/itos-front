<template>
  <div>
    <el-dialog
      title="添加模版组"
      width="550px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <el-form ref="form" :model="gp" label-width="100px">
        <!-- 1.模版组ID -->
        <el-form-item
          label="分组ID"
          prop="groupName"
          :rules="[
      { required: true, message: '请输入分组ID', trigger: 'blur' }]"
        >
          <el-input v-model="gp.groupName" size="mini" style="width:200px;"></el-input>
        </el-form-item>
        <!-- 2.分组描述 -->
        <el-form-item
          label="分组描述"
          prop="groupDesc"
          :rules="[
      { required: true, message: '请输入分组描述', trigger: 'blur' }]"
        >
          <el-input v-model="gp.groupDesc" size="mini" style="width:200px;"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="saveGp" size="mini" style="margin-left:200px;">保存</el-button>
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addModelGroup } from "@/api/api";

export default {
  data() {
    return {
      gp: "",
      dialogVisible: false
    };
  },
  props: ["ngp"],
  watch: {
    ngp: {
      handler(newVal) {
        if (newVal != null) {
          this.gp = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    saveGp() {
      let me = this;
      me.$refs.form.validate(valid => {
        if (valid) {
          let params = { ...me.gp };
          params.groupOrder = 99;
          addModelGroup(params).then(res => {
            let { flag, errMsg } = res;
            if (!flag) {
              this.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              me.$emit("groupUpdateSucess");
              me.dialogVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>