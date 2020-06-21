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
import abnormalTable from "./abnormalTable"; // 异常申请
import overtimeTable from "./overtimeTable"; // 加班申请
import leaveTable from "./leaveTable"; // 请假调休
import performanceTable from "./performanceTable"; // 绩效考核
export default {
  data() {
    return {
      editableTabsValue: "4",
      editableTabs: [
        {
          title: "异常申请",
          name: "1",
          content: "abnormalTable"
        },
        {
          title: "加班申请",
          name: "2",
          content: "overtimeTable"
        },
        {
          title: "请假调休",
          name: "3",
          content: "leaveTable"
        },
        {
          title: "绩效考核",
          name: "4",
          content: "performanceTable"
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



