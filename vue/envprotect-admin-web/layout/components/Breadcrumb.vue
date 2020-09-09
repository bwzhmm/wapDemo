<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script>
export default {
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      );
      const first = matched[0];
      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
      );
    },

    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: #666666;
  font-weight: 400;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  margin-left: 8px;

  .no-redirect {
    color: #a3a3a3;
    font-weight: 400;
  }
}
</style>
