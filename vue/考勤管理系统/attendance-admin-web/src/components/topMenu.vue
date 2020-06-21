<template>
  <div class="rflex">
    <div>
      <el-menu
        mode="horizontal"
        class="text-h1 rflex el-menu-demo"
        :show-timeout="200"
        :default-active="$route.path"
      >
        <!--  active-text-color="#0091ff" -->
        <template v-for="(item,index) in menus">
          <el-menu-item :index="item.path" :key="index">
            <!-- {{item.name}} -->
            <router-link :to="item.path" :key="index">{{item.name}}</router-link>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "top-Menu",
  data() {
    return {
      menus: [
        {
          name: "个人中心",
          lshow: 1,
          path: "home"
        },
        {
          name: "审批考核",
          lshow: 2,
          path: "approve"
        },
        {
          name: "员工管理",
          lshow: 2,
          path: "employee"
        },
        {
          name: "统计报表",
          lshow: 2,
          path: "report"
        }
        // {
        //   name: "角色管理",
        //   lshow: 1,
        //   path: "role",
        // },
      ],
      nomalMenu: {
        name: "参数管理",
        lshow: 1,
        path: "parameter"
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>


<style lang="less" scoped>
// .el-menu-item.is-active,
// .el-menu-item:focus,
// .el-menu-item:hover {
//   background-color: #fff;
//   color: #0091ff;
//   height: 100%;
//   border-bottom: 2px solid #1890ff;
// }
// .el-menu.el-menu--horizontal {
//   border: none !important;
// }
.text-h1 {
  font-size: 16px;
  font-weight: 500;
}
.title-w {
  width: 130px;
  margin: 0 15px;
}

// .el-menu--horizontal > .el-menu-item {
//   float: left;
//   height: 60px;
//   line-height: 60px;
//   margin: 0;
//   border: none;
//   // border-bottom: 2px solid red;
//   color: #909399;
// }

// .el-menu--horizontal > .el-menu-item.is-active,
// .el-menu--horizontal > .el-menu-item:focus,
// .el-menu--horizontal > .el-menu-item:hover {
//   background-color: #fff;
//   color: #0091ff;
//   height: 100%;
//   border-bottom: 2px solid #1890ff;
// }
</style>
