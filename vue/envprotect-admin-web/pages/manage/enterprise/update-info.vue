<template>
  <div class="min-width" @click="clickDiv">
    <span class="blue-title-line">工商信息</span>
    <el-form :model="fromInfo" ref="fromInfo" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="企业名称："
            prop="NAME"
            :rules="[{ required: true, message: '企业名称不能为空', trigger: 'blur'}]"
          >
            <el-input v-model="fromInfo.NAME" placeholder="请输入企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="社会统一信用代码："
            prop="CREDITCODE"
            :rules="[{ required: true, message: '社会统一信用代码不能为空', trigger: 'blur'}]"
          >
            <el-input v-model="fromInfo.CREDITCODE" placeholder="请输入社会统一信用代码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="法人代表："
            prop="LEGAL"
            :rules="[{ required: true, message: '法人代表不能为空', trigger: 'blur'}]"
          >
            <el-input v-model="fromInfo.LEGAL" placeholder="请输入法人代表"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="成立时间："
            prop="SETUPTIME"
            :rules="[{ required: true, message: '成立时间不能为空', trigger: 'blur'}]"
          >
            <el-date-picker
              v-model="fromInfo.SETUPTIME"
              value-format="yyyyMMdd"
              type="date"
              placeholder="请选择成立时间"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item
            label="营业执照："
            prop="BUSLICENSE"
            :rules="[{ required: true, message: '营业执照不能为空', trigger: 'blur'}]"
          >
            <base-upload
              :url="uploadUrl"
              :fileId="fileID || fromInfo.BUSLICENSE"
              :size="5*1024"
              :lowSize="10"
              exts="bmp|jpeg|jpg|gif|png"
              btnText="点击上传"
              :isBtn="false"
              @done="finish"
              @deleteFile="deleteFile"
            ></base-upload>
            <span class="tips">支持.bmp .jpeg .jpg .gif .png，大小不超过5M</span>
          </el-form-item>
        </el-col>
      </el-row>
      <span class="blue-title-line">基本信息</span>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="企业性质："
            prop="PROPERTY"
            :rules="[{ required: true, message: '企业性质不能为空', trigger: 'blur'}
           ]"
          >
            <el-input v-model="fromInfo.PROPERTY" placeholder="请输入企业性质"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item
            label="地址："
            prop="ADDRESS"
            :rules="[{ required:true , message: '地址不能为空', trigger: ['blur','change']}]"
          >
            <div class="address-div">
              <div>
                <el-select
                  v-model="provinceValue"
                  placeholder="请选择"
                  @change="selectProvince"
                  class="address-select"
                >
                  <el-option
                    v-for="(item,index) of provinceList"
                    :key="index"
                    :label="item.NAME"
                    :value="`${item.NAME}#${item.ID}`"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="cityValue"
                  placeholder="请选择"
                  @change="selectCity"
                  class="address-select"
                >
                  <el-option
                    v-for="(item,index) of cityList"
                    :key="index"
                    :label="item.NAME"
                    :value="`${item.NAME}#${item.ID}`"
                  ></el-option>
                </el-select>
                <el-select
                  placeholder="请选择"
                  v-model="regionValue"
                  @change="selectRegion"
                  class="address-select"
                >
                  <el-option
                    v-for="(item,index) of regionList"
                    :key="index"
                    :label="item.NAME"
                    :value="`${item.NAME}#${item.ID}`"
                  ></el-option>
                </el-select>
              </div>
              <el-input
                id="tipinput"
                @click.native="clickInput"
                @input="onInput()"
                v-model="fromInfo.ADDRESS"
                placeholder="详细地址"
                class="address-input"
              ></el-input>
            </div>
          </el-form-item>
        </el-col>
        <div class="my-sug-result" v-show="visibleSugList">
          <div class="sug-item" v-for="(item,index) of sugList" :key="index" @click="sugMap(item)">
            {{item.name}}
            <span class="sug-item-span">{{item.district}}</span>
          </div>
        </div>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="经度："
            prop="LONGITUDE"
            :rules="[{ required: true, message: '经度不能为空',trigger: ['blur','change'] },
             { pattern:/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/, message: '经度整数部分为0-180,小数部分为0到6位!' }]"
          >
            <el-input v-model="fromInfo.LONGITUDE" @input="onInput()" placeholder="请输入经度"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="纬度："
            prop="LATITUDE"
            :rules="[{ required: true, message: '纬度不能为空', trigger: ['blur', 'change']},
             { pattern:/^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/, message: '纬度整数部分为0-90,小数部分为0到6位!' }]"
          >
            <el-input v-model="fromInfo.LATITUDE" @input="onInput()" placeholder="请输入纬度"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <div v-show="isShowMap" id="map-container"></div>

        <el-col :span="8">
          <el-form-item
            label="投资情况："
            prop="INVESTMENT"
            :rules="[{ required: true, message: '投资情况不能为空', trigger: 'blur'}]"
          >
            <el-input v-model="fromInfo.INVESTMENT" placeholder="请输入投资情况"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="职工人数："
            prop="EMPLOYEENUM"
            :rules="[{ required: true, message: '职工人数不能为空', trigger: 'blur'},
             { pattern: /(^[1-9]\d*$)/, message: '请输入正整数' }
           ]"
          >
            <el-input v-model.number="fromInfo.EMPLOYEENUM" placeholder="请输入职工人数">
              <span slot="suffix">人</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="行业类别："
            prop="TYPE"
            :rules="[{ required: true, message: '行业类别不能为空', trigger: 'blur'}]"
          >
            <el-input v-model="fromInfo.TYPE" placeholder="请输入行业类别"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="行业代码："
            prop="CODE"
            :rules="[{ required: true, message: '行业代码不能为空', trigger: 'blur'}]"
          >
            <el-input v-model="fromInfo.CODE" placeholder="请输入行业代码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="环保联系人："
            prop="CONTACTPERSON"
            :rules="[{ required: true, message: '环保联系人不能为空', trigger: 'blur'}]"
          >
            <el-input v-model="fromInfo.CONTACTPERSON" placeholder="请输入环保联系人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="联系电话："
            prop="CONTACRNUMBER"
            :rules="[ { required: true, message: '联系电话不能为空', trigger: 'blur'},
              { pattern:/^1[0-9]{10}$/, message: '请输入正确的联系电话' } ]"
          >
            <el-input v-model="fromInfo.CONTACRNUMBER" placeholder="请输入联系电话"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="所在园区情况：" prop="PARKSITUATION">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="fromInfo.PARKSITUATION"
              placeholder="请输入所在园区情况"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="不动产情况：" prop="REALESTATE">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="fromInfo.REALESTATE"
              placeholder="请输入不动产情况"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="drawer-footer">
      <el-button
        type="primary"
        icon="el-icon-check"
        size="small"
        class="mg-r20"
        @click="save('fromInfo')"
      >保存</el-button>
      <el-button plain size="small" icon="el-icon-refresh-right" @click="handleRest('fromInfo')">重置</el-button>
    </div>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
