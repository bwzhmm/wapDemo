<template>
  <div class="contain">
    <el-tabs
      v-model="editableTabsValue"
      tab-position="left"
      class="tab-left"
      @tab-click="handleClickTab"
    >
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <component :is="item.content"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getUserList } from "@/api/user";
import monthReport from "./monthReport"; // 月度报表
import annualReport from "./annualReport"; // 年度报表
export default {
  data() {
    return {
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "月度报表",
          name: "1",
          content: "monthReport"
        },
        {
          title: "年度报表",
          name: "2",
          content: "annualReport"
        }
      ]
    };
  },
  components: {
    monthReport,
    annualReport
  },
  created() {},
  mounted() {},
  methods: {
    handleClickTab(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="less" scoped>
.contain {
  background: #fff;
}
.tab-left {
  height: 749px;
}
</style>



