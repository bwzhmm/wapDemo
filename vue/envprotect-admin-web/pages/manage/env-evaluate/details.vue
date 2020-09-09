<template>
  <div class="wapper-content">
    <h1 class="h1-title">{{companyInfo.row&&companyInfo.row.NAME}}</h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <template v-for="(item) in menuTabs">
        <el-tab-pane :key="item.dataIndex" :label="item.title" :name="item.dataIndex" lazy>
          <component
            v-if="activeName==item.dataIndex"
            :is="item.dataIndex"
            :company="companyInfo.row"
          ></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import project from "./project"; //立项信息
import approval from "./approval"; //申批情况
import accept from "./accept"; //验收批复
import product from "./product"; //产品信息
import process from "./process"; //生产工艺信息
import permit from "./permit"; //排污许可证信息
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
import { envTestCol } from "../tool.js";
export default {
  components: {
    project,
    approval,
    accept,
    product,
    process,
    permit
  },
  data() {
    return {
      menuTabs: envTestCol,
      activeName: "project",
      detailForm: {}
    };
  },

  computed: {
    companyInfo: function() {
      // 解决f5刷新会丢ID
      if (Object.keys(this.$route.params).length) {
        sessionStorage.setItem(
          "companyInfo",
          JSON.stringify(this.$route.params)
        );
      }
      let sessionCompany = JSON.parse(sessionStorage.getItem("companyInfo"));
      return sessionCompany;
    }
  },

  mounted() {
    if (this.companyInfo.column) {
      this.activeName = this.companyInfo.column.dataIndex;
    }

    if (this.companyInfo.row && this.companyInfo.row.ID) {
      this.getDetail(this.companyInfo.row.ID);
    }
  },
  methods: {
    //点击tab也将 保存session中，刷新仍在当前页面
    handleClick(tab) {
      this.activeName = tab.name;
      if (sessionStorage.getItem("companyInfo")) {
        let temptyCompany = JSON.parse(sessionStorage.getItem("companyInfo"));
        temptyCompany.column.dataIndex = tab.name;
        sessionStorage.setItem("companyInfo", JSON.stringify(temptyCompany));
      }
    },
    getDetail(ID) {
      let path = "env.ENV_COMPANY.view";
      let params = {
        ENV_COMPANY: { ID: ID }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.detailForm = res.data;
        }
      });
    }
  }
};
</script>

<style scoped>
.wapper-content /deep/ .el-tabs__nav-wrap::after {
  display: none;
}
.el-tabs__item.is-active,
.el-tabs__item:hover {
  color: #0091ff;
}
.el-tabs__active-bar {
  background-color: #1890ff;
}
</style>

