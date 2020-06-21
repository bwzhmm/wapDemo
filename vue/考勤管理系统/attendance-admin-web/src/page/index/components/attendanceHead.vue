
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
        <span>本月请假{{personInfo.RESTHOURS}}小时</span>
        <span>调休余额{{personInfo.RESTTIME}}小时</span>
      </p>
      <p class="month-info">
        <span>本月已出勤{{personInfo.ACTUALDAY}}天</span>
        <span>本月加班{{personInfo.OVERTIMEHOURS}}小时</span>
        <span>年假余额{{personInfo.YEARTIME}}天</span>
      </p>
    </div>
    <div class="month-right cflex opacity_65">
      <span>绩效考核</span>
      <el-divider></el-divider>
      <span @click="getPreMonth()" class="month-arrow">
        <i class="el-icon-arrow-left"></i>
        {{curYearMonth}}
      </span>
    </div>
  </div>
</template>

<script>
import { fetchTodayInfo, fetchPersonalRecord } from "@/api/record";
import { stringDay, nowYearMonth, nowChMonth, prevMonth } from "@/utils/common";

export default {
  data() {
    return {
      ISWORKDAY: "1", // 1是工作日 2非工作日
      personInfo: {
        ACTUALDAY: "10",
        SCORE: "10",
        OVERTIMEHOURS: "2",
        RESTTIME: "1",
        YEARTIME: "2",
        WORKDAYS: "21",
        RESTHOURS: "2"
      },
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
    }
  },
  mounted() {
    this.getTodayList();
  },
  methods: {
    getPersonInfo() {
      let param = {
        data: JSON.stringify({
          MONTH: this.curYearMonth.replace(/\./g, "")
        })
      };
      //首页上方个人考勤信息  小时
      fetchPersonalRecord(param).then(res => {
        console.log("123333", res);
        this.personInfo = res.item;
      });
    },
    getTodayList() {
      //首页左上角 今日考勤状态
      fetchTodayInfo().then(res => {
        this.ISWORKDAY = res.item.ISWORKDAY;
      });
      this.getPersonInfo();
    },
    getPreMonth() {
      let strday = this.prevMonth(this.curYearMonth);
      this.curYearMonth = strday;
      this.getPersonInfo();
      console.log("123333", this.curYearMonth);
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
    width: 130px;
    display: inline-block;
  }
}

.blue-line {
  width: 20px;
}
.month-arrow {
  cursor: pointer;
}
</style>

