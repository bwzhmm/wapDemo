<template>
  <!-- 下拉菜单 -->
  <div class="dropdown">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{dropTitle}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" align="center">
        <el-dropdown-item
          v-for="item in DropDownMenu"
          :key="item.path"
          :command="{path:item.path,column:item.column}"
        >{{ item.title}}</el-dropdown-item>
      </el-dropdown-menu>
      <!-- dropTitle ==item.title ?'': -->
    </el-dropdown>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
export default {
  name: "dropdown-menu",
  props: ["lookRow", "dropTitle"],
  data() {
    return {
      DropDownMenu: [
        {
          title: "企业信息",
          path: "enterprise-report"
        },
        {
          title: "环境测评信息",
          path: "env-evaluate-report",
          column: { dataIndex: "project" }
        },
        {
          title: "污染防治信息",
          path: "pollute-prevent-report",
          column: { dataIndex: "water" }
        },
        {
          title: "其他测评信息",
          path: "other-evaluate-report"
        },
        {
          title: "GIS地图",
          path: "enterprise-map-report"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    handleCommand(command) {
      if (command.column) {
        this.$router.push({
          name: command.path,
          params: { row: this.lookRow, type: "look", column: command.column }
        });
      } else {
        this.$router.push({
          name: command.path,
          params: { row: this.lookRow, type: "look" }
        });
      }
    }
  }
};
</script>
<style scoped>
.dropdown {
  display: inline-block;
  margin-left: 10px;
}
span.el-dropdown-link.el-dropdown-selfdefine {
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: left;
}
</style>