import BaseUpload from "@env/components/BaseUpload";
import { type } from "os";
export default {
  props: ["parentFrom", "currentPage"],
  components: { BaseUpload },
  data() {
    return {
      imageUrl: "",
      uploadUrl: `${window.global.ApiUrl}file/fileUpload`,
      fileID: "",
      provinceList: [],
      cityList: [],
      regionList: [],
      provinceValue: "",
      cityValue: "",
      regionValue: "",
      fromInfo: {
        ADDRESS: "",
        LONGITUDE: "",
        LATITUDE: "",
        BUSLICENSE: ""
      },
      addressMap: null,
      isShowMap: false,
      lng: "",
      lat: "",
      visibleSugList: false,
      sugList: [],
      placeSearch: null,
      district: null, //行政区
      districtBounds: ""
    };
  },

  computed: {
    //区
    regionName: function() {
      let COUNTY = this.fromInfo.COUNTY
        ? this.fromInfo.COUNTY.split("#")[0]
        : "";
      let regionStr = this.regionValue
        ? this.regionValue.split("#")[0]
        : COUNTY;
      return regionStr;
    },
    //省市区
    allPRC: function() {
      let PROVINCE = this.fromInfo.PROVINCE
        ? this.fromInfo.PROVINCE.split("#")[0]
        : "";
      let CITY = this.fromInfo.CITY ? this.fromInfo.CITY.split("#")[0] : "";
      let COUNTY = this.fromInfo.COUNTY
        ? this.fromInfo.COUNTY.split("#")[0]
        : "";
      let provinceStr = this.provinceValue
        ? this.provinceValue.split("#")[0]
        : PROVINCE;
      let cityStr = this.cityValue ? this.cityValue.split("#")[0] : CITY;
      let regionStr = this.regionValue
        ? this.regionValue.split("#")[0]
        : COUNTY;
      let str = `${provinceStr}${cityStr}市${regionStr}`;
      return str;
    },
    //市
    city: function() {
      let CITY = this.fromInfo.CITY ? this.fromInfo.CITY.split("#")[0] : "";
      let cityStr = this.cityValue ? this.cityValue.split("#")[0] : CITY;
      return cityStr;
    }
  },

  mounted() {
    if (this.parentFrom.ID) {
      this.fromInfo = JSON.parse(JSON.stringify(this.parentFrom));
    }
    this.fileID = this.parentFrom.BUSLICENSE || "";
    let PROVINCE = this.parentFrom.PROVINCE || "";
    this.getAddressList("", "province", PROVINCE); //获取省
    let CITY = this.parentFrom.CITY || "";
    let COUNTY = this.parentFrom.COUNTY;
    //获取省下的市
    if (PROVINCE) {
      this.getAddressList(PROVINCE.split("#")[1], "city", CITY);
    }
    //获取市下的区
    if (CITY) {
      this.getAddressList(CITY.split("#")[1], "region", COUNTY);
    }
  },
  methods: {
    // 点击最外层
    clickDiv(event) {
      let showEle = ["address-div", "sug-item-span", "sug-item"];
      if (
        showEle.includes(event.target.className) ||
        event.target.className.includes("amap") ||
        event.target.localName.includes("img")
      ) {
        return false;
      }
      this.isShowMap = false;
    },
    //获取区的中心点
    drawBounds() {
      if (!this.district) {
        var opts = {
          subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: "all", //返回行政区边界坐标组等具体信息
          level: "district" //查询行政级别为 市
        };
        this.district = new AMap.DistrictSearch(opts);
      }
      let regionName = this.regionName;
      if (!this.regionName) {
        this.$message({
          message: "请先选择省市区！",
          type: "warning"
        });
        this.isShowMap = false;
        return false;
      }

      this.district.search(this.regionName, (status, result) => {
        this.districtBounds = result.districtList && result.districtList[0];
        if (!this.districtBounds) {
          this.$message({
            message: "获取不到该市区的地图位置，请选择其他省市区！",
            type: "warning"
          });
          this.isShowMap = false;
          return false;
        }
        this.createMap();
      });
    },
    createMap() {
      let center = [
        this.districtBounds.center.lng,
        this.districtBounds.center.lat
      ];
      //地图加载 设定该区为中心点
      this.addressMap = new AMap.Map("map-container", {
        resizeEnable: true,
        zoom: 12,
        center: center,
        features: ["bg", "point", "building"]
      });
      this.addressMap.clearLimitBounds();
      //限制地图展示范围到指定区;
      var bounds = this.addressMap.getBounds();
      this.addressMap.setLimitBounds(bounds);

      //输入提示
      var autoOptions = {
        input: "tipinput",
        city: this.city,
        citylimit: true //是否强制限制在设置的城市内搜索
      };
      var auto = new AMap.Autocomplete(autoOptions);
      this.placeSearch = new AMap.PlaceSearch({
        map: this.addressMap
      });
      AMap.event.addListener(this.placeSearch, "markerClick", res => {
        let that = this;
        this.fromInfo.ADDRESS = res.data.name;
        this.fromInfo.LONGITUDE = res.data.location.lng;
        this.fromInfo.LATITUDE = res.data.location.lat;
      });

      //点击获取坐标
      this.addressMap.on("click", e => {
        this.visibleSugList = false;
        this.fromInfo.LONGITUDE = e.lnglat.getLng();
        this.fromInfo.LATITUDE = e.lnglat.getLat();
        let lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
        regeoCode(this, lnglat);
      });

      var geocoder = new AMap.Geocoder({
        city: "010", //城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      });
      var marker = new AMap.Marker();
      function regeoCode(that, lnglat) {
        that.addressMap.add(marker);
        marker.setPosition(lnglat);
        geocoder.getAddress(lnglat, (status, result) => {
          if (status === "complete" && result.regeocode) {
            var address = result.regeocode.formattedAddress;
            let regionStr = that.regionValue.split("#")[0];
            let addressStr = address
              .slice(address.lastIndexOf(`${regionStr}`))
              .split(`${regionStr}`)[1];
            that.fromInfo.ADDRESS = addressStr;
          } else {
            log.error("根据经纬度查询地址失败");
          }
        });
      }

      //查询成功时 根据省市区返回查询结果
      AMap.event.addListener(auto, "complete", res => {
        if (res.tips) {
          let tips = res.tips.filter(item => item.district == this.allPRC);
          this.sugList = tips;
        }
      });
    },
    onInput() {
      this.$forceUpdate();
    },
    // 点击详细地址当前input
    clickInput(event) {
      event.stopPropagation();
      this.isShowMap = true;
      this.visibleSugList = true;
      this.drawBounds();
    },
    //关键字查询地图
    sugMap(poi) {
      this.visibleSugList = false;
      this.fromInfo.ADDRESS = poi.name;
      this.fromInfo.LATITUDE = poi.location.lat;
      this.fromInfo.LONGITUDE = poi.location.lng;
      this.placeSearch.setCity(poi.adcode);
      this.placeSearch.setCityLimit(true);
      this.placeSearch.search(poi.name);
    },

    getAddressList(PID, type, initData) {
      const DICTID = "b8f769a7402c45ed8e256239d7a6c4b9";
      let path = "basic.CM_DICTV.findByPid";
      let params = {
        CM_DICTV: {
          DICTID: DICTID,
          PID: PID
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          if (type == "province") {
            this.provinceList = res.data;
            this.provinceValue = initData;
          }
          if (type == "city") {
            this.cityList = res.data;
            this.cityValue = initData;
          }
          if (type == "region") {
            this.regionList = res.data;
            this.regionValue = initData;
          }
        }
      });
    },
    selectProvince(item) {
      let ID = item.split("#")[1];
      this.getAddressList(ID, "city");
      this.cityValue = "";
      this.regionValue = "";
    },
    selectCity(item) {
      let ID = item.split("#")[1];
      this.getAddressList(ID, "region");
      this.regionValue = "";
    },
    selectRegion(item) {
      this.fromInfo.ADDRESS = "";
      this.fromInfo.LATITUDE = "";
      this.fromInfo.LONGITUDE = "";
      this.drawBounds();
    },
    // 图片上传完成后
    finish(res) {
      if (res.success) {
        this.fileID = res.item.ID;
        this.fromInfo.BUSLICENSE = res.item.ID;
      }
    },
    deleteFile() {
      this.fileID = "";
      this.fromInfo.BUSLICENSE = "";
    },
    //新增重置时清空图片 和地址
    handleRest(formName) {
      let province = this.provinceValue;
      let city = this.cityValue;
      let region = this.regionValue;
      this.fromInfo = JSON.parse(JSON.stringify(this.parentFrom));
      if (!this.fromInfo.BUSLICENSE) {
        this.fileID = "";
        this.fromInfo.BUSLICENSE = "";
        this.provinceValue = "";
        this.cityValue = "";
        this.regionValue = "";
      } else {
        let PROVINCE = this.parentFrom.PROVINCE || "";
        this.getAddressList("", "province", PROVINCE); //获取省
        let CITY = this.parentFrom.CITY || "";
        let COUNTY = this.parentFrom.COUNTY;
        //获取省下的市
        if (PROVINCE) {
          this.getAddressList(PROVINCE.split("#")[1], "city", CITY);
        }
        //获取市下的区
        if (CITY) {
          this.getAddressList(CITY.split("#")[1], "region", COUNTY);
        }
      }
    },

    add() {
      let path = "env.ENV_COMPANY.add";
      this.fromInfo.BUSLICENSE = this.fileID;
      let params = {
        ENV_COMPANY: {
          CONTACTPERSON: this.fromInfo.CONTACTPERSON,
          BUSLICENSE: this.fromInfo.BUSLICENSE,
          LONGITUDE: this.fromInfo.LONGITUDE,
          CREDITCODE: this.fromInfo.CREDITCODE,
          SETUPTIME: this.fromInfo.SETUPTIME,
          NAME: this.fromInfo.NAME,
          CODE: this.fromInfo.CODE,
          LEGAL: this.fromInfo.LEGAL,
          ADDRESS: this.fromInfo.ADDRESS,
          INVESTMENT: this.fromInfo.INVESTMENT,
          EMPLOYEENUM: this.fromInfo.EMPLOYEENUM,
          CONTACRNUMBER: this.fromInfo.CONTACRNUMBER,
          TYPE: this.fromInfo.TYPE,
          LATITUDE: this.fromInfo.LATITUDE,
          PARKSITUATION: this.fromInfo.PARKSITUATION,
          REALESTATE: this.fromInfo.REALESTATE,
          COUNTY: this.regionValue,
          CITY: this.cityValue,
          PROVINCE: this.provinceValue,
          PROPERTY: this.fromInfo.PROPERTY
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "新增成功"
          });
          this.$router.push({
            name: "enterprise"
          });
        } else {
          this.$message({
            type: "error",
            message: "新增失败"
          });
        }
      });
    },

    edit() {
      let path = "env.ENV_COMPANY.update";
      this.fromInfo.BUSLICENSE = this.fileID;
      let params = {
        ENV_COMPANY: {
          ID: this.fromInfo.ID,
          CONTACTPERSON: this.fromInfo.CONTACTPERSON,
          BUSLICENSE: this.fileID,
          LONGITUDE: this.fromInfo.LONGITUDE,
          CREDITCODE: this.fromInfo.CREDITCODE,
          SETUPTIME: this.fromInfo.SETUPTIME,
          NAME: this.fromInfo.NAME,
          CODE: this.fromInfo.CODE,
          LEGAL: this.fromInfo.LEGAL,
          ADDRESS: this.fromInfo.ADDRESS,
          INVESTMENT: this.fromInfo.INVESTMENT,
          EMPLOYEENUM: this.fromInfo.EMPLOYEENUM,
          CONTACRNUMBER: this.fromInfo.CONTACRNUMBER,
          TYPE: this.fromInfo.TYPE,
          LATITUDE: this.fromInfo.LATITUDE,
          PARKSITUATION: this.fromInfo.PARKSITUATION,
          REALESTATE: this.fromInfo.REALESTATE,
          COUNTY: this.regionValue,
          CITY: this.cityValue,
          PROVINCE: this.provinceValue,
          PROPERTY: this.fromInfo.PROPERTY
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "编辑成功"
          });
          this.$router.push({
            name: "enterprise",
            params: { curPage: this.currentPage }
          });
        }
      });
    },

    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.fromInfo.ID) {
            this.edit();
          } else {
            this.add();
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.min-width {
  min-width: 1160px;
}

.tips {
  color: #000;
  opacity: 0.45;
}
.address-div {
  display: flex;
}
.address-select {
  width: 140px;
  display: inline-block;
  margin-right: 10px;
}
.address-input {
  flex: 1;
  display: inline-block;
  position: relative;
}
#map-container {
  position: absolute;
  width: 900px;
  height: 500px;
  top: 0px;
  left: 10%;
  z-index: 99;
  box-shadow: 0 0 5px 1px #999;
}
.img-style {
  vertical-align: middle;
  display: inline-block;
  width: 120px;
  height: 160px;
}
.el-image.img-style .image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}
.my-sug-result {
  display: block;
  left: 608.313px;
  top: 42px;
  min-width: 343.469px;
  position: absolute;
  z-index: 1024;
  background-color: #fefefe;
  border: none;
  bottom: auto;
}
.sug-item {
  white-space: nowrap;
  font-size: 12px;
  cursor: pointer;
  padding: 10px;
}
.sug-item-span {
  color: #c1c1c1;
  padding-left: 4px;
}
</style>

