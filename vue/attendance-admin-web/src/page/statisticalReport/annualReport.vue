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
        <el-select class="query-picker" v-model="depvalue" placeholder="请选择部门" clearable>
          <el-option v-for="item in depOptions" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
        <el-divider class="divider" direction="vertical"></el-divider>
        <el-button @click="handleExport()" type="primary" size="small">导出</el-button>
      </div>
    </div>
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
      @sort-change="changeSort"
      ref="sortTable"
    >
      <el-table-column label="序号" type="index" align="center" fixed="left"></el-table-column>
      <el-table-column prop="ORGNAME" label="部门" align="center" fixed="left">
        <template slot-scope="scope">{{scope.row.ORGNAME||'-'}}</template>
      </el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center" fixed="left"></el-table-column>
      <el-table-column
        v-for=" records in monthCol"
        :key="records.key"
        :property="records.key"
        :label="records.label"
        :width="records.width"
        :fixed="records.fixed"
        align="center"
      >
        <template slot-scope="scope">{{getScore(scope)}}</template>
      </el-table-column>
      <el-table-column prop="avg" label="平均分" align="center" fixed="right" sortable="custom"></el-table-column>
      <el-table-column prop="total" label="总计" align="center" fixed="right" sortable="custom"></el-table-column>
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
import { fetchPerformanceList, addPerformance } from "@/api/approval";
import { fetchOrgList } from "@/api/auth";
import { stringDay, nowMonth, tableSort } from "@/utils/common";
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
      let score = "-";
      if (performance.length) {
        performance.map(item => {
          if (item.MONTH == label) {
            score = item.SCORE;
          }
        });
      }
      return score;
    },

    changeSort(column) {
      this.currentPage = 1;
      let sortData = JSON.parse(JSON.stringify(this.tableData));
      this.tableData = tableSort(sortData, column);
    },
    getPerformanceList() {
      let param = {
        data: JSON.stringify({
          TYPE: 2, // 年度报表
          YEAR: this.curYear,
          ORGID: this.depvalue
        })
      };
      fetchPerformanceList(param).then(res => {
        this.total = res.items.length;
        this.tableData = res.items;
      });
    },

    handleDatePicker(val) {
      this.$refs.sortTable.clearSort();
      this.currentPage = 1;
      this.getPerformanceList();
    },

    handleQuery() {
      this.$refs.sortTable.clearSort();
      this.currentPage = 1;
      this.getPerformanceList();
    },

    handleExport(row) {
      let url = `/check/rest/Performance/export?data={"YEAR":'${this.curYear}',"ORGID":'${this.depvalue}'}`;
      window.open(url, "_blank");
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currentPage = 1;
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
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