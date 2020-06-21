<template>
  <div>
    <div class="table_head">
      <h4>修改密码</h4>
    </div>
    <div class="passwordBox">
      <div class="tips_box">
        <i class="el-icon-warning"></i>
        <span>密码至少6位，包含字母和数字。</span>
      </div>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="修改密码" prop="newPass">
          <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { editPassword } from "@/api/user";
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            data: JSON.stringify({
              ID: "100",
              oldPWD: this.ruleForm.oldPass,
              newPWD: this.ruleForm.newPass,
              newPWD2: this.ruleForm.checkPass
            })
          };
          editPassword(param).then(res => {
            if (res.success) {
              this.$message({
                message: "密码修改成功！",
                type: "success"
              });
            } else {
              this.$message.error(res.data.errInf.shortBusInf);
            }
          });
        }
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
.passwordBox {
  width: 320px;
  .tips_box {
    margin: 30px;
    width: 100%;
  }
}
</style>