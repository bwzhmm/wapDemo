<template>
  <div class="wapper-content">
    <h1 class="h1-title">{{companyInfo.row&&companyInfo.row.NAME}}</h1>
    <dropdown-menu :lookRow="detailForm" dropTitle="污染防治信息" />
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
import water from "./water"; //废水
import gas from "./gas"; //废气
import solid from "./solid"; //一般固废
import danger from "./danger"; //危险废物
import DropdownMenu from "@env/components/dropdown-menu";
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
import { pollutePreventCol } from "./column.js";
export default {
  components: {
    water,
    gas,
    solid,
    danger,
    DropdownMenu
  },
  data() {
    return {
      menuTabs: pollutePreventCol,
      activeName: "water",
      detailForm: {}
    };
  },
  computed: {
    companyInfo: function() {
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

    if (this.companyInfo.row.ID) {
      this.getDetail(this.companyInfo.row.ID);
    }
  },
  methods: {
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

