<template>
  <div>
    <el-dialog title="修改智能提示" width="500px" :visible.sync="dialogVisible">
      <el-form ref="form" :model="tip" label-width="100px">
        <!-- 正则表达式 -->
        <el-form-item
          label="正则"
          prop="preReg"
          :rules="[
      { required: true, message: '请输入正则', trigger: 'blur' }]"
        >
          <el-input v-model="tip.preReg" size="mini"></el-input>
        </el-form-item>
        <!-- 提示词 -->
        <div>
          <el-tag
            :key="index"
            v-for="(word,index) in tip.words"
            closable
            :disable-transitions="false"
            @close="handleClose(index)"
          >{{word}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tip</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
//import { updateSmarttips } from "@/api/api";

export default {
  data() {
    return {
      tip: "",
      dialogVisible: false,
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    handleClose(index) {
      this.tip.words.splice(index, 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tip.nextWord.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    updateSmartTip() {
      let me = this;
      me.$refs.form.validate(valid => {
        return valid;
      });
    }
  },
  props: ["utip"],
  watch: {
    utip: {
      handler(newVal) {
        if (newVal != null) {
          this.tip = newVal;
          this.tip.words = this.tip.nextWord.split(",");
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

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>