<template>
  <div class="wapper-content">
    <update-info
      v-if="companyInfo.type=='update'"
      :parentFrom="companyInfo.row"
      :currentPage="companyInfo.currentPage"
    />
    <look-info
      v-if="companyInfo.type=='look'"
      :fromInfo="companyInfo.row"
      :currentPage="companyInfo.currentPage"
      @jumperEdit="jumperEdit"
      @jumperLook="jumperLook"
    />
  </div>
</template>

<script>
import updateInfo from "./update-info"; //新增、编辑
import lookInfo from "./look-info"; //查看
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
export default {
  components: {
    updateInfo,
    lookInfo
  },
  data() {
    return {
      detailForm: {},
      companyInfo: {}
    };
  },

  mounted() {
    // 解决f5刷新会丢ID
    if (Object.keys(this.$route.params).length) {
      sessionStorage.setItem("companyInfo", JSON.stringify(this.$route.params));
    }
    let sessionCompany = JSON.parse(sessionStorage.getItem("companyInfo"));
    this.companyInfo = sessionCompany;
    // if (this.companyInfo.row.ID) {
    //   this.getDetail(this.companyInfo.row.ID);
    // }
  },
  methods: {
    // getDetail(ID) {
    //   let path = "env.ENV_COMPANY.view";
    //   let params = {
    //     ENV_COMPANY: { ID: ID }
    //   };
    //   service(params, path).then(res => {
    //     if (res.success) {
    //       this.detailForm = res.data;
    //     }
    //   });
    // },
    jumperEdit(row) {
      this.companyInfo.type = "update";
      this.companyInfo.ID = row.ID;
    },
    jumperLook(row) {
      this.companyInfo.type = "look";
      this.companyInfo.ID = row.ID;
    }
  }
};
</script>

<style scoped>
</style>

