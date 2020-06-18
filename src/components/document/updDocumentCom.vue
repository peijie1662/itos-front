<template>
  <div>
    <el-dialog
      title="文档修改"
      width="550px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- 1.分类 -->
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择" size="mini">
            <el-option v-for="item in categorys" :key="item.id" :label="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 2.分组 -->
        <el-form-item label="分组" prop="groupId">
          <el-select v-model="form.groupId" placeholder="请选择" size="mini">
            <el-option v-for="item in groups" :key="item.id" :label="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 3.简介 -->
        <el-form-item label="简介" prop="abs">
          <el-input type="textarea" v-model="form.abs"></el-input>
        </el-form-item>
        <!-- 4.按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini">保存</el-button>
          <el-button @click="dialogVisible = false" size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { groupList, categoryList, updDocument } from "@/api/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogVisible: false,
      categorys: [], //文档分类
      groups: [], //文档分组
      form: {}, //上传文本内容
      rules: {
        category: [
          { required: true, message: "请输入文档分类", trigger: "blur" }
        ],
        abs: [{ required: true, message: "请输入文档简介", trigger: "blur" }],
        groupId: [
          { required: true, message: "请输入文档分组", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["updDoc"],
  watch: {
    updDoc: {
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
      updDocument(me.form).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.$emit("updateSuccess");
          me.dialogVisible = false;
        }
      });
    },
    quit() {
      this.dialogVisible = false;
    },
    groupList() {
      let me = this;
      groupList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.groups = data;
        }
      });
    },
    categoryList() {
      let me = this;
      categoryList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.categorys = data;
        }
      });
    }
  },
  mounted() {
    this.groupList();
    this.categoryList();
  }
};
</script>

<style scoped>
</style>