<template>
  <div>
    <el-dialog
      title="文档上传"
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
        <el-form-item label="简介" prop="abstract">
          <el-input type="textarea" v-model="form.abstract"></el-input>
        </el-form-item>
        <!-- 4.上传文件 -->
        <el-form-item>
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :data="{...form,userId:userInfo.userId}"
            :on-success="uploadSuccess"
            accept=".pdf"
            :limit="1"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="mini"
              type="success"
              @click="submitUpload"
            >上传到服务器</el-button>
            <el-button size="mini" @click="quit">取消</el-button>
            <div slot="tip">只能上传PDF文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { UPLOAD_DOCUMENT_URL, groupList, categoryList } from "@/api/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogVisible: false,
      uploadUrl: UPLOAD_DOCUMENT_URL,
      categorys: [], //文档分类
      groups: [], //文档分组
      form: {}, //上传文本内容
      fileList: [], //上传文件列表
      rules: {
        category: [
          { required: true, message: "请输入文档分类", trigger: "blur" }
        ],
        abstract: [
          { required: true, message: "请输入文档简介", trigger: "blur" }
        ],
        groupId: [
          { required: true, message: "请输入文档分组", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["newDoc"],
  watch: {
    newDoc: {
      handler(newVal) {
        if (newVal != null) {
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    submitUpload() {
      let me = this;
      me.$refs.form.validate(valid => {
        if (valid) {
          me.$refs.upload.submit();
          me.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    uploadSuccess() {
      this.$refs.upload.clearFiles();
      this.$refs.form.resetFields();
      this.$emit("updateSuccess");
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