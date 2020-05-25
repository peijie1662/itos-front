<template>
  <div>
    <el-dialog title="修改终端" width="500px" :visible.sync="dialogVisible">
      <el-form ref="form" :model="client" label-width="100px">
        <el-form-item label="服务名" prop="serviceName">{{client.serviceName}}</el-form-item>
        <!-- 域 -->
        <el-form-item
          label="所属域"
          prop="domain"
          :rules="[
      { required: true, message: '请选择所属域', trigger: 'blur' }]"
        >
          <el-select v-model="client.domain" size="mini" placeholder="请选择所属域">
            <el-option label="OFFICE" value="OFFICE"></el-option>
            <el-option label="NBCT" value="NBCT"></el-option>
          </el-select>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item
          label="描述"
          prop="description"
          :rules="[
      { required: true, message: '请输入描述', trigger: 'blur' }]"
        >
          <el-input v-model="client.description" size="mini"></el-input>
        </el-form-item>
        <!-- 任务KEY -->
        <el-form-item label="任务KEY">
          <el-cascader
            v-model="client.modelKey"
            :options="gps"
            :props="{multiple: true,emitPath:false}"
            clearable
            style="width:100%;"
          ></el-cascader>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注1">
          <el-input type="textarea" v-model="client.remark1"></el-input>
        </el-form-item>
        <el-form-item label="备注2">
          <el-input type="textarea" v-model="client.remark2"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="updateClient"
            size="mini"
            style="margin-left:200px;"
          >保存修改</el-button>
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { updateClient } from "@/api/api";

export default {
  data() {
    return {
      client: "",
      dialogVisible: false
    };
  },
  methods: {
    updateClient() {
      let me = this;
      me.$refs.form.validate(valid => {
        if (valid) {
          me.client.modelKeyStr = me.client.modelKey.join(",");
          updateClient(me.client).then(res => {
            let { flag, errMsg } = res;
            if (!flag) {
              this.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              me.dialogVisible = false;
              me.$emit("updateClientSuccess");
            }
          });
        }
      });
    }
  },
  props: ["uclient", "gps"],
  watch: {
    uclient: {
      handler(newVal) {
        if (newVal != null) {
          this.client = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }   
  },
};
</script>

<style scoped>
.content {
  min-height: 400px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  padding: 10px;
}
</style>