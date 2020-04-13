<template>
  <div>
    <div style="position:relative;text-align:center;width:120px;height:80px;">
      <div :style="topTriangleStyle()"></div>
      <span class="title">{{mmodel.abs}}</span>
      <div :style="bottomTriangleStyle()"></div>
    </div>
  </div>
</template>

<script>
import { getCategoryColor } from "@/api/data";

export default {
  props: ["mmodel"],
  methods: {
    topTriangleStyle() {
      let mstyle = {
        width: "0",
        height: "0",
        borderTop: "20px solid red",
        borderRight: "20px solid transparent",
        borderTopRadius: "5px"
      };
      if (this.mmodel.invalid) {
        mstyle.borderTop = "20px solid " + getCategoryColor(null);
      } else {
        mstyle.borderTop =
          "20px solid " + getCategoryColor(this.mmodel.category);
      }
      return mstyle;
    },
    bottomTriangleStyle() {
      let mstyle = {
        width: "0",
        height: "0",
        borderBottom: "20px solid red",
        borderLeft: "20px solid transparent",
        position: "absolute",
        bottom: "0px",
        right: "0px"
      };
      if (this.mmodel.invalid) {
        mstyle.borderBottom = "20px solid " + getCategoryColor(null);
      } else {
        mstyle.borderBottom =
          "20px solid " + getCategoryColor(this.mmodel.category);
      }
      return mstyle;
    }
  }
};
</script>

<style scoped>

.title{
  font-size: 8px;
}

</style>