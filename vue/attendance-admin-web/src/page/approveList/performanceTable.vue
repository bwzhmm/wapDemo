<template>
  <div class="wapper">
    <div class="left-content">
      <div class="table_head">
        <div v-if="showFlag" class="rflex">
          <span>绩效月份：</span>
          <el-date-picker
            v-model="queryMonth"
            type="month"
            placeholder="选择提交月份"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="handleSelectPicker"
            style="width:130px"
            :clearable="false"
          ></el-date-picker>
        </div>

        <h4 v-else>{{ yearMonth}}绩效</h4>
        <el-button
          :disabled="userForm.userData.length?isDisabled:true"
          @click="handleSubmit()"
          type="primary"
          size="small"
        >提交</el-button>
      </div>
      <div class="form-name">
        <div class="tips_box">
          <i class="el-icon-warning"></i>
          <span>考核截止到本月底，请尽快提交。</span>
        </div>

        <el-form
          label-position="right"
          label-width="80px"
          :model="userForm"
          ref="userValidateForm"
          :hide-required-asterisk="true"
        >
          <template v-if="userForm.userData.length">
            <div v-for="(user,index) in  userForm.userData" :key="user.ID+user.NAME">
              <el-form-item
                :label="user.NAME"
                :prop="'userData.' + index + '.curMScore'"
                :rules="[{ required: false, message: '考核分数不能为空', trigger: 'blur'   },
                { pattern: /^\d+\.{0,1}\d{0,1}$/, message: '须为整数或1位小数', trigger: 'blur' } ]"
              >
                <el-input v-model="user.curMScore" :disabled="user.disable"></el-input>
              </el-form-item>
            </div>
          </template>
        </el-form>
      </div>
    </div>
    <div class="right-content">
      <div class="table_head">
        <h4>绩效统计</h4>
        <div>
          <el-date-picker
            class="query-datapicker"
            v-model="curYear"
            type="year"
            placeholder="请选择年"
            value-format="yyyy"
            :picker-options="pickerOptions"
            @change="handleDatePicker"
            :clearable="false"
          ></el-date-picker>
          <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
        </div>
      </div>
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 100%"
        @sort-change="changeSort"
        ref="sortTable"
      >
        <el-table-column prop="NAME" label="姓名" width="110" align="center" fixed="left"></el-table-column>
        <el-table-column
          v-for=" records in monthCol"
          :key="records.key"
          :property="records.key"
          :label="records.label"
          :width="records.width"
          :fixed="records.fixed"
          align="center"
        >
          <template slot-scope="scope">{{getScore(scope)}}</template>
        </el-table-column>
        <el-table-column prop="avg" label="平均分" align="center" fixed="right" sortable="custom"></el-table-column>
        <el-table-column prop="total" label="总计" align="center" fixed="right" sortable="custom"></el-table-column>
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
    </div>
  </div>
