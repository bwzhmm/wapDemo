<template>
  <div class="contain">
    <el-tabs v-model="menuTabsValue" tab-position="left" class="tab-left">
      <template v-for="(item) in menuTabs">
        <el-tab-pane
          :key="item.name"
          :label="item.title"
          :name="item.name"
          lazy
          v-if="curSubmenus.includes(item.name)"
        >
          <component v-if="menuTabsValue==item.name" :is="item.name"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { getUserList } from "@/api/user";
import editPassword from "./editPassword";
import accountManage from "./accountManage";
import systemSet from "./systemSet";
import authManage from "./authManage";
import expatriateStaff from "./expatriateStaff";
export default {
  data() {
    return {
      isToggle: false,
      menuTabsValue: "",
      menuTabs: [
        {
          title: "修改密码",
          name: "editPassword"
        },
        {
          title: "账号管理",
          name: "accountManage"
        },
        {
          title: "系统设置",
          name: "systemSet"
        },
        {
          title: "权限管理",
          name: "authManage"
        },
        {
          title: "外派驻场",
          name: "expatriateStaff"
        }
      ]
    };
  },
  components: {
    editPassword,
    accountManage,
    systemSet,
    authManage,
    expatriateStaff
  },
  created() {},
  mounted() {
    this.menuTabsValue = this.curSubmenus[0] || "editPassword";
  },
  computed: {
    curSubmenus: function() {
      if (this.$store.state.menu.submenus.length) {
        if (!this.isToggle) {
          this.menuTabsValue = this.$store.state.menu.submenus[0];
        }
      }
      return this.$store.state.menu.submenus;
    }
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
  width: 1080px;
  margin: 0 auto;
  background: #fff;
}
</style>



