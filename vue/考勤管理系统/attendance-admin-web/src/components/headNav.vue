<template>
  <header class="head-nav rflex" id="header_container">
    <img :class="logo" :src="logo" alt="昂克考勤系统" />
    <top-menu></top-menu>
    <div class="userinfo-right">
      <span class="mg-right10">
        <i class="el-icon-setting mg-right"></i>
        <router-link to="set">设置</router-link>
      </span>
      <span>
        <i class="el-icon-user mg-right"></i>
        Hi，郁婷婷
      </span>
    </div>
  </header>
</template>

<script>
import { setToken, getToken } from "@/utils/auth";
import topMenu from "./topMenu";
import logoImg from "@/assets/img/logo.png";

export default {
  name: "head-nav",
  data() {
    return {
      logo: logoImg
    };
  },
  components: {
    topMenu
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload();
      });
    }
  }
};
</script>

<style scoped lang='less'>
.head-nav {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 29;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  background: #fff;
  transition: width 0.2s;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 2px 5px 0px rgba(237, 233, 233, 0.5);
  .logout {
    vertical-align: middle;
    cursor: pointer;
  }
}
.right-nav {
  display: flex;
  width: 400px;
  padding-right: 15px;
  justify-content: space-between;
}
.logo {
  height: 36px;
  width: 36px;
  vertical-align: middle;
  display: inline-block;
}
.middle {
  align-items: center;
  border: 1px solid;
}
.userinfo-right {
  font-size: 12px;
  color: #666;
  padding: 0 10px;
}
.mg-right10 {
  margin-right: 10px;
  cursor: pointer;
}
.mg-right {
  margin-right: 5px;
  font-size: 14px;
}
a {
  color: #666;
}
</style>
