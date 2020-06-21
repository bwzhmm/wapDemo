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
import editPassword from "./editPassword";
import accountManage from "./accountManage";
import systemSet from "./systemSet";
import authManage from "./authManage";

export default {
  data() {
    return {
      editableTabsValue: "4",
      editableTabs: [
        {
          title: "修改密码",
          name: "1",
          content: "editPassword"
        },
        {
          title: "账号管理",
          name: "2",
          content: "accountManage"
        },
        {
          title: "系统设置",
          name: "3",
          content: "systemSet"
        },
        {
          title: "权限管理",
          name: "4",
          content: "authManage"
        }
      ]
    };
  },
  components: {
    editPassword,
    accountManage,
    systemSet,
    authManage
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
  width: 1080px;
  margin: 0 auto;
  background: #fff;
}
.tab-left {
  min-height: 749px;
}
</style>



