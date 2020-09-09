<template>
  <el-drawer
    :title="userForm.ID ? '编辑账号' :'新增账号'"
    custom-class="demo-drawer"
    :before-close="hidePanel"
    :visible.sync="dialogVisible"
    width="600px"
    ref="drawer"
    :wrapperClosable="false"
  >
    <div class="drawer-content">
      <div class="tips_box" v-show="!userForm.ID">
        <i class="el-icon-warning"></i>
        <span>
          新增账号密码为
          <i class="blue-text">123456</i>。
        </span>
      </div>

      <el-form :model="userForm" ref="userForm" label-width="80px">
        <el-form-item
          label="登录名："
          prop="LOGINNAME"
          :rules="[{ required: true, message: '登录名不能为空', trigger: 'blur'},
           { pattern: /^[^\u4e00-\u9fa5]*$/, message: '登录名不能为中文' }
          ]"
        >
          <el-input v-model="userForm.LOGINNAME" placeholder="请输入登录名"></el-input>
        </el-form-item>

        <el-form-item
          label="姓名："
          prop="NAME"
          :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur'}]"
        >
          <el-input v-model="userForm.NAME" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item
          label="角色："
          prop="ROLEID"
          :rules="[{ required: true, message: '角色不能为空', trigger: 'blur'}]"
        >
          <el-select v-model="userForm.ROLEID" filterable placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roles" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          class="mg-r20"
          @click="save('userForm')"
        >保存</el-button>
        <el-button
          plain
          size="small"
          icon="el-icon-refresh-right"
          @click="handleRest('userForm')"
        >重置</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { service, logService } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
export default {
  name: "user-drawer",
  props: ["dialogVisible", "parentForm", "roles"],
  data() {
    return {
      userForm: {}
    };
  },
  mounted() {
    this.userForm = Object.assign({}, this.parentForm);
  },
  methods: {
    handleRest(formName) {
      this.$refs[formName].resetFields();
    },

    add() {
      let path = "authweb.AU_USER.add";
      let params = {
        AU_ORGUSER: [{ ORGID: ENV.ORGID }],
        AU_ROLEUSER: [
          {
            ROLEID: this.userForm.ROLEID
          }
        ],
        AU_USERADD: {},
        AU_USER: {
          NAME: this.userForm.NAME,
          LOGINNAME: this.userForm.LOGINNAME,
          SEX: 1,
          STATUS: "1",
          PWD: "123456" //新增时密码必填
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "添加成功"
          });
          this.hidePanel();
          this.$emit("flushList");

          //1登录 2新增 3删除 4修改
          let logparams = {
            ENV_LOG: {
              TYPE: "2",
              MODULE: "设置中心>账号管理>新增账号",
              CONTENT: `新增账号："${this.userForm.LOGINNAME}"`
            }
          };
          logService(logparams);
        } else {
          this.$message({
            type: "error",
            message: "添加失败"
          });
        }
      });
    },

    edit() {
      let path = "authweb.AU_USER.edit";
      let params = {
        AU_ORGUSER: [{ ORGID: ENV.ORGID }],
        AU_ROLEUSER: [
          {
            ROLEID: this.userForm.ROLEID
          }
        ],
        AU_USERADD: { ID: this.userForm.ID },
        AU_USER: {
          ID: this.userForm.ID,
          NAME: this.userForm.NAME,
          LOGINNAME: this.userForm.LOGINNAME,
          SEX: 1,
          STATUS: "1"
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "编辑成功"
          });
          this.hidePanel();
          this.$emit("flushList");
          let editStr = "";
          if (this.parentForm.LOGINNAME !== this.userForm.LOGINNAME) {
            editStr += `${this.parentForm.LOGINNAME}>${this.userForm.LOGINNAME}；`;
          }
          if (this.parentForm.NAME !== this.userForm.NAME) {
            editStr += `${this.parentForm.NAME}>${this.userForm.NAME}；`;
          }
          if (this.parentForm.ROLEID !== this.userForm.ROLEID) {
            let roleNameArr = this.roles.filter(
              item => item.ID == this.userForm.ROLEID
            );
            let roleName = roleNameArr[0].NAME;
            editStr += `${this.parentForm.ROLENAME}>${roleName}；`;
          }
          let logparams = {
            ENV_LOG: {
              TYPE: "4",
              MODULE: "设置中心>账号管理>编辑账号",
              CONTENT: `编辑账号：${editStr}`
            }
          };
          logService(logparams);
        }
      });
    },

    // 利用sync进行数据双向绑定，子组件修改dialogVisible的值，并响应到父组件
    hidePanel() {
      this.$emit("update:dialogVisible", false);
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.userForm.ID) {
            this.edit();
          } else {
            this.add();
          }
        }
      });
    }
  }
};
</script>

