<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="left-content">
          <div class="table_head">
            <h4>{{ yearMonth}}绩效</h4>
            <el-button
              v-show="!userForm.userData[0].disable"
              @click="handleSubmit()"
              type="primary"
              size="small"
            >提交</el-button>
          </div>
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
            <div v-for="(user,index) in  userForm.userData" :key="user.ID+user.NAME">
              <el-form-item
                :label="user.NAME"
                :prop="'userData.' + index + '.curMScore'"
                :rules="[{ required: true, message: '考核分数不能为空', trigger: 'blur'   },
                { pattern:/^(\d{1}|10)$/, message: '只能输入 0 ~ 10 的数字', trigger: 'blur' } ]"
              >
                <el-input v-model="user.curMScore" :disabled="user.disable"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="18">
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
              ></el-date-picker>
              <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
            </div>
          </div>
          <el-table :data="tableData" style="width: 100%">
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
          </el-table>
        </div>
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetchPerformanceList, addPerformance } from "@/api/approval";
import { stringDay, nowMonth, nowYearMonth } from "@/utils/common";
const CURMONTH = nowMonth();
const now = new Date();
const yearVal = now.getFullYear();
console.log("yearVal", yearVal);
export default {
  data() {
    return {
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
        userData: [
          {
            curMScore: "1",
            ID: ""
          }
        ]
      }
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
      temp.push(
        {
          label: "平均分",
          key: "average",
          fixed: "right"
        },
        {
          label: "总计",
          key: "total",
          fixed: "right"
        }
      );
      return temp;
    }
  },
  mounted() {
    this.getPerformanceList();
  },
  methods: {
    //  返回每一行的月份对应的分数，计算平均分和总分
    getScore(scope) {
      let d = new Date();
      let m = d.getMonth() + 1;
      let performance = scope.row.PERFORMANCE;
      let label = scope.column.property;
      let score = "-",
        total = 0;
      if (performance.length) {
        performance.map(item => {
          total += item.SCORE;
          if (item.MONTH == label) {
            score = item.SCORE;
          }
        });
        if (label == "total") {
          score = total;
        }
        if (label == "average") {
          score = (total / m).toFixed(1);
        }
      }
      return score;
    },

    handleSubmit() {
      this.$refs["userValidateForm"].validate(valid => {
        if (valid) {
          let tempArr = JSON.parse(JSON.stringify(this.userForm.userData));
          let tempData = tempArr.map(item => {
            return { USERID: item.ID, SCORE: item.curMScore };
          });
          let param = {
            data: JSON.stringify({
              TYPE: 1, // 录入页面
              YEAR: `$yearVal`,
              MONTH: "01",
              USERS: tempData
            })
          };
          addPerformance(param).then(res => {
            if (res.success) {
              this.$confirm("2020年05月绩效提交成功！", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "success",
                center: true,
                showCancelButton: false
              }).then(() => {});
            }
          });
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
        }),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchPerformanceList(param).then(res => {
        this.total = res.total;
        this.tableData = res.items;
        let tempList = JSON.parse(JSON.stringify(res.items));
        tempList.forEach(item => {
          if (item.PERFORMANCE.length) {
            item.PERFORMANCE.forEach(m => {
              if (m.MONTH == "01") {
                item.curMScore = m.SCORE;
                item.disable = true;
              }
            });
          } else {
            item.curMScore = "";
            item.disable = false;
          }
        });
        this.userForm.userData = tempList;
      });
    },
    // 年份变化时自动查询
    handleDatePicker(val) {
      this.getPerformanceList();
    },

    handleQuery() {
      this.getPerformanceList();
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getPerformanceList();
    }
  }
};
</script>

<style lang="less" scoped>
.left-content {
  width: 300px;
  padding: 0 20px;
  .el-form-item {
    width: 210px;
  }
  .table_head {
    padding: 20px 0;
  }
  .tips_box {
    width: 264px;
    margin: 0 auto 30px;
  }
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
.pagination {
  background: #fff;
  text-align: right;
  padding: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.6) !important;
}
p:last-child {
  margin-bottom: 50px;
}
</style>