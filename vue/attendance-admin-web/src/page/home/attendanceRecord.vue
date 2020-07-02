<template>
  <div>
    <div class="table_head">
      <h4>考勤记录</h4>
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
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="DAY" label="日期" width="110" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.DAY)}}</template>
      </el-table-column>
      <el-table-column prop="CHECKTIME" label="打卡时间" width="100" align="center">
        <template slot-scope="scope">{{ formatStrTime(scope.row.CHECKTIME)||'-'}}</template>
      </el-table-column>
      <el-table-column prop="CHECKRESULT_OLD" label="原考勤结果" width="100" align="center">
        <template slot-scope="scope">{{ checkState[scope.row.CHECKRESULT_OLD] ||'-'}}</template>
      </el-table-column>
      <el-table-column prop="CHECKRESULT_NEW" label="调整结果" width="100" align="center">
        <template slot-scope="scope">{{ checkState[scope.row.CHECKRESULT_NEW] || '-'}}</template>
      </el-table-column>
      <el-table-column prop="EXPLANATION" label="情况说明" width="350" align="center">
        <template slot-scope="scope">{{ scope.row.EXPLANATION||'-'}}</template>
      </el-table-column>
      <el-table-column prop="APPLYSTATE" label="申请状态" width="80" align="center">
        <template slot-scope="scope">{{ applyState[scope.row.APPLYSTATE]||'-'}}</template>
      </el-table-column>
      <el-table-column prop="OVERTIME" label="加班时长（h）" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.OVERTIME||'-'}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            v-if="(scope.row.APPLYSTATE=='0' || scope.row.APPLYSTATE=='3')"
          >异常申请</el-button>
          <el-button
            class="opacity_65"
            type="text"
            size="small"
            v-else
          >{{scope.row.ISWORKDAY=='0'?"" :"已经确认" }}</el-button>
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
    <el-dialog title="异常申请" :visible.sync="dialogVisible" width="700px">
      <el-form :model="applyForm" ref="applyForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="考勤日期:" :label-width="formLabelWidth">
              <el-date-picker
                v-model="applyForm.DAY"
                format="yyyy-MM-dd"
                value-format="yyyyMMdd"
                type="date"
                :disabled="true"
                placeholder="选择日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="考勤结果:" :label-width="formLabelWidth">
              <el-select v-model="applyForm.CHECKRESULT_OLD" :disabled="true">
                <el-option label="正常" value="1"></el-option>
                <el-option label="迟到" value="2"></el-option>
                <el-option label="旷工" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="调整结果:"
              :label-width="formLabelWidth"
              prop="CHECKRESULT_NEW"
              :rules="[ { required: true, message: '请选择调整结果', trigger: 'blur' } ]"
            >
              <el-select v-model="applyForm.CHECKRESULT_NEW" placeholder="请选择调整结果">
                <el-option label="正常" value="1"></el-option>
                <el-option label="迟到" value="2"></el-option>
                <el-option label="旷工" value="3"></el-option>
                <!-- <el-option label="旷工(半天)" value="2"></el-option>
                <el-option label="旷工(一天)" value="3"></el-option>-->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="情况说明:"
              :label-width="formLabelWidth"
              prop="EXPLANATION"
              :rules="[ { required: true, message: '请填写情况说明', trigger: 'blur' }  ]"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows:3, maxRows:6}"
                v-model="applyForm.EXPLANATION"
                placeholder="请输入情况说明，不超过200字"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchRecordList, fetchRecordById, abnormalApply } from "@/api/record";
import util from "@/utils/util";
import { formatStr, rangeMonth } from "@/utils/common";

export default {
  data() {
    return {
      checkState: ["", "正常", "迟到", "旷工"],
      applyState: ["未申请", "待审批", "已通过", "被驳回"],
      queryDay: rangeMonth(""),
      tableData: [],
      total: 0,
      pagesize: 5,
      currentPage: 1,
      dialogVisible: false,
      applyForm: {
        DAY: "2020-05-25",
        EXPLANATION: "123",
        CHECKRESULT_OLD: "旷工1",
        CHECKRESULT_NEW: "2"
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {
    this.getRecordList();
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatStrTime(time) {
      return time ? formatStr(time, ":", true) : "";
    },
    // 获取列表数据
    getRecordList() {
      let param = {
        data: JSON.stringify({
          TYPE: 1,
          DAY: "",
          NAME: "",
          STARTTIME: this.queryDay ? this.queryDay[0] : "",
          ENDTIME: this.queryDay ? this.queryDay[1] : ""
        }),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchRecordList(param).then(res => {
        this.total = res.total;
        this.tableData = res.items;
      });
    },
    handleQuery() {
      this.getRecordList();
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
    handleSubmit() {
      this.$refs["applyForm"].validate(valid => {
        if (valid) {
          console.log("www", this.applyForm);
          let param = {
            data: JSON.stringify({
              ID: this.applyForm.ID,
              EXPLANATION: this.applyForm.EXPLANATION,
              CHECKRESULT_NEW: this.applyForm.CHECKRESULT_NEW
            })
          };
          abnormalApply(param).then(res => {
            if (res.success) {
              this.$message({
                message: "异常申请成功",
                type: "success"
              });
              this.getRecordList();
              this.dialogVisible = false;
            }
          });
        }
      });
    },

    handleCancel() {
      this.$refs["applyForm"].resetFields();
      this.dialogVisible = false;
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getRecordList();
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
.date-picker {
  width: 292px;
  margin-right: 20px;
}
</style>