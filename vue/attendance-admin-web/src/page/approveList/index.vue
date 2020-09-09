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
import abnormalTable from "./abnormalTable"; // 异常申请
import overtimeTable from "./overtimeTable"; // 加班申请
import leaveTable from "./leaveTable"; // 请假调休
import performanceTable from "./performanceTable"; // 绩效考核
export default {
  data() {
    return {
      isToggle: false,
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
    performanceTable
  },
  computed: {
    curSubmenus() {
      if (this.$store.state.menu.submenus.length) {
        // 刷新页面时，默认展示的子菜单
        if (!this.isToggle) {
          this.menuTabsValue = this.$store.state.menu.submenus[0];
        }
      }
      return this.$store.state.menu.submenus;
    }
  },

  created() {},
  mounted() {
    // 切换页面时，默认展示的子菜单  不进行计算属性时，初始化值
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