</template>
<script>
import { fetchPerformanceList, addPerformance } from "@/api/approval";
import { stringDay, nowMonth, nowYearMonth, tableSort } from "@/utils/common";
const CURMONTH = nowMonth();
const now = new Date();
const yearVal = now.getFullYear();
export default {
  data() {
    return {
      queryMonth: nowYearMonth("-"),
      yearMonth: nowYearMonth("-"),
      queryName: "",
      curYear: yearVal + "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      monthColumn: "",
      userForm: {
        userData: []
      },
      isDisabled: false
    };
  },
  computed: {
    monthCol: function() {
      let now = new Date();
      let curM = now.getMonth() + 1;
      //  之前的年份
      if (this.curYear < yearVal) {
        curM = 12;
      }
      let temp = [];
      for (let i = 1; i <= curM; i++) {
        let m = i < 9 ? `0${i}` : `${i}`;
        temp.push({
          label: this.curYear + "-" + m,
          key: m
        });
      }
      return temp;
    },
    showFlag() {
      let flag = false;
      if (this.$store.state.user.userInfo.ID == "26") {
        flag = true;
      }
      return flag;
    }
  },
  mounted() {
    this.getPerformanceList();
  },
  methods: {
    //  返回每一行的月份对应的分数
    getScore(scope) {
      let performance = scope.row.PERFORMANCE;
      let label = scope.column.property;
      let score = "-";
      if (performance.length) {
        performance.map(item => {
          if (item.MONTH == label) {
            score = item.SCORE;
          }
        });
      }
      return score;
    },

    // 监听事件
    changeSort(column) {
      this.currentPage = 1;
      let sortData = JSON.parse(JSON.stringify(this.tableData));
      this.tableData = tableSort(sortData, column);
    },
    handleSubmit() {
      this.$refs["userValidateForm"].validate(valid => {
        if (valid) {
          let tempArr = JSON.parse(JSON.stringify(this.userForm.userData));
          let hasScore = [],
            noScore = [];
          tempArr.forEach(item => {
            if (item.curMScore) {
              hasScore.push({
                NAME: item.NAME,
                USERID: item.ID,
                SCORE: item.curMScore
              });
            } else {
              noScore.push({
                NAME: item.NAME,
                USERID: item.ID,
                SCORE: item.curMScore
              });
            }
          });
          let selectM = this.queryMonth;
          let curM = this.showFlag ? selectM.split("-")[1] : CURMONTH;
          let param = {
            data: JSON.stringify({
              TYPE: 1, // 录入页面
              YEAR: this.showFlag ? selectM.split("-")[0] : this.curYear,
              MONTH: this.showFlag ? selectM.split("-")[1] : CURMONTH,
              USERS: hasScore
            })
          };
          if (noScore.length) {
            let yearMonth = this.showFlag ? this.queryMonth : this.yearMonth;
            this.$confirm(
              <span style="text-align:left">
                {yearMonth}绩效有{noScore.length}人未提交：
                {noScore.map(item => item.NAME).join("，")}！
              </span>,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true
              }
            )
              .then(() => {
                this.insertPerformance(param);
              })
              .catch(() => {});
          } else {
            this.insertPerformance(param);
          }
        }
      });
    },
    insertPerformance(param) {
      addPerformance(param).then(res => {
        if (res.success) {
          let yearMonth = this.showFlag ? this.queryMonth : this.yearMonth;
          this.$message({
            message: `${yearMonth}绩效提交成功！`,
            type: "success"
          });
          this.getPerformanceList();
          // this.$confirm(`${yearMonth}绩效提交成功！`, "提示", {
          //   confirmButtonText: "确定",
          //   cancelButtonText: "取消",
          //   type: "success",
          //   center: true,
          //   showCancelButton: false
          // }).then(() => {
          //   this.getPerformanceList();
          // });
        }
      });
    },

    // 获取列表数据
    getPerformanceList() {
      let param = {
        data: JSON.stringify({
          TYPE: 1, // 录入页面
          YEAR: this.curYear,
          ORGID: ""
        })
      };
      fetchPerformanceList(param).then(res => {
        if (res.success) {
          this.total = res.items.length;
          this.tableData = res.items;
          let tempList = res ? JSON.parse(JSON.stringify(res.items)) : [];
          let isEqual = this.curYear == this.yearMonth.split("-")[0]; // 查询年与当前年份是否一致
          tempList.forEach(item => {
            if (item.PERFORMANCE.length) {
              item.PERFORMANCE.forEach(m => {
                let selectM = this.queryMonth;
                let curM = this.showFlag ? selectM.split("-")[1] : CURMONTH;
                if (m.MONTH == curM) {
                  item.curMScore = m.SCORE;
                  item.disable = true;
                }
              });
            } else if (!isEqual && !this.showFlag) {
              // 非开放全部日期下，判断年份是否一致
              item.disable = true;
            } else {
              item.curMScore = "";
              item.disable = false;
            }
          });
          this.userForm.userData = tempList;
          this.isDisabled =
            tempList.filter(item => item.disable == true).length > 0
              ? true
              : false;
        }
      });
    },

    // 绩效提交可以按选择日期来，提交
    handleSelectPicker(val) {
      this.currentPage = 1;
      this.getPerformanceList();
    },
    // 年份变化时自动查询
    handleDatePicker(val) {
      this.$refs.sortTable.clearSort();
      this.currentPage = 1;
      this.getPerformanceList();
    },

    handleQuery() {
      this.$refs.sortTable.clearSort();
      this.currentPage = 1;
      this.getPerformanceList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currentPage = 1;
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      // this.getPerformanceList();
    }
  }
};
</script>

<style lang="less" scoped>
.wapper {
  display: flex;
}
.left-content {
  width: 300px;
  padding: 0 20px;
  .el-form-item {
    width: 210px;
  }
  .table_head {
    padding: 20px 0;
    // padding-bottom: 30px;
  }
  .tips_box {
    width: 264px;
    margin: 0 auto 30px;
  }
}
.right-content {
  flex: 1;
}
.table_head {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 15px;
}
.query-datapicker {
  width: 180px;
  display: inline-block;
  margin-right: 20px;
}
.form-name {
  max-height: 749px;
  overflow-y: auto;
}
.form-name::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.form-name::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); /*opera或ie9*/
  -moz-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); /*firefox*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); /*webkit*/
  background: #f8f8f8;
}

.form-name::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  display: none;
}
</style>