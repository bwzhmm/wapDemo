<template>
  <div class="contain">
    <el-tabs
      v-model="menuTabsValue"
      tab-position="left"
      class="tab-left"
      @tab-click="handleClickTab"
    >
      <template v-for="(item) in menuTabs">
        <el-tab-pane
          :key="item.name"
          :label="item.title"
          :name="item.name"
          v-if="curSubmenus.includes(item.name)"
          lazy
        >
          <component :is="item.name"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import monthReport from "./monthReport"; // 月度报表
import annualReport from "./annualReport"; // 年度报表
import page401 from "../errorPage/401"; // 无权限
export default {
  data() {
    return {
      menuTabsValue: "",
      menuTabs: [
        {
          title: "月度报表",
          name: "monthReport"
        },
        {
          title: "年度报表",
          name: "annualReport"
        }
      ]
    };
  },
  components: {
    monthReport,
    annualReport,
    page401
  },
  computed: {
    curSubmenus() {
      if (this.$store.state.menu.submenus.length) {
        this.menuTabsValue = this.$store.state.menu.submenus[0];
        console.log("state222", this.menuTabsValue);
      }
      return this.$store.state.menu.submenus;
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClickTab(tab, event) {}
  }
};
</script>

<style lang="less" scoped>
.contain {
  background: #fff;
}
</style>



