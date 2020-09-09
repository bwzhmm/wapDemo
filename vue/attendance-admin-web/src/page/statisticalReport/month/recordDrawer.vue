<template>
  <el-drawer
    :title="drawerTitle"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="50%"
    :before-close="hidePanel"
  >
    <div class="query-box">
      <el-select v-model="checkValue" placeholder="请选择" class="mg-r10" clearable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button @click="handleQuery()" type="primary">查询</el-button>
    </div>
    <el-table :data="tableData" class="drawer-table" style="width: 100%" height="90%">
      <el-table-column prop="DAY" label="考勤日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.DAY)}}</template>
      </el-table-column>
      <el-table-column prop="CHECKTIME" label="最早打卡时间" width="100" align="center">
        <template slot-scope="scope">{{ formatStrTime(scope.row.CHECKTIME)||'-' }}</template>
      </el-table-column>
      <el-table-column prop="LASTCHECKTIME" label="最晚打卡时间" width="100" align="center">
        <template slot-scope="scope">{{ formatStrTime(scope.row.LASTCHECKTIME)||'-' }}</template>
      </el-table-column>
      <el-table-column prop="CHECKRESULT_OLD" label="原考勤结果" align="center">
        <template slot-scope="scope">{{ checkState[scope.row.CHECKRESULT_OLD]||'-'}}</template>
      </el-table-column>
      <el-table-column prop="CHECKRESULT_NEW" label="调整结果" align="center">
        <template slot-scope="scope">{{ checkState[scope.row.CHECKRESULT_NEW]||'-'}}</template>
      </el-table-column>
      <el-table-column prop="EXPLANATION" label="情况说明" align="center">
        <template slot-scope="scope">{{ scope.row.EXPLANATION||'-'}}</template>
      </el-table-column>
      <el-table-column prop="OVERTIME" label="加班时长（h）" align="center">
        <template slot-scope="scope">{{ scope.row.OVERTIME||'-'}}</template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script>
import {
  fetchRecordList,
  fetchAbnormalList,
  fetchRecordById,
  approveAbnormal
} from "@/api/record";
import util from "@/utils/util";
import { formatStr, nowYMD } from "@/utils/common";
export default {
  name: "user-drawer",
  props: ["drawerVisible", "queryMonth", "currentUser"],
  data() {
    return {
      checkState: ["", "正常", "迟到", "旷工"],
      applyState: ["未申请", "待审批", "已通过", "被驳回"],
      queryDay: "",
      queryName: "",
      tableData: [],
      total: 0,
      pagesize: 31,
      currentPage: 1,
      formLabelWidth: "100px",
      options: [
        {
          value: "1",
          label: "正常"
        },
        {
          value: "2",
          label: "迟到"
        },
        {
          value: "3",
          label: "旷工"
        }
      ],
      checkValue: ""
    };
  },

  mounted() {
    this.getList();
  },
  computed: {
    drawerTitle: function() {
      let year = this.queryMonth.slice(0, 4),
        month = this.queryMonth.slice(4, 6);
      let str = `${year}年${month}月考勤记录 - ${this.currentUser.NAME}`;
      return str;
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },

    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },
    formatStrTime(time) {
      return time ? formatStr(time, ":", true) : "";
    },

    getList() {
      let obj = {
        USERID: this.currentUser.USERID,
        MONTH: this.queryMonth,
        CHECKRESULT_NEW: this.checkValue
      };

      let param = {
        data: JSON.stringify(obj),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchRecordList(param).then(res => {
        this.total = res.total;
        this.tableData = res.items;
      });
    },
    hidePanel() {
      this.$emit("update:drawerVisible", false);
    },

    handleQuery(row) {
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.query-picker {
  width: 200px;
  display: inline-block;
  margin-right: 20px;
}
.query-box {
  float: right;
  margin-bottom: 10px;
}
.el-table::before {
  height: 0px !important;
}
</style>