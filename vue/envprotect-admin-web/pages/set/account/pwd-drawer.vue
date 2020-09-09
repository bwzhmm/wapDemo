<template>
  <el-drawer
    :title="iSRestPwd ? '重置密码' :'修改密码'"
    custom-class="demo-drawer"
    :visible.sync="dialogVisible"
    :before-close="hidePanel"
    width="600px"
    ref="drawer"
    :wrapperClosable="false"
  >
    <div class="drawer-content">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>密码至少6位，包含数字、大小写字母和特殊字符。</span>
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="原密码：" prop="oldPass" v-if="!iSRestPwd">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="修改密码：" prop="newPass">
          <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div class="drawer-footer">
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          class="mg-r20"
          @click="save('ruleForm')"
        >保存</el-button>
        <el-button
          plain
          size="small"
          icon="el-icon-refresh-right"
          @click="handleRest('ruleForm')"
        >重置</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { service, logService } from "@env/utils/request.js";
export default {
  name: "pwd-drawer",
  props: ["dialogVisible", "iSRestPwd", "parentForm"],
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        if (this.ruleForm.newPass !== "") {
          this.$refs.ruleForm.validateField("newPass");
        }
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validateNewPass = (rule, value, callback) => {
      let reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{6,}$/;
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (!reg.test(value)) {
        callback(new Error("密码须包含数字、大小写字母和特殊字符"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPass: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          {
            validator: validateOldPass,
            trigger: "blur",
            required: true
          }
        ],
        newPass: [
          {
            validator: validateNewPass,
            trigger: "blur",
            required: true
          }
        ],
        checkPass: [
          {
            validator: validateCheckPass,
            trigger: "blur",
            required: true
          }
        ]
      }
    };
  },

  methods: {
    handleRest(formName) {
      this.$refs[formName].resetFields();
    },

    resetPwd() {
      let path = "authweb.AU_USER.resetPwd";
      let params = {
        AU_USER: {
          ID: this.parentForm.ID,
          PWD: this.ruleForm.checkPass
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "密码重置成功！"
          });
          this.hidePanel();
          //1登录 2新增 3删除 4修改
          let logparams = {
            ENV_LOG: {
              TYPE: "4",
              MODULE: "设置中心>账号管理>重置密码",
              CONTENT: `重置密码："${this.ruleForm.checkPass}"`
            }
          };
          logService(logparams);
        }
      });
    },

    hidePanel() {
      this.$emit("update:dialogVisible", false);
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.resetPwd();
        }
      });
    }
  }
};
</script>

