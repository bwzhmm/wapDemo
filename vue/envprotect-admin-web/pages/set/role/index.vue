<template>
  <div class="wapper-content wapper">
    <div class="wapper-box left-content">
      <div class="table_head">
        <h4>角色管理</h4>
      </div>
      <el-button
        @click="addRole"
        type="primary"
        class="green-btn"
        size="small"
        icon="el-icon-plus"
      >新增角色</el-button>
      <mini-dialog
        class="mini-dialog"
        :append-to-body="true"
        v-if="miniVisible"
        :dialogVisible.sync="miniVisible"
        :ruleForm="miniForm"
        @handleSure="hanldeConfirm"
      ></mini-dialog>
      <div class="form-name">
        <ul class="item-ul">
          <li v-for="(item,index) in roleList" :key="index" @click="clickRow($event,item,index)">
            <div v-if="index===editIndex" class="rflex">
              <el-input v-model="editRoleName" class="mg-r10"></el-input>
              <el-button type="text" @click="saveRole(item)">保存</el-button>
            </div>
            <div v-else class="item-li" :class="activeIndex==index && 'active-li'">
              <span class="role-text">{{item.NAME}}</span>
              <span class="gray-text">
                <i
                  title="编辑角色"
                  class="iconfont iconbianji mg-r10"
                  @click="editRole($event,item,index)"
                ></i>
                <i title="删除角色" class="iconfont iconshanchu" @click="delRole(item)"></i>
                <!-- <i title="编辑角色" class="el-icon-edit mg-r10" @click="editRole($event,item,index)"></i>
                <i title="删除角色" class="el-icon-delete" @click="delRole(item)"></i>-->
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="right-content">
      <div class="table_head">
        <h4>权限分配</h4>
      </div>
      <tree-auth
        v-if="isFlush"
        :treeData="treeData"
        :curRole="curRole"
        :initCheckeds="initCheckeds"
        :initAllChecked="initAllChecked"
        :initHalfChecked="initHalfChecked"
      ></tree-auth>
    </div>
  </div>
