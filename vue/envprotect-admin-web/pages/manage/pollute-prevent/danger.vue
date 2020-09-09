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
  dangerWasteCol,
  dangerWasteDrawerCol,
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
        { type: 1, text: "有危险废物" },
        { type: 0, text: "没有危险废物" }
      ],
      wasteIndex: 0,
      solidWaste: {
        menuTitle: "污染物信息",
        title: "污染物",
        tableCol: dangerWasteCol,
        drawerCol: dangerWasteDrawerCol,
        wastePath: "ENV_DPINFO",
        factorPath: "ENV_DPPOLLFACTOR#INFOID"
      },
      collectStorage: {
        menuTitle: "收集贮存处置",
        title: "放置点",
        tableCol: placePointCol,
        drawerCol: placePointDrawerCol,
        wastePath: "ENV_DPCTD"
      },
      wasteID: { ID: "", path: "DPID" }
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
    //获取企业的危险物ID
    getHasWaste() {
      let path = "env.ENV_DANGER.view";
      let params = {
        ENV_DANGER: { COMPANYID: this.company.ID }
      };
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.wasteIndex = res.data.ISDANGER || 0;
          this.wasteID.ID = res.data.ID;
        }
      });
    },
    // 更新危险物ID
    saveWaste() {
      let path = "env.ENV_DANGER.save";
      let params = {
        ENV_DANGER: {
          COMPANYID: this.company.ID,
          ISDANGER: this.wasteIndex,
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
