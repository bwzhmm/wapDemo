<template>
  <div>
    <div class="search-box">
      <el-button @click="handleUpdate()" type="primary" icon="el-icon-edit" size="small">编辑</el-button>
    </div>
    <div class="table-container">
      <el-form label-width="150px" class="permit">
        <el-form-item label="纳入排污许可管理：">
          <span class="content">{{curfromData.ALLOW ||'-'}}</span>
        </el-form-item>
        <el-form-item label="管理级别：" v-if="curfromData.ALLOW=='是'">
          <span class="content">{{curfromData.MANAGELEVEL}}</span>
        </el-form-item>
      </el-form>
    </div>
    <permit-drawer
      v-if="updateDialogVisible"
      :dialogVisible.sync="updateDialogVisible"
      :drawerTitle="drawerTitle"
      :ENVPATH="ENVPATH"
      :parentForm="curfromData"
      :company="company"
      @flushList="handleFlush"
    ></permit-drawer>
  </div>
</template>
<script>
import permitDrawer from "./permit-drawer"; //新增、编辑账号抽屉
import { service } from "@env/utils/request.js";
import { ENV, formatStr } from "@env/utils/common.js";
export default {
  components: {
    permitDrawer
  },
  props: ["company"],
  data() {
    return {
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      updateDialogVisible: false,
      drawerTitle: "",
      ENVPATH: "ENV_ALLOWDIRTY",
      curfromData: {
        ALLOW: "",
        MANAGELEVEL: ""
      }
    };
  },

  mounted() {
    this.getTableList();
  },
  methods: {
    // 编辑 新增表单更新
    handleUpdate() {
      this.updateDialogVisible = true;
      this.drawerTitle = "编辑许可证信息";
    },

    handleQuery() {
      this.currentPage = 1;
      this.getTableList();
    },

    //点击分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableList();
    },

    // 添加或编辑成功后刷新列表
    handleFlush() {
      this.getTableList();
    },

    // 获取列表
    getTableList() {
      this.loading = true;
      let path = `env.${this.ENVPATH}.list`;
      let params = {
        [this.ENVPATH]: {
          COMPANYID: this.company.ID
        },
        FILTER: {
          KEYWORD: "",
          LIMIT: this.pageSize,
          PAGE: this.currentPage
        }
      };
      service(params, path).then(res => {
        this.loading = false;
        if (res.success && res.data && res.data.items[0]) {
          this.curfromData = res.data.items[0];
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
.permit .el-form-item {
  margin-bottom: 0px;
}
</style>
