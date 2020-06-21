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
import staffManageTable from "./staffManageTable"; // 员工管理
import staffCareTable from "./staffCareTable"; // 请假调休
import quitManageTable from "./quitManageTable"; // 离职管理
export default {
  data() {
    return {
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "员工管理",
          name: "1",
          content: "staffManageTable"
        },
        {
          title: "员工关怀",
          name: "2",
          content: "staffCareTable"
        },
        {
          title: "离职管理",
          name: "3",
          content: "quitManageTable"
        }
      ]
    };
  },
  components: {
    staffManageTable,
    staffCareTable,
    quitManageTable
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



