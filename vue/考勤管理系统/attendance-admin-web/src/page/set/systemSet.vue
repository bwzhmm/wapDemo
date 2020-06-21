<template>
  <div>
    <div class="table_head">
      <h4>系统设置</h4>
    </div>
    <div class="systemBox">
      <div class="title">
        <span class="opacity_65">年假设置</span>
      </div>
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>员工入职满一年后享受年休假，其中入职1~10年，年假5天；11~20年，年假10天；满20年，年假15天。</span>
      </div>

      <el-form :model="setForm" status-icon label-width="100px" class="demo-setForm">
        <el-form-item label="清零时间：" :label-width="formLabelWidth">
          每年
          <el-date-picker
            v-model="setForm.CFG.YEARCLEANDAY"
            type="date"
            format=" MM-dd "
            value-format="MMdd"
            placeholder="选择日期"
            class="picker_width140"
          ></el-date-picker>
          <span class="opacity_25 mg_left10">包括年假、调休假期</span>
        </el-form-item>

        <label class="el-form-item__label" style="width: 120px;">年假扣除：</label>
        <el-form-item>
          <!-- <el-form-item label="年假扣除：" prop="YEAR" :label-width="formLabelWidth"> -->
          <el-button @click="handleAnnualLeave()">添加</el-button>
          <el-table :data="setForm.YEAR" class="mg_tab">
            <el-table-column prop="DAY" label="日期">
              <template slot-scope="scope">{{formatDay(scope.row.DAY)}}</template>
            </el-table-column>
            <el-table-column prop="DES" label="扣除说明"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <div class="title">
        <span class="opacity_65">考勤设置</span>
      </div>
      <el-form :model="setForm" status-icon label-width="100px" class="demo-setForm">
        <el-form-item label="特殊日期：" :label-width="formLabelWidth">
          <!--  必须打卡的日期 -->
          <el-date-picker
            v-model="setForm.needDate"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期"
            class="picker_width140"
          ></el-date-picker>
          <el-button @click="addSpecialDate(true)">添加</el-button>
          <span class="opacity_25 mg_left10">必须打卡的日期，默认每周一至周五</span>
          <el-table :data="needDateList" class="mg_tab">
            <el-table-column prop="DATE" label="日期" width="180">
              <template slot-scope="scope" v-if="scope.row.STATE==='0'">{{scope.row.DATE}}</template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--  不用打卡的日期 -->
          <el-date-picker
            v-model="setForm.noNeedDate"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择"
            class="picker_width140"
          ></el-date-picker>
          <el-button @click="addSpecialDate(false)">添加</el-button>
          <span class="opacity_25 mg_left10">不用打卡的日期，默认每周六、日</span>
          <el-table :data="noNeedDateList" class="mg_tab">
            <el-table-column prop="DATE" label="日期" width="180">
              <template slot-scope="scope" v-if="scope.row.STATE==='1'">{{scope.row.DATE}}</template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-row>
          <el-col :span="8">
            <el-form-item label="上班时间：" :label-width="formLabelWidth">
              <el-time-select
                v-model="setForm.CFG.STARTTIME"
                class="picker_width100"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
              ></el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最迟：" :label-width="formLabelWidth">
              <el-time-select
                v-model="setForm.CFG.STARTTIME_LATEST"
                class="picker_width100"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30',
                 minTime: setForm.CFG.STARTTIME
                }"
              ></el-time-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="不参与考勤：" prop="outUser" :label-width="formLabelWidth">
          <el-select
            v-model="setForm.outUser"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入姓名查找"
            :remote-method="querySearchAsync"
            :loading="loading"
            style="width:100%"
            class="select-user"
          >
            <el-option
              v-for="item in selectUsers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('setForm')">提交</el-button>
          <el-button @click="resetForm('setForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="年假扣除" :visible.sync="annualVisible" width="600px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>没有年假或年假余额不足，按调休、事假顺序扣除。</span>
      </div>
      <el-form :model="annualForm" ref="annualForm">
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="调休日期:"
              :label-width="formLabelWidth"
              prop="date"
              :rules="[ { required: true, message: '请选择调休日期', trigger: 'blur' }  ]"
            >
              <el-date-picker
                v-model="annualForm.date"
                type="dates"
                value-format="yyyyMMdd"
                placeholder="选择日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="扣除说明:"
              :label-width="formLabelWidth"
              prop="desc"
              :rules="[ { required: true, message: '请输入说明，不超过200字', trigger: 'blur' }  ]"
            >
              <el-input type="textarea" :autosize="{minRows:2,maxRow:4}" v-model="annualForm.desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="annualVisible=false">取消</el-button>
        <el-button type="primary" @click="submitAnnual">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList } from "@/api/user";
