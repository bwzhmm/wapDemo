<template>
  <div class="card-wrapper">
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <div v-show="viewForm.FILEID">
          <el-image
            class="img-style"
            :src="titleImgUrl"
            :preview-src-list="imgPreviewURL(viewForm.FILEID)"
          >
            <div slot="error" class="image-error image">
              <span>图片获取失败</span>
            </div>
            <div slot="placeholder" class="image-error image">图片加载中...</div>
          </el-image>
        </div>
        <span class="res-title">{{resName}}</span>
      </div>

      <div style="padding: 14px;">
        <template v-for="(item,index) in resouceType">
          <el-button
            plain
            :key="index"
            class="blue-item"
            v-show="viewForm && item.type==viewForm.TYPE"
          >
            <i :class="`iconfont ${item.icon}`"></i>
            {{item.title}}
          </el-button>
        </template>
        <div class="card-des" v-if="viewForm.TYPE=='1'||viewForm.TYPE=='2'">
          <p>排放规律：{{viewForm.RES&&viewForm.RES.REGULAR }}</p>
          <p>污染物因子：{{factors}}</p>
          <p>产生量：{{viewForm.RES&&viewForm.RES.YIELD}}t/a</p>
          <p>{{viewForm.DES}}</p>
        </div>
        <div class="card-des" v-else>
          <p>放置位置：{{viewForm.RES&&viewForm.RES.POSITION }}</p>
          <p>占地面积：{{viewForm.RES&&viewForm.RES.FOOTPRINT}}m³</p>
          <p>{{viewForm.DES}}</p>
        </div>

        <div class="bottom">
          <el-button class="blue-btn" @click="handleUpdate()">编辑</el-button>
          <el-button class="red-btn" @click="handleDelete()">删除</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import BaseUpload from "@env/components/BaseUpload";
export default {
  name: "res-view",
  props: ["viewPoint"],
  components: { BaseUpload },
  data() {
    return {
      imageUrl: "",
      uploadUrl: `${window.global.ApiUrl}file/fileUpload`,
      fileID: "",
      resouceType: [
        { title: "废水排放口", type: "1", icon: "iconfeishui" },
        { title: "废气排放口", type: "2", icon: "iconfeiqi" },
        { title: "一般固废贮存点", type: "3", icon: "iconyibangufei" },
        { title: "危险废物贮存点", type: "4", icon: "iconweixianfeiwu" }
      ],
      viewForm: {},
      updateVisible: false,
      visible: true
    };
  },
  computed: {
    titleImgUrl() {
      let imgUrl = this.viewPoint.FILEID
        ? `${window.global.ApiUrl}file/view/${this.viewPoint.FILEID}`
        : "";
      console.log("11122", imgUrl);
      return imgUrl;
    },
    factors() {
      let factor = "";
      if (this.viewPoint && this.viewPoint.RES) {
        if (
          this.viewPoint.RES.ENV_WWPOLLFACTOR &&
          this.viewPoint.RES.ENV_WWPOLLFACTOR.length
        ) {
          factor = this.viewPoint.RES.ENV_WWPOLLFACTOR.map(
            item => item.NAME
          ).join("、");
        }
        if (
          this.viewPoint.RES.ENV_EGPOLLFACTOR &&
          this.viewPoint.RES.ENV_EGPOLLFACTOR.length
        ) {
          factor = this.viewPoint.RES.ENV_EGPOLLFACTOR.map(
            item => item.NAME
          ).join("、");
        }
      }
      return factor;
    },
    resName() {
      let res = this.viewPoint && this.viewPoint.RES;
      let name = `${res.NUM || ""}${res.NAME || ""}${res.POLLNAME || ""}`;
      let strName = res ? `${name}` : "";
      return strName;
    }
  },

  mounted() {
    this.viewForm = JSON.parse(JSON.stringify(this.viewPoint));
  },
  methods: {
    imgURL(fileID) {
      let imgUrl = fileID ? `${window.global.ApiUrl}file/view/${fileID}` : "";
      return imgUrl;
    },
    imgPreviewURL(fileID) {
      let imgUrl = fileID ? [`${window.global.ApiUrl}file/view/${fileID}`] : [];
      return imgUrl;
    },
    handleUpdate() {
      this.$emit("edit");
    },
    handleDelete() {
      let path = "env.ENV_RESOURCE.delete";
      let params = {
        ENV_RESOURCE: { ID: this.viewPoint.ID }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "资源删除成功"
          });
          this.$emit("deleteWin");
        }
      });
    }
  }
};
</script>

<style scoped>
.card-wrapper {
  width: 240px;
  background: #fff;
  margin-left: 40px !important;
}
.card-wrapper /deep/ .el-card__header {
  padding: 0px;
}
.res-title {
  color: #333333;
  line-height: 20px;
  padding: 10px;
  display: inline-block;
  font-weight: 600;
}
.card-des {
  line-height: 20px;
  color: #666;
}
.card-des p {
  margin-top: 10px;
}
.blue-item {
  background: #fff;
  border-color: #1890ff;
  color: #1890ff;
  line-height: 5px;
  padding: 10px;
}
.blue-btn,
.red-btn {
  margin-top: 20px;
  color: #fff;
  line-height: 10px;
  padding: 12px 10px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.blue-btn,
button.el-button.blue-btn.el-button--default:hover,
button.el-button.blue-btn.el-button--default:focus {
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
}
.red-btn,
button.el-button.red-btn.el-button--default:hover,
button.el-button.red-btn.el-button--default:focus {
  background-color: #fa541c;
  border-color: #fa541c;
  color: #fff;
}

.hidden {
  opacity: 1;
}
.img-style {
  vertical-align: middle;
  display: inline-block;
  width: 240px;
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
.el-button + .el-button {
  margin-left: 0px;
}
</style>
