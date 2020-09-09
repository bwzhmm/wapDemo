<template>
  <div>
    <div class="table_head">
      <h4>
        员工关怀
        <span class="opacity_65">{{queryMonth.replace(/^0/, '')}}月过生日的员工（共{{birthNum}}人）</span>
      </h4>
      <div>
        <el-date-picker
          class="query-datapicker"
          v-model="queryMonth"
          format=" M 月 "
          value-format="MM"
          type="month"
          placeholder="请选择月份"
        ></el-date-picker>
        <el-select class="query-datapicker" v-model="depvalue" placeholder="请选择部门" clearable>
          <el-option v-for="item in depOptions" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="ORGNAME" label="部门" align="center"></el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center"></el-table-column>
      <el-table-column prop="SEX" label="性别" align="center">
        <template slot-scope="scope">{{ scope.row.SEX=='2'?"女":scope.row.SEX=='1'&&'男'||'-'}}</template>
      </el-table-column>
      <el-table-column prop="BIRTHDAY" label="出生日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.BIRTHDAY)}}</template>
      </el-table-column>
      <el-table-column prop="ENTRYDAY" label="入职日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.ENTRYDAY)}}</template>
      </el-table-column>

      <el-table-column prop="ENTRYDAY" label="司龄（年）" align="center">
        <template slot-scope="scope">{{ getYears(scope.row.ENTRYDAY)}}</template>
      </el-table-column>
      <el-table-column prop="PHONE_OFFICE" label="公司电话" align="center"></el-table-column>
      <el-table-column prop="PHONE_SELF" label="个人电话" align="center"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :total="total"
        :page-size="pagesize"
        :current-page="currentPage"
        layout="sizes,prev, pager, next"
        :page-sizes="[10, 20, 50, 100,200]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchUserList, fetchUserById, updateUser } from "@/api/user";
import { fetchOrgList } from "@/api/auth";
import { stringDay, dataDiffYear, nowMonth } from "@/utils/common";
import util from "@/utils/util";

export default {
  data() {
    return {
      queryName: "",
      queryMonth: nowMonth(),
      birthNum: 0,
      depOptions: [],
      depvalue: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      staffColumn: []
    };
  },
  mounted() {
    fetchOrgList().then(res => {
      this.depOptions = res.items;
    });
    this.getUserList();
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },
    getYears(day) {
      let start = day ? util.formatTime(day, "YYYY-MM-DD") : "";
      let end = util.formatTime(Date.now(), "YYYY-MM-DD");
      return dataDiffYear(start, end);
    },
    getMonth() {
      return nowMonth();
    },

    getUserList() {
      let param = {
        data: JSON.stringify({
          STATUS: "1", // 非离职
          ORGID: this.depvalue,
          NAME: this.queryName,
          BIRTHMONTH: this.queryMonth
        }),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchUserList(param).then(res => {
        this.total = res.total;
        this.birthNum = res.total;
        this.tableData = res.items;
      });
    },

    handleQuery() {
      this.currentPage = 1;
      this.getUserList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currentPage = 1;
      this.getUserList();
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
.table_head {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
}

.query-datapicker {
  width: 180px;
  display: inline-block;
  margin-right: 20px;
}
.query-datapicker /deep/ .el-date-picker__header {
  display: none !important;
}
.query-picker {
  width: 200px;
  display: inline-block;
  margin-right: 20px;
}
</style>