<template>
  <div>
    <el-button
      v-if="isBtn"
      icon=" el-icon-upload2"
      @click="toupload"
      size="small"
    >{{btnText || '上传文件'}}</el-button>
    <span v-else>
      <li class="upload-img" v-if="fileId">
        <img :src="imgURL" class="upload-thumb" />
        <span class="upload-actions">
          <span class="upload-icon" @click="handlePreview">
            <i class="el-icon-view"></i>
          </span>
          <span class="upload-icon" @click="toupload">
            <i class="el-icon-plus"></i>
          </span>
          <span class="upload-icon" @click="handleDel">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
      <span class="cflex img-uploader" @click="toupload" v-else>
        <i class="el-icon-plus img-uploader-icon"></i>
        <span class="el-upload__text">{{btnText || '点击上传'}}</span>
      </span>
    </span>

    <input
      type="file"
      rel="files"
      :multiple="multiple"
      @change="getFile"
      title="上传文件"
      ref="uploaddom"
      class="uploadinput"
    />
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" class="img-dialog">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
  <!--:url="this.util.getUploadUrl()"--><!--绑定url  必须
    --exts="png|jpg|bmp|gif"--><!--指定文件后缀  必须
    v-on:choose="choosefiel"--><!--选择文件后的回调
    -on:done="finish"--><!--完成上传后的回调
    :carmera:"true"--><!--是否可以支持拍照上传，true是可以支持
      btnText:按钮显示的文字
    isBtn: 是否为按钮 或者为图框
    -->
