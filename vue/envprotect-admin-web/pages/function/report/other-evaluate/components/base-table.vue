<template>
  <div class="content">
    <span
      class="mg-tp20"
      :class="tableInfo.menuTitle ? 'blue-title-line':'blank'"
    >{{tableInfo.menuTitle}}</span>
    <el-table class="my-table" :data="tableData" style="width: 100%" v-loading="loading">
      <template v-for="(item,index) in tableInfo.tableCol">
        <el-table-column
          :prop="item.dataIndex"
          :label="item.title"
          :key="index"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <fileBtn :fileRow="scope.row" v-show="scope.row.FILEID && item.dataIndex=='file'" />
            <span v-show="!scope.row.FILEID && item.dataIndex=='file'">-</span>
            <span v-show="item.dataIndex!=='file'">{{scope.row[scope.column.property] || '-'}}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <update-drawer
      :dialogVisible.sync="updateDialogVisible"
      :drawerTitle="drawerTitle"
      :ENVPATH="tableInfo.basePath"
      :drawerCol="tableInfo.drawerCol"
      :parentForm="fromData"
      :company="company"
      :factorPath="tableInfo.factorPath"
      @flushList="handleFlush"
    ></update-drawer>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import updateDrawer from "@env/components/update-drawer"; //新增、编辑抽屉
import fileBtn from "@env/components/file-btn"; //查看,下载附件
import { formatStr, compareDate } from "@env/utils/common.js";
export default {
  name: "base-table",
  props: ["tableInfo", "company"],
  components: {
    updateDrawer,
    fileBtn
  },
  data() {
    return {
      active: 0,
      tableData: [],
      loading: false,
      updateDialogVisible: false,
      drawerTitle: "",
      fromData: {}
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    // 添加或编辑成功后刷新列表
    handleFlush() {
      this.getTableList();
    },

    // 编辑 新增表单更新
    handleUpdate(row, isLook) {
      this.updateDialogVisible = !isLook && true;
      let title = this.tableInfo.title;
      this.drawerTitle = row && row.ID ? `编辑${title}` : `新增${title}`;
      if (row && row.ID) {
        let path = `env.${this.tableInfo.basePath}.view`;
        let params = {
          [this.tableInfo.basePath]: {
            ID: row.ID
          }
        };
        service(params, path).then(res => {
          if (res.success) {
            let editData = res.data;
            if (editData.STARTTIME && editData.ENDTIME) {
              editData.RANGETIME = [editData.STARTTIME, editData.ENDTIME];
            }
            this.fromData = editData;
          }
        });
      } else {
        this.fromData = {};
      }
    },

    // 获取列表
    getTableList() {
      this.loading = true;
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
        this.loading = false;
        if (res.success) {
          let itemsArr = res.data.items;
          itemsArr.map(item => {
            if (item.EXPIRATIONDATE) {
              // 表格回显 是否在有效期内
              item.EXPIRATIONDATE = formatStr(item.EXPIRATIONDATE, "-");
              let iSPeriod = compareDate(item.EXPIRATIONDATE);
              item.ISExpire = iSPeriod ? "是" : "否";
            }
            if (item.CREATETIME) {
              item.CREATETIME = formatStr(item.CREATETIME, "-");
            }
            // 表格回显 周期展示
            if (item.STARTTIME && item.ENDTIME) {
              item.rangeTime = `${formatStr(
                item.STARTTIME,
                "-"
              )} 至 ${formatStr(item.ENDTIME, "-")}`;
              let start = formatStr(item.STARTTIME, "-"),
                end = formatStr(item.ENDTIME, "-");
            }
          });
          this.tableData = itemsArr;
        }
      });
    },

    handleDelete(row) {
      this.$confirm(`确认删除该${this.tableInfo.title}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let path = `env.${this.tableInfo.basePath}.delete`;
          let params = {
            [this.tableInfo.basePath]: {
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
.group {
  color: #333;
  margin-right: 10px;
  font-weight: 600;
}
</style>

