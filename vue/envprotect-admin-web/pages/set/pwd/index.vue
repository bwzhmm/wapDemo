<template>
  <div class="wapper-content">
    <div class="wapper-box">
      <h1 class="pwd-title">修改密码</h1>
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>密码至少6位，包含数字、大小写字母和特殊字符。</span>
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="原密码：" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="修改密码：" prop="newPass">
          <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div class="wapper-footer">
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
  </div>
</template>

<script>
import { service, logService } from "@env/utils/request.js";
export default {
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

    changePwd() {
      let path = "authweb.AU_USER.changePwd";
      let params = {
        PASSWORDPARAM: {
          OLDPWD: this.ruleForm.oldPass,
          NEWPWD: this.ruleForm.checkPass
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          if (res.data) {
            this.$message({
              type: "success",
              message: "密码修改成功！"
            });
            //1登录 2新增 3删除 4修改
            let logparams = {
              ENV_LOG: {
                TYPE: "4",
                MODULE: "设置中心>修改密码",
                CONTENT: `修改密码："${this.ruleForm.oldPass}>${this.ruleForm.checkPass}"`
              }
            };
            logService(logparams);
          } else {
            this.$message({
              type: "error",
              message: "原密码不正确！"
            });
          }
        }
      });
    },

    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changePwd();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.pwd-title {
  font-weight: 600;
  color: #3a3a3a;
  font-size: 14px;
  margin-bottom: 30px;
}
.wapper-box {
  width: 560px;
  min-height: 750px;
  .el-form {
    width: 400px;
  }
}
.tips_box {
  margin-left: 0px;
}
.wapper-footer {
  margin-left: 100px;
}
</style>
