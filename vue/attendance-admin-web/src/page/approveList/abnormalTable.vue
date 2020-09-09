<template>
  <div>
    <div class="table_head">
      <ul>
        <li
          v-for="(tab,index) in tabs"
          :key="index"
          @click="toggle(index,tab.view)"
          :class="{active:active==index} "
        >{{tab.title}}</li>
      </ul>
      <div>
        <el-date-picker
          class="query-datapicker"
          v-model="queryDay"
          value-format="yyyyMMdd"
          type="date"
          v-if="active==1"
          placeholder="请选择日期"
        ></el-date-picker>
        <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名" clearable></el-input>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" v-show="active==0">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="NAME" label="申请人" align="center"></el-table-column>
      <el-table-column prop="DAY" label="考勤日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.DAY)}}</template>
      </el-table-column>
      <el-table-column prop="CHECKTIME" label="最早打卡时间" align="center">
        <template slot-scope="scope">{{ formatStrTime(scope.row.CHECKTIME)||'-' }}</template>
      </el-table-column>
      <el-table-column prop="LASTCHECKTIME" label="最晚打卡时间" align="center">
        <template slot-scope="scope">{{ formatStrTime(scope.row.LASTCHECKTIME)||'-' }}</template>
      </el-table-column>
      <el-table-column prop="CHECKRESULT_OLD" label="原考勤结果" align="center">
        <template slot-scope="scope">{{ checkState[scope.row.CHECKRESULT_OLD]||'-'}}</template>
      </el-table-column>
      <el-table-column prop="CHECKRESULT_NEW" label="调整结果" align="center">
        <template slot-scope="scope">{{ checkState[scope.row.CHECKRESULT_NEW]||'-'}}</template>
      </el-table-column>
      <el-table-column prop="EXPLANATION" label="情况说明" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.EXPLANATION||'-'}}</template>
      </el-table-column>
      <el-table-column prop="EXCCREATETIME" label="创建时间" align="center" width="150">
        <template slot-scope="scope">{{ formatTimes(scope.row.EXCCREATETIME)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.APPLYSTATE=='1'"
          >审批</el-button>
          <el-button
            class="opacity_65"
            type="text"
            size="small"
            v-else
          >{{scope.row.APPLYSTATE=='2' ?"已通过" :"未通过"}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="tableData" style="width: 100%" v-show="active==1">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="NAME" label="申请人" align="center"></el-table-column>
      <el-table-column prop="DAY" label="考勤日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.DAY)}}</template>
      </el-table-column>
      <el-table-column prop="CHECKTIME" label="最早打卡时间" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.ISCHECK=='1'? formatStrTime(scope.row.CHECKTIME)||'-' :'-'}}</template>
      </el-table-column>
      <el-table-column prop="LASTCHECKTIME" label="最晚打卡时间" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.ISCHECK=='1'? formatStrTime(scope.row.LASTCHECKTIME)||'-' :'-'}}</template>
      </el-table-column>
      <el-table-column prop="CHECKRESULT_OLD" label="原考勤结果" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.ISCHECK=='1'? checkState[scope.row.CHECKRESULT_OLD]||'-':'-'}}</template>
      </el-table-column>
      <el-table-column prop="CHECKRESULT_NEW" label="调整结果" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.ISCHECK=='1'? checkState[scope.row.CHECKRESULT_NEW]||'-':'-'}}</template>
      </el-table-column>
      <el-table-column prop="EXPLANATION" label="情况说明" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'?scope.row.EXPLANATION||'-':'-'}}</template>
      </el-table-column>
      <el-table-column prop="OVERTIME" label="加班时长" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.ISCHECK=='1'?scope.row.OVERTIME||'-':'-'}}</template>
      </el-table-column>
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
    <el-dialog title="异常申请" :visible.sync="dialogVisible" width="600px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>请驳回因请假未能打卡的异常申请，建议提交请假调休申请。</span>
      </div>
      <el-form label-width="120px">
        <el-form-item label="申请人：" class="label-text opacity_65">
          <span class="content opacity_85">{{applyForm.NAME}}</span>
        </el-form-item>
        <el-form-item label="考勤日期：" class="label-text opacity_65">
          <span class="content opacity_85">{{formatDay(applyForm.DAY)}}</span>
        </el-form-item>
        <el-form-item label="最早打卡时间：" class="label-text opacity_65">
          <span class="content opacity_85">{{ formatStrTime(applyForm.CHECKTIME) || '-'}}</span>
        </el-form-item>
        <el-form-item label="最晚打卡时间：" class="label-text opacity_65">
          <span class="content opacity_85">{{ formatStrTime(applyForm.LASTCHECKTIME) || '-'}}</span>
        </el-form-item>
        <el-form-item label="原考勤结果：" class="label-text opacity_65">
          <span class="content opacity_85">{{checkState[applyForm.CHECKRESULT_OLD]}}</span>
        </el-form-item>
        <el-form-item label="调整结果：" class="label-text opacity_65">
          <span class="content opacity_85">{{checkState[applyForm.CHECKRESULT_NEW]}}</span>
        </el-form-item>
        <el-form-item label="情况说明：" class="label-text opacity_65">
          <span class="content opacity_85">{{applyForm.EXPLANATION}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleApprove('3')">驳回</el-button>
        <el-button type="primary" @click="handleApprove('2')">通过</el-button>
      </span>
    </el-dialog>
  </div>
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
  data() {
    return {
      active: 0,
      tabs: [
        {
          title: "异常申请",
          view: "tab1"
        },
        {
          title: "考勤记录",
          view: "tab2"
        }
      ],
      checkState: ["", "正常", "迟到", "旷工"],
      applyState: ["未申请", "待审批", "已通过", "被驳回"],
      queryDay: "",
      queryName: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      dialogVisible: false,
      applyForm: {
        DAY: "20200525",
        CHECKTIME: "",
        NAME: "撒贝宁",
        CHECKRESULT_OLD: "旷工",
        CHECKRESULT_NEW: "正常",
        EXPLANATION: "说明ing"
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {
    this.getList();
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
    // 切换 tab 时，清空查询条件，页面
    toggle(index, v) {
      this.active = index;
      this.queryName = "";
      this.queryDay = nowYMD("");
      this.page = 1;
      this.pagesize = 10;
      this.getList();
    },

    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatStrTime(time) {
      return time ? formatStr(time, ":", true) : "";
    },
    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },

    handleClick(row) {
      let param = {
        id: row.ID
      };
      fetchRecordById(param).then(res => {
        if (res.success) {
          this.applyForm = res.item;
          this.dialogVisible = true;
        }
      });
    },

    //  APPLYSTATE":"2同意3拒绝  CHECKRESULT_NEW 是123   DELAYSTATE 是014
    handleApprove(type) {
      let param;
      if (type == "2") {
        let states = ["", "0", "1", "4"];
        param = {
          data: JSON.stringify({
            ID: this.applyForm.ID,
            APPLYSTATE: type,
            DELAYSTATE: states[this.applyForm.CHECKRESULT_NEW]
          })
        };
      } else {
        param = {
          data: JSON.stringify({
            ID: this.applyForm.ID,
            CHECKRESULT_NEW: this.applyForm.CHECKRESULT_OLD,
            APPLYSTATE: type
          })
        };
      }
      approveAbnormal(param).then(res => {
        if (res.success) {
          this.dialogVisible = false;
          this.$message({
            message: "审批完成！",
            type: "success"
          });
          this.getList();
        }
      });
    },

    getList() {
      let obj = { NAME: this.queryName };
      if (this.active == 1) {
        obj.DAY = this.queryDay;
        obj.ORGID = this.userInfo.ORGID; //考勤记录按当前人员的部门查询
      }
      let param = {
        data: JSON.stringify(obj),
        limit: this.pagesize,
        page: this.currentPage
      };
      if (this.active == 1) {
        fetchRecordList(param).then(res => {
          this.total = res.total;
          this.tableData = res.items;
        });
      } else {
        fetchAbnormalList(param).then(res => {
          this.total = res.total;
          this.tableData = res.items;
        });
      }
    },

    handleQuery(row) {
      this.currentPage = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currentPage = 1;
      this.getList();
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
ul {
  width: 200px;
  display: flex;
}
ul li {
  width: 64px;
  height: 40px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 30px;
}
ul li.active {
  color: #0091ff;
  opacity: 1;
  font-weight: 500;
  border-bottom: 2px solid #1890ff;
}

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
</style>