<template>
  <div>
    <el-dialog title="修改服务" width="600px" :visible.sync="dialogVisible">
      <el-form ref="form" :model="app" label-width="120px">
        <!-- 服务名 -->
        <el-form-item
          label="服务名"
          prop="serviceName"
          :rules="[{required: true, message: '请输入服务名', trigger: 'blur' },
          {max: 10, message: '长度不能超过10个字符', trigger: 'blur' }]"
        >
          <el-input v-model="app.serviceName" size="mini" style="width:200px;"></el-input>
        </el-form-item>
        <!-- 服务对象 -->
        <el-form-item
          label="服务对象"
          prop="serviceObj"
          :rules="[{required: true, message: '请输入服务对象', trigger: 'blur' }]"
        >
          <el-input v-model="app.serviceObj" size="mini" style="width:200px;"></el-input>
        </el-form-item>
        <!-- 服务简介 -->
        <el-form-item
          label="服务简介"
          prop="serviceAbs"
          :rules="[{required: true, message: '请输入服务简介', trigger: 'blur'},
          {max: 10, message: '长度不能超过10个字符', trigger: 'blur' }]"
        >
          <el-input v-model="app.serviceAbs" size="mini" style="width:200px;"></el-input>
        </el-form-item>
        <!-- 服务类别 -->
        <el-form-item
          label="服务类别"
          prop="serviceType"
          :rules="[{required: true, message: '请输入服务类别', trigger: 'blur'}]"
        >
          <el-select v-model="app.serviceType" size="mini">
            <el-option label="APP-SOCKET" value="APP-SOCKET"></el-option>
            <el-option label="APP-HTTP" value="APP-HTTP"></el-option>
            <el-option label="REG" value="REG"></el-option>
            <el-option label="WEBSERVICE" value="WEBSERVICE"></el-option>
            <el-option label="DATABASE" value="DATABASE"></el-option>
            <el-option label="NGINX" value="NGINX"></el-option>
          </el-select>
        </el-form-item>
        <!-- 服务描述 -->
        <el-form-item
          label="服务详细描述"
          prop="serviceDesc"
          :rules="[{required: true, message: '请输入服务详细描述', trigger: 'blur'}]"
        >
          <el-input v-model="app.serviceDesc" size="mini"></el-input>
        </el-form-item>
        <!-- IP -->
        <el-form-item
          label="服务IP"
          prop="ip"
          :rules="[{required: true, message: '请输入服务IP', trigger: 'blur'}]"
        >
          <el-input v-model="app.ip" size="mini" style="width:200px;"></el-input>
        </el-form-item>
        <!-- IP -->
        <el-form-item
          label="服务PORT"
          prop="port"
          :rules="[{required: true, message: '请输入服务PORT', trigger: 'blur'}]"
        >
          <el-input v-model="app.port" type="number" size="mini" style="width:200px;"></el-input>
        </el-form-item>
        <!-- 所在区域 -->
        <el-form-item
          label="所在区域"
          prop="domain"
          :rules="[{required: true, message: '请输入所在区域', trigger: 'blur'}]"
        >
          <el-select v-model="app.domain" size="mini">
            <el-option label="PRD" value="PRD"></el-option>
            <el-option label="OFFICE" value="OFFICE"></el-option>
            <el-option label="DMZ" value="DMZ"></el-option>
          </el-select>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="app.remark" size="mini"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="saveApp" size="mini" style="margin-left:100px;">修改</el-button>
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { updAppInfo } from "@/api/api";

export default {
  data() {
    return {
      app: "",
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    saveApp() {
      let me = this;
      me.$refs.form.validate(valid => {
        if (valid) {
          me.app.visible = "Y"; //默认可见
          me.app.oper = me.userInfo.userId;
          me.app.port = Number(me.app.port);
          me.app.remark = me.app.remark || "";
          updAppInfo(me.app).then(res => {
            let { flag, errMsg } = res;
            if (!flag) {
              me.$message.error(errMsg);
            } else {
              me.$message.success("修改服务信息成功");
              me.dialogVisible = false;
              me.$emit("updateAppSuccess");
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  props: ["chgAppInfo"],
  watch: {
    chgAppInfo: {
      handler(newVal) {
        if (newVal != null) {
          this.app = newVal;
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
  min-height: 400px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  padding: 10px;
}
</style>