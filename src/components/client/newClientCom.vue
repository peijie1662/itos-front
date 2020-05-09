<template>
  <div>
    <el-dialog title="登记终端" width="500px" :visible.sync="dialogVisible">
      <el-form ref="form" :model="client" label-width="100px">
        <el-form-item
          label="服务名"
          prop="serviceName"
          :rules="[
      { required: true, message: '请输入服务名', trigger: 'blur' }]"
        >
          <el-input v-model="client.serviceName" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="description"
          :rules="[
      { required: true, message: '请输入描述', trigger: 'blur' }]"
        >
          <el-input v-model="client.description" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="任务KEY"
          prop="modelKey"
          :rules="[
      { required: true, message: '请选择任务KEY', trigger: 'blur' }]"
        >
          <el-cascader
            v-model="client.modelKey"
            :options="gps"
            :props="{multiple: true,emitPath:false}"
            clearable
            style="width:100%;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="备注1">
          <el-input type="textarea" v-model="client.remark1"></el-input>
        </el-form-item>
        <el-form-item label="备注2">
          <el-input type="textarea" v-model="client.remark2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveClient" size="mini" style="margin-left:200px;">立即创建</el-button>
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addClient, getGroupList } from "@/api/api";

export default {
  data() {
    return {
      client: "",
      dialogVisible: false
    };
  },
  methods: {
    loadGroupList() {
      return new Promise((resolve, reject) => {
        let me = this;
        getGroupList({}).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            me.gpList = data;
            me.gpList.push({
              groupId: "XXX",
              groupName: "NOGROUP",
              groupDesc: "不分组模版"
            });
            me.gpList.forEach(gp => {
              gp.value = gp.groupId;
              gp.label = gp.groupDesc;
              gp.children = [];
            });
            resolve();
          }
        });
      });
    },
    saveClient() {
      let me = this;
      me.$refs.form.validate(valid => {
        if (valid) {
          me.client.modelKey = me.client.modelKey.join(",");
          addClient(me.client).then(res => {
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
        } else {
          return false;
        }
      });
    }
  },
  props: ["nclient", "gps"],
  watch: {
    nclient: {
      handler(newVal) {
        if (newVal != null) {
          this.client = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    },
    mmodel: {
      handler: async function(newVal) {
        let me = this;
        if (newVal != null) {
          //1.载入组
          await me.loadGroupList();
          //2.组合
          me.gpList.forEach(gp => {
            newVal.forEach(m => {
              if (
                m.groupId == gp.groupId ||
                (!m.groupId && gp.groupId == "XXX")
              ) {
                gp.children.push({ value: m.modelId, label: m.abs });
              }
            });
          });
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
  min-height: 400px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  padding: 10px;
}
</style>