<template>
  <div>
    <div class="table_head">
      <h4>员工管理</h4>
      <div>
        <el-input v-model="queryName" class="query-picker" placeholder="请输入姓名" clearable></el-input>
        <el-button @click="handleQuery()" type="primary" size="small">查询</el-button>
        <el-divider class="divider" direction="vertical"></el-divider>
        <el-button @click="handleSnyc()" type="primary" size="small">同步</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="ORGNAME" label="部门" align="center">
        <template slot-scope="scope">{{ scope.row.ORGNAME||'-'}}</template>
      </el-table-column>
      <el-table-column prop="NAME" label="姓名" align="center"></el-table-column>
      <el-table-column prop="SEX" label="性别" align="center">
        <template slot-scope="scope">{{ scope.row.SEX=='2'?"女":scope.row.SEX=='1'&&'男'||'-'}}</template>
      </el-table-column>
      <el-table-column prop="BIRTHDAY" label="出生日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.BIRTHDAY) ||'-'}}</template>
      </el-table-column>
      <el-table-column prop="ENTRYDAY" label="入职日期" align="center">
        <template slot-scope="scope">{{ formatDay(scope.row.ENTRYDAY)||'-'}}</template>
      </el-table-column>

      <el-table-column prop="ENTRYDAY" label="司龄（年）" align="center">
        <template slot-scope="scope">{{ getYears(scope.row.ENTRYDAY)||'-'}}</template>
      </el-table-column>
      <el-table-column prop="PHONE_OFFICE" label="公司电话" align="center">
        <template slot-scope="scope">{{ scope.row.PHONE_OFFICE||'-'}}</template>
      </el-table-column>
      <el-table-column prop="PHONE_SELF" label="个人电话" align="center">
        <template slot-scope="scope">{{ scope.row.PHONE_SELF||'-'}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
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
    <el-dialog title="编辑员工" :visible.sync="dialogVisible" width="600px">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>
          员工账号默认密码为
          <i class="blueColor">123456</i>。
        </span>
      </div>
      <el-form :model="staffList" ref="staffForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="部门:" :label-width="formLabelWidth" prop="ORGID">
              <el-select v-model="staffList.ORGID" placeholder="请选择部门">
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
              <el-input v-model="staffList.NAME" :disabled="true"></el-input>
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
            <el-form-item
              label="公司电话:"
              :label-width="formLabelWidth"
              prop="PHONE_OFFICE"
              :rules="[ 
              { pattern:/^1[0-9]{10}$/, message: '请输入正确的手机号' } ]"
            >
              <el-input v-model="staffList.PHONE_OFFICE" placeholder="请输入公司电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="个人电话:"
              :label-width="formLabelWidth"
              prop="PHONE_SELF"
              :rules="[ { required: true, message: '请填写个人电话', trigger: 'blur' },
              { pattern:/^1[0-9]{10}$/, message: '请输入正确的手机号' } 
              ]"
            >
              <el-input v-model="staffList.PHONE_SELF" placeholder="请输入个人电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitUser">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList, fetchUserById, updateUser, syncUser } from "@/api/user";
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
      depOptions: [],
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
      this.depOptions = res.items;
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

    handleSnyc() {
      let param = {};
      syncUser().then(res => {
        if (res.success) {
          this.getUserList();
          this.$message({
            message: "同步成功",
            type: "success"
          });
        }
      });
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
    handleCancel() {
      this.dialogVisible = false;
      this.$refs.staffForm.resetFields();
    },
    submitUser(row) {
      this.$refs["staffForm"].validate(valid => {
        if (valid) {
          let param = {
            data: JSON.stringify({
              ID: this.staffList.ID,
              ORGID: this.staffList.ORGID,
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
              this.getUserList();
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
          STATUS: "1",
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
      this.currentPage = 1;
      this.getUserList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currentPage = 1;
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
</style>