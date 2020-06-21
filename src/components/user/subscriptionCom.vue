<template>
  <div>
    <el-dialog title="用户短信订阅" width="700px" :visible.sync="dialogVisible">
      <div style="position:relative;">
        <!-- 订阅 -->
        <div class="content">
          <el-transfer
            v-model="selTopic"
            :data="topics"
            :props="{key:'id',label:'desc'}"
            :titles="['可订阅','已订阅']"
          ></el-transfer>
        </div>
        <!-- 按钮 -->
        <div style="overflow:hidden;margin-top:10px;">
          <el-button
            type="warning"
            size="mini"
            style="float:right;margin-left:10px;"
            @click="dialogVisible=false"
          >取消</el-button>
          <el-button type="success" size="mini" style="float:right;" @click="saveSubscription">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { smsSubscription, getTopicList } from "@/api/api";

export default {
  data() {
    return {
      curUser: "",
      topics: [],
      selTopic: [],
      dialogVisible: false
    };
  },
  methods: {
    saveSubscription() {
      let me = this;
      smsSubscription({
        userId: me.curUser.userId,
        subscription: me.selTopic.join(",")
      }).then(res => {
        let { flag, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.$emit("updateUserSuccess");
          me.dialogVisible = false;
        }
      });
    },
    getTopicList() {
      let me = this;
      getTopicList({}).then(res => {
        let { flag, data, errMsg } = res;
        if (!flag) {
          me.$message.error(errMsg);
        } else {
          me.topics = data;
        }
      });
    }
  },
  props: ["user"],
  watch: {
    user: {
      handler(newVal) {
        if (newVal != null) {
          this.curUser = newVal;
          this.selTopic = this.curUser.subscription
            ? this.curUser.subscription.split(",")
            : [];
          this.dialogVisible = true;
          this.getTopicList();
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
  min-height: 100px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
}
</style>