<template>
  <!-- 是否有污染物按钮 -->
  <div class="content-btn">
    <template v-for="(item,index) in wasteData">
      <el-button
        plain
        :key="index"
        size="small"
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
}
.gray-btn {
  color: #999999;
  border-color: #f2f2f2;
  background: #fefdff;
  padding: 8px 10px;
}
.el-button:first-child {
  border-radius: 5px 0 0 5px;
}
.el-button:nth-child(2) {
  border-radius: 0 5px 5px 0;
}
.el-button + .el-button {
  margin-left: 0px;
}
/* .el-button--small,
.el-button--small.is-round {
  padding: 8px 10px;
} */
</style>

