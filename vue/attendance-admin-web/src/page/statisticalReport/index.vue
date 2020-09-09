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
          <component v-if="menuTabsValue==item.name" :is="item.name"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import monthReport from "./month/report"; // 月度报表
import annualReport from "./annualReport"; // 年度报表
export default {
  data() {
    return {
      isToggle: false,
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
    annualReport
  },
  computed: {
    curSubmenus() {
      if (this.$store.state.menu.submenus.length) {
        if (!this.isToggle) {
          this.menuTabsValue = this.$store.state.menu.submenus[0];
        }
      }
      return this.$store.state.menu.submenus;
    }
  },
  created() {},
  mounted() {
    this.menuTabsValue = this.curSubmenus[0] || "";
  },
  methods: {
    handleClickTab(tab, event) {
      this.isToggle = true;
      this.menuTabsValue = tab.name;
    }
  }
};
</script>

<style lang="less" scoped>
.contain {
  background: #fff;
}
</style>