</template>
<script>
import TreeAuth from "./tree-auth";
import miniDialog from "./mini-dialog";
import { service, logService } from "@env/utils/request.js";
import { ENV, toTree } from "@env/utils/common.js";
export default {
  components: {
    TreeAuth,
    miniDialog
  },
  data() {
    return {
      roleList: [],
      tableData: [],
      treeData: [],
      allTreeData: [],
      initCheckeds: [],
      miniVisible: false,
      curRole: {},
      activeIndex: 0,
      editIndex: -1,
      editRoleName: "",
      miniForm: { propName: "角色", NAME: "" },
      isFlush: true,
      initAllChecked: [], // 父节点全选
      initHalfChecked: [] //父节点半选
    };
  },
  computed: {},
  mounted() {
    this.getRoleList();
    this.getAllRes();
  },
  methods: {
    addRole() {
      this.miniForm.NAME = "";
      this.miniVisible = true;
    },
    // 点击角色某行的编辑按钮
    editRole(event, row, index) {
      event.stopPropagation();
      this.editRoleName = row.NAME;
      this.editIndex = index;
    },

    // 转换成符合树组件的数据 判断子菜单里选中的个数，确定是否半选
    getTreeData(data) {
      data.forEach(item => {
        item.checked = this.initCheckeds.includes(item.ID) ? true : false;
        if (item.children && item.children.length) {
          let childChecked = item.children.filter(item =>
            this.initCheckeds.includes(item.ID)
          );
          let countCheck = childChecked.length,
            countChild = item.children.length,
            isCheckAll = countCheck > 0 && countCheck == countChild,
            isIndeterminate = countCheck > 0 && countCheck < countChild;
          if (isCheckAll) {
            this.initAllChecked.push(item.ID);
          }
          if (isIndeterminate) {
            this.initHalfChecked.push(item.ID);
          }
          item.isCheckAll = isCheckAll;
          item.isIndeterminate = isIndeterminate;

          this.getTreeData(item.children);
        }
      });
      return data;
    },

    //查询该角色下的选中的资源
    getRoleRes(role) {
      let path = "authweb.AU_ROLERES.FINDBYROLEID";
      let params = {
        AU_ROLERES: {
          ROLEID: role.ID
        }
      };
      this.isFlush = false;
      service(params, path).then(res => {
        if (res.success) {
          let initCheckeds = res.data.items;
          this.initCheckeds = initCheckeds.map(item => item.RESID);
          this.initAllChecked = []; //重置
          let newTreeList = this.getTreeData(this.allTreeData);
          this.treeData = newTreeList;
          this.isFlush = true;
        }
      });
    },

    // 查询全部的资源
    getAllRes() {
      let path = "authweb.AU_RES.list";
      let params = {
        AU_RES: {
          APPID: ENV.CONTEXTID
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.allTreeData = toTree(res.data.items);
        }
      });
    },

    //点击角色某行
    clickRow(event, row, index) {
      if (event.target.className == "el-input__inner") {
        return false;
      }
      this.curRole = row;
      this.activeIndex = index;
      this.editIndex = -1;
      this.getRoleRes(row);
    },

    // 编辑角色名称
    saveRole(role) {
      let path = "authweb.AU_ROLE.simpleEdit";
      let params = {
        AU_ROLE: {
          ORGID: "",
          CODE: null,
          GROUPID: null,
          NAME: this.editRoleName,
          CONTEXTID: role.CONTEXTID,
          ISDELETE: "0",
          ID: role.ID
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "编辑角色成功"
          });
          this.editIndex = -1;
          this.getRoleList();
          //1登录 2新增 3删除 4修改
          let logparams = {
            ENV_LOG: {
              TYPE: "4",
              MODULE: "设置中心>角色权限>角色管理",
              CONTENT: `编辑角色："${role.NAME}>${this.editRoleName}"`
            }
          };
          logService(logparams);
        }
      });
    },

    //弹框确认
    hanldeConfirm(role) {
      let path = "authweb.AU_ROLE.add";
      let params = {
        AU_ROLE: {
          NAME: role.NAME,
          CONTEXTID: ENV.CONTEXTID,
          ISDELETE: "0"
        }
      };

      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "添加角色成功"
          });
          this.getRoleList();
          //1登录 2新增 3删除 4修改
          let logparams = {
            ENV_LOG: {
              TYPE: "4",
              MODULE: "设置中心>角色权限>角色管理",
              CONTENT: `新增角色："${params.AU_ROLE.NAME}"`
            }
          };
          logService(logparams);
        }
      });
    },

    delRole(role) {
      let path = "authweb.AU_ROLE.checkRoleUser";
      let params = {
        AU_ROLE: {
          ID: role.ID
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          let tip = !res.data ? "该角色下存在用户，" : "";
          this.$confirm(`${tip}确认删除该角色吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let path = "authweb.AU_ROLE.delete";
              let params = {
                AU_ROLE: {
                  ID: role.ID,
                  ISDELETE: "1"
                }
              };
              service(params, path).then(res => {
                if (res.success) {
                  this.$message({
                    type: "success",
                    message: "删除角色成功"
                  });
                  this.getRoleList();
                  //1登录 2新增 3删除 4修改
                  return false;
                  let logparams = {
                    ENV_LOG: {
                      TYPE: "3",
                      MODULE: "设置中心>角色权限>角色管理",
                      CONTENT: `删除角色："${role.NAME}"`
                    }
                  };
                  logService(logparams);
                }
              });
            })
            .catch(() => {});
        }
      });
    },

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
          this.roleList = res.data
            ? res.data.items.filter(item => item.CONTEXTID == ENV.CONTEXTID)
            : [];
          let firstRole = this.roleList[0];
          this.curRole = firstRole;
          this.getRoleRes(firstRole);
        }
      });
    },

    // 绩效提交可以按选择日期来，提交
    handleSelectPicker(val) {
      this.currentPage = 1;
      this.getRoleList();
    }
  }
};
</script>

<style lang="scss" scoped>
.wapper {
  display: flex;
}
.left-content {
  width: 250px;
  padding: 0 20px;
  background: #fff;
  position: relative;
  .table_head {
    padding: 20px 0;
  }
}
.mini-dialog {
  position: absolute;
  margin-top: -5vh;
}

.item-ul {
  // border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin: 20px 0px;
}
.item-li {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
}
.active-li {
  background: #f1f9ff;
  color: #1890ff;
}
.gray-text {
  color: #7f95aa;
  cursor: pointer;
}
.right-content {
  flex: 1;
}
.table_head {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
}
.role-text {
  text-align: left;
  display: inline-block;
  width: 115px;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis;
}
</style>