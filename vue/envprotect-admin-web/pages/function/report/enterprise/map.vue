<template>
  <div class="main-wapper">
    <div id="GIS" class="map-wapper" @click="clickMap"></div>
    <div class="GIS-head">
      <span class="back-btn" @click="reback()">
        <i class="iconfont iconfanhui"></i>
      </span>
      <span class="GIS-title">{{company.NAME}}</span>
    </div>
    <div class="GIS-bar">
      <div class="GIS-btn" v-show="active=='search'">
        <el-button
          v-for="(item,index) in resouceSearch"
          plain
          size="medium"
          :key="index"
          :class="item.checked? index===resouceSearch.length-1 ?'last-btn':'blue-btn':'gray-btn'"
          @click="touchBtn(index,item)"
        >
          <img class="img-mini" :src="`${item.icon}`" />
          <span class="btn-title">{{item.title}}</span>
          <i class="el-icon-check btn-check" v-show="item.checked"></i>
        </el-button>
      </div>
      <div class="GIS-tool">
        <span class="search-btn" @click="search('search')">
          <i class="el-icon-search"></i>
        </span>
        <span class="fixed-btn" @click="fixed('fixed')">
          <i class="iconfont icondingwei"></i>
        </span>
        <!-- <span class="model-btn" @click="viewMode('3D')">
          <i>{{show2D?'2D':'3D'}}</i>
        </span>-->
        <span class="enlarge-btn" @click="scale('enlarge')">
          <i class="el-icon-plus"></i>
        </span>
        <span class="narrow-btn" @click="scale('narrow')">
          <i class="el-icon-minus"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import AMap from "AMap"; // 引入高德地图
import resView from "./res-view"; //查看标记资源
import place from "@env/assets/imgs/icon-place.png";
import water from "@env/assets/imgs/icon-water.png";
import gas from "@env/assets/imgs/icon-gas.png";
import solid from "@env/assets/imgs/icon-solid.png";
import danger from "@env/assets/imgs/icon-danger.png";
import { service } from "@env/utils/request.js";

