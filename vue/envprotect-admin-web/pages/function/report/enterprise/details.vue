<template>
  <div class="wapper-content">
    <!-- :fromInfo="detailForm" -->
    <look-info v-if="companyInfo.type=='look'" :fromInfo="companyInfo.row" />
  </div>
</template>

<script>
import lookInfo from "./look-info"; //查看
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
export default {
  components: {
    lookInfo
  },
  data() {
    return {
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
    // if (this.companyInfo.row.ID) {
    //   this.getDetail(this.companyInfo.row.ID);
    // }
  },
  methods: {
    getDetail(ID) {
      let path = "env.ENV_COMPANY.view";
      let params = {
        ENV_COMPANY: { ID: ID }
      };
      service(params, path).then(res => {
        if (res.success) {
          let currentForm = res.data;
          // this.detailForm = res.data;
          if (currentForm.BUSLICENSE) {
            currentForm.imgUrl = `${window.global.ApiUrl}file/view/${currentForm.BUSLICENSE}`;
          } else {
            currentForm.imgUrl = "";
          }
          this.detailForm = JSON.parse(JSON.stringify(currentForm));
          console.log(" this.detailForm", this.detailForm);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>

