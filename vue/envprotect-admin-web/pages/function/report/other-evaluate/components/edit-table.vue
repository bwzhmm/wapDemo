<template>
  <div class="content">
    <span
      class="mg-tp20"
      :class="tableInfo.menuTitle ? 'blue-title-line':'blank'"
    >{{tableInfo.menuTitle}}</span>
    <el-table class="my-table" :data="tableData" style="width: 100%" v-loading="loading">
      <template v-for="(item,index) in tableInfo.tableCol">
        <el-table-column
          :prop="item.dataIndex"
          :label="item.title"
          :key="index"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="activeID==scope.row.ID">
              <el-input v-if="item.type=='input'" v-model="scope.row[scope.column.property]"></el-input>
              <el-select
                v-if="item.type=='select'"
                v-model="scope.row[scope.column.property]"
                placeholder="请选择"
              >
                <el-option v-for="val in item.options" :key="val" :label="val" :value="val"></el-option>
              </el-select>
              <el-date-picker
                v-if="item.type=='date'"
                v-model="scope.row[scope.column.property]"
                type="date"
                placeholder="选择日期"
                value-format="yyyyMMdd"
              ></el-date-picker>
              <span v-if="item.type=='string'">{{scope.row[scope.column.property] ||'-'}}</span>
            </span>
            <span
              v-else
            >{{item.type=='date'? formateDay(scope.row[scope.column.property]):scope.row[scope.column.property] ||'-'}}</span>
          </template>
        </el-table-column>
      </template>

      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleSave(scope.row)" v-if="activeID==scope.row.ID">保存</el-button>
          <el-button type="text" @click="handleEdit(scope.row)" v-else>编辑</el-button>
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
import { formatStr, compareDate, stringDay } from "@env/utils/common.js";
export default {
  name: "edit-table",
  props: ["tableInfo", "company"],
  components: {},
  data() {
    return {
      activeID: "-1",
      tableData: [],
      loading: false,
      ruleForm: {}
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    formateDay(day) {
      return day ? formatStr(day, "-") : "-";
    },
    handleSave(row, isLook) {
      for (let prop in row) {
        if (row[prop] == null) {
          this.$message({
            type: "warning",
            message: "请先填写数据，再进行保存。"
          });
          return false;
        }
      }

      if (row && row.ID) {
        let path = `env.${this.tableInfo.basePath}.update`;
        let newRow = JSON.parse(JSON.stringify(row));
        newRow.COMPANYID = this.company && this.company.ID;
        delete newRow.ISExpire;
        let params = {
          [this.tableInfo.basePath]: newRow
        };
        service(params, path).then(res => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "保存成功！"
            });
            this.activeID = "";
          }
        });
      }
    },

    // 获取列表
    getTableList() {
      this.loading = true;
      let path = `env.${this.tableInfo.basePath}.list`;
      let params = {
        [this.tableInfo.basePath]: {
          COMPANYID: this.company && this.company.ID
        },
        FILTER: {
          KEYWORD: this.queryName,
          LIMIT: this.pageSize,
          PAGE: this.currentPage
        }
      };
      service(params, path).then(res => {
        this.loading = false;
        if (res.success) {
          let itemsArr = res.data.items;
          itemsArr.map(item => {
            if (item.EXPIRATIONDATE) {
              // 是否在有效期内
              let EXPIR = formatStr(item.EXPIRATIONDATE, "-");
              let iSPeriod = compareDate(EXPIR);
              item.ISExpire = iSPeriod ? "是" : "否";
            }
          });
          this.tableData = itemsArr;
        }
      });
    },

    handleEdit(row) {
      this.activeID = row.ID;
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
</style>

