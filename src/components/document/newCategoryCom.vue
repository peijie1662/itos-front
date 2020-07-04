<template>
  <div>
    <el-dialog
      title="文档分类"
      width="550px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <div>
        <el-tag
          :key="index"
          v-for="(tag,index) in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          style="margin: 3px;"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">新分类</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addSysCode, delSysCode, listSysCode } from "@/api/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogVisible: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["newCg"],
  watch: {
    newCg: {
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
    //删除类别
    handleClose(tag) {
      let me = this;
      delSysCode({ category: "DOCUMENTCATEGORY", id: tag }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.dynamicTags.splice(me.dynamicTags.indexOf(tag), 1);
        }
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //增加组
    handleInputConfirm() {
      let me = this;
      if (me.inputValue) {
        addSysCode({ category: "DOCUMENTCATEGORY", id: me.inputValue }).then(
          res => {
            let { flag, errMsg } = res;
            if (!flag) {
              me.$message.error(errMsg);
            } else {
              let inputValue = me.inputValue;
              if (inputValue) {
                me.dynamicTags.push(inputValue);
              }
              me.inputVisible = false;
              me.inputValue = "";
            }
          }
        );
      }
    },
    categoryList() {
      let me = this;
      listSysCode({ category: "DOCUMENTCATEGORY" }).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.dynamicTags = data.map(item => {
            return item.id;
          });
        }
      });
    },
    quit() {
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.categoryList();
  }
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin: 3px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin: 3px;
  vertical-align: bottom;
}
</style>