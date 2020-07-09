<template>
  <div>
    <el-dialog title="场景编辑" width="800px" :visible.sync="dialogVisible">
        <div>
            


        </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//import { addAppInfo } from "@/api/api";

export default {
  data() {
    return {
      app: "",
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    saveApp() {


    }
  },
  props: ["sceneApp"],
  watch: {
    sceneApp: {
      handler(newVal) {
        if (newVal != null) {
          this.scene = newVal.scene;
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