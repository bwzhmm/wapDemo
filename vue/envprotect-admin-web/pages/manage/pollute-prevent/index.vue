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
    </div>
    <div class="table-container">
      <el-table class="my-table" :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column
          prop="NAME"
          label="企业名称"
          align="left"
          header-align="left"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <template v-for="(item,index) in tableCol">
          <el-table-column :prop="item.name" :label="item.title" :key="index" align="center">
            <template slot-scope="scope">
              <span v-if="scope.column.property=='NAME'">{{scope.row[scope.column.property]}}</span>
              <span v-else>
                <el-button @click="handleLook(scope.row,item)" type="text" size="small">查看</el-button>
              </span>
            </template>
          </el-table-column>
        </template>
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
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
import { pollutePreventCol } from "./column.js";
export default {
  data() {
    return {
      tableCol: pollutePreventCol,
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      queryName: ""
    };
  },

  mounted() {
    this.getEnterpiseList();
  },
  methods: {
    //查看跳转
    handleLook(row, column) {
      this.$router.push({
        name: "pollute-prevent-details",
        params: { row: row, type: "look", column: column }
      });
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
</style>
