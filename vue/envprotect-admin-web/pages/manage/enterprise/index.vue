<template>
  <div class="main-wapper">
    <div class="search-box">
      <el-input
        class="mg-r10"
        placeholder="请输入企业名称查找"
        style="width: 200px"
        size="small"
        v-model="queryName"
        clearable
      ></el-input>
      <el-button @click="handleQuery()" type="primary" icon="el-icon-search" size="small">查询</el-button>
      <el-divider class="divider" direction="vertical"></el-divider>
      <el-button
        @click="handleUpdate"
        type="primary"
        class="green-btn"
        size="small"
        icon="el-icon-plus"
      >新增</el-button>
      <i class="iconfont iconshezhi set-col" @click="setCol"></i>
    </div>
    <div class="table-container">
      <el-table class="my-table" :data="tableData" style="width: 100%" v-loading="loading">
        <template v-for="(item,index) in tableCol">
          <el-table-column
            :prop="item.dataIndex"
            :label="item.title"
            :key="index"
            v-if="item.selected"
            align="left"
            header-align="left"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.column.property=='SETUPTIME'">{{formatDay(scope.row['SETUPTIME'])}}</span>
              <span v-else>{{scope.row[scope.column.property] || '-'}}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" @click="handleUpdate(scope.row)" size="small">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)" size="small">删除</el-button>
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
      <el-dialog
        title="配置显示字段"
        :visible.sync="dialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="beforeColseModal"
      >
        <el-checkbox-group v-model="setColItems">
          <el-checkbox
            class="content-label"
            v-for="(item,index) in tableCol"
            :label="item.dataIndex"
            :key="'check'+index"
            :checked="item.selected"
          >{{item.title}}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleCenter" icon="el-icon-check" size="small">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import { ENV, formatStr } from "@env/utils/common.js";
import { companyCol } from "../tool.js";
export default {
  data() {
    return {
      tableCol: companyCol,
      setColItems: [],
      initColItems: [],
      tableData: [],
      loading: false,
      roleValue: "",
      roleOptions: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      queryName: "",
      dialogVisible: false,
      setColID: ""
    };
  },

  created() {
    this.getUserCol();
    this.currentPage = this.$route.params.curPage || 1;
    this.getEnterpiseList();
  },

  methods: {
    formatDay(day) {
      return day ? formatStr(day, "-") : "";
    },
    setCol() {
      this.dialogVisible = true;
    },

    getUserCol() {
      let path = "env.ENV_USERCONFIG.get";
      let params = {};
      service(params, path).then(res => {
        if (res.success && res.data) {
          this.setColID = (res.data && res.data.ID) || "";
          let curColItems = res.data.CONFIG.split(",");

          if (curColItems.length) {
            this.initColItems = JSON.parse(JSON.stringify(curColItems));
            this.tableCol.map(
              item => (item.selected = curColItems.includes(item.dataIndex))
            );
          }
        }
      });
    },

    beforeColseModal(done) {
      this.setColItems = JSON.parse(JSON.stringify(this.initColItems));
      done();
    },

    handleCenter() {
      if (!this.setColItems.length) {
        this.$message({
          message: "请至少设置一个显示字段！",
          type: "warning"
        });
        return false;
      }

      let path = "env.ENV_USERCONFIG.save";
      let params = {
        ENV_USERCONFIG: {
          ID: this.setColID,
          CONFIG: this.setColItems.join(",")
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            message: "设置成功！",
            type: "success"
          });
          this.tableCol.map(
            item => (item.selected = this.setColItems.includes(item.dataIndex))
          );
          this.dialogVisible = false;
          this.initColItems = JSON.parse(JSON.stringify(this.setColItems));
        }
      });
    },

    // 编辑 新增跳转
    handleUpdate(row) {
      this.$router.push({
        name: "enterprise-details",
        params: { row: row, type: "update", currentPage: this.currentPage }
      });
    },
    //查看跳转
    handleLook(row) {
      this.$router.push({
        name: "enterprise-details",
        params: { row: row, type: "look", currentPage: this.currentPage }
      });
    },

    handleDelete(row) {
      this.$confirm("确认删除该企业信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let path = "env.ENV_COMPANY.delete";
          let params = {
            ENV_COMPANY: {
              ID: row.ID
            }
          };
          service(params, path).then(res => {
            if (res.success) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getEnterpiseList();
            }
          });
        })
        .catch(() => {});
    },

    handleQuery() {
      this.currentPage = 1;
      this.getEnterpiseList();
    },

    //点击分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getEnterpiseList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getEnterpiseList();
    },

    // 获取列表
    getEnterpiseList() {
      this.loading = true;
      let path = "env.ENV_COMPANY.list";
      let params = {
        FILTER: {
          KEYWORD: this.queryName,
          LIMIT: this.pageSize,
          PAGE: this.currentPage
        }
      };
      service(params, path).then(res => {
        this.loading = false;
        if (res.success) {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    }
  }
};
</script>

<style scoped>
.search-box {
  margin-bottom: 10px;
}
.set-col {
  float: right;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  background: #fff;
}
.el-checkbox {
  width: 110px;
  margin-bottom: 10px;
  padding: 0 20px;
}
</style>
