<template>
  <div class="content">
    <span
      class="mg-tp20"
      :class="tableInfo.menuTitle ? 'blue-title-line':'blank'"
    >{{tableInfo.menuTitle}}</span>
    <div class="upload-div">
      <base-upload
        :url="uploadUrl"
        :size="10*1024"
        :lowSize="10"
        :exts="fileType"
        btnText="点击上传"
        :isBtn="true"
        @done="finish"
      ></base-upload>
      <div class="upload-tip">大小不超过10M，支持.rar .zip .doc .docx .pdf .jpg .jpeg .png</div>
      <span v-if="fileForm.FILEID">
        <i class="el-icon-paperclip"></i>
        <span
          :title="fileTitle"
          class="file-title"
          @click="downFile(fileForm.FILEID)"
        >{{fileTitle | ellipsis}}</span>
        <i class="el-icon-close del-file" @click="delFile"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import BaseUpload from "@env/components/BaseUpload";
export default {
  name: "upload-file",
  props: ["tableInfo", "company"],
  components: { BaseUpload },
  data() {
    return {
      fileName: "",
      fileForm: { FILEID: "" },
      fileType: "rar|zip|doc|docx|pdf|jpg|jpeg|png",
      uploadUrl: `${window.global.ApiUrl}file/fileUpload`
    };
  },
  computed: {
    fileTitle: function() {
      if (this.fileForm.FILEID) {
        this.getFileDetail(this.fileForm.FILEID);
      }
      let fileName = this.fileName;
      return fileName;
    }
  },
  filters: {
    ellipsis(value) {
      if (!value) {
        return "";
      }
      if (value.length > 40) {
        return value.slice(0, 40) + "...";
      } else {
        return value;
      }
    }
  },
  mounted() {
    this.getFileList();
  },
  methods: {
    //文件下载
    downFile(fileId) {
      if (!fileId) {
        this.$message({
          message: "没有可下载的文件！",
          type: "warning"
        });
        return false;
      }
      let url = `${window.global.ApiUrl}file//download/${fileId}`;
      window.open(url, "_blank");
    },
    delFile() {
      this.fileName = "";
      this.fileForm.FILEID = "";
      this.updateFile();
    },
    // 获取文件详情
    getFileDetail(fileId) {
      let path = `fileweb.CM_FILE.detail`;
      let params = {
        CM_FILE: {
          ID: fileId
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.fileName = res.data.TITLE;
        }
      });
      return this.fileName;
    },
    //上传图片
    choosefile(file) {},
    // 图片上传完成后
    finish(res) {
      if (res.success) {
        this.fileForm.FILEID = res.item.ID;
        this.$message({
          type: "success",
          message: "上传成功，并覆盖已上传的文件！"
        });
        if (this.fileForm.FILEID) {
          this.updateFile();
        }
      }
    },
    // 获取文件详情
    updateFile() {
      let path = `env.${this.tableInfo.basePath}.update`;
      let updates = {
        FILEID: this.fileForm.FILEID,
        COMPANYID: this.company.ID,
        ID: this.fileForm.ID
      };
      let params = {
        [this.tableInfo.basePath]: updates
      };
      service(params, path).then(res => {});
      return this.fileName;
    },
    // 获取企业下的文件
    getFileList() {
      let path = `env.${this.tableInfo.basePath}.list`;
      let params = {
        [this.tableInfo.basePath]: {
          COMPANYID: this.company && this.company.ID
        },
        FILTER: {
          KEYWORD: this.queryName,
          LIMIT: this.pageSize,
          PAGE: this.currentPage
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          if (res.data.items && res.data.items[0]) {
            this.fileForm = res.data.items[0];
          }
        }
      });
    }
  }
};
</script>
<style scoped>
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
.blank {
  display: block;
}
.upload-div {
  padding-left: 20px;
}
.upload-tip {
  color: #cdcdcd;
  margin: 10px 0;
  line-height: normal;
}
.file-title {
  color: #1890ff;
  cursor: pointer;
}
.del-file {
  cursor: pointer;
  margin-left: 10px;
}
</style>

