<template>
  <section class="data_section">
    <div class="row_list">
      <attendance-head></attendance-head>
    </div>
    <div class="row_list">
      <attendance-record></attendance-record>
    </div>
    <div class="row_list">
      <apply-table></apply-table>
    </div>
  </section>
</template>

<script>
import applyTable from "./applyTable"; // 申请表格：加班申请、请假调休
import attendanceRecord from "./attendanceRecord"; // 考勤记录
import attendanceHead from "./attendanceHead"; // 考勤头部信息

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
    width: 1080px;
    margin: 0 auto;
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
