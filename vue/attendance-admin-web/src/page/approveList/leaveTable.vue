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
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="NAME" label="申请人" align="center"></el-table-column>
      <el-table-column prop="TYPE" label="请假类型" width="110" align="center">
        <template slot-scope="scope">{{ restTypeArr[scope.row.TYPE]}}</template>
      </el-table-column>
      <el-table-column prop="DAY" label="请假时间" width="200" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.DAYTYPE =='2' ? formatDay(scope.row.STARTDAY)+ '~'+ formatDay(scope.row.ENDDAY) :formatDay(scope.row.DAY)}}</template>
      </el-table-column>
      <el-table-column prop="HOURS" label="请假时长" width="110" align="center">
        <template slot-scope="scope">{{formatHour(scope.row)}}</template>
      </el-table-column>
      <el-table-column prop="REASON" label="请假原因" align="center">
        <template slot-scope="scope">{{ scope.row.REASON}}</template>
      </el-table-column>
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
            v-if="scope.row.STATE=='0'"
          >审批</el-button>
          <el-button
            class="opacity_65"
            type="text"
            size="small"
            v-else
          >{{scope.row.STATE=='1' ?"已通过" :"未通过"}}</el-button>
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
          <i class="blueColor">{{holidayInfo.RESTTIME}}</i>小时、年假
          <i class="blueColor">{{holidayInfo.day}}</i>天
          <span v-show="holidayInfo.hour">
            <i class="blueColor">{{holidayInfo.hour}}</i>小时
          </span>
        </span>
      </div>
      <p>
        <span class="label-text opacity_65">申请人：</span>
        <span class="content">{{applyForm.NAME}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">请假类型：</span>
        <span class="content">{{restTypeArr[applyForm.TYPE]}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">请假日期：</span>
        <span
          class="content opacity_85"
          v-if="applyForm.DAYTYPE =='1'"
        >{{`${formatDay(applyForm.DAY)},${restTypeArr[applyForm.TYPE]}${formatHour(applyForm)}`}}</span>
        <span
          class="content opacity_85"
          v-else
        >{{`${formatDay(applyForm.STARTDAY)}~${formatDay(applyForm.ENDDAY)}, ${restTypeArr[applyForm.TYPE]} ${formatHour(applyForm)}`}}</span>
      </p>
      <p>
        <span class="label-text opacity_65">原因说明：</span>
        <span class="content opacity_85">{{applyForm.REASON}}</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleApprove('2')">驳回</el-button>
        <el-button type="primary" @click="handleApprove('1')">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchRestList,
  approveRest,
  getRestById,
  getRestHoliday
} from "@/api/approval";
import util from "@/utils/util";
import {
  stringDay,
  formatStr,
  dataDiffDay,
  getDayAndHour
} from "@/utils/common";
export default {
  data() {
    return {
      restTypeArr: [
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
      ],
      overTimeState: ["待审批", "已通过", "被驳回"],
      queryName: "",
      value1: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      dialogVisible: false,
      applyForm: {
        DAY: "",
        TYPE: "",
        NAME: "",
        REASON: ""
      },
      formLabelWidth: "100px",
      holidayInfo: {
        RESTTIME: "0",
        YEARTIME: "0",
        day: "0",
        hour: "0"
      }
    };
  },
  mounted() {
    this.getRestList();
  },
  methods: {
    formatDay(day) {
      // console.log("formatDay", day);
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },

    formatHour(row) {
      let hour =
        row.DAYTYPE == "2"
          ? `${dataDiffDay(
              this.formatDay(row.STARTDAY),
              this.formatDay(row.ENDDAY)
            )}天`
          : `${getDayAndHour(row.HOURS)}`;
      return hour;
    },

    backDayAndHour(hour) {
      let dayandhour = getDayAndHour(hour);
      if (dayandhour.includes("天")) {
        this.holidayInfo.day = dayandhour.split("天")[0];
      }
      if (dayandhour.includes("小时")) {
        this.holidayInfo.hour = dayandhour.split("天")[1].split("小时")[0];
      }
    },

    handleClick(row) {
      let param = {
        id: row.ID
      };

      getRestById(param).then(res => {
        if (res.success) {
          this.applyForm = res.item;
          let query = {
            data: JSON.stringify({
              USERID: row.USERID //管理员传  普通用户为空
            })
          };
          getRestHoliday(query).then(res => {
            if (res.success) {
              this.holidayInfo = res.item;
              this.backDayAndHour(res.item.YEARTIME);
              this.dialogVisible = true;
            }
          });
        }
      });
    },

    // 获取列表数据
    getRestList() {
      let param = {
        data: JSON.stringify({
          USERTYPE: "2", //用户USERTYPE1 管理员USERTYPE2 审批时
          NAME: this.queryName
        }),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchRestList(param).then(res => {
        this.total = res.total;
        this.tableData = res.items;
      });
    },
    handleQuery(row) {
      this.currentPage = 1;
      this.getRestList();
    },

    handleApprove(type) {
      let param = {
        data: JSON.stringify({
          ID: this.applyForm.ID,
          STATE: type
        })
      };
      approveRest(param).then(res => {
        if (res.success) {
          this.dialogVisible = false;
          this.$message({
            message: "审批完成！",
            type: "success"
          });
          this.getRestList();
        }
      });
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getRestList();
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