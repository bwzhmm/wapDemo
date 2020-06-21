<template>
  <div>
    <div class="table_head">
      <h4>请假调休</h4>
      <div>
        <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名"></el-input>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for=" records in applyColumn"
        :key="records.key"
        :property="records.key"
        :label="records.label"
        :width="records.width"
        align="center"
      >
        <template slot-scope="scope">{{scope.row[scope.column.property]}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.status==2"
          >审批</el-button>
          <el-button
            class="opacity_65"
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            v-else
          >已通过</el-button>
        </template>
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
    <el-dialog title="请假调休" :visible.sync="dialogVisible" width="600px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>
          半天=4小时，一天=8小时。该用户拥有加班时长
          <i class="blueColor">7</i>小时、年假
          <i class="blueColor">2.5</i>天。
        </span>
      </div>
      <p>
        <span class="label-text opacity_65">申请人：</span>
        <span class="content">{{form.name}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">请假类型：</span>
        <span class="content">{{form.type}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">请假日期：</span>
        <span class="content opacity_85">{{form.date}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">原因说明：</span>
        <span class="content opacity_85">{{form.result}}</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">驳回</el-button>
        <el-button type="primary" @click="dialogVisible=false">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from "@/api/user";

import { leaveCol } from "./common.js";
export default {
  data() {
    return {
      queryName: "",
      value1: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      applyColumn: leaveCol,
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
    this.getUserList();
  },
  methods: {
    toggle(index, v) {
      this.active = index;
      if (index == 1) {
        this.applyColumn = attendanceCol;
      }
    },
    handleClick(row) {
      this.dialogVisible = true;
      console.log(row);
    },

    // 获取列表数据
    getUserList() {
      let param = {
        limit: this.pageSize,
        page: this.currentPage
      };
      getUserList(param).then(res => {
        console.log("rrrr", res);
        this.total = res.data.total;
        console.log(this.total);
        this.tableData = res.data.userList;
      });
    },
    handleQuery(row) {
      this.overtimeVisible = true;
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