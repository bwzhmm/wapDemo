<template>
  <div class="el-dialog__wrapper">
    <div class="el-dialog__header">
      <span class="el-dialog__title">{{resForm.dialogTitle}}</span>
      <button type="button" class="el-dialog__headerbtn" @click="closeDialog">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
    </div>
    <div class="el-dialog__body">
      <el-form :model="resouceForm" ref="resouceForm" label-width="95px">
        <el-form-item
          label="资源类型："
          prop="TYPE"
          :rules="[{ required: true, message: `请选择资源类型`, trigger: 'blur'}]"
        >
          <template v-for="(item,index) in resouceType">
            <el-button
              v-model="resouceForm.TYPE"
              class="radio-btn"
              plain
              size="small"
              :key="index"
              :class="radioIndex==index || item.type==resouceForm.TYPE? 'blue-btn':'gray-btn'"
              @click="touchRadio(index,item)"
            >
              <i :class="`iconfont ${item.icon}`"></i>
              {{item.title}}
            </el-button>
          </template>
        </el-form-item>
        <el-form-item
          label="资源名称："
          prop="RESID"
          :rules="[{ required: true, message: `资源名称不能为空`, trigger: 'blur'}]"
        >
          <el-select
            v-model="resouceForm.RESID"
            filterable
            remote
            reserve-keyword
            placeholder="请输入资源名称查找"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="handleChange"
            @focus="handleFocus"
            style="width:100%"
          >
            <el-option
              v-for="item in resOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div
            class="el-select-dropdown el-popper"
            style="min-width: 348px; transform-origin: center top; z-index: 2019; position: absolute; top: 40px; left: 0px;"
            x-placement="bottom-start"
            v-show="isCreateRes"
          >
            <ul class="el-scrollbar__view el-select-dropdown__list">
              <li data-v-7dffb78e class="el-select-dropdown__item hover">
                <span>
                  没有查找到{{resourceName}}，
                  <i class="blue-text" @click="goCreate">去创建</i>
                </span>
              </li>
            </ul>
            <div x-arrow class="popper__arrow" style="left: 35px;"></div>
          </div>
        </el-form-item>
        <el-form-item
          label="资源位置："
          prop="PLACE"
          :rules="[{ required: true, message: `资源位置不能为空`, trigger: 'blur'}]"
        >
          <el-input v-model="lng" placeholder="经度" class="place"></el-input>
          <el-input v-model="lat" placeholder="纬度" class="place"></el-input>
          <el-button type="primary" size="small" @click="handlePlace()">
            <i class="iconfont icondingwei place-btn"></i>
            <span class="place-btn">地图拾取</span>
          </el-button>
        </el-form-item>
        <el-form-item label="资源照片：" prop="BUSLICENSE">
          <base-upload
            :url="uploadUrl"
            :fileId="fileID || resouceForm.BUSLICENSE"
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
        <el-form-item label="资源描述：" prop="DES">
          <el-input
            type="textarea"
            :autosize="{ minRows:4, maxRows:8}"
            v-model="resouceForm.DES"
            maxlength="200"
            show-word-limit
            placeholder="请输入描述内容，不超过200字"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          class="mg-r20"
          @click="save('resouceForm')"
        >保存</el-button>
        <el-button
          plain
          size="small"
          icon="el-icon-refresh-right"
          @click="handleRest('resouceForm')"
        >重置</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import BaseUpload from "@env/components/BaseUpload";
