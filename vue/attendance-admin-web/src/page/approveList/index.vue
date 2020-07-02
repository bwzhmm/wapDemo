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
import abnormalTable from "./abnormalTable"; // 异常申请
import overtimeTable from "./overtimeTable"; // 加班申请
import leaveTable from "./leaveTable"; // 请假调休
import performanceTable from "./performanceTable"; // 绩效考核
import page401 from "../errorPage/401"; // 无权限
export default {
  data() {
    return {
      menuTabsValue: "",
      menuTabs: [
        {
          title: "异常申请",
          name: "abnormalTable"
        },
        {
          title: "加班申请",
          name: "overtimeTable"
        },
        {
          title: "请假调休",
          name: "leaveTable"
        },
        {
          title: "绩效考核",
          name: "performanceTable"
        }
      ]
    };
  },
  components: {
    abnormalTable,
    overtimeTable,
    leaveTable,
    performanceTable,
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



