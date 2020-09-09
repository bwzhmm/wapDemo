<template>
  <!-- 是否有污染物按钮 -->
  <div class="content-btn">
    <template v-for="(item,index) in wasteData">
      <el-button
        plain
        :key="index"
        v-show="item.type==wasteIndex"
        :icon="item.type==wasteIndex ? 'el-icon-check' :''"
        :class="item.type==wasteIndex ? 'blue-btn':'gray-btn'"
        @click="handleChecked(item.type)"
      >{{item.text}}</el-button>
    </template>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
export default {
  name: "waste-btn",
  props: ["wasteData", "wasteActive", "wasteIndex"],
  data() {
    return {
      active: 0
    };
  },
  methods: {
    //点击某项时
    handleChecked(type) {
      this.active = type;
      this.$emit("wasteActive", type);
    }
  }
};
</script>
<style scoped>
.blue-btn {
  background: #fff;
  border-color: #1890ff;
  color: #1890ff;
  padding: 8px 10px;
  border-radius: 5px;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>

