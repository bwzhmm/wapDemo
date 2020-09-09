<template>
  <div class="wapper-content">
    <h1 class="h1-title">{{companyInfo && companyInfo.row.NAME}}</h1>
    <base-table :tableInfo="emergTab" :company="companyInfo&&companyInfo.row" />
    <edit-table :tableInfo="cleanTab" :company="companyInfo&&companyInfo.row" />
    <edit-table :tableInfo="infoTab" :company="companyInfo&&companyInfo.row" />
    <base-table :tableInfo="thirdTab" :company="companyInfo&&companyInfo.row" />
    <upload-file :tableInfo="fileTab" :company="companyInfo&&companyInfo.row" />
  </div>
</template>

<script>
import baseTable from "./components/base-table"; //简单列表
import editTable from "./components/edit-table"; //可编辑的列表
import uploadFile from "./components/upload-file"; //上传附件
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
import {
  emergCol,
  emergDrawerCol,
  thirdCol,
  thirdDrawerCol,
  cleanCol,
  infoCol
} from "./column.js";
export default {
  components: {
    baseTable,
    editTable,
    uploadFile
  },
  data() {
    return {
      activeName: "emergency",
      detailForm: {},
      emergTab: {
        menuTitle: "环境应急",
        title: "应急预案",
        tableCol: emergCol,
        drawerCol: emergDrawerCol,
        basePath: "ENV_EMERGENCY"
      },
      cleanTab: {
        menuTitle: "清洁生产",
        tableCol: cleanCol,
        basePath: "ENV_CLEAN"
      },
      infoTab: {
        menuTitle: "信息公开",
        tableCol: infoCol,
        basePath: "ENV_OPENINFO"
      },

      thirdTab: {
        menuTitle: "第三方运维",
        title: "第三方运维",
        tableCol: thirdCol,
        drawerCol: thirdDrawerCol,
        basePath: "ENV_THIRDPARTOM"
      },
      fileTab: {
        menuTitle: "巡检现状与后续问题处理建议",
        tableCol: infoCol,
        basePath: "ENV_SUGGEST"
      }
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
    if (this.companyInfo && this.companyInfo.column) {
      this.activeName = this.companyInfo.column.dataIndex;
    }
    if (this.companyInfo && this.companyInfo.row.ID) {
      this.getDetail(this.companyInfo.row.ID);
    }
  },
  methods: {
    handleClick(tab, event) {},
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

