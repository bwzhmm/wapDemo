<template>
  <div class="contain">
    <el-tabs v-model="menuTabsValue" tab-position="left" class="tab-left">
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
import editPassword from "./editPassword";
import accountManage from "./accountManage";
import systemSet from "./systemSet";
import authManage from "./authManage";
import page401 from "../errorPage/401"; // 无权限
export default {
  data() {
    return {
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
        }
      ]
    };
  },
  components: {
    editPassword,
    accountManage,
    systemSet,
    authManage,
    page401
  },
  created() {},
  mounted() {},
  computed: {
    curSubmenus: function() {
      if (this.$store.state.menu.submenus.length) {
        this.menuTabsValue = this.$store.state.menu.submenus[0];
        console.log("state222", this.menuTabsValue);
      }
      return this.$store.state.menu.submenus;
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.contain {
  width: 1080px;
  margin: 0 auto;
  background: #fff;
}
</style>



