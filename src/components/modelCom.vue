<template>
  <div>
    <div class="outer">
      <div :style="triangleStyle"></div>
      <!-- 按钮 -->
      <div style="position: absolute;top: 2px;right: 2px;">
        <i class="el-icon-more" @click="modelDetail" style="font-size:20px;color:#909399;"></i>
      </div>
      <!-- 简介 -->
      <div style="text-align: center;">
        <span style="line-height:50px;font-size:18px;">{{taskModel.abs}}</span>
      </div>
    </div>
    <!-- 模版详情 -->
    <modelDetailCom :tmodel="detailModel" @modelUpdateOk="modelUpdateOk"></modelDetailCom>
  </div>
</template>

<script>
import { getCategoryColor } from "@/api/data";
import modelDetailCom from "@/components/modelDetailCom.vue";

export default {
  data() {
    return {
      detailModel: null,
      taskModel: "",
      triangleStyle: {
        width: "0",
        height: "0",
        borderTop: "30px solid red",
        borderRight: "30px solid transparent"
      }
    };
  },
  methods: {
    modelDetail() {
      this.detailModel = { ...this.taskModel };
    },
    modelUpdateOk() {
      this.$emit("modelUpdateOk");
    }
  },
  props: ["tmodel"],
  watch: {
    tmodel: {
      handler(newVal) {
        this.taskModel = newVal;
        if (newVal.category == "COMMON") {
          this.triangleStyle.borderTop =
            "30px solid " + getCategoryColor("COMMON");
        } else if (newVal.category == "CMD") {
          this.triangleStyle.borderTop =
            "30px solid " + getCategoryColor("CMD");
        } else if (newVal.category == "PROCEDURE") {
          this.triangleStyle.borderTop =
            "30px solid " + getCategoryColor("PROCEDURE");
        } else {
          this.triangleStyle.borderTop = "30px solid #909399 ";
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    modelDetailCom
  }
};
</script>

<style scoped>
.outer {
  width: 160px;
  height: 120px;
  border: 1px solid #909399;
  position: relative;
  border-radius: 5px;
  box-shadow: 2px 2px 3px #909399;
}

.el-icon-more:hover {
  color: white;
  background: #409eff;
}
</style>