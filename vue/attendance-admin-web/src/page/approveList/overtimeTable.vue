<template>
  <div>
    <div class="table_head">
      <h4>加班申请</h4>
      <div>
        <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名"></el-input>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="NAME" label="申请人" align="center"></el-table-column>
      <el-table-column prop="DAY" label="加班日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.DAY)}}</template>
      </el-table-column>
      <el-table-column prop="HOURS" label="加班时长（h）" width="110" align="center"></el-table-column>
      <el-table-column prop="REASON" label="加班原因" align="center"></el-table-column>
      <el-table-column prop="STATE" label="申请状态" width="100" align="center">
        <template slot-scope="scope">{{ overTimeState[scope.row.STATE]}}</template>
      </el-table-column>
      <el-table-column prop="CREATETIME" label="创建时间" align="center">
        <template slot-scope="scope">{{ formatTimes(scope.row.CREATETIME)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.STATE==0"
          >审批</el-button>
          <el-button
            class="opacity_65"
            type="text"
            size="small"
            v-else
          >{{scope.row.STATE==1?'已通过':'已驳回'}}</el-button>
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
    <el-dialog title="加班申请" :visible.sync="dialogVisible" width="600px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>工作日加班时间从19:00起计算。</span>
      </div>
      <p>
        <span class="label-text opacity_65">申请人：</span>
        <span class="content">{{formDetails.NAME}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">加班日期：</span>
        <span class="content">{{ formatDay(formDetails.DAY)}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">加班时长：</span>
        <span class="content opacity_85">{{formDetails.HOURS}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">加班原因：</span>
        <span class="content opacity_85">{{formDetails.REASON}}</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleApprove(2)">驳回</el-button>
        <el-button type="primary" @click="handleApprove(1)">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchOvertimeList, selectById, approve } from "@/api/approval";
import util from "@/utils/util";
export default {
  data() {
    return {
      overTimeState: ["待审批", "已通过", "被驳回"],
      queryName: "",
      value1: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      dialogVisible: false,
      formDetails: {
        CREATETIME: "",
        DAY: "",
        HOURS: "",
        ID: "",
        NAME: "",
        REASON: "",
        STATE: ""
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {
    this.getOvertimeList();
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },

    handleClick(row) {
      selectById({ id: row.ID }).then(res => {
        this.formDetails = res.item;
        this.dialogVisible = true;
      });
    },

    // 获取部门审批的加班列表
    getOvertimeList() {
      let param = {
        data: JSON.stringify({
          TYPE: 2,
          DAY: "",
          NAME: this.queryName
        }),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchOvertimeList(param).then(res => {
        this.total = res.total;
        this.tableData = res.items;
      });
    },
    handleQuery() {
      this.currentPage = 1;
      this.getOvertimeList();
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getOvertimeList();
    },

    handleApprove(state) {
      let param = {
        data: JSON.stringify({
          ID: this.formDetails.ID,
          STATE: state
        })
      };
      approve(param).then(res => {
        if (res.success) {
          this.getOvertimeList();
          this.dialogVisible = false;
        }
      });
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

p:last-child {
  margin-bottom: 50px;
}
</style>