<template>
  <div>
    <div class="search-box">
      <waste-btn :wasteData="wasteData" :wasteIndex="wasteIndex" @wasteActive="wasteActive" />
    </div>
    <div class="table-container" v-show="wasteIndex==1">
      <waste-tag :wasteTags="wasteTags" @addTag="addTag" @delTag="delTag" />
      <waste-table
        :tableInfo="ventHasGroup"
        :company="company"
        :wasteID="wasteID"
        v-if="wasteID.ID"
      />
      <waste-table
        :tableInfo="ventNoGroup"
        :company="company"
        :wasteID="wasteID"
        v-if="wasteID.ID"
      />
      <waste-table :tableInfo="gasGovern" :company="company" :wasteID="wasteID" v-if="wasteID.ID" />
      <waste-table
        :tableInfo="orgEmissInfo"
        :company="company"
        :wasteID="wasteID"
        v-if="wasteID.ID"
      />
      <waste-table
        :tableInfo="unorgEmissInfo"
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
  gasVentCol,
  gasVentDrawerCol,
  ventNoGroupCol,
  ventDrawerNoGroupCol,
  waterGovernCol,
  waterGovernDrawerCol,
  orgEmissInfoCol,
  orgEmissInfoDrawerCol,
  unorgEmissInfoCol,
  unorgEmissInfoDrawerCol
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
        { type: 1, text: "有废气排放" },
        { type: 0, text: "没有废气排放" }
      ],
      wasteTags: [],
      wasteIndex: 0,
      ventHasGroup: {
        menuTitle: "废气排放口",
        group: "有组织排放",
        title: "排放口（有组织排放）",
        tableCol: gasVentCol,
        drawerCol: gasVentDrawerCol,
        wastePath: "ENV_EGHOLE",
        factorPath: "ENV_EGPOLLFACTOR#HOLEID"
      },
      ventNoGroup: {
        menuTitle: "",
        group: "无组织排放",
        title: "排放口（无组织排放）",
        tableCol: ventNoGroupCol,
        drawerCol: ventDrawerNoGroupCol,
        wastePath: "ENV_EGHOLE",
        factorPath: "ENV_EGPOLLFACTOR#HOLEID"
      },
      gasGovern: {
        menuTitle: "治理设施",
        title: "治理设施",
        tableCol: waterGovernCol,
        drawerCol: waterGovernDrawerCol,
        wastePath: "ENV_EGINSTALLATION"
      },
      orgEmissInfo: {
        menuTitle: "排放信息",
        group: "有组织排放",
        title: "排放信息（有组织排放）",
        tableCol: orgEmissInfoCol,
        drawerCol: orgEmissInfoDrawerCol,
        wastePath: "ENV_EGEMISSION"
      },
      unorgEmissInfo: {
        menuTitle: "",
        group: "无组织排放",
        title: "排放信息（无组织排放）",
        tableCol: unorgEmissInfoCol,
        drawerCol: unorgEmissInfoDrawerCol,
        wastePath: "ENV_EGEMISSION"
      },
      wasteID: { ID: "", path: "EGID" }
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
    getHasWaste() {
      let path = "env.ENV_EXHAUSTGAS.view";
      let params = {
        ENV_EXHAUSTGAS: { COMPANYID: this.company.ID }
      };
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.wasteIndex = res.data.ISEXHAUSTGAS || 0;
          this.wasteID.ID = res.data.ID;
          this.getTag();
        }
      });
    },
    saveWaste() {
      let path = "env.ENV_EXHAUSTGAS.save";
      let params = {
        ENV_EXHAUSTGAS: {
          COMPANYID: this.company.ID,
          ISEXHAUSTGAS: this.wasteIndex,
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
      let path = "env.ENV_EGPOLLUTANT.list";
      let params = {
        ENV_EGPOLLUTANT: { EGID: this.wasteID.ID }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.wasteTags = res.data.items;
        }
      });
    },
    addTag(miniForm) {
      // this.wasteTags.push(miniForm.NAME);
      let path = "env.ENV_EGPOLLUTANT.add";
      let params = {
        ENV_EGPOLLUTANT: { EGID: this.wasteID.ID, NAME: miniForm.NAME }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.wasteTags.push({ ID: res.data.ID, NAME: res.data.NAME });
        }
      });
    },
    delTag(tag) {
      let path = "env.ENV_EGPOLLUTANT.delete";
      let params = {
        ENV_EGPOLLUTANT: { ID: tag.ID }
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