export default {
  components: {
    resView
  },
  data() {
    return {
      map: {}, //保存地图对象
      initPolygonList: [], //初始的多边形
      companyInfoWindow: null, // 企业信息窗
      resInfoWindow: null, //资源信息窗
      active: "",
      show2D: true,
      isDraw: true,
      dialogVisible: false,
      resInfo: {},
      polygonID: "",
      viewPoint: {},
      resouceSearch: [
        { title: "废水排放口", type: "1", icon: water, checked: true },
        { title: "废气排放口", type: "2", icon: gas, checked: true },
        { title: "一般固废贮存点", type: "3", icon: solid, checked: true },
        { title: "危险废物贮存点", type: "4", icon: danger, checked: true }
      ],
      markerList: [], //多个标记
      markers: []
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    company: function() {
      if (Object.keys(this.$route.params).length) {
        sessionStorage.setItem(
          "company",
          JSON.stringify(this.$route.params.row)
        );
      }
      let sessionCompany = JSON.parse(sessionStorage.getItem("company"));
      return sessionCompany;
    }
  },

  methods: {
    // 初始化地图企业位置、资源位置、标记等
    init() {
      this.map = new AMap.Map("GIS", {
        mapStyle: "amap://styles/whitesmoke", //颜色主题
        zoom: 18,
        province: "江苏省",
        city: "苏州市",
        center: [120.596505, 31.306101], //初始地图中心点
        features: ["bg", "road", "building", "point"], //
        showBuildingBlock: true,
        pitch: 0,
        rotation: 0,
        viewMode: "2D",
        resizeEnable: true, //是否监控地图容器尺寸变化
        rotateEnable: true,
        pitchEnable: true,
        expandZoomRange: true,
        buildingAnimation: true //楼块出现是否带动画
      });
      //公司定位
      let placePoint = [this.company.LONGITUDE, this.company.LATITUDE];
      let placeMarker = new AMap.Marker({
        position: placePoint,
        content: `<img src="${place}" >`
      });
      this.map.add(placeMarker);
      placeMarker.on("click", event => {
        this.showCompanyInfo(placePoint);
      });
      this.getHasPolygon();
      this.getResourceList();
      this.map.setFitView();
    },
    //获取企业的下资源
    getResourceList() {
      let path = "env.ENV_RESOURCE.list";
      let params = {
        ENV_RESOURCE: { COMPANYID: this.company.ID }
      };
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.markerList = res.data.items;
          this.drawMarkers(res.data.items);
          this.map.setFitView();
        }
      });
    },
    //按类型查询标记点
    touchBtn(index, point) {
      this.$set(point, "checked", !point.checked);
      let newRes = this.resouceSearch.filter(item => item.checked == true);
      let resType = newRes.map(item => item.type);
      let newList = this.markerList.filter(item => resType.includes(item.TYPE));
      this.drawMarkers(newList);
    },
    //多个标记渲染
    drawMarkers(markerList) {
      const icon = ["", water, gas, solid, danger];
      if (this.markers.length) {
        this.map.remove(this.markers);
      }
      markerList.forEach((point, index) => {
        let marker = new AMap.Marker({
          position: new AMap.LngLat(point.LONGITUDE, point.LATITUDE),
          content: `<img src="${icon[point.TYPE]}">` // 将 html 传给 content
        });
        this.markers.push(marker);
        this.map.add(marker);
        marker.on("click", event => {
          this.showInfoM(event, point);
        });
      });
    },

    //获取企业的多边形
    getHasPolygon() {
      let path = "env.ENV_GIS.view";
      let params = {
        ENV_GIS: { COMPANYID: this.company.ID }
      };
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.polygonID = res.data.ID;
          let initList = JSON.parse(res.data.CARRAY);
          this.initPolygonList = initList;
          //公司多边形
          var polygon = new AMap.Polygon({
            path: initList,
            fillColor: "#BFDDEA",
            strokeColor: "#3CB2D1",
            fillOpacity: 0.4,
            zIndex: 50
          });
          this.map.add(polygon);
          this.map.setFitView();
        }
      });
    },

    //企业名称
    showCompanyInfo(placePoint) {
      this.companyInfoWindow = new AMap.InfoWindow({
        isCustom: true,
        anchor: "middle-left",
        content: `<div><div class="company-title">${this.company.NAME}</div><div class="company-info-sharp"></div></div>`
      });
      this.companyInfoWindow.open(this.map, placePoint);
    },

    createInfoWindow(point) {
      let that = this;
      that.resInfoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        anchor: "middle-left"
      });
      let InfoContent = Vue.extend({
        template: `<res-view
      :viewPoint="viewPoint"
    ></res-view>`,
        components: {
          resView
        },
        props: ["viewPoint"],
        data() {
          return {};
        },
        methods: {}
      });
      let component = new InfoContent({
        propsData: {
          viewPoint: this.viewPoint,
          company: this.company,
          map: this.map,
          resInfoWindow: that.resInfoWindow
        }
      }).$mount();
      that.resInfoWindow.setContent(component.$el);
      that.resInfoWindow.open(this.map, [point.LONGITUDE, point.LATITUDE]);
    },

    showInfoM(e, point) {
      this.viewPoint = point;
      this.createInfoWindow(point);
    },

    reback() {
      let row = this.company;
      this.$router.push({
        name: "enterprise-report",
        params: { row: row, type: "look" }
      });
    },
    clickMap() {
      this.active = "";
      let str = event.target.localName;
      if (str == "img" || str == "i") {
        return false;
      }
      if (this.companyInfoWindow) {
        this.companyInfoWindow.close();
      }
      if (this.resInfoWindow) {
        this.resInfoWindow.close();
      }
    },
    search(activeindex) {
      this.active = activeindex;
    },
    //地图视角适应企业点标记
    fixed(activeindex) {
      this.active = activeindex;
      this.map.setFitView();
    },
    viewMode(activeindex) {
      this.show2D = !this.show2D;
      let mode = this.show2D ? "2D" : "3D";
      this.active = activeindex;
      if (mode == "2D") {
        this.map.setRotation(0);
        this.map.setPitch(45);
      } else {
        this.map.setRotation(-15);
        this.map.setPitch(80);
      }
    },

    scale(activeindex) {
      let num = this.map.getZoom();
      if (activeindex == "enlarge") {
        num++;
        num = num > 18 ? 18 : num;
        this.map.setZoom(num);
      } else {
        num--;
        num = num < 3 ? 3 : num;
        this.map.setZoom(num);
      }
      this.active = activeindex;
    }
  }
};
</script>
<style lang="scss" scoped>
.map-wapper {
  width: 100%;
  height: 100%;
}
.GIS-head {
  position: fixed;
  top: 120px;
  // left: 20%;
  margin-left: 30px;
  display: flex;
}
.back-btn {
  background: #fff;
  width: 40px;
  border-radius: 2px;
  display: inline-block;
  text-align: center;
  margin-right: 10px;
  cursor: pointer;
}
.GIS-title {
  color: #1890ff;
  background-color: #fff;
  padding: 0 10px;
  line-height: 36px;
  text-align: center;
  border-radius: 2px;
  display: inline-block;
  margin-right: 10px;
}
.GIS-bar {
  position: fixed;
  top: 120px;
  right: 50px;
}
.GIS-tool {
  display: flex;
  flex-direction: column;
}
.GIS-btn {
  position: absolute;
  top: 0%;
  right: 50px;
  padding: 0 10px;
  background: #fff;
}
.img-mini {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 8px;
}
.btn-title {
  width: 100px;
  display: inline-block;
  text-align: left;
}
.el-button + .el-button {
  margin-left: 0px !important;
}
button.el-button.el-button--default.is-plain.gray-btn:focus,
button.el-button.el-button--default.is-plain.gray-btn:hover {
  border-color: #eeeeee;
  color: #999999;
}
.el-button.is-plain:focus,
.el-button.is-plain:hover {
  border-color: #eeeeee;
  color: #1890ff;
}
.blue-btn,
.gray-btn {
  border: none;
  border-bottom: 1px solid #eeeeee;
  position: relative;
  border-radius: 0;
}
.last-btn {
  color: #1890ff;
  border: none;
  position: relative;
}
.blue-btn {
  color: #1890ff;
}
.gray-btn {
  color: #999999;
}
.btn-check {
  position: absolute;
  right: 3px;
  top: 10px;
}

.GIS-footer {
  position: fixed;
  bottom: 60px;
  right: 50px;
}
.tool-btn {
  background: #fff;
  padding: 10px;
  cursor: pointer;
  font-weight: 500;
  color: #999;
  border-bottom: 1px solid #e6e8ec;
  border-radius: 1px;
}
.search-btn,
.fixed-btn,
.model-btn,
.enlarge-btn,
.narrow-btn {
  background: #fff;
  padding: 10px;
  cursor: pointer;
  font-weight: 500;
  color: #999;
  border-bottom: 1px solid #e6e8ec;
  border-radius: 1px;
  display: block;
  &:hover {
    background: #1890ff;
    color: #fff;
  }
}
i.el-icon-plus,
i.el-icon-minus,
i.el-icon-search {
  font-weight: 800;
}
.el-button--medium {
  padding: 10px 20px 10px 10px;
  font-weight: 400;
}
</style>

