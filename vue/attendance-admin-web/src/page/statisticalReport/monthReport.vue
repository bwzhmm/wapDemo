<template>
  <div>
    <div class="table_head">
      <h4>月度报表</h4>
      <div>
        <el-date-picker
          class="query-picker"
          v-model="queryMonth"
          type="month"
          placeholder="请选择月份"
          format="yyyy-MM"
          value-format="yyyyMM"
        ></el-date-picker>
        <el-select class="query-picker" v-model="depvalue" placeholder="请选择部门">
          <el-option v-for="item in depOptions" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
        <!-- <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名"></el-input> -->
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
        <el-divider class="divider" direction="vertical"></el-divider>
        <el-date-picker
          v-model="SnycDay"
          type="date"
          placeholder="同步日期"
          value-format="yyyyMMdd"
          style="width:150px;margin-right:10px"
        ></el-date-picker>
        <el-button @click="handleSnyc()" type="primary" size="small">同步</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="ORGNAME" label="部门" align="center"></el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center"></el-table-column>
      <el-table-column prop="CHECKDAY" label="应出勤数（天）" align="center">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'? scope.row.CHECKDAY:'-'}}</template>
      </el-table-column>
      <el-table-column prop="ACTUALDAY" label="实际出勤数（天）" align="center">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'? scope.row.ACTUALDAY:'-'}}</template>
      </el-table-column>
      <el-table-column prop="L15" label="迟到≤15min" align="center">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'? scope.row.L15:'-'}}</template>
      </el-table-column>
      <el-table-column prop="L30" label="迟到≤30min" align="center">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'? scope.row.L30:'-'}}</template>
      </el-table-column>
      <el-table-column prop="L60" label="迟到≤1h" align="center">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'? scope.row.L60:'-'}}</template>
      </el-table-column>
      <el-table-column prop="M60" label="迟到≥1h" align="center">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'? scope.row.M60:'-'}}</template>
      </el-table-column>
      <el-table-column prop="RESTHOURS" label="请假总天数" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.ISCHECK=='1'? backDayAndHour(scope.row.RESTHOURS):'-'}}</template>
      </el-table-column>
      <el-table-column prop="RESTARR" label="具体请假日期" align="center" width="300">
        <template slot-scope="scope">
          <!-- {{ getRest(scope.row.RESTARR)}} -->
          <div v-html="getRest(scope.row.RESTARR)" v-if="scope.row.ISCHECK=='1'"></div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="SCORE" label="绩效考核" align="center">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'? scope.row.SCORE||'-':'-'}}</template>
      </el-table-column>
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
import { fetchMonthStatistic, syncRecord } from "@/api/record";
import { fetchOrgList } from "@/api/auth";
import util from "@/utils/util";
import {
  formatStr,
  stringDay,
  dataDiffDay,
  nowYearMonth,
  getDayAndHour
} from "@/utils/common";

//nowYearMonth("-") new Date()
export default {
  data() {
    return {
      queryName: "",
      queryMonth: nowYearMonth(""),
      SnycDay: "",
      depOptions: [],
      depvalue: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      dialogVisible: false,
      form: {
        date: "2020-05-25，请假3小时",
        type: "事假",
        name: "撒贝宁",
        result: "旷工",
        changeResult: "正常",
        desc: "说明ing"
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {
    fetchOrgList().then(res => {
      this.depOptions = res.items;
    });
    this.getMonthList();
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatStrTime(time) {
      return time ? formatStr(time, ":", true) : "";
    },

    handleClick(row) {
      this.dialogVisible = true;
    },

    // 处理小时为多少天小时
    backDayAndHour(hour) {
      let hours = getDayAndHour(hour);
      hours = hours == "0小时" ? "-" : hours;
      return hours;
    },

    // 获取列表数据
    getMonthList() {
      let param = {
        data: JSON.stringify({
          MONTH: stringDay(this.queryMonth),
          ORGID: this.depvalue
        }),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchMonthStatistic(param).then(res => {
        this.total = res.total;
        this.tableData = res.items;
      });
    },
    handleQuery() {
      this.currentPage = 1;
      this.getMonthList();
    },
    handleSnyc() {
      let param = {
        day: this.SnycDay || ""
      };
      syncRecord(param).then(res => {
        if (res.success) {
          this.getMonthList();
          this.$message({
            message: "同步成功",
            type: "success"
          });
        }
      });
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getMonthList();
    },
    getRest(rest) {
      // console.log("dd", rest);
      let absenceArr = [];
      rest.forEach(item => {
        // 1 病假 2 调休 3 事假 4 哺乳假 5 年假 6 例假 7 产假 8 陪产假 9 婚假 0
        let typeArr = [
          "丧假",
          "病假",
          "调休",
          "事假",
          "哺乳假",
          "年假",
          "例假",
          "产假",
          "陪产假",
          "婚假"
        ];
        let absenceStr = "";
        let type = item.TYPE;
        // console.log("item", item);
        switch (type) {
          case "0":
          case "7":
          case "8":
          case "9":
            // console.log("item", item);
            let start = this.formatDay(item.STARTDAY),
              end = this.formatDay(item.ENDDAY),
              days = dataDiffDay(start, end);
            absenceStr = `${start}~${end}${typeArr[type]}${days}天`;
            break;
          case "5":
          case "6":
            // console.log("item", item);
            let start2 = this.formatDay(item.DAY),
              days2 = item.HOURS == 4 ? "半" : "一";
            absenceStr = `${start2}${typeArr[type]}${days2}天`;
            break;
          case "1":
          case "2":
          case "3":
          case "4":
            // console.log("item", item);
            let start3 = this.formatDay(item.DAY),
              days3 = item.HOURS;
            absenceStr = `${start3}${typeArr[type]}${days3}小时`;
            break;
        }
        absenceArr.push(absenceStr);
      });
      absenceArr = absenceArr.length ? absenceArr.join("<br/>") : "-";
      // console.log("aaa", absenceArr);
      return absenceArr;
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

.query-picker {
  width: 125px;
  display: inline-block;
  margin-right: 20px;
}
</style>
