<template>
  <!-- 查看表单信息抽屉 -->
  <el-drawer
    :title="drawerTitle"
    custom-class="demo-drawer"
    :visible.sync="dialogVisible"
    :before-close="hidePanel"
    width="600px"
    ref="drawer"
    :wrapperClosable="false"
  >
    <div class="drawer-content">
      <el-form :model="parentForm" ref="parentForm" label-width="120px">
        <template v-for="item in drawerCol">
          <el-form-item v-if="item.type=='date'" :key="item.name" :label="`${item.title}：`">
            <span>{{formatDay(parentForm[item.propName])}}</span>
          </el-form-item>
          <el-form-item v-else-if="item.type=='upload'" :key="item.name" :label="`${item.title}：`">
            <span v-if="parentForm.FILEID">
              <i class="el-icon-paperclip"></i>
              <span
                :title="fileTitle"
                class="file-title"
                @click="downFile(parentForm.FILEID)"
              >{{fileTitle | ellipsis }}</span>
            </span>
            <span v-else>无</span>
          </el-form-item>
          <el-form-item v-else :key="item.name" :label="`${item.title}：`">
            <span>{{parentForm[item.propName] || '无'}}</span>
          </el-form-item>
        </template>
      </el-form>
      <div class="drawer-footer">
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          class="mg-r20"
          @click="hidePanel('parentForm')"
        >确定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { formatStr } from "@env/utils/common.js";
import { service } from "@env/utils/request.js";
export default {
  name: "info-drawer",
  props: ["dialogVisible", "parentForm", "ENVPATH", "drawerTitle", "drawerCol"],
  data() {
    return {
      iSFirst: true,
      i: 0,
      fileName: ""
    };
  },

  computed: {
    fileTitle: function() {
      let fileName = this.getFileDetail(this.parentForm.FILEID);
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

  methods: {
    formatDay(day) {
      return day ? formatStr(day, "-") : "";
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

    hidePanel() {
      this.$emit("update:dialogVisible", false);
    }
  }
};
</script>
<style scoped>
.file-title {
  color: #1890ff;
  cursor: pointer;
}
.el-form-item {
  margin-bottom: 0px;
}
</style>
