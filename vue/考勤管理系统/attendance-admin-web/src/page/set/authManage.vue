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
                  reserve-keyword
                  placeholder="请输入姓名查找"
                  :remote-method="(query)=>{querySearchAsync(query,index,true)}"
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
                  reserve-keyword
                  placeholder="请输入姓名查找"
                  :remote-method="(query)=>{querySearchAsync(query,index,false)}"
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
      <div class="button">
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
            <el-button @click="handleAuthClick(scope.row)" type="text" size="small">权限维护</el-button>
            <el-button @click="handleMemberClick(scope.row)" type="text" size="small">成员维护</el-button>
            <el-button @click="handleDeleteRole(scope.row)" type="text" size="small">删除角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="500px">
      <el-form :model="roleForm" ref="roleForm">
        <el-row>
          <el-col :span="20">
            <el-form-item label="角色组:" label-width="100px">
              <el-input v-model="roleForm.NAME" placeholder="请输入角色组名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="描述:" label-width="100px">
              <el-input
                type="textarea"
                :autosize="{ minRows:3, maxRows:6}"
                v-model="roleForm.DES"
                placeholder="请输入描述内容，不超过200字"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleCancel">取消</el-button>
        <el-button type="primary" @click="submitRole">提交</el-button>
      </span>
    </el-dialog>
    <tree-auth
      v-if="annualVisible"
      :treeData="treeData"
      class="item"
      :dialogVisible.sync="annualVisible"
    ></tree-auth>
    <tree-member
      v-if="memberVisible"
      class="item"
      :treeData="memberTreeData"
      :dialogVisible.sync="memberVisible"
    ></tree-member>
  </div>
</template>

