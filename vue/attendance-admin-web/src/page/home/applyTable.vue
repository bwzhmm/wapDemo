<template>
  <div>
    <div class="table_head">
      <el-tabs v-model="activeName" @tab-click="handleClickTab" class="tab-container" lazy>
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
          value-format="yyyyMMdd"
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
    <el-table :data="overtimeData" style="width: 100%" v-show="activeName=='overtime'">
      <el-table-column prop="overDAY" label="加班日期" width="110" align="center">
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

    <el-table :data="restData" style="width: 100%" v-show="activeName=='rest'">
      <el-table-column prop="TYPE" label="请假类型" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.TYPE=='a'?'病假（病休）':restTypeArr[scope.row.TYPE]}}</template>
      </el-table-column>
      <el-table-column prop="DAY" label="请假时间" width="200" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.DAYTYPE=='1'">{{ formatDay(scope.row.DAY)}}</span>
          <span v-else>{{ `${formatDay(scope.row.STARTDAY)}~${formatDay(scope.row.ENDDAY)}`}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="HOURS" label="请假时长" width="110" align="center">
        <template slot-scope="scope">{{scope.row.HOURS}}</template>
      </el-table-column>
      <el-table-column prop="REASON" label="请假原因" align="center">
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
        :total="total"
        :page-size="pagesize"
        :current-page="currentPage"
        layout="sizes,prev, pager, next"
        :page-sizes="[5,10, 20, 50, 100,200]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!--  加班申请 -->
    <el-dialog
      title="加班申请"
      :visible.sync="overtimeVisible"
      width="600px"
      :before-close="overTimeClose"
    >
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>工作日加班时间从19:00起，以小时为单位计算，不足的不计算。</span>
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
              :rules="[ { required: true, message: '请填写加班时长', trigger: 'blur' } ,
                { pattern: /^(([1-9])|(1\d)|(2[0-4]))$/, message: '须为小于24的正整数' } ]"
            >
              <el-input v-model.number="workform.HOURS">
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
                maxlength="200"
                show-word-limit
                placeholder="请输入加班原因，不超过200字"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('workform')">取消</el-button>
        <el-button type="primary" @click="overtimeSubmit('workform')">提交</el-button>
      </span>
    </el-dialog>
    <!--  请假调休弹框 -->
    <el-dialog title="请假调休" :visible.sync="leaveVisible" width="700px" :before-close="leaveClose">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>
          您拥有加班时长
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
      <el-form :model="leaveform" ref="leaveform">
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="请假类型:"
              :label-width="formLabelWidth"
              prop="TYPE"
              :rules="[ { required: true, message: '请选择请假类型', trigger: 'blur' } ]"
            >
              <el-select
                v-model="leaveform.TYPE"
                placeholder="请选择请假类型"
                style="width: 100%;"
                @change="changeSelect"
              >
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

          <el-col
            :span="2"
            style="margin-left:10px;line-height: 28px;"
            v-show="leaveform.TYPE=='1'"
          >
            <el-checkbox v-model="sickChecked">病休</el-checkbox>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="iSOneDay?10:12">
            <el-form-item
              v-if="iSOneDay "
              label="请假日期:"
              :label-width="formLabelWidth"
              prop="DAY"
              :rules="[ { required: true, message: '请选择请假日期', trigger: 'blur' }  ]"
            >
              <el-date-picker
                v-model="leaveform.DAY"
                value-format="yyyyMMdd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              v-show="!iSOneDay "
              label="请假日期:"
              :label-width="formLabelWidth"
              prop="rangeDAY"
              :rules="[ { required: !iSOneDay, message: '请选择请假日期', trigger: 'blur' }  ]"
            >
              <el-date-picker
                v-model="leaveform.rangeDAY"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <div v-if="iSOneDay">
              <span class="hourTip">半天=4小时，一天=8小时</span>
              <el-form-item
                v-if="leaveform.TYPE=='5'||leaveform.TYPE=='6' "
                label="请假时长:"
                :label-width="formLabelWidth"
                prop="HOURS"
                :rules="[ { required: true, message: '请填写请假时长', trigger: 'blur' } ]"
              >
                <el-select v-model="leaveform.HOURS" placeholder="请选择请假时长">
                  <el-option label="半天" value="4"></el-option>
                  <el-option label="一天" value="8"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-else
                label="请假时长:"
                :label-width="formLabelWidth"
                prop="HOURS"
                :rules="[ { required: true, message: '请填写请假时长', trigger: 'blur' },
                 { pattern: /^\+?[1-8]$/, message: '须为小于8的正整数' }
                 ]"
              >
                <el-input v-model.number="leaveform.HOURS">
                  <span slot="suffix">小时</span>
                </el-input>
              </el-form-item>
            </div>
            <span v-else class="dayTips">共请假{{allleaveDays}}天</span>
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
                maxlength="200"
                show-word-limit
                placeholder="请输入请假原因，不超过200字"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="leaveform.TYPE=='1' && sickChecked">
          <el-col :span="20">
            <el-form-item
              label="病假证明："
              :label-width="formLabelWidth"
              prop="FILEID"
              :rules="[ { required: true, message: '请上传病假证明', trigger: 'blur' }  ]"
            >
              <base-upload
                :url="uploadUrl"
                :size="5*1024"
                :lowSize="10"
                :exts="fileType"
                btnText="点击上传"
                :isBtn="true"
                @done="finish"
              ></base-upload>
              <div class="upload-tip">支持.bmp .jpeg .jpg .gif .png，大小不超过5M</div>
              <span v-if="leaveform.FILEID">
                <i class="el-icon-paperclip"></i>
                <span :title="fileTitle" class="file-title">{{fileTitle}}</span>
                <i class="el-icon-close del-file" @click="delFile"></i>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('leaveform')">取消</el-button>
        <el-button type="primary" @click="restSubmit('leaveform')">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" :append-to-body="true" class="img-dialog">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import BaseUpload from "@/components/BaseUpload";
