<template>
  <div class="wapper-content">
    <div class="search-box wapper-box">
      <el-input
        class="mg-r10"
        placeholder="请输入姓名"
        style="width: 200px"
        size="small"
        v-model="searchForm.name"
        clearable
      ></el-input>
      <el-select class="mg-r10" v-model="roleValue" placeholder="请选择角色" clearable size="small">
        <el-option
          v-for="item in roleOptions"
          :key="item.ID||'111'"
          :label="item.NAME"
          :value="item.ID"
        ></el-option>
      </el-select>
      <el-button @click="handleQuery()" type="primary" icon="el-icon-search" size="small">查询</el-button>
      <el-divider class="divider" direction="vertical"></el-divider>
      <el-button
        @click="handleAdd"
        type="primary"
        class="green-btn"
        size="small"
        icon="el-icon-plus"
      >新增</el-button>
    </div>
    <div class="table-container">
      <el-table class="my-table" :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="LOGINNAME" label="登录名" align="center"></el-table-column>
        <el-table-column prop="NAME" label="姓名" align="center"></el-table-column>
        <el-table-column prop="ROLENAME" label="角色" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)" size="small">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)" size="small">删除</el-button>
            <el-button @click="resetPwd(scope.row)" type="text" size="small">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="totalPage"
          :page-size="limit"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100,200]"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>

    <user-drawer
      v-if="userDialogVisible"
      :dialogVisible.sync="userDialogVisible"
      :parentForm="fromData"
      :roles="roleOptions"
      @flushList="handleFlush"
    ></user-drawer>
    <pwd-drawer
      v-if="pwdDialogVisible"
      :dialogVisible.sync="pwdDialogVisible"
      :parentForm="fromData"
      :iSRestPwd="true"
    ></pwd-drawer>
  </div>
</template>

<script>
import userDrawer from "./user-drawer"; //新增、编辑账号抽屉
import pwdDrawer from "./pwd-drawer"; //重置密码抽屉
import { service, logService } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
export default {
  components: {
    userDrawer,
    pwdDrawer
  },
  data() {
    return {
      tableData: [],
      loading: false,
      roleValue: "",
      roleOptions: [],
      totalPage: 0,
      limit: 10,
      currentPage: 1,
      searchForm: {},
      userDialogVisible: false,
      pwdDialogVisible: false,
      fromData: {
        ADMIN: "",
        ID: "",
        PWD: "",
        NAME: ""
      },
      initForm: {}
    };
  },
  mounted() {
    this.getRoleList();
    this.getUserList();
  },
  methods: {
    // 获取角色列表数据
    getRoleList() {
      let path = "authweb.AU_ROLE.list";
      let params = {
        FILTER: {
          KEYWORD: ""
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.roleOptions = res.data
            ? res.data.items.filter(item => item.CONTEXTID == ENV.CONTEXTID)
            : [];
        }
      });
    },

    handleAdd() {
      this.userDialogVisible = true;
      this.fromData = {};
    },

    handleEdit(row) {
      this.fromData = row;
      this.initForm = this.fromData;
      this.userDialogVisible = true;
    },

    resetPwd(row) {
      this.fromData = row;
      this.pwdDialogVisible = true;
    },

    handleDelete(row) {
      this.$confirm("确认删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let path = "authweb.AU_USER.delete";
          let params = {
            AU_USER: {
              ID: row.ID,
              STATUS: "0" //删除用户
            }
          };
          service(params, path).then(res => {
            if (res.success) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getUserList();
              //1登录 2新增 3删除 4修改
              let logparams = {
                ENV_LOG: {
                  TYPE: "3",
                  MODULE: "设置中心>账号管理>删除",
                  CONTENT: `删除账号："${row.LOGINNAME}"`
                }
              };
              logService(logparams);
            }
          });
        })
        .catch(() => {});
    },

    handleQuery() {
      this.currentPage = 1;
      this.getUserList();
    },
    // 添加或编辑成功后刷新列表
    handleFlush() {
      this.getUserList();
    },
    //点击分页
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList();
    },

    // 获取列表
    getUserList() {
      this.loading = true;
      let path = "authweb.AU_USER.pageQueryList";
      let params = {
        AU_ORG: { ID: ENV.ORGID },
        AU_ROLE: { ID: this.roleValue },
        FILTER: {
          PAGE: this.currentPage,
          LIMIT: this.limit,
          KEYWORD: this.searchForm.name || ""
        }
      };
      service(params, path).then(res => {
        this.loading = false;
        if (res.success) {
          this.tableData = res.data.items;
          this.totalPage = res.data.total;
        }
      });
    }
  }
};
</script>

<style scoped>
.search-box {
  margin-bottom: 10px;
}
</style>
