<template>
  <div class="wapper-content">
    <div class="search-box wapper-box">
      <el-date-picker
        v-model="searchForm.dateArr"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
        style="width:245px"
        value-format="yyyyMMdd"
      ></el-date-picker>
      <el-input
        class="mg-r10"
        placeholder="请输入登录名/姓名"
        style="width: 200px"
        size="small"
        v-model="searchForm.name"
        clearable
      ></el-input>
      <el-select
        class="mg-r10"
        v-model="searchForm.type"
        placeholder="请选择日志动作"
        clearable
        size="small"
      >
        <el-option v-for="item in logList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button @click="handleQuery()" type="primary" icon="el-icon-search" size="small">查询</el-button>
    </div>
    <div class="table-container">
      <el-table class="my-table" :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="LOGINNAME" label="登录名" align="left" width="100"></el-table-column>
        <el-table-column prop="NAME" label="姓名" align="left" width="100"></el-table-column>
        <el-table-column
          prop="IP"
          label="登录IP"
          align="left"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="MODULE" label="操作模块" align="left" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="CONTENT" label="操作内容" align="left" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          prop="OPERTIME"
          label="操作时间"
          align="center"
          :formatter="timeFormatter"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="totalPage"
          :page-size="limit"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
import util from "@env/utils/util.js";
export default {
  data() {
    var now = new Date();
    var startDate = util.formatTime(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 7),
      "yyyyMMdd"
    );
    var endDate = util.formatTime(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      "yyyyMMdd"
    );

    return {
      tableData: [],
      loading: false,
      roleValue: "",
      roleOptions: [],
      totalPage: 0,
      limit: 10,
      currentPage: 1,
      searchForm: {
        dateArr: [startDate, endDate]
      },
      logList: [
        { id: 1, name: "登录" },
        { id: 2, name: "新增" },
        { id: 3, name: "删除" },
        { id: 4, name: "编辑" }
      ]
    };
  },

  methods: {
    // 时间转换
    timeFormatter(row, column, cellValue) {
      if (cellValue == null) {
        return "--";
      } else {
        return util.formatTime(cellValue, "yyyy-MM-dd hh:mm:ss");
      }
    },

    // 查询
    handleQuery() {
      this.currentPage = 1;
      this.getList();
    },
    //点击分页
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    // 获取列表
    getList() {
      this.loading = true;
      let path = "env.ENV_LOG.list";
      let FILTER = {
        PAGE: this.currentPage,
        LIMIT: this.limit,
        KEYWORD: this.searchForm.name || "",
        TYPE: this.searchForm.type
      };
      if (this.searchForm.dateArr) {
        FILTER.STARTTIME = this.searchForm.dateArr[0];
        FILTER.ENDTIME = this.searchForm.dateArr[1];
      }
      let params = {
        FILTER: FILTER
      };
      service(params, path).then(res => {
        this.loading = false;

        if (res.success) {
          this.tableData = res.data.items;
          this.totalPage = res.data.total;
        }
      });
    }
  },

  created() {
    this.getList();
  }
};
</script>

<style scoped>
.search-box {
  margin-bottom: 10px;
}
</style>
