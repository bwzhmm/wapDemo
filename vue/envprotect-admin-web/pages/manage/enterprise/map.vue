<template>
  <div class="main-wapper">
    <div id="GIS" class="map-wapper" @contextmenu.prevent="rightClick" @click="clickMap"></div>
    <div class="GIS-head">
      <span class="back-btn" @click="reback()">
        <i class="iconfont iconfanhui"></i>
      </span>
      <span class="GIS-title">{{company.NAME}}</span>
      <el-button
        type="primary"
        size="medium"
        class="mg-r10"
        @click="drawPolygon()"
        v-if="isDraw"
        style="width:118px"
      >
        <i class="iconfont iconhuizhi" style="font-size:14px"></i>
        绘制地图
      </el-button>
      <el-button
        style="width:118px"
        type="primary"
        size="medium"
        class="green-btn mg-r10"
        @click="closeDraw()"
        icon="el-icon-check"
        v-else
      >绘制结束</el-button>
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-plus"
        @click="addResource('fromInfo')"
      >创建资源</el-button>
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
    <div class="GIS-footer" v-show="!isDraw">
      <el-button
        type="danger"
        size="small"
        class="mg-r10"
        icon="el-icon-close"
        @click="clearPolygon"
      >清空</el-button>
      <el-button type="primary" size="small" icon="el-icon-check" @click="saveDraw">保存</el-button>
    </div>
    <res-dialog
      v-if="dialogVisible"
      :resForm="resInfo"
      :company="company"
      @closeDialog="closeDialog"
      @handleSave="handleSave"
      :mapdata="map"
      :polygon="polygon"
    ></res-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import AMap from "AMap"; // 引入高德地图
import resDialog from "./res-dialog"; //创建 编辑资源
import resView from "./res-view"; //查看标记资源
import place from "@env/assets/imgs/icon-place.png";
import water from "@env/assets/imgs/icon-water.png";
import gas from "@env/assets/imgs/icon-gas.png";
import solid from "@env/assets/imgs/icon-solid.png";
import danger from "@env/assets/imgs/icon-danger.png";
import { service } from "@env/utils/request.js";

