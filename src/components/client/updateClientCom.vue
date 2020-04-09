<template>
  <div>
    <el-dialog title="修改终端" width="500px" :visible.sync="dialogVisible">
      <el-form ref="form" :model="client" label-width="100px">
        <el-form-item label="服务名" prop="serviceName">{{client.serviceName}}</el-form-item>
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
            :options="gpList"
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
import { updateClient, serverReloadClient, getGroupList } from "@/api/api";

export default {
  data() {
    return {
      client: "",
      gpList: [],
      dialogVisible: false
    };
  },
  methods: {
    updateClient() {
      let me = this;
      me.$refs.form.validate(valid => {
        if (valid) {
          me.client.modelKey = me.client.modelKey.join(",");
          updateClient(me.client).then(res => {
            let { flag, errMsg } = res;
            if (!flag) {
              this.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              me.dialogVisible = false;
              serverReloadClient({}).then(res => {
                let { flag } = res;
                if (flag) {
                  me.$emit("updateClientSuccess");
                }
              });
            }
          });
        } else {
          return false;
        }
      });
    },
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
            me.gpList.forEach(gp => {
              gp.value = gp.groupId;
              gp.label = gp.groupDesc;
              gp.children = [];
            });
            resolve();
          }
        });
      });
    }
  },
  props: ["uclient", "mmodel"],
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
              if (m.groupId == gp.groupId) {
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