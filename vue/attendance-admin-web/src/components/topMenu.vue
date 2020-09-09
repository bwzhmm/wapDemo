<template>
  <div class="rflex">
    <div>
      <el-menu
        @select="handleSelect"
        background-color="#fff"
        text-color="#9C9C9C"
        active-text-color="#0091FF"
        mode="horizontal"
        class="text-h1 rflex"
        :default-active="$route.path"
      >
        <template v-for="(item,index) in menus">
          <el-menu-item
            v-if="showMenu.includes(item.path)"
            :key="index"
            :index="item.path "
            :class="$route.path==('/'+item.path)?'is-active':''"
          >{{item.name}}</el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import util from "@/utils/util";
import { fetchUserMenu, fetchCurrentUser } from "@/api/user";
export default {
  name: "top-Menu",
  data() {
    return {
      menus: [
        {
          name: "个人中心",
          path: "home"
        },
        {
          name: "审批考核",
          path: "approve"
        },
        {
          name: "员工管理",
          path: "employee"
        },
        {
          name: "统计报表",
          path: "report"
        }
      ],
      showMenu: []
    };
  },
  computed: {
    allmenusList() {
      return this.$store.state.menu.allmenus;
    }
  },

  created() {
    this.getUserMenu();
  },
  mounted() {},
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({
        path: key
      });
      this.handleSubMenus(key);
    },

    handleSubMenus(key) {
      let allmenusData = this.allmenusList;
      let childmenu = [];
      allmenusData.forEach(item => {
        if (item.NAME == key) {
          childmenu = item.children;
        }
      });
      childmenu = childmenu.length
        ? childmenu.map(item => item.DISPLAYURL)
        : [];
      this.$store.commit("SET_SubMenus", childmenu);
    },

    getUserMenu() {
      let param = {
        data: {}
      };
      fetchCurrentUser(param).then(res => {
        if (res.success) {
          this.$store.commit("SET_UserInfo", res.data);
        }
      });

      fetchUserMenu(param).then(res => {
        if (res.length) {
          this.$store.commit("SET_AllMenus", res);
          let menuData = res.map(item => item.NAME);
          this.showMenu = menuData;
          let key = this.$route.path.split("/")[1];
          this.handleSubMenus(key);
        }
      });
    }
  }
};
</script>
<style lang="less">
.el-menu.el-menu--horizontal {
  border: none !important;
}
.el-menu--horizontal > .el-menu-item {
  height: 60px;
  line-height: 55px !important;
  margin: 0;
  border: none !important;
  color: #909399;
}
.el-menu--horizontal > .el-menu-item:hover {
  background-color: #fff !important;
}

.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
  background-color: #fff !important;
}

.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-menu-item:focus {
  background-color: #fff;
  color: #0091ff !important ;
  height: 100%;
  border-bottom: 2px solid #1890ff !important;
}
</style>

<style lang="less" scoped>
.text-h1 {
  font-size: 16px;
  font-weight: 500;
}
.title-w {
  width: 130px;
  margin: 0 15px;
}
</style>
