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
          <!-- <el-col :span="8">
            <el-form-item label="部门：" prop="outPerson" :label-width="formLabelWidth">
              <el-input v-model="attendanceForm.outPerson"></el-input>
            </el-form-item>
          </el-col>-->
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
        <el-table-column prop="roles" label="角色组" width="180"></el-table-column>
        <el-table-column prop="users" label="用户列表"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="opacity_65" v-if="scope.row.roleType==0">所有权限</span>
            <el-button
              @click="handleAuthClick(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.roleType>0"
            >权限维护</el-button>
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.roleType==2"
            >成员维护</el-button>
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.roleType==2"
            >删除角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="权限维护" :visible.sync="annualVisible" width="600px">
      <div class="title">
        <span class="opacity_65">普通员工</span>
      </div>
      <ul id="demo" v-for="(child, index) in treeData" :key="index">
        <tree-item class="item" :treelist="child" @make-folder="makeFolder" @add-item="addItem"></tree-item>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="dialogVisible=false">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="500px">
      <el-form :model="roleForm" ref="roleForm">
        <el-row>
          <el-col :span="20">
            <el-form-item label="角色组:" label-width="100px">
              <el-input v-model="roleForm.roles" placeholder="请输入角色组名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="用户列表:" label-width="100px">
              <el-input v-model="roleForm.users" placeholder="请选择用户"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleCancel">取消</el-button>
        <el-button type="primary" @click="submitRole">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TreeItem from "../../components/tree-list/tree-item.vue";
import { fetchOrgList, saveOrgManager, addRole } from "@/api/auth";
import { fetchUserList } from "@/api/user";

export default {
  components: {
    TreeItem
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
      addRoleVisible: false,
      attendanceForm: {
        outPerson: "",
        desc: ""
      },
      formLabelWidth: "120px",
      roleForm: {
        roles: "角色",
        users: "张三"
      },
      rolesList: [
        {
          roles: "超级管理员",
          users: "王小虎",
          roleType: 0
        },
        {
          roles: "普通员工",
          users: "默认所有员工",
          roleType: 1
        },
        {
          roles: "部门经理",
          users: "张三",
          roleType: 2
        }
      ]
    };
  },
  mounted() {
    // console.log("tempArry");
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
    console.log("tempArry", tempArry);
    this.depForm.depOptions = tempArry;
  },
  methods: {
    querySearchAsync(queryString, index, type) {
      console.log("index", index);
      console.log("queryString", queryString);
      console.log("type", type);
      if (type) {
        this.depForm.depOptions[index].selectManagers = [
          { value: "33", label: "江越2" },
          { value: "31", label: "江越4" }
        ];
      } else {
        this.depForm.depOptions[index].selectLeaders = [
          { value: "43", label: "江越5" },
          { value: "40", label: "江越7" }
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
            return { label: item.NAME, value: item.ID };
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
    handleAuthClick() {
      this.annualVisible = true;
    },
    addRole() {
      this.addRoleVisible = true;
    },
    roleCancel() {},
    submitRole() {
      let param = {
        data: JSON.stringify({
          ISUSE: "1",
          DES: "",
          NAME: ""
        })
      };
      addRole(param).then(res => {});
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
.title {
  border-left: 3px solid #38adff;
  padding: 0 10px;
  margin-bottom: 20px;
}
.picker_width140 {
  width: 140px;
  margin-right: 10px;
}
.picker_width100 {
  width: 100px;
  margin-right: 10px;
}
.mg_tab {
  width: 100%;
  margin: 20px auto 30px;
}
.button {
  text-align: right;
}
</style>