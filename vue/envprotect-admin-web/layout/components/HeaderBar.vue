<template>
  <div class="header-menu">
    <i class="iconfont iconyonghu"></i>
    <span>{{userInfo.NAME}}</span>
    <span class="header-menu-exit" @click="exit">退出登录</span>
  </div>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  mounted() {},
  methods: {
    // 退出 跳转到登录页
    exit() {
      sessionStorage.removeItem("iSlog");

      let url = `${window.location.href.split("#")[0]}#/`;
      // return false;
      location.href = window.global.exitURL + url;
    }
  }
};
</script>

<style lang="scss" scoped>
.header-menu {
  float: right;
  color: #999999;
  span {
    display: inline-block;
    margin-right: 5px;
    &.header-menu-exit {
      margin-right: 40px;
      color: #0090ff;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
