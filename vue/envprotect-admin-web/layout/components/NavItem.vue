<template>
  <ul :class="collapse && 'el-menu--collapse'" class="nav">
    <template v-for="menu in menuData">
      <div class="hr-line" :key="menu.name+'hr'" v-show="menu.children&&menu.meta.show  "></div>

      <el-submenu :index="menu.path" v-if="menu.children&&menu.meta.show  " :key="menu.name+'menu'">
        <template slot="title">
          <i v-show="collapse">{{menu.meta.title.substring(0,2)}}</i>
          <span slot="title" class="gray-title">{{menu.meta.title}}</span>
        </template>
        <nav-item :menuData="menu.children"></nav-item>
      </el-submenu>
      <div v-else :key="menu.name+'submenu'">
        <el-menu-item :index="menu.path" v-if="menu.meta.show">
          <i class="iconfont" :class="menu.meta.icon"></i>
          <span slot="title" class="mg-left5">{{menu.meta.title}}</span>
        </el-menu-item>
      </div>
    </template>
  </ul>
</template>

<script>
import NavItem from "../components/NavItem";
export default {
  name: "NavItem",
  components: {
    NavItem
  },
  data() {
    return {};
  },
  props: ["menuData", "collapse"]
};
</script>

<style scoped>
.hr-line {
  height: 1px;
  background: #eeeeee;
  margin: 15px 10px;
}
span.gray-title {
  color: #999;
}
li.el-menu-item {
  padding-left: 30px !important;
}
.mg-left5 {
  margin-left: 10px;
}
</style>
