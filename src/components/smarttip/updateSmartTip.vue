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
          <el-input v-model="tip.preReg" size="mini" style="width:200px;"></el-input>
        </el-form-item>
        <!-- 提示词 -->
        <p>提示词</p>
        <div class="tipcontent">
          <el-tag
            :key="index"
            v-for="(word,index) in tip.nextWord"
            closable
            :disable-transitions="false"
            @close="handleClose(index)"
            style="margin:5px;"
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
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="updateTip" size="mini" style="margin-left:200px;">保存修改</el-button>
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { updateSmarttips } from "@/api/api";

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
      this.tip.nextWord.splice(index, 1);
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
    updateTip() {
      let me = this;
      me.$refs.form.validate(valid => {
        if (valid) {
          let params = { ...me.tip };
          params.nextWord = params.nextWord || [];
          params.nextWord = params.nextWord.join(",");
          updateSmarttips(params).then(res => {
            let { flag, errMsg } = res;
            if (!flag) {
              this.$message({
                message: errMsg,
                type: "error"
              });
            } else {
              me.$emit("tipUpdateSucess");
              me.dialogVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  props: ["utip"],
  watch: {
    utip: {
      handler(newVal) {
        if (newVal != null) {
          this.tip = newVal;
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

.tipcontent {
  min-height: 100px;
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