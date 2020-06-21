<template>
  <div>
    <div class="table_head">
      <el-tabs v-model="activeName" @tab-click="handleClickTab" class="tab-container">
        <el-tab-pane label="加班申请" name="overtime"></el-tab-pane>
        <el-tab-pane label="请假调休" name="rest"></el-tab-pane>
      </el-tabs>
      <div class="inline-block">
        <el-date-picker
          class="date-picker"
          v-model="queryDay"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>

        <el-divider class="divider" direction="vertical"></el-divider>
        <el-button
          v-if="activeName=='overtime'"
          @click="handleClickWork()"
          type="primary"
          size="small"
          icon="el-icon-plus"
        >加班申请</el-button>
        <el-button
          v-else
          @click="handleClickLeave()"
          type="primary"
          size="small"
          icon="el-icon-plus"
        >请假调休</el-button>
      </div>
    </div>
    <el-table :data="overtimeData" style="width: 100%" v-if="activeName=='overtime'">
      <el-table-column prop="DAY" label="加班日期" width="110" align="center">
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
    </el-table>

    <el-table :data="restData" style="width: 100%" v-else>
      <el-table-column prop="TYPE" label="请假类型" width="110" align="center">
        <template slot-scope="scope">{{ restTypeArr[scope.row.TYPE]}}</template>
      </el-table-column>
      <el-table-column prop="DAY" label="请假时间" width="110" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.DAY)}}</template>
      </el-table-column>
      <el-table-column prop="HOURS" label="请假时长" width="110" align="center"></el-table-column>
      <el-table-column prop="REASON" label="请假原因" align="center">
        <template slot-scope="scope">{{ scope.row.REASON}}</template>
      </el-table-column>
      <el-table-column prop="STATE" label="申请状态" width="100" align="center">
        <template slot-scope="scope">{{ overTimeState[scope.row.STATE]}}</template>
      </el-table-column>
      <el-table-column prop="CREATETIME" label="创建时间" align="center">
        <template slot-scope="scope">{{ formatTimes(scope.row.CREATETIME)}}</template>
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
    <!--  加班申请 -->
    <el-dialog title="加班申请" :visible.sync="overtimeVisible" width="600px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>工作日加班时间从19:00起计算</span>
      </div>
      <el-form :model="workform" ref="workform">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="加班日期:"
              :label-width="formLabelWidth"
              prop="DAY"
              :rules="[ { required: true, message: '请选择加班日期', trigger: 'blur' }  ]"
            >
              <el-date-picker
                v-model="workform.DAY"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="加班时长:"
              :label-width="formLabelWidth"
              prop="HOURS"
              :rules="[ { required: true, message: '请填写加班时长', trigger: 'blur' }  ]"
            >
              <el-input v-model="workform.HOURS">
                <span slot="suffix">小时</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="加班原因:"
              :label-width="formLabelWidth"
              prop="REASON"
              :rules="[ { required: true, message: '请填写加班原因', trigger: 'blur' }  ]"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows:3, maxRows:6}"
                v-model="workform.REASON"
                placeholder="请输入加班原因，不超过200字"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="overtimeVisible=false">取消</el-button>
        <el-button type="primary" @click="overtimeSubmit">提交</el-button>
      </span>
    </el-dialog>
    <!--  请假调休弹框 -->
    <el-dialog title="请假调休" :visible.sync="leaveVisible" width="700px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>
          您拥有加班时长
          <i class="blueColor">7</i>小时、年假
          <i class="blueColor">2.5</i>天，可用于请假调休
        </span>
      </div>
      <el-form :model="leaveform" ref="leaveform">
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="请假类型:"
              :label-width="formLabelWidth"
              prop="TYPE"
              :rules="[ { required: true, message: '请选择请假类型', trigger: 'blur' } ]"
            >
              <el-select v-model="leaveform.TYPE" placeholder="请选择请假类型" style="width: 100%;">
                <el-option label="事假" value="3"></el-option>
                <el-option label="调休" value="2"></el-option>
                <el-option label="病假" value="1"></el-option>
                <el-option label="哺乳假" value="4"></el-option>
                <el-option label="年假" value="5"></el-option>
                <el-option label="例假" value="6"></el-option>
                <el-option label="产假" value="7"></el-option>
                <el-option label="陪产假" value="8"></el-option>
                <el-option label="婚假" value="9"></el-option>
                <el-option label="丧假" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="(hourType.includes(leaveform.TYPE) )?10:12">
            <el-form-item
              label="请假日期:"
              :label-width="formLabelWidth"
              prop="DAY"
              :rules="[ { required: true, message: '请选择请假日期', trigger: 'blur' }  ]"
            >
              <el-date-picker
                v-if="hourType.includes(leaveform.TYPE) "
                v-model="leaveform.DAY"
                value-format="yyyyMMdd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              ></el-date-picker>
              <el-date-picker
                v-else
                v-model="leaveform.DAY"
                type="daterange"
                value-format="yyyyMMdd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <div v-if="hourType.includes(leaveform.TYPE) ">
              <span class="hourTip">半天=4小时，一天=8小时</span>
              <el-form-item
                label="请假时长:"
                :label-width="formLabelWidth"
                prop="HOURS"
                :rules="[ { required: true, message: '请填写请假时长', trigger: 'blur' }  ]"
              >
                <el-select
                  v-model="leaveform.HOURS"
                  placeholder="请选择请假时长"
                  v-if="leaveform.TYPE=='5' ||leaveform.TYPE=='6'"
                >
                  <el-option label="半天" value="4"></el-option>
                  <el-option label="一天" value="8"></el-option>
                </el-select>
                <el-input v-model="leaveform.HOURS" v-else>
                  <span slot="suffix">小时</span>
                </el-input>
              </el-form-item>
            </div>
            <span v-else class="dayTips">共请假10天</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="原因说明:"
              :label-width="formLabelWidth"
              prop="REASON"
              :rules="[ { required: true, message: '请填写请假原因', trigger: 'blur' }  ]"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows:3, maxRows:6}"
                v-model="leaveform.REASON"
                placeholder="请输入请假原因，不超过200字"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="leaveVisible=false">取消</el-button>
        <el-button type="primary" @click="restSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchOvertimeList,
  addOvertime,
  fetchRestList,
  InsertRestList
} from "@/api/approval";
import util from "@/utils/util";
import { stringDay } from "@/utils/common";

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
        "陪产假"
      ],
      hourType: ["1", "2", "3", "4", "5", "6"], //年假/例假 5、6 半天/一天     事假/调休/病假/哺乳假 3、2、1、4 小时， 其他按 连续天
      dayType: ["0", "7", "8", "9"],
      overTimeState: ["申请中", "同意", "拒绝"],
      activeName: "overtime",
      queryDay: "",
      overtimeData: [],
      restData: [],
      total: 0,
      pagesize: 5,
      currentPage: 1,
      overtimeVisible: false,
      leaveVisible: false,
      workform: {
        DAY: "",
        REASON: "",
        HOURS: ""
      },
      leaveform: {
        DAY: "",
        TYPE: "0",
        REASON: "",
        HOURS: ""
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {
    this.getApplyList();
  },
  methods: {
    formatDay(day) {
      console.log("dd", day);
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },

    handleQuery() {
      console.log("queryDay", this.queryDay);
      this.getApplyList();
    },
    handleClickTab(tab, event) {
      this.activeName = tab.name;
      this.getApplyList();
      console.log("tab", tab);
    },
    // 获取列表数据
    getApplyList() {
      if (this.activeName == "overtime") {
        let param = {
          data: JSON.stringify({
            TYPE: 1,
            STARTTIME: stringDay(this.queryDay[0]) || "",
            ENDTIME: stringDay(this.queryDay[1]) || ""
          }),
          limit: this.pagesize,
          page: this.currentPage
        };
        fetchOvertimeList(param).then(res => {
          console.log("123hhhhhh", res);
          this.total = res.total;
          this.overtimeData = res.items;
        });
      } else {
        let param = {
          data: JSON.stringify({
            USERTYPE: 1, //用户USERTYPE1 管理员USERTYPE2
            NAME: "",
            STARTTIME: stringDay(this.queryDay[0]) || "",
            ENDTIME: stringDay(this.queryDay[1]) || ""
          }),
          limit: this.pagesize,
          page: this.currentPage
        };
        fetchRestList(param).then(res => {
          console.log("123", res);
          this.total = res.total;
          this.restData = res.items;
        });
      }
    },
    overtimeSubmit() {
      this.$refs["workform"].validate(valid => {
        if (valid) {
          console.log("valid", valid);
          console.log("www", this.workform);
          let param = {
            data: JSON.stringify({
              DAY: stringDay(this.workform.DAY),
              REASON: this.workform.REASON,
              HOURS: this.workform.HOURS
            })
          };
          addOvertime(param).then(res => {
            if (res.success) {
              this.$message({
                message: "加班申请成功",
                type: "success"
              });
              this.getApplyList();
              this.overtimeVisible = false;
            }
          });
        }
      });
    },
    restSubmit() {
      this.$refs["leaveform"].validate(valid => {
        if (valid) {
          let dayType = this.hourType.includes(this.leaveform.TYPE) ? "1" : "2";
          let obj;
          console.log("www", this.leaveform);
          // DAYTYPE=1 和 DAYTYPE=2  参数格式不一样 1是固定一天内的几小时 2是连续天请假
          if (dayType == "1") {
            obj = {
              USERID: this.leaveform.USERID,
              DAYTYPE: "1",
              DAY: this.leaveform.DAY,
              TYPE: this.leaveform.TYPE,
              HOURS: this.leaveform.HOURS,
              REASON: this.leaveform.REASON
            };
          } else {
            obj = {
              USERID: this.leaveform.USERID,
              DAYTYPE: "2",
              STARTDAY: stringDay(this.leaveform.DAY[0]),
              ENDDAY: stringDay(this.leaveform.DAY[1]),
              TYPE: this.leaveform.TYPE,
              REASON: this.leaveform.REASON
            };
          }

          let param = {
            data: JSON.stringify(obj)
          };
          InsertRestList(param).then(res => {
            if (res.success) {
              this.$message({
                message: "请假调休申请成功",
                type: "success"
              });
              this.getApplyList();
              this.leaveVisible = false;
            }
          });
        }
      });
    },
    handleClickWork(row) {
      this.overtimeVisible = true;
    },
    handleClickLeave(row) {
      this.leaveVisible = true;
      console.log(row);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getApplyList();
    }
  }
};
</script>

<style lang="less" scoped>
.tab-container /deep/ .el-tabs__nav-wrap::after {
  background-color: #fff;
}
.tab-container /deep/ .el-tabs__item {
  font-size: 16px;
}
.table_head {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
}
.date-picker {
  width: 292px;
  margin-right: 20px;
}
.divider {
  margin: 0 20px;
  height: 1.5em;
}
.pagination {
  background: #fff;
  text-align: right;
  padding: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.6) !important;
}

span.hourTip {
  position: absolute;
  top: -30px;
  left: 58%;
}
span.dayTips {
  line-height: 28px;
  margin-left: 10px;
}
</style>