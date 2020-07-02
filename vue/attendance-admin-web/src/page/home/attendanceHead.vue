
<template>
  <div class="month-box rflex">
    <div class="month-left cflex">
      <h3 class="h3-text">{{today}}</h3>
      <span class="opacity_65">- {{NowChMonth}} -</span>
      <span class="blueColor">{{ISWORKDAY =='1' ? '工作日':'非工作日'}}</span>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div class="month-center">
      <p class="month-info">
        <span>本月应出勤{{personInfo.WORKDAYS}}天</span>
        <span>本月请假{{backDayAndHour(personInfo.RESTHOURS)}}</span>
        <span>调休余额{{backDayAndHour(personInfo.RESTTIME)}}</span>
      </p>
      <p class="month-info">
        <span>本月已出勤{{personInfo.ACTUALDAY}}天</span>
        <span>本月加班{{backDayAndHour(personInfo.OVERTIMEHOURS)}}</span>
        <span>年假余额{{backDayAndHour(personInfo.YEARTIME)}}</span>
      </p>
    </div>
    <div class="month-right cflex opacity_65">
      <span>绩效考核</span>
      <span v-if="SCORE" class="score-text">{{SCORE}}</span>
      <el-divider v-else></el-divider>
      <span class="month-arrow">
        <i class="el-icon-arrow-left" @click="getPreMonth('-')"></i>
        {{curYearMonth}}
        <i
          class="el-icon-arrow-right"
          @click="getNextMonth('+')"
          v-show="showRight"
        ></i>
      </span>
    </div>
  </div>
</template>

<script>
import { fetchTodayInfo, fetchPersonalRecord } from "@/api/record";
import {
  getDayAndHour,
  nowYearMonth,
  nowChMonth,
  prevMonth
} from "@/utils/common";

export default {
  data() {
    return {
      ISWORKDAY: "1", // 1是工作日 0非工作日
      personInfo: {
        ACTUALDAY: "",
        OVERTIMEHOURS: "",
        RESTTIME: "",
        YEARTIME: "",
        WORKDAYS: "",
        RESTHOURS: ""
      },
      SCORE: "",
      curYearMonth: nowYearMonth(".")
    };
  },
  computed: {
    today: function() {
      let nowDate = new Date();
      let day = nowDate.getDate();
      console.log("month", day);

      return day;
    },
    NowChMonth: function() {
      return nowChMonth();
    },
    showRight: function() {
      let nowday = nowYearMonth("");
      let showday = this.curYearMonth.replace(".", "");
      let flag = showday < nowday ? true : false;
      return flag;
    }
  },
  mounted() {
    this.getTodayList();
  },
  methods: {
    backDayAndHour(hour) {
      return getDayAndHour(hour);
    },
    getPersonInfo(flag) {
      let param = {
        data: JSON.stringify({
          MONTH: this.curYearMonth.replace(/\./g, "")
        })
      };
      //首页上方个人考勤信息  小时
      fetchPersonalRecord(param).then(res => {
        if (res.success) {
          if (flag) {
            this.SCORE = (res && res.item.SCORE) || "";
          } else {
            this.personInfo = res.item;
          }
          // console.log("personInfo", res.item);
        }
      });
    },
    getTodayList() {
      //首页左上角 今日考勤状态
      fetchTodayInfo().then(res => {
        this.ISWORKDAY = res && res.item.ISWORKDAY;
      });
      this.getPersonInfo(false);
    },
    getPreMonth(type) {
      let strday = this.prevMonth(this.curYearMonth);
      this.curYearMonth = strday;
      this.getPersonInfo(true);
      // console.log("123333", this.curYearMonth);
    },
    getNextMonth() {
      let strday = this.nextMonth(this.curYearMonth);
      this.curYearMonth = strday;
      this.getPersonInfo(true);
      // console.log("124444", this.curYearMonth);
    },
    // 前一个月
    prevMonth(date) {
      let arr = date.split(".");
      let year = arr[0]; //获取当前日期的年份
      let month = arr[1]; //获取当前日期的月份
      let year2 = year;
      let month2 = parseInt(month) - 1;
      if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }
      let t2 = year2 + "." + month2;
      return t2;
    },

    //后一个月
    nextMonth(date) {
      let arr = date.split(".");
      let year = arr[0]; //获取当前日期的年份
      let month = arr[1]; //获取当前日期的月份
      let year2 = year;
      let month2 = parseInt(month) + 1;
      if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }
      let t2 = year2 + "." + month2;
      return t2;
    }
  }
};
</script>

<style lang="less" scoped>
.month-box {
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
  height: 180px;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
  .el-divider--vertical {
    height: 6em;
    width: 2px;
    color: #ededed;
  }
  .month-left,
  .month-right {
    width: 140px;
    height: 140px;
    line-height: 25px;
    align-items: center;
    justify-content: center;
  }
  .month-right {
    background-color: #f0f0f0;
    .el-divider--horizontal {
      width: 20px;
      height: 2px;
      background-color: #1890ff;
    }
  }
  .h3-text {
    font-size: 32px;
    font-weight: 400;
    width: 39px;
    height: 45px;
    line-height: 45px;
  }
}
.month-info {
  line-height: 40px;
  span {
    margin: 0 30px;
    width: 135px;
    display: inline-block;
  }
}

.blue-line {
  width: 20px;
}
.month-arrow {
  cursor: pointer;
}
.score-text {
  color: #1890ff;
  line-height: 2px;
  margin: 24px 0;
}
</style>

