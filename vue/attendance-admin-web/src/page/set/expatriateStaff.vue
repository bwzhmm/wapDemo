<template>
  <div>
    <div class="table_head">
      <h4>外派驻场</h4>
    </div>
    <div class="head_box">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>外派驻场人员不参与考勤，当日考勤记录自动记为正常。</span>
      </div>
    </div>

    <el-button @click="updateStaff()" type="plain" size="small" class="add-btn">添加</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="time" label="外派时间" align="center">
        <template slot-scope="scope">{{ getRangeTime(scope.row)}}</template>
      </el-table-column>
      <el-table-column prop="USERNAME" label="外出人员" align="center">
        <template slot-scope="scope">{{ scope.row.USERNAME.replace(/,/g,"，")}}</template>
      </el-table-column>
      <el-table-column prop="DES" label="外派说明" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="updateStaff(scope.row)" type="text" size="small" class="mg-r10">编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
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

    <el-dialog title="外派驻场" :visible.sync="staffVisible" width="560px" v-if="staffVisible">
      <el-form :model="staffForm" ref="staffForm" style="width:450px">
        <el-form-item
          label="外派时间："
          label-width="100px"
          prop="rangeTime"
          :rules="[{ required: true, message: '外派时间不能为空', trigger: 'blur'}]"
        >
          <el-date-picker
            class="date-picker"
            v-model="staffForm.rangeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="外派人员："
          label-width="100px"
          prop="outUser"
          :rules="[{ required: true, message: '外派人员不能为空', trigger: 'blur'}]"
        >
          <el-select
            v-model="staffForm.outUser"
            multiple
            filterable
            remote
            placeholder="请输入姓名查找"
            :remote-method="querySearchAsync"
            @visible-change="(val)=>{selectChange(val)}"
            :loading="loading"
            style="width:100%"
            class="select-user"
          >
            <el-option
              v-for="item in selectUsers"
              :key="item.USERID"
              :label="item.USERNAME"
              :value="`${item.USERID}#${item.USERNAME}`"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="外派说明：" label-width="100px" prop="DES">
          <el-input
            type="textarea"
            :autosize="{ minRows:3, maxRows:6}"
            v-model="staffForm.DES"
            maxlength="50"
            show-word-limit
            placeholder="请输入说明，不超过50字"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('staffForm')">取消</el-button>
        <el-button type="primary" @click="handleSubmit('staffForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  stringDay,
  formatStr,
  formatTimeStr,
  rangeMonth
} from "@/utils/common";
import {
  fetchUserList,
  insertExpatriate,
  updateExpatriate,
  selectByIdExpatriate,
  fetchExpatriateList,
  deleteExpatriate
} from "@/api/user";
export default {
  data() {
    return {
      queryName: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      staffVisible: false,
      staffForm: {
        rangeTime: [],
        DES: "",
        outUser: []
      },
      selectUsers: [],
      loading: false,
      isFirst: true
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    getRangeTime(row) {
      let str = `${formatStr(row.STARTTIME, "-", true)} 至 ${formatStr(
        row.ENDTIME,
        "-",
        true
      )}`;
      return str;
    },
    handleDelete(row) {
      this.$confirm("确认删除该外派人员吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            id: row.ID
          };
          deleteExpatriate(param).then(res => {
            if (res.success) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getUserList();
            }
          });
        })
        .catch(() => {});
    },

    updateStaff(row) {
      this.staffVisible = true;
      if (row && row.ID) {
        let param = {
          id: row.ID
        };
        selectByIdExpatriate(param).then(res => {
          if (res.success) {
            res.item.rangeTime = [res.item.STARTTIME, res.item.ENDTIME];
            let ids = [];
            res.item.USERS.forEach(user => {
              ids.push(`${user.USERID}#${user.USERNAME}`);
            });
            res.item.outUser = ids;
            this.staffForm = JSON.parse(JSON.stringify(res.item));
            this.selectUsers = res.item.USERS;
          }
        });
      } else {
        this.staffForm = { rangeTime: [], DES: "", outUser: [] };
        this.selectUsers = [];
      }
    },
    handleCancel(formName) {
      this.staffVisible = false;
      this.$refs[formName].resetFields();
    },
    edit(formName) {
      let selectOutUser = this.staffForm.outUser;
      let selectUsers = [];
      selectOutUser.forEach(item => {
        selectUsers.push({
          USERID: item.split("#")[0],
          USERNAME: item.split("#")[1]
        });
      });
      let param = {
        data: JSON.stringify({
          ID: this.staffForm.ID,
          STARTTIME: this.staffForm.rangeTime.length
            ? this.staffForm.rangeTime[0]
            : "",
          ENDTIME: this.staffForm.rangeTime.length
            ? this.staffForm.rangeTime[1]
            : "",
          DES: this.staffForm.DES,
          USERS: selectUsers
        })
      };
      updateExpatriate(param).then(res => {
        if (res.success) {
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.staffVisible = false;
          this.$refs[formName].resetFields();
          this.getUserList();
        }
      });
    },
    add(formName) {
      let selectOutUser = this.staffForm.outUser;
      let selectUsers = [];
      selectOutUser.forEach(item => {
        selectUsers.push({
          USERID: item.split("#")[0],
          USERNAME: item.split("#")[1]
        });
      });

      let param = {
        data: JSON.stringify({
          STARTTIME: this.staffForm.rangeTime.length
            ? this.staffForm.rangeTime[0]
            : "",
          ENDTIME: this.staffForm.rangeTime.length
            ? this.staffForm.rangeTime[1]
            : "",
          DES: this.staffForm.DES,
          USERS: selectUsers
        })
      };
      insertExpatriate(param).then(res => {
        if (res.success) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.staffVisible = false;
          this.$refs[formName].resetFields();
          this.getUserList();
        }
      });
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.staffForm.ID) {
            this.edit(formName);
          } else {
            this.add(formName);
          }
        }
      });
    },

    getUserList() {
      let param = {
        limit: this.pagesize,
        page: this.currentPage
      };
      fetchExpatriateList(param).then(res => {
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
    },

    //初次点击展开时调接口
    selectChange(val) {
      if (val) {
        this.querySearchAsync("");
      }
    },
    querySearchAsync(queryString, cb) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let param = {
          data: JSON.stringify({
            STATUS: "1",
            ORGID: this.userInfo.ORGID,
            NAME: queryString || ""
          }),
          limit: 10,
          page: 1
        };
        fetchUserList(param).then(res => {
          let tempData = res.items.map(item => {
            return { USERNAME: item.NAME, USERID: item.ID };
          });
          this.selectUsers = tempData;
        });
      }, 10 * Math.random());
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
.head_box {
  width: 800px;
  .tips_box {
    margin-left: 20px;
    width: 100%;
  }
}
.add-btn {
  margin-left: 20px;
  margin-bottom: 16px;
}
.select-user /deep/ .el-tag.el-tag--info {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}
.select-user /deep/ .el-tag.el-tag--info .el-tag__close {
  color: #40a9ff;
  background-color: transparent;
}
.select-user /deep/ .el-select .el-tag__close.el-icon-close {
  background-color: transparent;
}
.select-user /deep/ .el-tag.el-tag--info .el-tag__close:hover {
  color: #fff;
  background-color: #409eff;
}

.select-user /deep/ .el-select__tags {
  flex-wrap: wrap;
  overflow: auto;
}
.date-picker {
  width: 100%;
  height: 32px;
}
</style>