<template>
  <div>
    <div class="table_head">
      <h4>权限管理</h4>
    </div>
    <div class="systemBox">
      <div class="title">
        <span class="opacity_65">部门经理设置</span>
      </div>

      <el-form :model="depForm" ref="depForm" status-icon label-width="100px" class="demo-ruleForm">
        <el-row>
          <div v-for="(dep,index) in  depForm.depOptions" :key="dep.ID+index">
            <el-col :span="8">
              <el-form-item label="部门：" :prop="dep.ID" :label-width="formLabelWidth">
                <el-input v-model="dep.NAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="部门经理："
                :prop="'depOptions.' + index + '.MANAGERID'"
                :label-width="formLabelWidth"
              >
                <el-select
                  v-model="dep.MANAGERID"
                  filterable
                  remote
                  placeholder="请输入姓名查找"
                  :remote-method="(query)=>{querySearchAsync(query,index,true)}"
                  @visible-change="(val)=>{selectChange(val,index,true)}"
                  :loading="loading"
                  style="width:100%"
                  class="select-user"
                >
                  <el-option
                    v-for="item in dep.selectManagers"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="上级领导："
                :prop="'depOptions.' + index + '.LEADERID'"
                :label-width="formLabelWidth"
              >
                <el-select
                  v-model="dep.LEADERID"
                  filterable
                  remote
                  placeholder="请输入姓名查找"
                  :remote-method="(query)=>{querySearchAsync(query,index,false)}"
                  @visible-change="(val)=>{selectChange(val,index,false)}"
                  :loading="loading"
                  style="width:100%"
                  class="select-user"
                >
                  <el-option
                    v-for="item in dep.selectLeaders"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('depForm')">提交</el-button>
          <el-button @click="resetForm('depForm')">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="title" style="marginTop:30px">
        <span class="opacity_65">角色权限设置</span>
      </div>
      <div class="right-button">
        <el-button @click="addRole(true)" type="primary" icon="el-icon-plus">角色</el-button>
      </div>
      <el-table :data="rolesList" class="mg_tab">
        <el-table-column prop="NAME" label="角色组" width="180"></el-table-column>
        <el-table-column prop="children" label="用户列表">
          <template slot-scope="scope">{{ getUserScope(scope.row)}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="opacity_65" v-if="scope.row.NAME=='超级管理员'">所有权限</span>
            <!-- v-if="scope.row.CODE>3" v-if="scope.row.CODE>1" -->
            <el-button
              @click="handleAuthClick(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.CODE>1|| !scope.row.CODE "
            >权限维护</el-button>
            <el-button
              @click="handleMemberClick(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.CODE>2 || !scope.row.CODE "
            >成员维护</el-button>
            <el-button
              @click="handleDeleteRole(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.CODE>3 || !scope.row.CODE"
            >删除角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="500px">
      <el-form :model="roleForm" ref="roleForm">
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="角色组:"
              label-width="100px"
              prop="NAME"
              :rules="[{ required: true, message: '角色组名称不能为空', trigger: 'blur'}]"
            >
              <el-input v-model="roleForm.NAME" placeholder="请输入角色组名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="描述:" label-width="100px" prop="DES">
              <el-input
                type="textarea"
                :autosize="{ minRows:3, maxRows:6}"
                v-model="roleForm.DES"
                maxlength="200"
                show-word-limit
                placeholder="请输入描述内容，不超过200字"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleCancel('roleForm')">取消</el-button>
        <el-button type="primary" @click="submitRole('roleForm')">提交</el-button>
      </span>
    </el-dialog>
    <tree-auth
      v-if="annualVisible"
      :treeData="treeData"
      :curRole="curRole"
      class="item"
      :dialogVisible.sync="annualVisible"
    ></tree-auth>
    <tree-member
      v-if="memberVisible"
      class="item"
      :treeData="memberTreeData"
      :curRole="curRole"
      :dialogVisible.sync="memberVisible"
      @flushList="handleFlush"
    ></tree-member>
  </div>
</template>

<script>
import TreeAuth from "./tree-list/tree-auth";
import TreeMember from "./tree-list/tree-member";

import {
  fetchOrgList,
  saveOrgManager,
  addRole,
  getRoleUserTree,
  getRole,
  getUserRole,
  deleteRole
} from "@/api/auth";
import { fetchUserList } from "@/api/user";

export default {
  components: {
    TreeAuth,
    TreeMember
  },
  data() {
    return {
      loading: false,
      depForm: {
        depOptions: []
      },
      memberTreeData: [],
      treeData: [],
      annualVisible: false,
      memberVisible: false,
      addRoleVisible: false,
      formLabelWidth: "120px",
      roleForm: {
        NAME: "",
        DES: ""
      },
      rolesList: [],
      initDepList: [],
      curRole: {}
    };
  },
  mounted() {
    this.getOrgList();
    this.getRoleGroupList();
  },
  methods: {
    // 成员权限提交刷新
    handleFlush() {
      this.getRoleGroupList();
    },
    // 获取部门列表
    getOrgList() {
      fetchOrgList().then(res => {
        let tempArry = JSON.parse(JSON.stringify(res.items));
        tempArry.forEach(item => {
          item.selectManagers = [
            {
              value: item.MANAGERID,
              label: item.MANAGERNAME
            }
          ];
          item.selectLeaders = [
            {
              value: item.LEADERID,
              label: item.LEADERNAME
            }
          ];
        });
        this.initDepList = tempArry;
        this.depForm.depOptions = tempArry;
      });
    },

    // 数组中按对象某属性排序
    compare(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },

    // 获取角色组列表
    getRoleGroupList() {
      let param = {
        filter: JSON.stringify({
          checked: "true"
        })
      };
      getRoleUserTree(param).then(res => {
        // 排序默认前三个角色
        let roleIDs = ["role1", "role2", "role3"],
          firstArr = [],
          lastArr = [],
          allList = [];
        if (res && res.length) {
          res.forEach(item => {
            if (roleIDs.includes(item.ID)) {
              firstArr.push(item);
            } else {
              lastArr.push(item);
            }
          });
        }
        let sortRes = firstArr.sort(this.compare("CODE"));
        allList = sortRes.concat(lastArr);
        this.rolesList = allList;
      });
    },

    // 角色组下的用户列表
    getUserScope(row) {
      let text = row.children.length
        ? row.children.map(item => item.text).join("，")
        : "-";
      if (row.text == "普通员工") {
        text = "默认所有员工";
      }
      return text;
    },
    //初次点击展开时调接口
    selectChange(val, index, type) {
      if (val) {
        this.querySearchAsync("", index, type);
      }
    },
    querySearchAsync(queryString, index, type) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let param = {
          data: JSON.stringify({
            STATUS: "1",
            ORGID: "",
            NAME: queryString || ""
          }),
          limit: 10,
          page: 1
        };

        fetchUserList(param).then(res => {
          let tempData = res.items.map(item => {
            return {
              label: item.NAME,
              value: item.ID
            };
          });
          if (type) {
            this.depForm.depOptions[index].selectManagers = tempData;
          } else {
            this.depForm.depOptions[index].selectLeaders = tempData;
          }
        });
      }, 5 * Math.random());
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let newList = this.depForm.depOptions.map((item, index) => {
            return Object.assign(
              {},
              {
                MANAGERID: item.MANAGERID,
                LEADERID: item.LEADERID,
                ID: item.ID
              }
            );
          });
          let param = {
            data: JSON.stringify(newList)
          };
          saveOrgManager(param).then(res => {
            if (res.success) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.depForm.depOptions = this.initDepList;
    },

    handleDeleteRole(row) {
      this.$confirm("确认删除该角色组吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            ROLEID: row.ID
          };
          deleteRole(param).then(res => {
            if (res.success) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getRoleGroupList();
            }
          });
        })
        .catch(() => {});
    },

    getTreeData(data) {
      data.forEach(item => {
        item.value = item.RESID || item.ID;
        item.label = item.NAME;
        item.children = item.items || item.users;

        if (item.children && item.children.length) {
          let childChecked = item.children.filter(item => item.checked == true);
          let countCheck = childChecked.length,
            countChild = item.children.length;
          item.isCheckAll = countCheck == countChild;
          item.isIndeterminate = countCheck > 0 && countCheck < countChild;
          this.getTreeData(item.children);
        }
      });
      return data;
    },

    // 成员维护
    handleMemberClick(row) {
      this.curRole = row;
      let param = {
        filter: JSON.stringify({
          ROLEID: row.ID
        })
      };
      getUserRole(param).then(res => {
        let tempArry = JSON.parse(JSON.stringify(res.data));
        let treelist = this.getTreeData(tempArry);
        this.memberTreeData = treelist;
        this.memberVisible = true;
      });
    },
    // 权限维护
    handleAuthClick(row) {
      this.curRole = row;
      let param = {
        filter: JSON.stringify({
          ROLEID: row.ID
        })
      };
      getRole(param).then(res => {
        let tempArry = JSON.parse(JSON.stringify(res.data));
        let treelist = this.getTreeData(tempArry);
        this.treeData = treelist;
        this.annualVisible = true;
      });
    },
    addRole() {
      this.addRoleVisible = true;
    },
    roleCancel(formName) {
      this.addRoleVisible = false;
      this.$refs[formName].resetFields();
    },
    submitRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            data: JSON.stringify({
              ISUSE: "1",
              DES: this.roleForm.DES,
              NAME: this.roleForm.NAME
            })
          };
          addRole(param).then(res => {
            if (res.success) {
              this.$message({
                message: "添加角色成功",
                type: "success"
              });
              this.addRoleVisible = false;
              this.$refs[formName].resetFields();
              this.getRoleGroupList();
            }
          });
        }
      });
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
.demo-ruleForm {
  margin-top: 20px;
  margin-left: -60px;
}
.systemBox {
  width: 800px;
  padding: 0 20px;
  .tips_box {
    margin: 0 30px 30px;
    width: 100%;
  }
}
.mg_tab {
  width: 100%;
  margin: 20px auto 30px;
}
.right-button {
  float: right;
  margin-bottom: 10px;
}
.title {
  border-left: 3px solid #38adff;
  padding: 0 10px;
}
</style>
