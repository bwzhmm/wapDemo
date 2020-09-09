<template>
  <el-container class="app-wrapper">
    <side-bar :collapse="collapse"></side-bar>
    <el-container
      class="main-container"
      style="width: 100%;position: relative"
      :class="{'padding-left-75': collapse,'padding-left-250': !collapse}"
    >
      <el-header>
        <span
          class="iconfont iconshousuo"
          :class="{'collapse-img': collapse}"
          @click="changeCollapse"
        ></span>
        <breadcrumb class="breadcrumb-container" />
        <header-bar></header-bar>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideBar from "./components/SideBar";
import HeaderBar from "./components/HeaderBar";
import Breadcrumb from "./components/Breadcrumb";

export default {
  name: "BasicLayout",
  props: {
    name: String
  },
  components: {
    SideBar,
    HeaderBar,
    Breadcrumb
  },
  data() {
    return {
      collapse: false
    };
  },
  methods: {
    changeCollapse() {
      this.collapse = !this.collapse;
    }
  },
  created() {}
};
</script>

<style lang="scss" scpoed>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .padding-left-250 {
    padding-left: 220px;
  }
  .padding-left-75 {
    padding-left: 75px;
  }
  .main-container {
    min-width: 1000px;
    transition: padding 0.5s;
    .el-main {
      padding: 30px 20px 0;
      background: #f1f2f7;
      width: 100%;
      height: 90%;
    }
    .el-header {
      height: 60px !important;
      line-height: 60px;
      width: 100%;
      box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.05);
      z-index: 500;
      .collapse-img {
        display: inline-block;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