import {
  fetchOvertimeList,
  addOvertime,
  fetchRestList,
  InsertRestList,
  getRestHoliday,
  getRestDays
} from "@/api/approval";
import util from "@/utils/util";
import {
  stringDay,
  dataDiffDay,
  getDayAndHour,
  rangeMonth
} from "@/utils/common";

export default {
  components: { BaseUpload },
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
      hourType: ["1", "2", "3", "4", "5", "6"], //年假/例假 5、6 半天/一天     事假/调休/病假/哺乳假 3、2、1、4 小时， 其他按 连续天
      dayType: ["0", "7", "8", "9"],
      overTimeState: ["待审批", "已通过", "被驳回"],
      activeName: "overtime",
      queryDay: rangeMonth(""),
      overtimeData: [],
      restData: [],
      total: 100,
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
        rangeDAY: "",
        DAY: "",
        TYPE: "3",
        REASON: "",
        HOURS: "",
        FILEID: ""
      },
      formLabelWidth: "100px",
      holidayInfo: {
        RESTTIME: "0",
        YEARTIME: "0",
        day: "0",
        hour: "0"
      },
      isFlag: true, //事假时只给出年假和加班时长提醒
      sickChecked: false,
      sickDay: "0",
      fileID: "", //上传图片
      fileType: "bmp|jpeg|jpg|gif|png",
      fileTitle: "",
      uploadUrl: `${window.global.ApiUrl}/fileweb/rest/FileOut/saveFile`,
      remoteOptions: [],
      dialogImageUrl: "",
      imgVisible: false
    };
  },

  computed: {
    allleaveDays: function() {
      let str = "0";
      str = this.leaveform.rangeDAY
        ? dataDiffDay(this.leaveform.rangeDAY[0], this.leaveform.rangeDAY[1])
        : "0";
      if (
        this.sickChecked &&
        Array.isArray(this.leaveform.rangeDAY) &&
        this.leaveform.rangeDAY[1]
      ) {
        this.getSickDay();
        str = this.sickDay;
      }
      return str;
    },
    iSOneDay: function() {
      let isRange =
        this.hourType.includes(this.leaveform.TYPE) && !this.sickChecked;
      return isRange;
    }
  },
  mounted() {
    this.getApplyList();
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },

    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },

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

    //获取病假天数，去除节假日
    getSickDay() {
      let sickday = this.leaveform.rangeDAY;
      let param = {
        data: JSON.stringify({
          STARTDAY: sickday ? stringDay(sickday[0]) : "",
          ENDDAY: sickday ? stringDay(sickday[1]) : ""
        })
      };
      getRestDays(param).then(res => {
        if (res.success) {
          this.sickDay = res.item.DAYS;
        }
      });
    },
    previewFile(fileId) {
      let url = `${window.global.ApiUrl}/fileweb/rest/FileOut/view/${fileId}`;
      this.dialogImageUrl = url;
      this.imgVisible = true;
    },

    // 图片上传完成后 ，新增上传完成后
    finish(res) {
      if (res.success && res.data[0]) {
        this.leaveform.FILEID = res.data[0].ID;
        this.fileTitle = res.data[0].TITLE;
        this.$forceUpdate();
        this.$message({
          type: "success",
          message: "上传成功，并覆盖已上传的文件！"
        });
      }
    },
    delFile() {
      this.fileTitle = "";
      this.leaveform.FILEID = "";
    },
    leaveClose(done) {
      done();
      this.$refs["leaveform"].resetFields();
      this.leaveVisible = false;
    },
    overTimeClose(done) {
      done();
      this.$refs["workform"].resetFields();
      this.overtimeVisible = false;
    },
    handleCancel(fromname) {
      this.$refs[fromname].resetFields();
      this.leaveVisible = false;
      this.overtimeVisible = false;
    },

    //类型改变时,清空数据
    changeSelect(val) {
      this.leaveform.HOURS = "";
      this.leaveform.DAY = "";
      this.leaveform.rangeDAY = "";
      this.leaveform.REASON = "";
      this.leaveform.FILEID = "";
      this.fileTitle = "";
      this.sickChecked = false;
      this.isFlag = true;
    },

    handleQuery() {
      this.getApplyList();
    },
    handleClickTab(tab, event) {
      this.activeName = tab.name;
      this.queryDay = rangeMonth("");
      this.pagesize = 5;
      this.currentPage = 1;
      this.getApplyList();
    },
    // 获取列表数据
    getApplyList() {
      if (this.activeName == "overtime") {
        let param = {
          data: JSON.stringify({
            TYPE: 1,
            STARTTIME: this.queryDay ? this.queryDay[0] : "",
            ENDTIME: this.queryDay ? this.queryDay[1] : ""
          }),
          limit: this.pagesize,
          page: this.currentPage
        };
        fetchOvertimeList(param).then(res => {
          this.total = res.total;
          this.overtimeData = res.items;
        });
      } else {
        let param = {
          data: JSON.stringify({
            USERTYPE: 1, //用户USERTYPE1 管理员USERTYPE2
            NAME: "",
            STARTTIME: this.queryDay ? stringDay(this.queryDay[0]) : "",
            ENDTIME: this.queryDay ? stringDay(this.queryDay[1]) : ""
          }),
          limit: this.pagesize,
          page: this.currentPage
        };
        fetchRestList(param).then(res => {
          this.total = res.total;
          // this.restData = res.items;
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
          this.restData = itemsArr;
        });
      }
    },

    overtimeSubmit(fromname) {
      this.$refs[fromname].validate(valid => {
        if (valid) {
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
              this.$refs[fromname].resetFields();
            }
          });
        }
      });
    },
    restSubmit(fromname) {
      this.$refs[fromname].validate(valid => {
        if (valid) {
          let dayType = this.hourType.includes(this.leaveform.TYPE) ? "1" : "2";
          if (this.leaveform.TYPE == "1" && this.sickChecked) {
            dayType = "2";
          }
          // 加班时长或年假不足时，无法申请调休或年假
          let type =
            this.leaveform.TYPE == "2" &&
            this.leaveform.HOURS > this.holidayInfo.RESTTIME;

          if (
            this.leaveform.TYPE == "2" &&
            this.leaveform.HOURS > this.holidayInfo.RESTTIME
          ) {
            this.$message({
              message: "加班时长不足，无法请假！",
              type: "warning"
            });
            return false;
          }
          if (
            this.leaveform.TYPE == "5" &&
            this.leaveform.HOURS > this.holidayInfo.YEARTIME
          ) {
            this.$message({
              message: "年假不足，无法请假！",
              type: "warning"
            });
            return false;
          }
          let obj;
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
              STARTDAY: stringDay(this.leaveform.rangeDAY[0]),
              ENDDAY: stringDay(this.leaveform.rangeDAY[1]),
              TYPE: this.sickChecked ? "a" : this.leaveform.TYPE,
              REASON: this.leaveform.REASON
            };
          }
          if (this.leaveform.TYPE == "1") {
            obj.FILEID = this.leaveform.FILEID;
            obj.FILENAME = this.fileTitle;
          }

          let param = {
            data: JSON.stringify(obj)
          };
          //请假类型为事假且有余额时，提示
          if (
            this.isFlag &&
            this.leaveform.TYPE == "3" &&
            (this.holidayInfo.RESTTIME > 0 || this.holidayInfo.YEARTIME > 0)
          ) {
            this.$confirm(
              <div style="text-align:left;text-indent:18px">
                <p>
                  {this.holidayInfo.RESTTIME > 0 &&
                    `您拥有加班时长${this.holidayInfo.RESTTIME}小时（可申请调休） `}
                  {this.holidayInfo.RESTTIME > 0 &&
                  (this.holidayInfo.day || this.holidayInfo.hour > 0)
                    ? "，"
                    : ""}
                </p>
                <p>
                  {this.holidayInfo.day || this.holidayInfo.hour > 0
                    ? `您拥有年假${
                        this.holidayInfo.day ? this.holidayInfo.day + "天" : ""
                      } ${
                        this.holidayInfo.hour
                          ? this.holidayInfo.hour + "小时"
                          : ""
                      }`
                    : ""}
                </p>
              </div>,
              "确认要申请事假吗？",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true
              }
            )
              .then(() => {
                this.isFlag = false;
              })
              .catch(() => {
                this.isFlag = false;
              });
          } else {
            this.isFlag = false;
          }
          if (
            (!this.isFlag && this.leaveform.TYPE == "3") ||
            this.leaveform.TYPE !== "3"
          ) {
            InsertRestList(param).then(res => {
              if (res.success) {
                this.$message({
                  message: "请假调休申请成功",
                  type: "success"
                });
                this.getApplyList();
                this.leaveVisible = false;
                this.$refs[fromname].resetFields();
              }
            });
          }
        }
      });
    },
    handleClickWork(row) {
      this.overtimeVisible = true;
    },
    handleClickLeave(row) {
      let param = {
        data: JSON.stringify({
          USERID: "" //管理员传  普通用户为空
        })
      };
      getRestHoliday(param).then(res => {
        if (res.success) {
          this.holidayInfo = res.item;
          this.backDayAndHour(res.item.YEARTIME);
          this.leaveVisible = true;
        }
      });
      this.leaveVisible = true;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getApplyList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currentPage = 1;
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

span.hourTip {
  position: absolute;
  top: -30px;
  left: 58%;
}
span.dayTips {
  line-height: 28px;
  margin-left: 10px;
}
.upload-tip {
  color: #cdcdcd;
  line-height: normal;
  margin-top: 10px;
}
.file-title {
  color: #000;
  opacity: 0.65;
}
.del-file {
  cursor: pointer;
  margin-left: 10px;
}

.img-dialog /deep/ .el-dialog__headerbtn {
  top: 5px;
}
</style>