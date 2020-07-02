<template>
  <div>
    <div class="table_head">
      <h4>离职管理</h4>
      <div>
        <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名"></el-input>
        <el-select class="query-datapicker" v-model="depvalue" placeholder="请选择部门">
          <el-option v-for="item in depOptions" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
        <el-divider class="divider" direction="vertical"></el-divider>
        <el-button @click="handleLeaveWork()" type="primary" size="small" icon="el-icon-plus">办理离职</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="ORGNAME" label="部门" align="center">
        <template slot-scope="scope">{{ scope.row.ORGNAME||'-'}}</template>
      </el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center"></el-table-column>
      <el-table-column prop="SEX" label="性别" align="center">
        <template slot-scope="scope">{{ scope.row.SEX=='2'?"女":'男'}}</template>
      </el-table-column>
      <el-table-column prop="BIRTHDAY" label="出生日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.BIRTHDAY)||'-'}}</template>
      </el-table-column>
      <el-table-column prop="ENTRYDAY" label="入职日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.ENTRYDAY)||'-'}}</template>
      </el-table-column>
      <el-table-column prop="QUITDAY" label="离职日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.QUITDAY)||'-'}}</template>
      </el-table-column>
      <el-table-column prop="REASON" label="离职原因" align="center" width="260"></el-table-column>
      <el-table-column prop="PHONE_SELF" label="个人电话" align="center">
        <template slot-scope="scope">{{ scope.row.PHONE_SELF||'-'}}</template>
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
    <el-dialog title="办理离职" :visible.sync="dialogVisible" width="800px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>提交后所选员工将进入已离职状态，从员工管理列表中删除。</span>
      </div>
      <el-form :model="staffList" ref="staffForm">
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="离职员工:"
              :label-width="formLabelWidth"
              prop="name"
              :rules="[ { required: true, message: '请输入姓名查找', trigger: 'blur' }  ]"
            >
              <el-autocomplete
                v-model="staffList.name"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入姓名查找"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="离职日期:"
              :label-width="formLabelWidth"
              prop="DAY"
              :rules="[ { required: true, message: '请选择离职日期', trigger: 'blur' }  ]"
            >
              <el-date-picker
                v-model="staffList.DAY"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="离职原因:"
              :label-width="formLabelWidth"
              prop="checkList"
              :rules="[ { required: true, message: '请选择离职原因', trigger: 'blur' }  ]"
            >
              <span class="opacity_65 graybox">主动原因</span>
              <el-checkbox-group v-model="staffList.checkList">
                <el-checkbox label="家庭原因"></el-checkbox>
                <el-checkbox label="个人原因"></el-checkbox>
                <el-checkbox label="发展原因"></el-checkbox>
                <el-checkbox label="合同到期不续签"></el-checkbox>
                <el-checkbox label="其他"></el-checkbox>
                <span class="opacity_65 graybox">被动原因</span>
                <el-checkbox label="协议解除"></el-checkbox>
                <el-checkbox label="无法胜任工作"></el-checkbox>
                <el-checkbox label="经济性裁员"></el-checkbox>
                <el-checkbox label="严重违法违纪"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitLeaveWork">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addResign, fetchResignList, fetchUserList } from "@/api/user";
import { fetchOrgList } from "@/api/auth";
import { stringDay } from "@/utils/common";
import util from "@/utils/util";
export default {
  data() {
    return {
      selectUser: {},
      timeout: null,
      depOptions: [],
      depvalue: "",
      queryName: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      dialogVisible: false,
      staffList: {
        checkList: [],
        USERID: "",
        name: "",
        DAY: ""
      },
      formLabelWidth: "100px"
    };
  },

  mounted() {
    fetchOrgList().then(res => {
      this.depOptions = res.items;
    });
    this.getQuitUserList();
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },
    // input边输入边查询人员
    querySearchAsync(queryString, cb) {
      console.log("queryString", queryString);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let param = {
          data: JSON.stringify({
            STATUS: "1",
            ORGID: "",
            NAME: queryString
          }),
          limit: this.pagesize,
          page: this.currentPage
        };
        fetchUserList(param).then(res => {
          let tempData = res.items.map(item => {
            return { value: item.NAME, id: item.ID };
          });
          console.log("tempData", tempData);
          cb(tempData);
        });
      }, 10 * Math.random());
    },

    handleSelect(item) {
      this.selectUser = item;
    },
    handleLeaveWork() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs.staffForm.resetFields();
    },

    submitLeaveWork(row) {
      this.$refs["staffForm"].validate(valid => {
        if (valid) {
          let param = {
            data: JSON.stringify({
              USERID: this.selectUser.id,
              DAY: stringDay(this.staffList.DAY) || "",
              REASON: this.staffList.checkList.join("/")
            })
          };
          addResign(param).then(res => {
            if (res.success) {
              this.getQuitUserList();
              this.dialogVisible = false;
              this.$refs.staffForm.resetFields();
            }
          });
        }
      });
    },

    getQuitUserList() {
      let param = {
        data: JSON.stringify({
          STATUS: 2,
          ORGID: this.depvalue,
          NAME: this.queryName
        }),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchResignList(param).then(res => {
        this.total = res.total;
        this.tableData = res.items;
      });
    },

    handleQuery() {
      this.currentPage = 1;
      this.getQuitUserList();
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getQuitUserList();
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
.query-datapicker {
  width: 180px;
  display: inline-block;
  margin-right: 20px;
}
.query-picker {
  width: 200px;
  display: inline-block;
  margin-right: 20px;
}
.graybox {
  padding: 5px 10px;
  margin-bottom: 10px;
  border-radius: 2px;
  width: 100%;
  display: block;
  background-color: rgba(0, 0, 0, 0.04);
}
</style>