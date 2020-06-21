<template>
  <section class="data_section">
    <el-row class="row_list">
      <el-col :span="12" :offset="6">
        <attendance-head></attendance-head>
      </el-col>
    </el-row>
    <el-row class="row_list">
      <el-col :span="12" :offset="6">
        <attendance-record></attendance-record>
      </el-col>
    </el-row>
    <el-row class="row_list">
      <el-col :span="12 " :offset="6">
        <apply-table></apply-table>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import applyTable from "./components/applyTable"; // 申请表格：加班申请、请假调休
import attendanceRecord from "./components/attendanceRecord"; // 考勤记录
import attendanceHead from "./components/attendanceHead"; // 考勤头部信息

export default {
  data() {
    return {};
  },
  components: {
    applyTable,
    attendanceRecord,
    attendanceHead
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.data_section {
  margin: 20px;
  border-radius: 2px;
  .row_list {
    margin-bottom: 20px;
    .row_base {
      padding: 10px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 6px;
      height: 120px;
    }
  }
}
</style>
