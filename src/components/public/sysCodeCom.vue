<template>
  <div>
    <el-dialog
      :title="title"
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
        <el-button v-else class="button-new-tag" size="small" @click="showInput">新场景</el-button>
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
      inputValue: "",
      title: "",
      category: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["sysCode"],
  watch: {
    sysCode: {
      handler: async function(newVal) {
        if (newVal != null) {
          this.category = newVal.category;
          this.title = newVal.title;
          await this.groupList();
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    //删除代码
    handleClose(tag) {
      let me = this;
      delSysCode({ category: me.category, id: tag }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.dynamicTags.splice(me.dynamicTags.indexOf(tag), 1);
          me.$emit("updateSuccess");
        }
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //增加代码
    handleInputConfirm() {
      let me = this;
      if (me.inputValue) {
        addSysCode({ category: me.category, id: me.inputValue }).then(res => {
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
            me.$emit("updateSuccess");
          }
        });
      }
    },
    groupList() {
      return new Promise((resolve, reject) => {
        let me = this;
        listSysCode({ category: me.category }).then(res => {
          let { flag, data, errMsg } = res;
          if (!flag) {
            me.$message.error(errMsg);
            reject();
          } else {
            me.dynamicTags = data.map(item => {
              return item.id;
            });
            resolve();
          }
        });
      });
    },
    quit() {
      this.dialogVisible = false;
    }
  },
  mounted() {}
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