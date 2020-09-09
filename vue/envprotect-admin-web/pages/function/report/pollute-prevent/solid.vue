<template>
  <div>
    <div class="search-box">
      <waste-btn :wasteData="wasteData" :wasteIndex="wasteIndex" @wasteActive="wasteActive" />
    </div>
    <div class="table-container" v-show="wasteIndex==1">
      <waste-table :tableInfo="solidWaste" :company="company" :wasteID="wasteID" v-if="wasteID.ID" />
      <waste-table
        :tableInfo="collectStorage"
        :company="company"
        :wasteID="wasteID"
        v-if="wasteID.ID"
      />
    </div>
  </div>
</template>

<script>
import wasteBtn from "./components/waste-btn"; //是否有废物
import wasteTable from "./components/waste-table"; //废物列表
import { service } from "@env/utils/request.js";
import {
  solidWasteCol,
  solidWasteDrawerCol,
  placePointCol,
  placePointDrawerCol
} from "./column.js";

export default {
  components: {
    wasteBtn,
    wasteTable
  },
  props: ["company"],
  data() {
    return {
      wasteData: [
        { type: 1, text: "有固体废物" },
        { type: 0, text: "没有固体废物" }
      ],
      wasteIndex: 0,
      solidWaste: {
        menuTitle: "污染物信息",
        title: "污染物",
        tableCol: solidWasteCol,
        drawerCol: solidWasteDrawerCol,
        wastePath: "ENV_SWINFO",
        factorPath: "ENV_SWPOLLFACTOR#INFOID"
      },
      collectStorage: {
        menuTitle: "收集贮存处置",
        title: "放置点",
        tableCol: placePointCol,
        drawerCol: placePointDrawerCol,
        wastePath: "ENV_SWCTD"
      },
      wasteID: { ID: "", path: "WSID" }
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
    //获取企业的固废ID
    getHasWaste() {
      let path = "env.ENV_SOLIDWASTE.view";
      let params = {
        ENV_SOLIDWASTE: { COMPANYID: this.company.ID }
      };
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.wasteIndex = res.data.ISSOLIDWASTE || 0;
          this.wasteID.ID = res.data.ID;
        }
      });
    },
    // 更新固废ID
    saveWaste() {
      let path = "env.ENV_SOLIDWASTE.save";
      let params = {
        ENV_SOLIDWASTE: {
          COMPANYID: this.company.ID,
          ISSOLIDWASTE: this.wasteIndex,
          ID: this.wasteID.ID
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.wasteID.ID = res.data.ID;
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
