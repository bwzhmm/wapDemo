<template>
  <el-aside :width="collapse ? '72px' : '220px'" class="sidebar-container">
    <div class="sidebar-logo">
      <i class="iconfont iconLOGO menu-logo"></i>
      <div class="title" v-if="!collapse">环保管家</div>
    </div>
    <div class="scroll-bar">
      <el-menu
        v-loading="loading"
        :default-active="'/' + $route.path.split('/')[1]"
        class="el-menu-vertical-demo"
        :collapse="collapse"
        :collapse-transition="false"
        router
      >
        <nav-item :menuData="menuList" :collapse="collapse" />
      </el-menu>
    </div>
  </el-aside>
</template>

<script>
import NavItem from "./NavItem";
import { service } from "@env/utils/request.js";
export default {
  name: "SideBar",
  components: {
    NavItem
  },
  data() {
    return {
      loading: false,
      menuList: []
    };
  },
  props: {
    collapse: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  mounted() {
    this.getUser();
    this.getUserMeun();
    let iSlog = sessionStorage.getItem("iSlog");
    if (iSlog !== "log") {
      this.log();
    }
  },
  methods: {
    getUser() {
      let path = "authweb.AU_USER.CURRUSER";
      service({}, path).then(res => {
        if (res.success) {
          this.$store.commit("setUserInfo", res.data);
        }
      });
    },
    getUserMeun() {
      let menupath = "authweb.AU_MENU.getCurrentResMenu";
      service({}, menupath).then(res => {
        if (res.success) {
          let userMenu = res.data.map(item => item.DISPLAYURL);
          if (userMenu.length) {
            let userRoutes = this.$router.options.routes;
            let RouteList = this.getRoutes(userRoutes, userMenu);
            this.menuList = RouteList;
            // find只查出第一个符合的返回对象 返回第一个为true的子菜单
            let firstMenu = RouteList.find(item => item.meta.show === true);
            if (firstMenu && firstMenu.children) {
              let firstSubMenu = firstMenu.children.find(
                item => item.meta.show === true
              );
              //非首次登录时，跳转到默认页面或默认有权限的第一个页面，其他刷新仍在当前路由
              let iSlog = sessionStorage.getItem("iSlog");
              if (iSlog !== "log") {
                let initPath = firstSubMenu.path || "/";
                this.$router.push(initPath);
              }
            }
          }
        }
      });
    },

    getRoutes(userRoutes, userMenu) {
      userRoutes.forEach(item => {
        if (userMenu.includes(item.name)) {
          item.meta.show = true;
        } else {
          item.meta.show = false;
        }
        if (item.children) {
          this.getRoutes(item.children, userMenu);
        }
      });
      return userRoutes;
    },
    log() {
      let path = "env.ENV_LOG.add";
      service({}, path).then(res => {
        if (res.success) {
          sessionStorage.setItem("iSlog", "log");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  height: 100%;
  z-index: 100;
  overflow: hidden;
  transition: width 0.5s;
  background: #ffffff;
  box-shadow: 6px 0px 6px 0px rgba(0, 0, 0, 0.05);
  color: #000;
}
.sidebar-logo {
  width: 100%;
  height: 100px;
  color: #1890ff;
  line-height: 100px;
  display: flex;
  justify-content: center;
  .menu-logo {
    display: inline-block;
    margin-right: 10px;
    font-size: 40px;
  }
  .title {
    display: inline-block;
    font-size: 24px;
    font-weight: 500;
    width: 100px;
    text-align: left;
  }
}
.scroll-bar {
  height: calc(100% - 100px);
  overflow-y: auto;
}
.scroll-bar::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.scroll-bar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); /*opera或ie9*/
  -moz-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); /*firefox*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); /*webkit*/
  background: #f8f8f8;
}

.scroll-bar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  display: none;
}
</style>