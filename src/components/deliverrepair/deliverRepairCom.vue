<template>
  <div>
    <el-dialog :title="drId?'修改委外修理':'新增委外修理'" width="500px" :visible.sync="dialogVisible">
      <el-form ref="form" :model="curDr" label-width="100px">
        <el-form-item
          label="送修时间"
          prop="deliverDate"
          :rules="[
      { required: true, message: '请输入送修时间', trigger: 'blur' }]"
        >
          <el-date-picker type="date" placeholder="选择日期" v-model="curDr.deliverDate" size="mini"></el-date-picker>
        </el-form-item>
        <el-form-item label="收回时间" prop="receiptDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="curDr.receiptDate" size="mini"></el-date-picker>
        </el-form-item>
        <el-form-item label="发票号码">
          <el-input v-model="curDr.invoiceNumber" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="curDr.amount" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="curDr.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveOrUpdateDr" size="mini">保存</el-button>
          <el-button type="danger" @click="delDr" size="mini">删除</el-button>
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addDr, updateDr, deleteDr } from "@/api/api";

export default {
  data() {
    return {
      curDr: "",
      drId: null, //传入的委外ID,可以判断是新增还是修改
      dialogVisible: false
    };
  },
  methods: {
    saveOrUpdateDr: async function() {
      let me = this;
      if (me.drId) {
        await me.editDr();
      } else {
        await me.saveDr();
      }
    },
    saveDr() {
      return new Promise((resolve, reject) => {
        let me = this;
        addDr(me.dr).then(res => {
          let { flag, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            me.$emit("updateTaskSuccess");
            me.dialogVisible = false;
            resolve();
          }
        });
      });
    },
    editDr() {
      return new Promise((resolve, reject) => {
        let me = this;
        updateDr(me.dr).then(res => {
          let { flag, errMsg } = res;
          if (!flag) {
            this.$message({
              message: errMsg,
              type: "error"
            });
            reject();
          } else {
            me.$emit("updateTaskSuccess");
            me.dialogVisible = false;
            resolve();
          }
        });
      });
    },
    delDr() {
      let me = this;
      deleteDr(me.dr).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          this.$message({
            message: errMsg,
            type: "error"
          });
        } else {
          me.$emit("updateTaskSuccess");
          me.dialogVisible = false;
        }
      });
    }
  },
  props: ["dr"],
  watch: {
    dr: {
      handler(newVal) {
        if (newVal != null) {
          this.curDr = newVal;
          this.drId = newVal.drId;
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