<template>
  <div>
    <div class="table_head">
      <h4>
        员工关怀
        <span class="opacity_65">2020年{{getMonth()}}月过生日的员工（共{{birthNum}}人）</span>
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
        <el-select class="query-datapicker" v-model="depvalue" placeholder="请选择部门">
          <el-option v-for="item in depOptions" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
        <!-- <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名"></el-input> -->
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="ORGID" label="部门" align="center"></el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center"></el-table-column>
      <el-table-column prop="SEX" label="性别" align="center"></el-table-column>
      <el-table-column prop="BIRTHDAY" label="出生日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.BIRTHDAY)}}</template>
      </el-table-column>
      <el-table-column prop="ENTRYDAY" label="入职日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.ENTRYDAY)}}</template>
      </el-table-column>

      <el-table-column prop="ENTRYDAY" label="司龄" align="center">
        <template slot-scope="scope">{{ getYears(scope.row.ENTRYDAY)}}</template>
      </el-table-column>
      <el-table-column prop="PHONE_OFFICE" label="公司电话" align="center"></el-table-column>
      <el-table-column prop="PHONE_SELF" label="个人电话" align="center"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pagesize"
        :current-page="currentPage"
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
      depOptions: [
        {
          MANAGERID: "33",
          LEADERID: "33",
          ID: "org1",
          LEADERNAME: "江越",
          MANAGERNAME: "江越",
          NAME: "开发"
        },
        {
          MANAGERID: "33",
          LEADERID: "33",
          ID: "org2",
          LEADERNAME: "江越",
          MANAGERNAME: "江越",
          NAME: "财务"
        },
        {
          MANAGERID: "33",
          LEADERID: "33",
          ID: "org3",
          LEADERNAME: "江越",
          MANAGERNAME: "江越",
          NAME: "销售"
        },
        {
          MANAGERID: "33",
          LEADERID: "33",
          ID: "org4",
          LEADERNAME: "江越",
          MANAGERNAME: "江越",
          NAME: "商务"
        }
      ],
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
      this.depOptions = res.item;
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
          STATUS: "",
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
.pagination {
  background: #fff;
  text-align: right;
  padding: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.6) !important;
}
p:last-child {
  margin-bottom: 50px;
}
</style>