<template>
  <div>
    <el-dialog title="用户信息修改" width="520px" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <div>
          <span>部门</span>
          <el-select v-model="curUser.department" placeholder="请选择" size="mini" :clearable="true" style="margin-left:20px;">
            <el-option
              v-for="item in [{value:'SD',label:'胜达'},{value:'ITD',label:'NBCT'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        
        <!-- 按钮 -->
        <div style="overflow:hidden;margin-top:10px;">
          <el-button
            type="warning"
            size="mini"
            style="float:right;margin-left:10px;"
            @click="dialogVisible=false"
          >取消</el-button>
          <el-button type="success" size="mini" style="float:right;" @click="saveTask">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.content {
  min-height: 100px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
}
</style>

<script>
export default {
  data() {
    return {
      userInfo: "",
      dialogVisible: false,
      curUser: ""
    };
  },
  props: ["user"],
  watch: {
    user: {
      handler(newVal) {
        if (newVal != null) {
          this.curUser = newVal;
          this.dialogVisible = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    saveTask() {}
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  }
};
</script>