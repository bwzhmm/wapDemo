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
          value-format="yyyyMM"
        ></el-date-picker>
        <el-select class="query-picker" v-model="depvalue" placeholder="请选择部门">
          <el-option v-for="item in depOptions" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
        <!-- <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名"></el-input> -->
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
        <el-divider class="divider" direction="vertical"></el-divider>
        <el-button @click="handleQuery()" type="primary" size="small">同步</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="ORGNAME" label="部门" align="center"></el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center"></el-table-column>
      <el-table-column prop="CHECKDAY" label="应出勤数（天）" align="center"></el-table-column>
      <el-table-column prop="ACTUALDAY" label="实际出勤数（天）" align="center"></el-table-column>
      <el-table-column prop="L15" label="迟到≤15min" align="center"></el-table-column>
      <el-table-column prop="L30" label="迟到≤30min" align="center"></el-table-column>
      <el-table-column prop="L60" label="迟到≤1h" align="center"></el-table-column>
      <el-table-column prop="ABSENT" label="迟到≥1h" align="center"></el-table-column>
      <el-table-column prop="RESTHOURS" label="请假总天数" align="center"></el-table-column>
      <el-table-column prop="RESTARR" label="具体请假日期" align="center" width="300">
        <template slot-scope="scope">
          <!-- {{ getRest(scope.row.RESTARR)}} -->
          <div v-html="getRest(scope.row.RESTARR)"></div>
        </template>
      </el-table-column>
      <el-table-column prop="SCORE" label="绩效考核" align="center"></el-table-column>
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
import { fetchMonthStatistic } from "@/api/record";
import { fetchOrgList } from "@/api/auth";
import util from "@/utils/util";
import {
  formatStr,
  stringDay,
  dataDiffDay,
  nowYearMonth
} from "@/utils/common";
export default {
  data() {
    return {
      queryName: "",
      queryMonth: nowYearMonth("-"),
      depOptions: [
        {
          ID: "org1",
          NAME: "开发"
        },
        {
          ID: "org2",
          NAME: "财务"
        }
      ],
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
      this.depOptions = res.item;
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
      console.log(row);
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
    handleQuery(row) {
      this.getMonthList();
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
          "陪产假"
        ];
        let absenceStr = "";
        let type = item.TYPE;
        console.log("item", item);
        switch (type) {
          case "8":
            console.log("item", item);
            let start = this.formatDay(item.STARTDAY),
              end = this.formatDay(item.ENDDAY),
              days = dataDiffDay(start, end);

            absenceStr = `${start}~${end}${typeArr[type]}${days}天`;
            break;
          default:
            break;
        }
        absenceArr.push(absenceStr);
      });
      absenceArr = absenceArr.length ? absenceArr.join("<br/>") : "-";
      console.log("aaa", absenceArr);
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