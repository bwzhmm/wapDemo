<template>
  <div>
    <div class="table_head">
      <h4>请假调休</h4>
      <div>
        <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名" clearable></el-input>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="NAME" label="申请人" align="center"></el-table-column>
      <el-table-column prop="TYPE" label="请假类型" align="center">
        <template slot-scope="scope">{{ scope.row.TYPE=='a'?"病假（病休）":restTypeArr[scope.row.TYPE]}}</template>
      </el-table-column>
      <el-table-column prop="DAY" label="请假时间" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.DAYTYPE =='2' ? formatDay(scope.row.STARTDAY)+ '~'+ formatDay(scope.row.ENDDAY) :formatDay(scope.row.DAY)}}</template>
      </el-table-column>

      <el-table-column prop="HOURS" label="请假时长" align="center"></el-table-column>
      <el-table-column prop="REASON" label="请假原因" align="center" width="250">
        <template slot-scope="scope">
          {{ scope.row.REASON}}
          <span
            v-show="scope.row.TYPE=='a'"
            @click="previewFile( scope.row.FILEID)"
          >
            ，
            <span class="blue_sick">病假证明</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="STATE" label="申请状态" align="center">
        <template slot-scope="scope">{{ overTimeState[scope.row.STATE]}}</template>
      </el-table-column>
      <el-table-column prop="CREATETIME" label="创建时间" align="center" width="150">
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
        :total="total"
        :page-size="pagesize"
        :current-page="currentPage"
        layout="sizes,prev, pager, next"
        :page-sizes="[10, 20, 50, 100,200]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="请假调休" :visible.sync="dialogVisible" width="680px">
      <div class="tips_box">
        <i class="el-icon-warning" style="margin-right:0px"></i>
        <span>
          半天=4小时，一天=8小时。该用户拥有加班时长
          <i class="blueColor">{{holidayInfo.RESTTIME}}</i>小时、年假
          <span v-show="holidayInfo.day">
            <i class="blueColor">{{holidayInfo.day}}</i>天
          </span>
          <span v-show="holidayInfo.hour">
            <i class="blueColor">{{holidayInfo.hour}}</i>小时
          </span>
          <span v-show="!holidayInfo.day&&!holidayInfo.hour">
            <i class="blueColor">0</i>小时
          </span>，可用于请假调休。
        </span>
      </div>
      <el-form label-width="100px">
        <el-form-item label="申请人：" class="label-text opacity_65">
          <span class="content opacity_85">{{applyForm.NAME}}</span>
        </el-form-item>
        <el-form-item label="请假类型：" class="label-text opacity_65">
          <span
            class="content opacity_85"
          >{{applyForm.TYPE=='a'?"病假（病休）":restTypeArr[applyForm.TYPE]}}</span>
        </el-form-item>
        <el-form-item label="请假日期：" class="label-text opacity_65">
          <span
            class="content opacity_85"
            v-if="applyForm.DAYTYPE =='1'"
          >{{`${formatDay(applyForm.DAY)}，请假${applyForm.HOURS}`}}</span>
          <span
            class="content opacity_85"
            v-else
          >{{`${formatDay(applyForm.STARTDAY)}~${formatDay(applyForm.ENDDAY)}，共请假${applyForm.HOURS}`}}</span>
        </el-form-item>
        <el-form-item label="原因说明：" class="label-text opacity_65">
          <span class="content opacity_85">{{applyForm.REASON}}</span>
        </el-form-item>
        <el-form-item label="病假证明：" class="label-text opacity_65" v-show="applyForm.TYPE=='a' ">
          <i class="el-icon-paperclip"></i>
          <span class="file-title" @click="previewFile(applyForm.FILEID)">{{applyForm.FILENAME}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleApprove('2')">驳回</el-button>
        <el-button type="primary" @click="handleApprove('1')">通过</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" :append-to-body="true" class="img-dialog">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchRestList,
  approveRest,
  getRestById,
  getRestHoliday,
  getRestDays
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
      },
      dialogImageUrl: "",
      imgVisible: false,
      sickDay: ""
    };
  },
  mounted() {
    this.getRestList();
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },

    // formatHour(row) {
    //   let hour =
    //     row.DAYTYPE == "2"
    //       ? `${dataDiffDay(
    //           this.formatDay(row.STARTDAY),
    //           this.formatDay(row.ENDDAY)
    //         )}天`
    //       : `${getDayAndHour(row.HOURS)}`;
    //   return hour;
    // },

    backDayAndHour(hour) {
      let dayandhour = getDayAndHour(hour);
      if (dayandhour.includes("天")) {
        this.holidayInfo.day = dayandhour.split("天")[0];
      }
      if (dayandhour.includes("小时")) {
        this.holidayInfo.hour = dayandhour.includes("天")
          ? dayandhour.split("天")[1].split("小时")[0]
          : dayandhour.split("小时")[0];
      }
    },

    previewFile(fileId) {
      let url = `${window.global.ApiUrl}/fileweb/rest/FileOut/view/${fileId}`;
      this.dialogImageUrl = url;
      this.imgVisible = true;
    },

    handleClick(row) {
      let param = {
        id: row.ID
      };

      getRestById(param).then(res => {
        if (res.success) {
          let current = res.item;
          if (current.TYPE == "a") {
            let param = {
              data: JSON.stringify({
                STARTDAY: current.STARTDAY,
                ENDDAY: current.ENDDAY
              })
            };
            getRestDays(param).then(res => {
              if (res.success) {
                current.HOURS = `${res.item.DAYS}天`;
              }
            });
          } else {
            current.HOURS =
              current.DAYTYPE == "2"
                ? `${dataDiffDay(
                    this.formatDay(current.STARTDAY),
                    this.formatDay(current.ENDDAY)
                  )}天`
                : `${getDayAndHour(current.HOURS)}`;
          }
          this.applyForm = current;
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
        let itemsArr = res.items;
        itemsArr.map(item => {
          if (item.TYPE == "a") {
            let param = {
              data: JSON.stringify({
                STARTDAY: item.STARTDAY,
                ENDDAY: item.ENDDAY
              })
            };
            getRestDays(param).then(res => {
              if (res.success) {
                item.HOURS = `${res.item.DAYS}天`;
              }
            });
          } else {
            item.HOURS =
              item.DAYTYPE == "2"
                ? `${dataDiffDay(
                    this.formatDay(item.STARTDAY),
                    this.formatDay(item.ENDDAY)
                  )}天`
                : `${getDayAndHour(item.HOURS)}`;
          }
        });
        this.tableData = itemsArr;
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
    handleSizeChange(val) {
      this.pagesize = val;
      this.currentPage = 1;
      this.getRestList();
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
.file-title {
  color: #1890ff;
  cursor: pointer;
  margin-left: 5px;
}
.img-dialog /deep/ .el-dialog__headerbtn {
  top: 5px;
}
</style>