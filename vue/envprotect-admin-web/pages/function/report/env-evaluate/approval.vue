<template>
  <div>
    <div class="search-box" v-show="tableData.length">
      <el-input
        class="mg-r10"
        placeholder="请输入项目名称查找"
        style="width: 200px"
        size="small"
        v-model="queryName"
        clearable
      ></el-input>
      <el-button @click="handleQuery()" type="primary" icon="el-icon-search" size="small">查询</el-button>
    </div>
    <div class="table-container" v-if="tableData.length">
      <el-table class="my-table" :data="tableData" style="width: 100%" v-loading="loading">
        <template v-for="(item,index) in tableCol">
          <el-table-column
            :prop="item.dataIndex"
            :label="item.title"
            :key="index"
            align="left"
            header-align="left"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{scope.row[scope.column.property]||'-'}}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="环评批复" align="center">
          <template slot-scope="scope">
            <fileBtn :fileRow="scope.row" v-if="scope.row.FILEID" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleUpdate(scope.row,true)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="sizes,prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100,200]"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
    <div class="nodata" v-else>
      <i class="iconfont iconzanwushuju"></i>
    </div>
    <update-drawer
      :dialogVisible.sync="updateDialogVisible"
      :drawerTitle="drawerTitle"
      :ENVPATH="ENVPATH"
      :drawerCol="approvedDrawerCol"
      :parentForm="fromData"
      :company="company"
      @flushList="handleFlush"
    ></update-drawer>
    <look-drawer
      :dialogVisible.sync="lookDialogVisible"
      :drawerTitle="drawerTitle"
      :ENVPATH="ENVPATH"
      :drawerCol="approvedDrawerCol"
      :parentForm="fromData"
    ></look-drawer>
  </div>
</template>

<script>
import updateDrawer from "@env/components/update-drawer"; //新增、编辑账号抽屉
import lookDrawer from "@env/components/look-drawer"; //查看
import fileBtn from "@env/components/file-btn"; //查看,下载附件
import { service } from "@env/utils/request.js";
import { ENV, formatStr } from "@env/utils/common.js";
import { approvedCol, approvedDrawerCol } from "../tool.js";
export default {
  components: {
    updateDrawer,
    lookDrawer,
    fileBtn
  },
  props: ["company"],
  data() {
    return {
      tableCol: approvedCol,
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      queryName: "",
      updateDialogVisible: false,
      lookDialogVisible: false,
      approvedDrawerCol: approvedDrawerCol,
      drawerTitle: "",
      ENVPATH: "ENV_APPROVAL",
      fromData: {}
    };
  },

  mounted() {
    this.getTableList();
  },
  methods: {
    // 编辑 新增表单更新
    handleUpdate(row, isLook) {
      this.updateDialogVisible = !isLook && true;
      this.lookDialogVisible = isLook && true;
      this.drawerTitle =
        row && row.ID ? (isLook ? "查看审批" : "编辑审批") : "新增审批";
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
            item => (item.APPROVETIME = formatStr(item.APPROVETIME, "-"))
          );
          this.tableData = itemsArr;
          this.total = res.data.total;
        }
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除该审批情况信息吗？", "提示", {
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

<style scoped>
.search-box {
  margin-bottom: 10px;
}
</style>
