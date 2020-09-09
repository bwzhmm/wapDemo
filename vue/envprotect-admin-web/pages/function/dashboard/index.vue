<template>
  <div class="main-wapper">
    <div id="GIS" class="map-wapper" @click="clickMap"></div>
    <div class="GIS-bar">
      <div class="GIS-stats" v-show="active=='stats'">
        <header>
          <span class="black-title">企业总数</span>
          <span>
            <i class="blue-num">{{statistic.total}}</i>
            <i class="type-des">家</i>
          </span>
        </header>
        <section>
          <div
            :style="{borderColor:item.color}"
            class="num-box"
            v-for="(item,index) in resouceType"
            plain
            :key="index"
            :class="(index==0)||(index==1)?`num-btm`:''"
          >
            <span class="type-title">{{item.title}}</span>
            <span>
              <i :style="{color:item.color}" class="type-num">{{statistic[item.type]}}</i>
              <i class="type-des">家企业</i>
            </span>
          </div>
        </section>
      </div>
      <div class="GIS-btn" v-show="active=='search'">
        <el-button
          v-for="(item,index) in resouceSearch"
          plain
          :key="index"
          size="medium"
          :class="item.checked? index===resouceSearch.length-1 ?'last-btn':'blue-btn':'gray-btn'"
          @click="touchBtn(index,item)"
        >
          <img class="img-mini" :src="`${item.icon}`" />
          <span class="btn-title">{{item.title}}</span>
          <i class="el-icon-check btn-check" v-show="item.checked"></i>
        </el-button>
      </div>
      <div class="GIS-tool">
        <span class="stats-btn" @click="stats('stats')">
          <i class="el-icon-s-data"></i>
        </span>
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
      active: "stats",
      show2D: true,
      isDraw: true,
      dialogVisible: false,
      resInfo: {},
      polygonID: "",
      viewPoint: {},
      statistic: {},
      resouceSearch: [
        { title: "废水排放口", type: "1", icon: water, checked: true },
        { title: "废气排放口", type: "2", icon: gas, checked: true },
        { title: "一般固废贮存点", type: "3", icon: solid, checked: true },
        { title: "危险废物贮存点", type: "4", icon: danger, checked: true }
      ],
      markerList: [], //多个标记
      markers: [],
      resouceType: [
        { title: "废水排放", type: "fs", color: "#1890FF" },
        { title: "废气排放", type: "fq", color: "#F5A623" },
        { title: "一般固废", type: "gf", color: "#9013FE" },
        { title: "危险废物", type: "wx", color: "#FA7268" }
      ]
    };
  },
  mounted() {
    this.createMap();
    this.getResourceList();
    this.getStatisic();
  },

  methods: {
    //默认省下的所有企业及资源
    getResourceList() {
      let path = "env.ENV_COMPANY.homeList";
      service({}, path).then(res => {
        if (res.success && res.data) {
          let allCompany = res.data;
          if (Array.isArray(allCompany)) {
            allCompany.forEach(item => {
              this.initPlace(item);
              this.drawMarkers(item.RES, false);
              this.markerList = this.markerList.concat(item.RES);
              this.map.setFitView();
            });
          }
        }
      });
    },
    //按类型查询标记点
    touchBtn(index, point) {
      this.$set(point, "checked", !point.checked);
      let newRes = this.resouceSearch.filter(item => item.checked == true);
      let resType = newRes.map(item => item.type);
      let newList = this.markerList.filter(item => resType.includes(item.TYPE));
      this.drawMarkers(newList, true);
    },
    //多个标记渲染
    drawMarkers(markerList, flag) {
      const icon = ["", water, gas, solid, danger];
      if (this.markers.length && flag) {
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

    createMap() {
      this.map = new AMap.Map("GIS", {
        mapStyle: "amap://styles/whitesmoke", //颜色主题
        zoom: 12,
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
    },

    initPlace(company) {
      //公司多边形
      let initPolygonList = JSON.parse(company.CARRAY);
      var polygon = new AMap.Polygon({
        path: initPolygonList,
        fillColor: "#BFDDEA",
        strokeColor: "#3CB2D1",
        fillOpacity: 0.4,
        zIndex: 50
      });

      this.map.add(polygon);
      // 多个公司定位
      let lng = company.LONGITUDE,
        lat = company.LATITUDE;
      let placePoint = [lng, lat];
      let placeMarker = new AMap.Marker({
        position: placePoint,
        content: `<img src="${place}" >`
      });
      this.map.add(placeMarker);
      placeMarker.on("click", event => {
        this.showCompanyInfo(placePoint, company);
      });
    },
    //企业名称
    showCompanyInfo(placePoint, company) {
      this.companyInfoWindow = new AMap.InfoWindow({
        isCustom: true,
        anchor: "middle-left",
        content: `<div><div class="company-title">${company.NAME}</div><div class="company-info-sharp"></div></div>`
      });
      this.companyInfoWindow.open(this.map, placePoint);
    },
    //弹出信息窗体
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
          map: this.map,
          resInfoWindow: that.resInfoWindow
        }
      }).$mount();
      that.resInfoWindow.setContent(component.$el);
      let lng = point.LONGITUDE,
        lat = point.LATITUDE;
      that.resInfoWindow.open(this.map, [lng, lat]);
    },

    showInfoM(e, point) {
      this.viewPoint = point;
      this.createInfoWindow(point);
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
    getStatisic() {
      let path = "env.ENV_COMPANY.statistic";
      service({}, path).then(res => {
        if (res.success && res.data) {
          this.statistic = res.data;
        }
      });
    },

    stats(activeindex) {
      this.active = activeindex;
      this.getStatisic();
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
.back-btn {
  background: #fff;
  width: 40px;
  line-height: 26px;
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
.GIS-stats {
  position: absolute;
  top: 0%;
  right: 50px;
  display: flex;
  flex-direction: column;
  padding: 30px 20px 10px;
  background: #fff;
}
.GIS-stats header {
  display: flex;
  justify-content: space-between;
  width: 400px;
  padding: 10px 15px;
  background: #f1f9ff;
  height: 60px;
}
.black-title {
  width: 72px;
  height: 25px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 33px;
}
.blue-num {
  width: 44px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  color: #1890ff;
  line-height: 33px;
  margin-right: 10px;
}
.num-box {
  line-height: 40px;
  width: 150px;
  color: #666666;
  border-left: 1px solid;
  padding: 0px 20px;
  height: 80px;
}

.GIS-stats section {
  display: flex;
  justify-content: space-between;
  width: 400px;
  padding: 15px;
  flex-wrap: wrap;
}
.num-btm {
  margin-bottom: 20px;
}

.GIS-btn {
  position: absolute;
  top: 35px;
  right: 50px;
  padding: 0 10px;
  background: #fff;
}
.type-title {
  display: block;
}
.type-num {
  font-size: 24px;
  margin-right: 5px;
}
.type-des {
  color: #999;
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
.stats-btn,
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
  font-weight: 400;
  padding: 10px 20px 10px 0px;
}
</style>