import { fetchSets, saveSets } from "@/api/auth";
import { stringDay, formatStr, formatTimeStr } from "@/utils/common";
import util from "@/utils/util";
export default {
  data() {
    return {
      selectUsers: [],
      loading: false,
      annualVisible: false,
      addSpecialVisible: false,
      annualForm: {
        date: "",
        desc: ""
      },
      formLabelWidth: "120px",
      setForm: {
        CFG: {
          YEARCLEANDAY: "12-31", // 年假清零日期
          STARTTIME: "10:30", // 上班时间
          STARTTIME_LATEST: "08:45" // 最迟打卡时间
        },
        YEAR: [
          {
            DAY: ["20160502", "20160501"],
            DES: "王小虎"
          }
        ],
        needDate: "",
        noNeedDate: "",
        SPECIALDAY: [
          {
            DATE: "20200502",
            STATE: "0"
          }
        ],
        outUser: "" // 不用打卡的人
      }
    };
  },
  computed: {
    needDateList: function() {
      let newArr = this.setForm.SPECIALDAY.filter(item => item.STATE == "0");
      return newArr;
    },
    noNeedDateList: function() {
      let newArr = this.setForm.SPECIALDAY.filter(item => item.STATE == "1");
      return newArr;
    }
  },
  mounted() {
    this.getSetList();
  },
  methods: {
    formatDay(data) {
      if (Array.isArray(data)) {
        data = data.map(day => {
          day = util.formatTime(day, "YYYY-MM-DD");
          return day;
        });
        data = data.join("、");
      }
      return data;
    },

    getSetList() {
      fetchSets().then(res => {
        let setData = JSON.parse(JSON.stringify(res.item));
        // 格式化为相应格式
        setData.CFG.YEARCLEANDAY = formatStr(setData.CFG.YEARCLEANDAY, "-");
        setData.CFG.STARTTIME = formatStr(setData.CFG.STARTTIME, ":");
        setData.CFG.STARTTIME_LATEST = formatStr(
          setData.CFG.STARTTIME_LATEST,
          ":"
        );
        //  不参与打卡人 的下拉框初始值
        let tempData = setData.UNUSE.map(item => {
          return { label: item.NAME, value: item.ID };
        });
        setData.outUser = tempData.map(item => item.value);

        console.log("tempData", tempData);
        this.selectUsers = tempData;

        console.log("setData", setData);
        // this.setForm = setData;
      });
    },

    handleAnnualLeave() {
      this.annualVisible = true;
    },

    // 提交年假
    submitAnnual() {
      this.$refs["annualForm"].validate(valid => {
        if (valid) {
          this.setForm.YEAR.push({
            DAY: this.annualForm.date,
            DES: this.annualForm.desc
          });
          this.annualVisible = false;
          this.$refs["annualForm"].resetFields();
        }
      });
    },

    // 考勤 添加打卡日期
    addSpecialDate(type) {
      let specialDay = type
        ? this.setForm.needDate || ""
        : this.setForm.noNeedDate || "";

      //   console.log("flag", flag);
      if (specialDay) {
        let curArr = this.setForm.SPECIALDAY.map(item => item.DATE);
        let flag = curArr.some(item => item == specialDay);
        if (flag) {
          this.$message({
            message: "日期不能重复！",
            type: "warning"
          });
          return;
        }
        this.setForm.SPECIALDAY.push({
          DATE: specialDay,
          STATE: type ? "0" : "1"
        });
      } else {
        let str = type ? "" : "不";
        this.$message({
          message: "要添加的" + str + "必须打卡日期不能为空！",
          type: "warning"
        });
      }
      this.addSpecialVisible = true;
    },

    handleDelete(row) {
      let curArr = this.setForm.SPECIALDAY.filter(
        item => item.DATE !== row.DATE
      );
      this.setForm.SPECIALDAY = curArr;
      console.log("tttt", curArr);
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submitForm(formName) {
      console.log("tttt333", this.setForm);
      let CFG = JSON.parse(JSON.stringify(this.setForm.CFG));
      CFG.STARTTIME = formatTimeStr(CFG.STARTTIME);
      CFG.STARTTIME_LATEST = formatTimeStr(CFG.STARTTIME_LATEST);

      let param = {
        data: JSON.stringify({
          CFG: CFG, // 录入页面
          YEAR: this.setForm.YEAR,
          SPECIALDAY: this.setForm.SPECIALDAY,
          UNUSE: this.setForm.outUser
        })
      };
      console.log("param", param);
      saveSets(param).then(res => {
        if (res.success) {
          this.$message({
            message: "提交成功！",
            type: "success"
          });
        } else {
          this.$message.error("提交失败，请重试！");
        }
      });
    },

    querySearchAsync(queryString, cb) {
      console.log("queryString", queryString);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let param = {
          data: JSON.stringify({
            STATUS: "",
            ORGID: "",
            NAME: queryString || ""
          }),
          limit: 10,
          page: 1
        };
        fetchUserList(param).then(res => {
          let tempData = res.items.map(item => {
            return { label: item.NAME, value: item.ID };
          });
          this.selectUsers = tempData;
        });
      }, 1000 * Math.random());
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
.systemBox {
  width: 800px;
  .tips_box {
    margin: 0 30px 30px;
    width: 100%;
  }
}
.title {
  border-left: 3px solid #38adff;
  padding: 0 10px;
  margin: 0 20px 20px;
}
.picker_width140 {
  width: 140px;
  margin-right: 10px;
}
.picker_width100 {
  width: 120px;
  margin-right: 10px;
}
.mg_tab {
  width: 100%;
  margin: 20px auto 30px;
}
.select-user /deep/ .el-tag.el-tag--info {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}
.select-user /deep/ .el-tag.el-tag--info .el-tag__close {
  color: #40a9ff;
  background-color: transparent;
}
.select-user /deep/ .el-select .el-tag__close.el-icon-close {
  background-color: transparent;
}
.select-user /deep/ .el-tag.el-tag--info .el-tag__close:hover {
  color: #fff;
  background-color: #409eff;
}
</style>