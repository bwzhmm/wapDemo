<template>
  <div>
    <div class="table_head">
      <h4>年度报表</h4>
      <div>
        <el-date-picker
          class="query-picker"
          v-model="curYear"
          type="year"
          placeholder="请选择年份"
          value-format="yyyy"
          :picker-options="pickerOptions"
          @change="handleDatePicker"
          :clearable="false"
        ></el-date-picker>
        <el-select class="query-picker" v-model="depvalue" placeholder="请选择部门">
          <el-option v-for="item in depOptions" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
        <el-divider class="divider" direction="vertical"></el-divider>
        <el-button @click="handleExport()" type="primary" size="small">导出</el-button>
      </div>
    </div>
    <!--    :sort-by="['average', 'total']" :default-sort="{prop: 'number', order: 'descending'}" -->
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" align="center" fixed="left"></el-table-column>
      <el-table-column prop="ORGNAME" label="部门" align="center" fixed="left"></el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center" fixed="left"></el-table-column>
      <el-table-column
        v-for=" records in monthCol"
        :key="records.key"
        :property="records.key"
        :label="records.label"
        :width="records.width"
        :fixed="records.fixed"
        :sortable="records.sortable"
        align="center"
      >
        <template slot-scope="scope">{{getScore(scope)}}</template>
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
import { fetchPerformanceList, addPerformance } from "@/api/approval";
import { fetchOrgList } from "@/api/auth";
import { stringDay, nowMonth } from "@/utils/common";
const CURMONTH = nowMonth();
const now = new Date();
const yearVal = now.getFullYear();
export default {
  data() {
    return {
      queryName: "",
      curYear: yearVal + "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      depOptions: [],
      depvalue: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      monthColumn: "",
      dialogVisible: false,
      formLabelWidth: "100px"
    };
  },
  computed: {
    monthCol: function() {
      let now = new Date();
      let curM = now.getMonth() + 1;
      //  之前的年份
      if (this.curYear < yearVal) {
        curM = 12;
      }
      let temp = [];
      for (let i = 1; i <= curM; i++) {
        let m = i < 9 ? `0${i}` : `${i}`;
        temp.push({
          label: this.curYear + "-" + m,
          key: m
        });
      }
      temp.push(
        {
          label: "平均分",
          key: "average",
          fixed: "right",
          sortable: true
        },
        {
          label: "总计",
          key: "total",
          fixed: "right",
          sortable: true
        }
      );
      // console.log("6666", temp);
      return temp;
    }
  },
  mounted() {
    fetchOrgList().then(res => {
      this.depOptions = res.items;
    });
    this.getPerformanceList();
  },
  methods: {
    getScore(scope) {
      let d = new Date();
      let m = d.getMonth() + 1;
      let performance = scope.row.PERFORMANCE;
      let label = scope.column.property;
      let score = "-",
        total = 0;
      if (performance.length) {
        performance.map(item => {
          total += item.SCORE;
          if (item.MONTH == label) {
            score = item.SCORE;
          }
        });
        if (label == "total") {
          score = total;
        }
        if (label == "average") {
          score = (total / m).toFixed(1);
        }
      }
      return score;
    },

    getPerformanceList() {
      console.log("depvalue", this.depvalue);
      let param = {
        data: JSON.stringify({
          TYPE: 2, // 年度报表
          YEAR: this.curYear,
          ORGID: this.depvalue
        })
        // limit: this.pagesize,
        // page: this.currentPage
      };
      fetchPerformanceList(param).then(res => {
        console.log("rrrr", res);
        this.total = res.items.length;
        this.tableData = res.items;
      });
    },

    handleDatePicker(val) {
      this.getPerformanceList();
    },

    handleQuery() {
      this.currentPage = 1;
      this.getPerformanceList();
    },

    handleExport(row) {
      let url = `/check/rest/Performance/export?data={"YEAR":'${this.curYear}',"ORGID":'${this.depvalue}'}`;
      console.log("url", url);
      window.open(url, "_blank");
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      // this.getPerformanceList();
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