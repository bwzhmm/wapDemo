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
import { getUserList } from "@/api/user";
import staffManageTable from "./staffManageTable"; // 员工管理
import staffCareTable from "./staffCareTable"; // 请假调休
import quitManageTable from "./quitManageTable"; // 离职管理
import page401 from "../errorPage/401"; // 无权限
export default {
  data() {
    return {
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
    quitManageTable,
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