<script>
import TreeAuth from "./tree-list/tree-auth.vue";
import TreeMember from "./tree-list/tree-member.vue";

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
      selectUsers: [],
      loading: false,
      depForm: {
        depOptions: [
          {
            MANAGERID: "33",
            LEADERID: "33",
            ID: "org1",
            LEADERNAME: "江越",
            MANAGERNAME: "江越",
            NAME: "开发"
          },
          {
            MANAGERID: "33",
            LEADERID: "33",
            ID: "org2",
            LEADERNAME: "江越",
            MANAGERNAME: "江越",
            NAME: "财务"
          },
          {
            MANAGERID: "33",
            LEADERID: "33",
            ID: "org3",
            LEADERNAME: "江越",
            MANAGERNAME: "江越",
            NAME: "销售"
          },
          {
            MANAGERID: "33",
            LEADERID: "33",
            ID: "org4",
            LEADERNAME: "江越",
            MANAGERNAME: "江越",
            NAME: "商务"
          }
        ]
      },
      memberTreeData: [],
      treeData: [
        {
          id: 1,
          label: "个人中心",
          children: [
            {
              id: 4,
              label: "个人中心"
            }
          ]
        },
        {
          id: 2,
          label: "审批考核",
          children: [
            {
              id: 5,
              label: "异常申请"
            },
            {
              id: 6,
              label: "加班申请"
            },
            {
              id: "2-1",
              label: "请假调休"
            },
            {
              id: "2-2",
              label: "绩效考核"
            }
          ]
        },
        {
          id: 3,
          label: "员工管理",
          children: [
            {
              id: 7,
              label: "员工管理"
            },
            {
              id: 8,
              label: "员工关怀"
            }
          ]
        }
      ],
      annualVisible: false,
      memberVisible: false,
      addRoleVisible: false,
      attendanceForm: {
        outPerson: "",
        desc: ""
      },
      formLabelWidth: "120px",
      roleForm: {
        NAME: "",
        DES: ""
      },
      rolesList: []
    };
  },
  mounted() {
    // console.log("tempArry");

    this.getOrgList();
    this.getRoleGroupList();
  },
  methods: {
    // 获取部门列表
    getOrgList() {
      fetchOrgList().then(res => {
        this.depOptions = res.item;
      });
      let tempArry = JSON.parse(JSON.stringify(this.depForm.depOptions));
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
      // console.log("tempArry", tempArry);
      this.depForm.depOptions = tempArry;
    },

    // 获取角色组列表
    getRoleGroupList() {
      let param = {
        filter: JSON.stringify({
          checked: "true"
        })
      };
      getRoleUserTree(param).then(res => {
        this.rolesList = res;
      });
    },

    // 角色组下的用户列表
    getUserScope(row) {
      let text = row.children.length
        ? row.children.map(item => item.text).join(",")
        : "-";
      if (row.text == "普通员工") {
        text = "默认所有员工";
      }
      return text;
    },

    querySearchAsync(queryString, index, type) {
      console.log("index", index);
      console.log("queryString", queryString);
      console.log("type", type);
      if (type) {
        this.depForm.depOptions[index].selectManagers = [
          {
            value: "33",
            label: "江越2"
          },
          {
            value: "31",
            label: "江越4"
          }
        ];
      } else {
        this.depForm.depOptions[index].selectLeaders = [
          {
            value: "43",
            label: "江越5"
          },
          {
            value: "40",
            label: "江越7"
          }
        ];
      }

      console.log(" this.depOptions", this.depOptions);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let param = {
          data: JSON.stringify({
            STATUS: "",
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
          this.selectUsers = tempData;
        });
      }, 1000 * Math.random());
    },
    makeFolder: function(item) {
      Vue.set(item, "children", []);
      this.addItem(item);
    },
    addItem: function(item) {
      item.children.push({
        name: "new stuff"
      });
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
          console.log(" newList!!", newList);
          console.log(" depOptions!!", this.depForm.depOptions);
          let param = {
            data: JSON.stringify(newList)
          };
          saveOrgManager(param).then(res => {
            if (res.success) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
            } else {
              this.$message.error("提交失败，请重试！");
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handleDeleteRole(row) {
      this.$confirm("确认删除该角色组吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        // center: true,
        // showCancelButton: false
      }).then(() => {
        let param = {
          ROLEID: row.ID
        };
        deleteRole(param).then(res => {
          if (res.success) {
            this.$message({
              message: "删除成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: "删除失败，请重试！",
              type: "error"
            });
          }
        });
      });
    },

    getTreeData(data) {
      data.forEach(item => {
        item.value = item.RESID || item.ID;
        item.label = item.NAME;
        item.children = item.items || item.users;

        if (item.children) {
          let childChecked = item.children.filter(item => item.checked == true);
          let countCheck = childChecked.length,
            countChild = item.children.length;

          console.log("childChecked", childChecked);
          item.isCheckAll = countCheck == countChild;
          item.isIndeterminate = countCheck > 0 && countCheck < countChild;
          console.log("childChecked222", countCheck == countChild);
          this.getTreeData(item.children);
        }
      });
      // console.log('dd',data)
      return data;
    },

    // 成员维护
    handleMemberClick() {
      let param = {
        filter: JSON.stringify({
          ROLEID: "role1"
        })
      };
      getUserRole(param).then(res => {
        // this.rolesList = res;
        let tempArry = JSON.parse(JSON.stringify(res.data));
        let treelist = this.getTreeData(tempArry);
        console.log("treelist", treelist);
        this.memberTreeData = treelist;
        this.memberVisible = true;
      });
    },
    // 权限维护
    handleAuthClick() {
      let param = {
        filter: JSON.stringify({
          ROLEID: "role1"
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
    roleCancel() {},
    submitRole() {
      let param = {
        data: JSON.stringify({
          ISUSE: "1",
          DES: this.roleForm.DES,
          NAME: this.roleForm.NAME
        })
      };
      addRole(param).then(res => {
        this.$message({
          message: "添加角色成功",
          type: "success"
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
.systemBox {
  width: 800px;
  padding: 20px;
  .tips_box {
    margin: 0 30px 30px;
    width: 100%;
  }
}
.mg_tab {
  width: 100%;
  margin: 20px auto 30px;
}
.button {
  text-align: right;
}
</style>