export default {
  components: {
    resDialog,
    resView
  },
  data() {
    return {
      map: {}, //保存地图对象
      mouseTool: null, // 鼠标多边形绘制工具
      polygon: null, //多边形对象
      polyEditor: null, //编辑多边形
      polygonList: [],
      initPolygonList: [], //初始的多边形
      savePolygon: [],
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
      markers: [],
      isDelPolygon: false //是否删除了多边形
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
          JSON.stringify(this.$route.params.company)
        );
      }
      let sessionCompany = JSON.parse(sessionStorage.getItem("company"));
      return sessionCompany;
    }
  },

  methods: {
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
      let placePoint = [this.company.LONGITUDE, this.company.LATITUDE];
      //公司定位
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
          //公司初始多边形
          this.polygon = new AMap.Polygon({
            path: this.initPolygonList,
            fillColor: "#BFDDEA",
            strokeColor: "#3CB2D1",
            fillOpacity: 0.4,
            zIndex: 50
          });

          this.map.add(this.polygon);
          this.map.setFitView();
        }
      });
    },
    // 保存企业多边形,有初始多边形初始化初始多边形
    saveCompanyPolygon() {
      let tempData = [];
      if (this.savePolygon.length) {
        tempData = this.savePolygon.map(item => {
          return [item.lng, item.lat];
        });
      } else if (this.initPolygonList.length) {
        tempData = JSON.parse(JSON.stringify(this.initPolygonList));
      }
      let polygonLngLat = JSON.stringify(tempData);
      let path = "env.ENV_GIS.save";
      let params = {
        ENV_GIS: {
          COMPANYID: this.company.ID,
          CARRAY: polygonLngLat,
          ID: this.polygonID
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.polygonID = res.data.ID;
          let initList = JSON.parse(res.data.CARRAY);
          this.initPolygonList = initList;
          this.$message({
            type: "success",
            message: "企业位置保存成功！"
          });

          this.isDraw = true;
          this.isDelPolygon = false;
          if (this.mouseTool) {
            this.mouseTool.close(true);
          }
          if (this.polyEditor) {
            this.polyEditor.close();
          }
        }
      });
    },

    //显示企业名称
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
      @deleteWin="deleteWin"
      @edit="edit"
    ></res-view>`,
        components: {
          resView
        },
        props: ["viewPoint"],
        data() {
          return {};
        },
        mounted() {},
        methods: {
          edit() {
            let item = JSON.parse(JSON.stringify(this.viewPoint));
            that.resInfo = item;
            that.resInfo.dialogTitle = "编辑资源";
            that.dialogVisible = true;
            that.resInfoWindow.close();
          },
          deleteWin() {
            that.getResourceList();
            that.resInfoWindow.close();
          }
        }
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
    //清空后再次画
    drawAgain() {
      this.polygon = new AMap.Polygon({
        fillColor: "#BFDDEA",
        strokeColor: "#3CB2D1",
        fillOpacity: 0.4,
        zIndex: 50
      });
      this.mouseTool = new AMap.MouseTool(this.map);
      this.mouseTool.polygon({
        fillColor: "#BFDDEA",
        strokeColor: "#3CB2D1",
        fillOpacity: 0.4,
        zIndex: 50
      });
      //监听draw事件可获取画好的覆盖物
      this.polygonList = [];
      this.mouseTool.on("draw", e => {
        this.polygonList = [];
        this.polygonList.push(e.obj);
        this.closeDrawPolygon();
      });
    },

    // 清空地图上绘制的多边形，清空保存的数据，清空编辑的状态
    clearPolygon() {
      this.isDelPolygon = true;
      if (this.polygon) {
        this.map.remove(this.polygon);
        this.map.remove(this.polygonList);
        this.polygon = null;
        this.polygonList = [];
        this.savePolygon = [];
        if (this.polyEditor) {
          this.polyEditor.close();
        }
        this.drawAgain();
      } else {
        this.$message({
          message: "企业位置多边形已清空！",
          type: "warning"
        });
      }
    },
    saveDraw() {
      this.saveCompanyPolygon();
    },
    //结束绘制并不是真正的删除，回到初始多边形状态
    closeDraw() {
      this.isDraw = true;
      this.isDelPolygon = false;
      if (this.mouseTool) {
        this.mouseTool.close(true);
      }
      if (this.polyEditor) {
        this.polyEditor.close();
      }
      if (this.initPolygonList.length) {
        this.polygon = new AMap.Polygon({
          path: this.initPolygonList,
          fillColor: "#BFDDEA",
          strokeColor: "#3CB2D1",
          fillOpacity: 0.4,
          zIndex: 50
        });
        this.map.add(this.polygon);
      }
    },
    //绘制多边形,已存在多边形直接编辑，不再画
    drawPolygon() {
      this.isDraw = false;
      if (this.initPolygonList.length) {
        if (!this.polygon) {
          this.polygon = new AMap.Polygon({
            path: this.initPolygonList,
            fillColor: "#BFDDEA",
            strokeColor: "#3CB2D1",
            fillOpacity: 0.4,
            zIndex: 50
          });
          this.map.add(this.polygon);
        }
        this.polyEditor = new AMap.PolyEditor(this.map, this.polygon);
        this.polyEditor.open();
        return false;
      } else {
        this.polygon = new AMap.Polygon({
          fillColor: "#BFDDEA",
          strokeColor: "#3CB2D1",
          fillOpacity: 0.4,
          zIndex: 50
        });
      }
      // let that = this;
      this.mouseTool = new AMap.MouseTool(this.map);
      this.mouseTool.polygon({
        fillColor: "#BFDDEA",
        strokeColor: "#3CB2D1",
        fillOpacity: 0.4,
        zIndex: 50
      });
      //监听draw事件可获取画好的覆盖物
      this.polygonList = [];
      this.mouseTool.on("draw", e => {
        this.polygonList = [];
        this.polygonList.push(e.obj);
        this.closeDrawPolygon();
      });
    },

    // 结束绘制多边形
    closeDrawPolygon() {
      let savePolygon = [];
      if (this.polygonList.length) {
        for (let i = 0; i < this.polygonList.length; i++) {
          let op = this.polygonList[i].getOptions();
          let routePath = [];
          op.path.forEach(item => {
            routePath.push([item.lng, item.lat]);
          });
          let savearr = {
            path: routePath,
            strokeColor: op.strokeColor,
            fillOpacity: op.fillOpacity,
            fillColor: op.fillColor,
            zIndex: op.zIndex
          };
          this.savePolygon = routePath;
          this.polygon = new AMap.Polygon({
            path: routePath, //设置多边形边界路径
            fillColor: "#BFDDEA", //填充色
            strokeColor: "#3CB2D1", //线颜色
            fillOpacity: 0.4, //填充透明度
            zIndex: 50
          });

          this.map.add(this.polygon);
          this.polyEditor = new AMap.PolyEditor(this.map, this.polygon);
          this.polygon.on("click", event => {
            this.mouseTool.close(true);
            // this.polyEditor.open();
          });
        }
      }
    },
    reback() {
      let row = this.company;
      this.$router.push({
        name: "enterprise-details",
        params: { row: row, type: "look" }
      });
    },
    //鼠标点击事件，消息弹框关闭,点击多边形可以编辑
    clickMap(event) {
      this.active = "";
      if (this.polygon) {
        this.polygon.on("click", event => {
          if (!this.isDraw) {
            this.polyEditor.open();
          }
        });
      }

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
    //鼠标右键
    rightClick() {
      if (this.mouseTool) {
        this.mouseTool.close(true);
      }
      if (this.polyEditor) {
        this.polyEditor.close();
      }
    },

    addResource() {
      this.resInfo = {};
      this.resInfo.dialogTitle = "创建资源";
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
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
    },
    //弹框保存资源
    handleSave() {
      this.getResourceList();
    }
  }
};
</script>

<style lang="scss" scoped  >
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
.el-button--medium {
  font-weight: 400;
}
.GIS-btn /deep/ .el-button--medium {
  padding: 10px 20px 10px 0px;
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
/* .el-button--small,
.el-button--small.is-round {
  padding: 8px 10px;
} */
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
</style>

