<template>
  <div>
    <div style="position:relative;text-align:center;width:120px;height:80px;font-size:8px;">
      <div :style="topTriangleStyle"></div>
      <div style="position: absolute;top: 2px;right:2px;">
        <span style="color: #cdcdcd;">{{mmodel.serviceName}}</span>
        <span :style="domainColor">{{mmodel.serviceDomain}}</span>
      </div>
      <div style="margin-top:10px;">
        <span>{{mmodel.abs}}</span>
      </div>
      <div :style="bottomTriangleStyle"></div>
    </div>
  </div>
</template>

<script>
import { getCategoryColor } from "@/api/data";

export default {
  data() {
    return {};
  },
  props: ["mmodel"],
  computed: {
    topTriangleStyle() {
      let style = {
        width: "0",
        height: "0",
        borderTop: "20px solid red",
        borderRight: "20px solid transparent",
        borderTopRadius: "5px"
      };
      if (this.mmodel.invalid) {
        style.borderTop = "20px solid " + getCategoryColor(null);
      } else {
        style.borderTop =
          "20px solid " + getCategoryColor(this.mmodel.category);
      }
      return style;
    },
    domainColor() {
      let style = {
        color: "#ddd"
      };
      if (this.mmodel.serviceDomain == "NBCT") style.color = "#FF4500";
      if (this.mmodel.serviceDomain == "OFFICE") style.color = "#00AA88";
      return style;
    },
    bottomTriangleStyle() {
      let style = {
        width: "0",
        height: "0",
        borderBottom: "20px solid red",
        borderLeft: "20px solid transparent",
        position: "absolute",
        bottom: "0px",
        right: "0px"
      };
      if (this.mmodel.invalid) {
        style.borderBottom = "20px solid " + getCategoryColor(null);
      } else {
        style.borderBottom =
          "20px solid " + getCategoryColor(this.mmodel.category);
      }
      return style;
    }
  }
};
</script>

<style scoped>

</style>