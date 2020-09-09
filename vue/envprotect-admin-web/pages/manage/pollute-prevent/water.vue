<template>
  <div>
    <div class="search-box">
      <waste-btn :wasteData="wasteData" :wasteIndex="wasteIndex" @wasteActive="wasteActive" />
    </div>
    <div class="table-container" v-show="wasteIndex==1">
      <waste-tag :wasteTags="wasteTags" @addTag="addTag" @delTag="delTag" />
      <waste-table :tableInfo="waterVent" :company="company" :wasteID="wasteID" v-if="wasteID.ID" />
      <waste-table
        :tableInfo="waterGovern"
        :company="company"
        :wasteID="wasteID"
        v-if="wasteID.ID"
      />
      <waste-table
        :tableInfo="waterEmissInfo"
        :company="company"
        :wasteID="wasteID"
        v-if="wasteID.ID"
      />
    </div>
  </div>
</template>

<script>
import wasteBtn from "./components/waste-btn"; //是否有废水
import wasteTag from "./components/waste-tag"; // 废水污染物
import wasteTable from "./components/waste-table"; //废水列表
import { service } from "@env/utils/request.js";
import {
  waterVentCol,
  waterVentDrawerCol,
  waterGovernCol,
  waterGovernDrawerCol,
  waterEmissInfoCol,
  waterEmissInfoDrawerCol
} from "./column.js";

export default {
  components: {
    wasteBtn,
    wasteTag,
    wasteTable
  },
  props: ["company"],
  data() {
    return {
      wasteData: [
        { type: 1, text: "有废水排放" },
        { type: 0, text: "没有废水排放" }
      ],
      wasteTags: [],
      wasteIndex: 0,
      waterVent: {
        menuTitle: "废水排放口",
        title: "排放口",
        tableCol: waterVentCol,
        drawerCol: waterVentDrawerCol,
        wastePath: "ENV_WWHOLE",
        factorPath: "ENV_WWPOLLFACTOR#HOLEID"
      },
      waterGovern: {
        menuTitle: "治理设施",
        title: "治理设施",
        tableCol: waterGovernCol,
        drawerCol: waterGovernDrawerCol,
        wastePath: "ENV_WWINSTALLATION"
      },
      waterEmissInfo: {
        menuTitle: "排放信息",
        title: "排放信息",
        tableCol: waterEmissInfoCol,
        drawerCol: waterEmissInfoDrawerCol,
        wastePath: "ENV_WWEMISSION"
      },
      ENVPATH: "ENV_WWHOLE",
      wasteID: { ID: "", path: "WWID" }
    };
  },

  mounted() {
    this.getHasWaste();
  },
  methods: {
    wasteActive(index) {
      this.wasteIndex = index;
      this.saveWaste();
    },
    //获取企业的废水ID
    getHasWaste() {
      let path = "env.ENV_WASTEWATER.view";
      let params = {
        ENV_WASTEWATER: { COMPANYID: this.company.ID }
      };
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.wasteIndex = res.data.ISWASTEWATER || 0;
          this.wasteID.ID = res.data.ID;
          this.getTag();
        }
      });
    },
    // 更新废水ID
    saveWaste() {
      let path = "env.ENV_WASTEWATER.save";
      let params = {
        ENV_WASTEWATER: {
          COMPANYID: this.company.ID,
          ISWASTEWATER: this.wasteIndex,
          ID: this.wasteID.ID
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.wasteID.ID = res.data.ID;
        }
      });
    },
    getTag() {
      let path = "env.ENV_WWPOLLUTANT.list";
      let params = {
        ENV_WWPOLLUTANT: { WWID: this.wasteID.ID }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.wasteTags = res.data.items;
        }
      });
    },
    addTag(miniForm) {
      let path = "env.ENV_WWPOLLUTANT.add";
      let params = {
        ENV_WWPOLLUTANT: { WWID: this.wasteID.ID, NAME: miniForm.NAME }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.wasteTags.push({ ID: res.data.ID, NAME: res.data.NAME });
        }
      });
    },
    delTag(tag) {
      let path = "env.ENV_WWPOLLUTANT.delete";
      let params = {
        ENV_WWPOLLUTANT: { ID: tag.ID }
      };
      service(params, path).then(res => {
        if (res.success) {
          let newArr = this.wasteTags.filter(item => item.ID !== tag.ID);
          this.wasteTags = newArr;
          // this.wasteTags.push(miniForm.NAME);
        }
      });
    }
  }
};
</script>

<style scoped>
.search-box {
  margin-bottom: 10px;
}
</style>
