<template>
  <div class="content">
    <span
      class="mg-tp20"
      :class="tableInfo.menuTitle ? 'blue-title-line':'blank'"
    >{{tableInfo.menuTitle}}</span>
    <span class="group">{{tableInfo.group}}</span>
    <el-button
      @click="handleUpdate"
      type="primary"
      class="green-btn mg-bt20"
      size="small"
      icon="el-icon-plus"
    >新增{{tableInfo.group?"":tableInfo.title}}</el-button>
    <el-table class="my-table" :data="tableData" style="width: 100%" v-loading="loading">
      <template v-for="(item,index) in tableInfo.tableCol">
        <el-table-column
          :prop="item.dataIndex"
          :label="item.title"
          :key="index"
          align="left"
          header-align="left"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <fileBtn :fileRow="scope.row" v-show="scope.row.FILEID && item.dataIndex=='file'" />
            <span v-show="!scope.row.FILEID && item.dataIndex=='file'">-</span>
            <span v-show="item.dataIndex!=='file'">{{scope.row[scope.column.property] || '-'}}</span>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)" size="small">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <update-drawer
      :dialogVisible.sync="updateDialogVisible"
      :drawerTitle="drawerTitle"
      :ENVPATH="tableInfo.wastePath"
      :drawerCol="tableInfo.drawerCol"
      :parentForm="fromData"
      :wasteID="wasteID"
      :factorPath="tableInfo.factorPath"
      @flushList="handleFlush"
    ></update-drawer>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import updateDrawer from "@env/components/update-drawer"; //新增、编辑抽屉
import fileBtn from "@env/components/file-btn"; //查看,下载附件
export default {
  name: "waste-table",
  props: ["tableInfo", "company", "wasteID"],
  components: {
    updateDrawer,
    fileBtn
  },
  data() {
    return {
      active: 0,
      tableData: [],
      loading: false,
      updateDialogVisible: false,
      drawerTitle: "",
      fromData: {}
    };
  },
  mounted() {
    let ID = this.wasteID && this.wasteID.ID;
    if (ID) {
      this.getTableList();
    }
  },
  methods: {
    // 添加或编辑成功后刷新列表
    handleFlush() {
      this.getTableList();
    },

    // 编辑 新增表单更新
    handleUpdate(row, isLook) {
      this.updateDialogVisible = !isLook && true;
      let title = this.tableInfo.title;
      this.drawerTitle = row && row.ID ? `编辑${title}` : `新增${title}`;
      if (row && row.ID) {
        let path = `env.${this.tableInfo.wastePath}.view`;
        let params = {
          [this.tableInfo.wastePath]: {
            ID: row.ID
          }
        };
        service(params, path).then(res => {
          if (res.success) {
            let resData = res.data;
            if (this.tableInfo.factorPath) {
              // 污染因子
              let factorProp = this.tableInfo.factorPath.split("#")[0];
              let factorTags = resData[factorProp];
              let tempData = factorTags.map(item => {
                return { NAME: item.NAME };
              });
              resData[`${this.tableInfo.factorPath}`] = tempData;
              delete resData[factorProp];
            }
            this.fromData = resData;
          }
        });
      } else {
        this.fromData = {};
        if (this.tableInfo.factorPath) {
          this.fromData[`${this.tableInfo.factorPath}`] = [];
        }
        if (this.tableInfo.group) {
          this.fromData.TYPE = this.tableInfo.group == "有组织排放" ? "1" : "2";
        }
      }
    },
    //统一处理 污染物因子表格 返回值
    handleRes(itemsArr) {
      let factorArr = [
        "ENV_WWPOLLFACTOR",
        "ENV_EGPOLLFACTOR",
        "ENV_DPPOLLFACTOR",
        "ENV_SWPOLLFACTOR"
      ];
      itemsArr.map(item => {
        for (let prop in item) {
          if (factorArr.includes(prop)) {
            let nameArr = item[prop].map(val => val.NAME);
            item.factor = nameArr.join("，");
          }
          if (prop === "CATEGORY") {
            let path = `basic.CM_DICTV.list`;
            let params = {
              FILTER: { KEYWORD: item.CATEGORY },
              CM_DICTV: { DICTID: "d21098cd2128421eaa9e29cac501c1a0" }
            };
            service(params, path).then(res => {
              if (res.success && res.data) {
                let name = res.data.items[0].NAME;
                item.CATEGORY = `${item.CATEGORY} ${name}`;
              }
            });
          }
        }
      });
      return itemsArr;
    },

    // 获取列表
    getTableList() {
      this.loading = true;
      let path = `env.${this.tableInfo.wastePath}.list`;
      let params = {
        [this.tableInfo.wastePath]: {
          [this.wasteID.path]: this.wasteID.ID
        },
        FILTER: {
          KEYWORD: this.queryName,
          LIMIT: this.pageSize,
          PAGE: this.currentPage
        }
      };

      if (this.tableInfo.group) {
        params[this.tableInfo.wastePath].TYPE =
          this.tableInfo.group == "有组织排放" ? "1" : "2";
      }
      service(params, path).then(res => {
        this.loading = false;
        if (res.success) {
          let itemsArr = res.data.items;
          this.tableData = this.handleRes(itemsArr);
          this.total = res.data.total;
        }
      });
    },

    handleDelete(row) {
      this.$confirm(`确认删除该${this.tableInfo.title}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let path = `env.${this.tableInfo.wastePath}.delete`;
          let params = {
            [this.tableInfo.wastePath]: {
              ID: row.ID
            }
          };
          service(params, path).then(res => {
            if (res.success) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getTableList();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
.blue-btn {
  background: #fff;
  border-color: #1890ff;
  color: #1890ff;
}
.gray-btn {
  color: #999999;
  border-color: #f2f2f2;
  background: #fefdff;
}
.blank {
  display: block;
}
.group {
  color: #333;
  margin-right: 10px;
  font-weight: 600;
}
</style>

