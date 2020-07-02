<template>
  <div class="app">
    <router-view v-if="!$route.meta.keepAlive" />
    <div v-else>
      <head-nav></head-nav>
      <div class="menu_content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import HeadNav from "./components/headNav";
export default {
  components: {
    HeadNav
  },
  mounted() {}
};
</script>
<style lang="less">
@import "./style/variables";
@import "./style/element-ui";
@import "./style/common";
.app {
  background: #e7e8eb;
  color: #000;
}
.menu_content {
  position: relative;
  margin-top: 80px;
  width: 100%;
}
</style>
