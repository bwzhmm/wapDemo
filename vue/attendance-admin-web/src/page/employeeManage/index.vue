<template>
  <div class="contain">
    <el-tabs
      v-model="menuTabsValue"
      tab-position="left"
      class="tab-left"
      @tab-click="handleClickTab"
    >
      <!-- 判断是否包含相应子菜单，并保证每次重新强制渲染数据 -->
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
import { getUserList } from "@/api/user";
import staffManageTable from "./staffManageTable"; // 员工管理
import staffCareTable from "./staffCareTable"; // 请假调休
import quitManageTable from "./quitManageTable"; // 离职管理
export default {
  data() {
    return {
      isToggle: false,
      menuTabsValue: "",
      menuTabs: [
        {
          title: "员工管理",
          name: "staffManageTable"
        },
        {
          title: "员工关怀",
          name: "staffCareTable"
        },
        {
          title: "离职管理",
          name: "quitManageTable"
        }
      ]
    };
  },
  components: {
    staffManageTable,
    staffCareTable,
    quitManageTable
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



