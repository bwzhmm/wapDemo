<template>
  <div>
    <div class="table_head">
      <h4>员工管理</h4>
      <div>
        <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名"></el-input>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="ORGID" label="部门" align="center"></el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center"></el-table-column>
      <el-table-column prop="SEX" label="性别" align="center"></el-table-column>
      <el-table-column prop="BIRTHDAY" label="出生日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.BIRTHDAY)}}</template>
      </el-table-column>
      <el-table-column prop="ENTRYDAY" label="入职日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.ENTRYDAY)}}</template>
      </el-table-column>

      <el-table-column prop="ENTRYDAY" label="司龄" align="center">
        <template slot-scope="scope">{{ getYears(scope.row.ENTRYDAY)}}</template>
      </el-table-column>
      <el-table-column prop="PHONE_OFFICE" label="公司电话" align="center"></el-table-column>
      <el-table-column prop="PHONE_SELF" label="个人电话" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
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
    <el-dialog title="编辑员工" :visible.sync="dialogVisible" width="600px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>
          新增账号默认密码为
          <i class="blueColor">123456</i>。
        </span>
      </div>
      <el-form :model="staffList" ref="staffForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="部门:" :label-width="formLabelWidth" prop="dep">
              <el-select v-model="staffList.dep" placeholder="请选择部门">
                <el-option
                  v-for="item in depOptions"
                  :key="item.ID"
                  :label="item.NAME"
                  :value="item.ID"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="登录账号:"
              :label-width="formLabelWidth"
              prop="LOGINNAME"
              :rules="[ { required: true, message: '请填写登录账号', trigger: 'blur' }  ]"
            >
              <el-input v-model="staffList.LOGINNAME" placeholder="请输入登录账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="出生日期:"
              :label-width="formLabelWidth"
              prop="BIRTHDAY"
              :rules="[ { required: true, message: '请选择出生日期', trigger: 'blur' }  ]"
            >
              <el-date-picker
                v-model="staffList.BIRTHDAY"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="入职日期:"
              :label-width="formLabelWidth"
              prop="ENTRYDAY"
              :rules="[ { required: true, message: '请选择入职日期', trigger: 'blur' }  ]"
            >
              <el-date-picker
                v-model="staffList.ENTRYDAY"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="姓名:"
              :label-width="formLabelWidth"
              prop="NAME"
              :rules="[ { required: true, message: '请填写姓名', trigger: 'blur' }  ]"
            >
              <el-input v-model="staffList.NAME"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别:" prop="SEX" :label-width="formLabelWidth">
              <el-radio-group v-model="staffList.SEX">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="公司电话:" :label-width="formLabelWidth" prop="PHONE_OFFICE">
              <el-input v-model="staffList.PHONE_OFFICE" placeholder="请输入公司电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="个人电话:"
              :label-width="formLabelWidth"
              prop="PHONE_SELF"
              :rules="[ { required: true, message: '请填写个人电话', trigger: 'blur' }  ]"
            >
              <el-input v-model="staffList.PHONE_SELF" placeholder="请输入个人电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitUser">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList, fetchUserById, updateUser } from "@/api/user";
import { fetchOrgList } from "@/api/auth";
import { stringDay, dataDiffYear } from "@/utils/common";
import util from "@/utils/util";

export default {
  data() {
    return {
      queryName: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      dialogVisible: false,
      depOptions: [
        {
          ID: "org1",
          NAME: "开发"
        },
        {
          ID: "org2",
          NAME: "财务"
        }
      ],
      depvalue: "",
      staffList: {
        BIRTHDAY: "",
        ENTRYDAY: "",
        NAME: "",
        SEX: 1,
        PHONE_OFFICE: "",
        PHONE_SELF: ""
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {
    fetchOrgList().then(res => {
      this.depOptions = res.item;
    });
    this.getUserList();
  },
  methods: {
    formatDay(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD") : "";
    },
    formatTimes(day) {
      return day ? util.formatTime(day, "YYYY-MM-DD hh:mm:ss") : "";
    },
    getYears(day) {
      let start = day ? util.formatTime(day, "YYYY-MM-DD") : "";
      let end = util.formatTime(Date.now(), "YYYY-MM-DD");
      return dataDiffYear(start, end);
    },

    handleEdit(row) {
      fetchUserById({ id: row.ID }).then(res => {
        let tempItem = res.item;
        tempItem.BIRTHDAY = this.formatDay(tempItem.BIRTHDAY);
        tempItem.ENTRYDAY = this.formatDay(tempItem.ENTRYDAY);
        this.staffList = tempItem;
        this.dialogVisible = true;
      });
    },
    submitUser(row) {
      this.$refs["staffForm"].validate(valid => {
        if (valid) {
          let param = {
            data: JSON.stringify({
              ID: this.staffList.ID,
              ORGID: this.staffList.dep,
              LOGINNAME: this.staffList.LOGINNAME,
              SEX: this.staffList.SEX,
              BIRTHDAY: stringDay(this.staffList.BIRTHDAY) || "",
              ENTRYDAY: stringDay(this.staffList.ENTRYDAY) || "",
              PHONE_OFFICE: this.staffList.PHONE_OFFICE,
              PHONE_SELF: this.staffList.PHONE_SELF
            })
          };
          updateUser(param).then(res => {
            if (res.success) {
              this.getQuitUserList();
              this.dialogVisible = false;
              this.$refs.staffForm.resetFields();
            }
          });
        }
      });
    },

    getUserList() {
      let param = {
        data: JSON.stringify({
          STATUS: "",
          ORGID: "",
          NAME: this.queryName
        }),
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchUserList(param).then(res => {
        this.total = res.total;
        this.tableData = res.items;
      });
    },

    handleQuery() {
      this.getUserList();
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getUserList();
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

.query-picker {
  width: 200px;
  display: inline-block;
  margin-right: 20px;
}

.pagination {
  background: #fff;
  text-align: right;
  padding: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.6) !important;
}
</style>