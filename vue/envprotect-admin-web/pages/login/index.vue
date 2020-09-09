<template>
  <div class="login_page">
    <div class="login_bg"></div>
    <section class="form_contianer">
      <p class="title">欢迎登录</p>
      <p class="title">昂克环保管家系统</p>
      <div class="titleArea cflex">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm" v-if="!isIE9">
          <el-form-item prop="username" class="login-item">
            <span class="loginTips"></span>
            <el-input
              @keyup.enter.native="submitForm('loginForm')"
              class="login-input"
              type="text"
              placeholder="请输入登录账号"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" class="login-item">
            <span class="loginTips"></span>
            <el-input
              @keyup.enter.native="submitForm('loginForm')"
              class="login-input"
              type="password"
              placeholder="请输入登录密码"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('loginForm')"
              :class="loginForm.username&&loginForm.password ?'visible':'dim'"
              class="login_btn"
            >登录</el-button>
          </el-form-item>
          <span class="footer">版权所有 © 2020 南京昂克软件有限公司</span>
        </el-form>
        <div v-else>
          <span class="ie-tips">您的浏览器版本过低，为了更好的用户体验，请使用IE10及以上版本！</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { service, loginService } from "@env/utils/request.js";
import util from "@env/utils/util";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
          // { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      isIE9: false
    };
  },
  mounted() {
    let browser = navigator.appName;
    let b_version = navigator.appVersion;
    let version = b_version.split(";");
    let ieVersion = version[1].replace(/[ ]/g, "");
    let versionType = ["MSIE6.0", "MSIE7.0", "MSIE8.0", "MSIE9.0"];
    console.log("window", ieVersion);
    if (
      browser == "Microsoft Internet Explorer" &&
      versionType.includes(ieVersion)
    ) {
      this.isIE9 = true;
      console.log("您的浏览器版本过低，请使用IE9及以上版本");
    }
  },
  methods: {
    submitForm(loginForm) {
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          let params = {
            LOGINNAME: this.loginForm.username,
            PASSWORD: this.loginForm.password
          };
          loginService(params).then(res => {
            if (res.success) {
              if (!this.isIE9) {
                this.$router.push({ name: "dashboard" });
              }
            } else {
              this.$message({
                type: "error",
                message: "登录失败"
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login_page {
  height: 100%;
}

.login_bg {
  position: absolute;
  width: 1000px;
  height: 100%;
  background: url("~@env/assets/imgs/login-bg.png") no-repeat right;
  background-size: cover;
}
.title {
  color: #3a3a3a;
  font-size: 36px;
  display: block;
  font-weight: 600;
  line-height: 50px;
  margin-bottom: 10px;
}
.form_contianer {
  position: fixed;
  top: 200px;
  right: 16%;
  .el-form-item--mini.el-form-item {
    margin-bottom: 60px;
  }
  .loginForm {
    margin-top: 50px;
    .login_btn {
      width: 300px;
      height: 48px;
      background: linear-gradient(
        270deg,
        rgba(53, 195, 255, 1) 0%,
        rgba(24, 144, 255, 1) 100%
      );
      box-shadow: 0px 6px 10px 0px rgba(24, 144, 255, 0.2);
      border-radius: 24px;
    }
    .loginTips {
      position: absolute;
      left: 10px;
      z-index: 20;
      font-size: 18px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.loginForm {
  .el-button--primary {
    border: none;
  }
}
.login-input /deep/ .el-input__inner {
  width: 300px;
  height: 48px;
  background: #f7f5fb;
  border-radius: 30px;
  border: none;
  text-indent: 10px;
}
.footer {
  color: #999;
  text-align: center;
  display: block;
}
.loginForm /deep/ div.el-form-item__error {
  text-indent: 15px;
}
.visible {
  opacity: 1;
}
.dim {
  opacity: 0.3;
}
.ie-tips {
  margin-top: 10px;
  display: block;
  font-size: 16px;
  color: #999;
}
</style>
