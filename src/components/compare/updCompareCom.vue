<template>
  <div>
    <el-dialog
      title="修改比对项"
      width="550px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- 1.比对分组 -->
        <el-form-item label="比对分组" prop="compareGroup">
          <el-select
            v-model="form.compareGroup"
            placeholder="请选择"
            size="mini"
            filterable
            allow-create
            default-first-option
          >
            <el-option v-for="item in compareGroups" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 2.文件路径 -->
        <el-form-item label="文件路径" prop="filePath">
          <el-input v-model="form.filePath" size="mini" style="width:300px;"></el-input>
        </el-form-item>
        <!-- 3.简介 -->
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="form.fileName" size="mini" style="width:300px;"></el-input>
        </el-form-item>
        <!-- 4.执行终端 -->
        <el-form-item label="执行终端" prop="serviceName">
          <el-select v-model="form.serviceName" placeholder="请选择" size="mini">
            <el-option
              v-for="item in clients"
              :key="item.serviceName"
              :label="item.serviceName"
              :value="item.serviceName"
              style="width:350px;"
            >
              <span style="float: left">{{ item.description }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.serviceName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 5.按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini">保存</el-button>
          <el-button @click="dialogVisible = false" size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { updCompare } from "@/api/api";

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      rules: {
        compareGroup: [
          { required: true, message: "请输入比对分组", trigger: "blur" }
        ],
        filePath: [
          { required: true, message: "请输入比对文件路径", trigger: "blur" }
        ],
        fileName: [
          { required: true, message: "请输入比对文件名", trigger: "blur" }
        ],
        serviceName: [
          { required: true, message: "请输入关联的执行终端", trigger: "blur" }
        ]
      }
    };
  },
  props: ["updCompare", "clients", "compareGroups"],
  watch: {
    updCompare: {
      handler(newVal) {
        if (newVal != null) {
          this.form = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onSubmit() {
      let me = this;
      updCompare(me.form).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.$emit("updateSuccess");
          me.dialogVisible = false;
        }
      });
    },
    quit() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
</style>