export default {
  name: "res-view",
  props: ["dialogVisible", "resForm", "mapdata", "company", "polygon"],
  components: { BaseUpload },
  data() {
    return {
      imageUrl: "",
      uploadUrl: `${window.global.ApiUrl}file/fileUpload`,
      fileID: "",
      radioIndex: "-1",
      resouceType: [
        {
          title: "废水排放口",
          type: "1",
          icon: "iconfeishui",
          resName: "废水资源",
          tab: "water"
        },
        {
          title: "一般固废贮存点",
          type: "3",
          icon: "iconyibangufei",
          resName: "固废资源",
          tab: "solid"
        },
        {
          title: "废气排放口",
          type: "2",
          icon: "iconfeiqi",
          resName: "废气资源",
          tab: "gas"
        },
        {
          title: "危险废物贮存点",
          type: "4",
          icon: "iconweixianfeiwu",
          resName: "危险废物资源",
          tab: "danger"
        }
      ],
      lng: "",
      lat: "",
      resOptions: [],
      reslist: [],
      loading: false,
      resouceForm: {
        TYPE: "",
        resNAME: "",
        PLACE: "",
        DES: "",
        RESID: ""
      },
      initForm: {},
      isCreateRes: false
    };
  },
  computed: {
    resourceName: function() {
      let name = this.resouceType.filter(
        item => item.type == this.resouceForm.TYPE
      )[0];
      return name ? name.resName : "";
    }
  },
  mounted() {
    if (this.resForm.ID) {
      this.getResDetail();
    }
    this.fileID = this.resForm.FILEID || "";
  },
  methods: {
    //获取企业的资源详情
    getResDetail() {
      let path = "env.ENV_RESOURCE.view";
      let params = {
        ENV_RESOURCE: { ID: this.resForm.ID }
      };
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.lng = res.data.LONGITUDE;
          this.lat = res.data.LATITUDE;
          this.getResOptions(res.data.TYPE, false);
          this.resouceForm = res.data;
          this.resouceForm.PLACE = "1";
          this.initForm = JSON.parse(JSON.stringify(this.resouceForm));
        }
      });
    },

    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.resOptions = this.reslist.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.resOptions = [];
      }
    },
    // 重置表单到初始化
    handleRest() {
      this.radioIndex = "-1";
      this.getResOptions(this.initForm.TYPE);
      this.resouceForm = JSON.parse(JSON.stringify(this.initForm));

      this.lng = this.initForm.LONGITUDE;
      this.lat = this.initForm.LATITUDE;
      this.fileID = this.initForm.FILEID;
    },
    // 图片上传完成后
    finish(res) {
      if (res.success) {
        this.fileID = res.item.ID;
        this.resouceForm.FILEID = res.item.ID;
      }
    },
    deleteFile() {
      this.fileID = "";
      this.resouceForm.FILEID = "";
    },

    getResOptions(type, flag) {
      let path = "env.ENV_RESOURCE.getResource";
      let params = {
        ENV_RESOURCE: { COMPANYID: this.company.ID, TYPE: type }
      };
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.reslist = res.data.map(item => {
            let name = `${item.NUM || ""}${item.NAME || ""}${item.POLLNAME ||
              ""}`;
            return { value: `${item.ID}`, label: `${name}` };
          });
          this.resOptions = this.reslist;
          if (flag) {
            if (!this.resOptions.length) {
              this.isCreateRes = true;
            } else {
              this.isCreateRes = false;
            }
          } else {
            this.isCreateRes = false;
          }
        }
      });
    },
    // 新页面打开创建污染防治资源
    goCreate() {
      let tabName = this.resouceType.filter(
        item => item.type == this.resouceForm.TYPE
      )[0];
      let name = tabName ? tabName.tab : "";
      let url = `${
        window.location.href.split("#")[0]
      }#/pollute-prevent/details?tabName=${name}`;
      window.open(url, "_blank");
    },

    touchRadio(index, item) {
      this.resouceForm.TYPE = item.type;
      this.resouceForm.RESID = "";
      this.radioIndex = index;
      this.getResOptions(item.type, false);
    },
    // 点击地图，地图的多边形 获取经纬度
    handlePlace() {
      this.mapdata.on("click", e => {
        this.lng = e.lnglat.getLng();
        this.lat = e.lnglat.getLat();
        this.resouceForm.PLACE = `${this.lng}${this.lat}`;
      });
      if (this.polygon) {
        this.polygon.on("click", e => {
          this.lng = e.lnglat.lng;
          this.lat = e.lnglat.lat;
          this.resouceForm.PLACE = `${this.lng}${this.lat}`;
        });
      }
    },

    closeDialog() {
      this.$emit("closeDialog");
    },

    handleChange(val) {
      this.resouceForm.RESID = val;
    },
    // 获得焦点时，重新获取资源下拉列表数据
    handleFocus(val) {
      this.getResOptions(this.resouceForm.TYPE, true);
    },

    add() {
      let path = "env.ENV_RESOURCE.add";
      let params = {
        ENV_RESOURCE: {
          COMPANYID: this.company.ID,
          LONGITUDE: this.lng,
          LATITUDE: this.lat,
          FILEID: this.resouceForm.FILEID,
          TYPE: this.resouceForm.TYPE,
          RESID: this.resouceForm.RESID,
          DES: this.resouceForm.DES
        }
      };

      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "创建成功"
          });
          this.closeDialog();
          this.$emit("handleSave");
        } else {
          this.$message({
            type: "error",
            message: "创建失败"
          });
        }
      });
    },

    edit() {
      let path = "env.ENV_RESOURCE.update";
      let params = {
        ENV_RESOURCE: {
          ID: this.resouceForm.ID,
          COMPANYID: this.company.ID,
          LONGITUDE: this.lng,
          LATITUDE: this.lat,
          FILEID: this.resouceForm.FILEID,
          TYPE: this.resouceForm.TYPE,
          RESID: this.resouceForm.RESID,
          DES: this.resouceForm.DES
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "编辑成功"
          });
          this.closeDialog();
          this.$emit("handleSave");
        }
      });
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.resouceForm.ID) {
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
.place {
  width: 105px;
  margin-right: 10px;
}
.place-btn {
  line-height: 20px;
  font-weight: 400;
}
.el-button + .el-button {
  margin-left: 0px;
}
/* .el-button--small,
.el-button--small.is-round {
  padding: 8px 15px;
} */

.radio-btn:nth-child(even) {
  margin-bottom: 10px;
  margin-left: 10px;
}
.el-dialog__close {
  font-size: #000000;
  opacity: 0.25;
}

.el-dialog__wrapper {
  position: fixed;
  top: 17%;
  left: 20%;
  max-height: 705px;
  width: 500px;
  background: #fff;
}
.el-dialog__body {
  padding: 20px;
  height: 600px;
}

.blue-btn {
  background: #fff;
  border-color: #1890ff;
  color: #1890ff;
}
.gray-btn {
  color: #999999;
  border-color: #f2f2f2;
  background: #fefdff;
}
.tips {
  color: #000;
  opacity: 0.45;
}
.blue-text {
  color: #1890ff;
}
</style>
