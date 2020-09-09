<template>
  <div>
    <div class="search-box">
      <!-- <el-button
        @click="handleUpdate"
        type="primary"
        class="green-btn"
        size="small"
        icon="el-icon-plus"
      >新增生产工艺</el-button>-->
    </div>
    <div class="table-container" v-if="tableData.length">
      <template v-for="(item,index) in tableData">
        <el-card :body-style="{ padding: '0px' }" :key="index">
          <div slot="header" class="clearfix">
            <span class="card-title">{{item.NAME}}</span>
          </div>
          <el-image
            :lazy="true"
            class="img-style"
            :src="imgURL(item.FILEID)"
            @click="handlePreview(item.FILEID)"
          >
            <div slot="error" class="image-error image">
              <span>图片获取失败</span>
            </div>
            <div slot="placeholder" class="image-error image">图片加载中...</div>
          </el-image>

          <div style="padding: 14px;">
            <span class="card-des">{{item.DES}}</span>
            <div class="bottom clearfix"></div>
          </div>
        </el-card>
      </template>
    </div>
    <div class="nodata" v-else>
      <i class="iconfont iconzanwushuju"></i>
    </div>
    <update-drawer
      :dialogVisible.sync="updateDialogVisible"
      :drawerTitle="drawerTitle"
      :ENVPATH="ENVPATH"
      :drawerCol="processDrawerCol"
      :parentForm="fromData"
      :company="company"
      @flushList="handleFlush"
    ></update-drawer>
    <el-dialog :visible.sync="imgVisible" :append-to-body="true" class="img-dialog">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import updateDrawer from "@env/components/update-drawer"; //新增、编辑账号抽屉
import { service } from "@env/utils/request.js";
import { ENV, formatStr } from "@env/utils/common.js";
import { processDrawerCol } from "../tool.js";
export default {
  components: {
    updateDrawer
  },
  props: ["company"],
  data() {
    return {
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      queryName: "",
      updateDialogVisible: false,
      processDrawerCol: processDrawerCol,
      drawerTitle: "",
      ENVPATH: "ENV_PROCESS",
      fromData: {},
      dialogImageUrl: "",
      imgVisible: false
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    imgURL(fileID) {
      let imgUrl = fileID ? `${window.global.ApiUrl}file/view/${fileID}` : "";
      return imgUrl;
    },
    // imgPreviewURL(fileID) {
    //   let imgUrl = fileID ? [`${window.global.ApiUrl}file/view/${fileID}`] : [];
    //   return imgUrl;
    // },
    // 兼容IE10 ，手动图片预览
    handlePreview(fileID) {
      let imgUrl = fileID ? `${window.global.ApiUrl}file/view/${fileID}` : "";
      this.dialogImageUrl = imgUrl;
      this.imgVisible = true;
    },
    // 编辑 新增表单更新
    handleUpdate(row) {
      if (row && row.ID) {
        let path = `env.${this.ENVPATH}.view`;
        let params = {
          [this.ENVPATH]: {
            ID: row.ID
          }
        };
        service(params, path).then(res => {
          if (res.success) {
            this.fromData = res.data;
          }
        });
      } else {
        this.fromData = {};
      }
      this.updateDialogVisible = true;
      this.drawerTitle = row && row.ID ? "编辑生产工艺" : "新增生产工艺";
    },

    handleQuery() {
      this.currentPage = 1;
      this.getTableList();
    },

    //点击分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableList();
    },

    // 添加或编辑成功后刷新列表
    handleFlush() {
      this.getTableList();
    },

    // 获取列表
    getTableList() {
      this.loading = true;

      let path = `env.${this.ENVPATH}.list`;
      let params = {
        [this.ENVPATH]: {
          COMPANYID: this.company.ID
        },
        FILTER: {
          KEYWORD: this.queryName,
          LIMIT: this.pageSize,
          PAGE: this.currentPage
        }
      };
      service(params, path).then(res => {
        this.loading = false;
        if (res.success) {
          let itemsArr = res.data.items;
          itemsArr.map(
            item => (item.ACCEPTTIME = formatStr(item.ACCEPTTIME, "-"))
          );
          this.tableData = itemsArr;
          this.total = res.data.total;
        }
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除该生产工艺信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let path = `env.${this.ENVPATH}.delete`;
          let params = {
            [this.ENVPATH]: {
              ID: row.ID
            }
          };
          service(params, path).then(res => {
            if (res.success) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getTableList();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang='scss' scoped>
.search-box {
  margin-bottom: 10px;
}
.el-card {
  width: 360px;
  float: left;
  margin: 0 10px;
}
.el-card__header {
  color: #333333;
}
.image {
  background-size: cover;
  width: 360px;
}
.img-style {
  vertical-align: middle;
  display: inline-block;
  width: 100%;
  height: 100%;
}
.el-image.img-style .image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100px;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
  line-height: 100px;
}
.img-style /deep/ .el-image__inner--center {
  transform: translate(-50%, 0%);
}
.card-des {
  color: #595959;
  line-height: 20px;
  margin-bottom: 20px;
  display: inline-block;
}
.blue-btn,
.red-btn {
  color: #fff;
  width: 150px;
  height: 32px;
  line-height: 5px;
  &:hover {
    opacity: 0.8;
  }
}
.blue-btn {
  background-color: #1890ff;
}
.red-btn {
  background-color: #fa541c;
}
.card-title {
  font-weight: 600;
  color: #333;
}
.img-dialog /deep/ .el-dialog__headerbtn {
  top: 5px;
}
</style>
