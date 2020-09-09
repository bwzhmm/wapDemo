<template>
  <div>
    <div class="info-box">
      <h1 class="h1-title">{{fromInfo.NAME}}</h1>
      <dropdown-menu :lookRow="fromInfo" dropTitle="企业信息" />
    </div>
    <span class="blue-title-line font16">工商信息</span>
    <div class="base-info">
      <span class="mg-r10">
        <el-image :lazy="true" class="img-style" :src="imgURL" :preview-src-list="imgPreviewURL">
          <div slot="error" class="image-error">
            <span>图片获取失败</span>
          </div>
          <div slot="placeholder" class="image-error">图片加载中...</div>
        </el-image>
      </span>
      <div>
        <div class="info-title">
          <h1 class="h1-title">{{fromInfo.NAME}}</h1>
        </div>
        <el-form :model="fromInfo" ref="fromInfo" style="width:250px" label-position="left">
          <el-form-item label="社会统一信用代码：" label-width="140px">
            <span>{{fromInfo.CREDITCODE}}</span>
          </el-form-item>

          <el-form-item label="法人代表：" label-width="90px">
            <span>{{fromInfo.LEGAL}}</span>
          </el-form-item>

          <el-form-item label="成立时间：" label-width="90px">
            <span>{{SETUPTIME}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-divider class="hr-line"></el-divider>
    <span class="blue-title-line mg-tp20 font16">基本信息</span>
    <el-form :model="fromInfo" ref="fromInfo" label-width="150px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="企业名称：">
            <span>{{fromInfo.NAME}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="地址：">
            <span>{{address}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="投资情况：">
            <span>{{fromInfo.INVESTMENT}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="职工人数：">
            <span>{{fromInfo.EMPLOYEENUM}}人</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="行业类别：">
            <span>{{fromInfo.TYPE}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="行业代码：">
            <span>{{fromInfo.CODE}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="经度：">
            <span>{{fromInfo.LONGITUDE}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="纬度：">
            <span>{{fromInfo.LATITUDE}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="环保联系人：">
            <span>{{fromInfo.CONTACTPERSON}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话：">
            <span>{{fromInfo.CONTACRNUMBER}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所在园区情况：">
        <span>{{fromInfo.PARKSITUATION ||'-'}}</span>
      </el-form-item>
      <el-form-item label="不动产情况：">
        <span>{{fromInfo.REALESTATE ||'-'}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { formatStr } from "@env/utils/common.js";
import DropdownMenu from "@env/components/dropdown-menu";
export default {
  props: ["fromInfo"],
  components: { DropdownMenu },
  data() {
    return {};
  },
  computed: {
    SETUPTIME: function() {
      return formatStr(this.fromInfo.SETUPTIME, "-");
    },
    imgURL: function() {
      let imgUrl = this.fromInfo.BUSLICENSE
        ? `${window.global.ApiUrl}file/view/${this.fromInfo.BUSLICENSE}`
        : "";
      // console.log("1111", imgUrl);
      return imgUrl;
    },
    imgPreviewURL: function() {
      let imgUrl = this.fromInfo.BUSLICENSE
        ? [`${window.global.ApiUrl}file/view/${this.fromInfo.BUSLICENSE}`]
        : [];
      return imgUrl;
    },
    address: function() {
      let PROVINCE = this.fromInfo.PROVINCE
        ? this.fromInfo.PROVINCE.split("#")[0]
        : "";
      let CITY = this.fromInfo.CITY ? this.fromInfo.CITY.split("#")[0] : "";
      let COUNTY = this.fromInfo.COUNTY
        ? this.fromInfo.COUNTY.split("#")[0]
        : "";
      let address = this.fromInfo.ADDRESS;
      let str = `${PROVINCE}${CITY}${COUNTY}${address}`;
      return str;
    }
  }
};
</script>

<style scoped>
.font16 {
  font-size: 16px;
}
.head-content {
  width: 1160px;
}
.el-button--small {
  width: 83px;
  height: 32px;
}

.base-info {
  display: flex;
}

.el-form-item {
  margin-bottom: 0px;
}

.el-divider {
  background: #fff;
  height: 0;
  border: 1px dashed #f4f1f4;
}
.img-style {
  vertical-align: middle;
  display: inline-block;
  width: 120px;
  height: 160px;
  margin-right: 10px;
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
</style>