<script>
import axios from "axios";
export default {
  name: "upload",
  data() {
    return {
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      isDel: false
    };
  },
  computed: {
    imgURL: function() {
      return `${window.global.ApiUrl}file/view/${this.fileId}`;
    }
  },
  methods: {
    // 图片预览
    handlePreview() {
      this.dialogImageUrl = this.imgURL;
      this.dialogVisible = true;
    },
    // 删除文件或图片
    handleDel() {
      this.isDel = true;
      this.$emit("deleteFile", true);
    },

    getCookie(name) {
      let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    getFile(e) {
      this.fileList = e.target.files;
      if (!this.fileList.length) {
        return false;
      }
      let exts = this.exts.split("|");
      for (let i = 0; i < this.fileList.length; i++) {
        let item = this.fileList[i];
        let fileNameArr = item.name.split(".");
        let fileext = fileNameArr[fileNameArr.length - 1].toLowerCase();
        if (exts.indexOf(fileext) === -1) {
          this.$message({
            message: "上传了不符合后缀的文件！",
            type: "warning"
          });
          // this.$message("上传了不符合后缀的文件！");
          throw "上传了不符合后缀的文件！";
        }
        if (this.size) {
          let limitFileSize = this.size * 1024;
          if (item.size > limitFileSize) {
            this.$message({
              message: "上传文件超过限制大小！",
              type: "warning"
            });
            // this.$message("上传文件超过限制大小！");
            throw "上传文件超过限制大小！";
          }
        }
      }
      this.$emit("choose", this.fileList);
      let formData = new FormData();
      for (let i = 0; i < this.fileList.length; i++) {
        formData.append("file", this.fileList[i]);
        // formData.append('PHYAPPID',"unknow");
      }
      let axiosSettings = {
        url: this.url,
        method: "POST",
        headers: {
          IDSTGC: this.getCookie("IDSTGC") || "e6dbc8356f604d2e9b49d5de95edb107"
        },
        data: formData
      };
      axios(axiosSettings).then(data => {
        // debugger
        let res = data.data;
        if (res !== null && !res.success) {
          if (res.hasOwnProperty("login") && !res.login) {
            let pathName = window.document.location.pathname;
            let projectName = pathName.substring(
              0,
              pathName.substr(1).indexOf("/") + 1
            );
            let url = projectName + "/";
            let purl = document.location.href; //
            location.href =
              url +
              "rest/Idsclient/reqLogin?reqUrl=" +
              encodeURIComponent(purl);
          } else {
            //判断返回错误状态

            if (typeof res.message == "object") {
              let message = "";
              for (var key in res.message) {
                let single = "第" + key + "行：" + res.message[key];
                message += single + ",";
              }
              if (message.length > 0) {
                message = message.substr(0, message.length - 1);
              }
              const h = this.$createElement;
              this.$message({
                type: "warning",
                // message:"<div>除以下问题数据外，其他数据都已上传成功：</div><div>"+message+"</div>",
                message: h("p", null, [
                  h(
                    "p",
                    { style: "color: orange;margin-bottom:10px" },
                    "除以下问题数据外，其他数据都已上传成功： "
                  ),
                  h("p", { style: "color: red" }, message)
                ]),
                duration: 0,
                showClose: true
              });
              this.$emit("unfinished");
            } else {
              this.$message(res.message);
            }
          }
        } else {
          this.$emit("done", res);
        }
      });
    },

    dropFile(e) {
      this.fileList = e.dataTransfer.files;
      if (!this.fileList.length || this.fileList.length > 1) {
        return false;
      }
      let exts = this.exts.split("|");
      for (let i = 0; i < this.fileList.length; i++) {
        let item = this.fileList[i];
        let fileNameArr = item.name.split(".");
        let fileext = fileNameArr[fileNameArr.length - 1];
        if (exts.indexOf(fileext) === -1) {
          this.$message("上传了不符合后缀的文件！");
          throw "上传了不符合后缀的文件！";
        }
        if (this.size) {
          let limitFileSize = this.size * 1024;
          if (item.size > limitFileSize) {
            this.$message("上传文件超过限制大小！");
            throw "上传文件超过限制大小！";
          }
        }
      }
      this.$emit("choose", this.fileList);
      let formData = new FormData();
      for (let i = 0; i < this.fileList.length; i++) {
        formData.append("file", this.fileList[i]);
      }
      let axiosSettings = {
        url: this.url,
        method: "POST",
        headers: {
          IDSTGC: this.getCookie("IDSTGC") || "e6dbc8356f604d2e9b49d5de95edb107"
        },
        data: formData
      };
      axios(axiosSettings).then(data => {
        // debugger
        let res = data.data;
        if (res !== null && !res.success) {
          if (res.hasOwnProperty("login") && !res.login) {
            let pathName = window.document.location.pathname;
            let projectName = pathName.substring(
              0,
              pathName.substr(1).indexOf("/") + 1
            );
            let url = projectName + "/";
            let purl = document.location.href; //
            location.href =
              url +
              "rest/Idsclient/reqLogin?reqUrl=" +
              encodeURIComponent(purl);
          } else {
            this.$message(res.message);
          }
        } else {
          this.$emit("done", res);
        }
      });
    },
    toupload() {
      this.$refs.uploaddom.click();
    },
    Toast(message) {
      let _div = document.createElement("div");
      let divCss = {
        position: "fixed",
        top: "50%",
        width: "100%"
      };
      for (let i in divCss) {
        _div.style[i] = divCss[i];
      }
      let _message = document.createElement("sapn");
      _message.innerText = message;
      let spanCss = {
        "background-color": "rgba(0,0,0,0.5)",
        padding: "15px 15px",
        "border-radius": "5px",
        color: "#FFF",
        "margin-left": "auto",
        "margin-right": "auto",
        "max-width": "300px",
        "font-size": "1rem",
        display: "block",
        "text-align": "center"
      };
      for (let i in spanCss) {
        _message.style[i] = spanCss[i];
      }
      _div.appendChild(_message);
      let _body = document.getElementsByTagName("body")[0];
      _body.appendChild(_div);
      setTimeout(function() {
        _body.removeChild(_div);
      }, 3000);
    }
  },
  watch: {},
  props: {
    url: String,
    exts: String,
    size: [String, Number],
    multiple: Boolean !== false,
    choose: Function,
    filelist: Array,
    beforeupload: Function,
    done: Function,
    deleteFile: Function,
    autoupload: Boolean !== false,
    btnText: String,
    isBtn: Boolean !== false,
    fileId: String
    // carmera:Boolean !== false
  },
  created() {
    this.exts = this.exts ? this.exts : "jpg|png|bmp|gif|txt";
    // this.carmera = this.carmera ? 'image/*' : '';
  }
};
</script>

<style scoped>
.img-uploader {
  border: 1px dashed #d9d9d9;
  color: #8c939d;
  width: 104px;
  height: 104px;
  text-align: center;
  background: #f5f5f5;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.img-uploader:hover {
  border-color: #409eff;
}
i.el-icon-plus.img-uploader-icon {
  margin-top: 10px;
}
.uploadinput {
  display: none;
}
.upload-img {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
  position: relative;
}
.upload-thumb {
  width: 100%;
  height: 100%;
}
.upload-actions:hover {
  opacity: 1;
}
.upload-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 140px;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
}
.upload-actions span {
  display: none;
  cursor: pointer;
  margin: 5px;
}
.upload-actions:hover span {
  display: inline-block;
}

.upload-actions .upload-icon {
  position: static;
  font-size: inherit;
  color: inherit;
}
.img-dialog /deep/ .el-dialog__headerbtn {
  top: 5px;
}
</style>
