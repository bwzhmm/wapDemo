<template>
  <!-- 查看、下载文件按钮 -->
  <div class="file-btn">
    <el-button type="text" size="small" @click="previewFile">查看</el-button>
    <el-button type="text" size="small" @click="downFile">下载</el-button>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" class="img-dialog">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
export default {
  name: "file-btn",
  props: ["parentForm", "fileRow"],
  data() {
    return {
      initForm: {},
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  mounted() {},
  methods: {
    //截取文件名的后缀
    getFileType(filePath) {
      var startIndex = filePath.lastIndexOf(".");
      if (startIndex != -1)
        return filePath
          .substring(startIndex + 1, filePath.length)
          .toLowerCase();
      else return "";
    },

    // 获取文件详情
    getFileDetail(fileId) {
      let path = `fileweb.CM_FILE.detail`;
      let params = {
        CM_FILE: {
          ID: fileId
        }
      };
      let suffix = "";
      service(params, path).then(res => {
        if (res.success) {
          let fileName = res.data.TITLE;
          suffix = this.getFileType(fileName);
          let fileType = ["rar", "zip"];
          let imgType = ["png", "jpg"];
          if (fileType.includes(suffix)) {
            this.$message({
              message: "不支持预览.rar或.zip文件,请下载查看！",
              type: "warning"
            });
            return false;
          }
          let url = `${window.global.ApiUrl}file/view/${fileId}`;
          if (imgType.includes(suffix)) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
          } else {
            window.open(url, "_blank");
          }
        }
      });
      // return suffix;
    },

    //文件预览
    previewFile() {
      let fileId = this.fileRow.FILEID || "";
      if (!fileId) {
        this.$message({
          message: "没有可预览的文件！",
          type: "warning"
        });
        return false;
      }
      this.getFileDetail(fileId);
      // let fileSuffix = this.getFileDetail(fileId);
    },
    //文件下载
    downFile(file) {
      let fileId = this.fileRow.FILEID || "";
      if (!fileId) {
        this.$message({
          message: "没有可下载的文件！",
          type: "warning"
        });
        return false;
      }
      let url = `${window.global.ApiUrl}file/download/${fileId}`;
      window.open(url, "_blank");
    }
  }
};
</script>
<style scoped>
.img-dialog /deep/ .el-dialog__headerbtn {
  top: 5px;
}
.file-btn {
  min-width: 100px;
}
</style>
