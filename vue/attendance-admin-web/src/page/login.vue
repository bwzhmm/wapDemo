<template>
  <div class="login_page">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer rflex">
        <div>
          <img :src="loginImg" class="langAvatar" />
        </div>
        <div class="titleArea cflex">
          <span class="title">昂克考勤系统</span>
          <el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
            <el-form-item prop="username" class="login-item">
              <span class="loginTips"></span>
              <el-input
                @keyup.enter.native="submitForm('loginForm')"
                class="area"
                type="text"
                placeholder="请输入登录账号"
                v-model="loginForm.username"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password" class="login-item">
              <span class="loginTips"></span>
              <el-input
                @keyup.enter.native="submitForm('loginForm')"
                class="area"
                type="password"
                placeholder="请输入登录密码"
                v-model="loginForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')" class="login_btn">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import loginImg from "@/assets/img/login_center.png";
import { login } from "@/api/user";

export default {
  data() {
    return {
      loginImg: loginImg,
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    loginByWechat() {},
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message
      });
    },
    submitForm(loginForm) {
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          let userinfo = this.loginForm;

          login(userinfo).then(res => {
            let userList = res.data.userList;
            this.$router.push({ path: "/home" });
            // this.$store.dispatch("initLeftMenu"); //设置左边菜单始终为展开状态
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../assets/img/login_bg.png) no-repeat center center;
  background-size: 100% 100%;
}
.form_contianer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 870px;
  border-radius: 20px;
  padding: 100px 35px;
  text-align: center;
  justify-content: space-around;
  box-shadow: 0px 0px 20px 8px rgba(24, 144, 255, 0.16);
  .titleArea {
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;
    font-size: 22px;
    width: 50%;
    .title {
      color: #1890ff;
      font-size: 24px;
    }
  }
  .el-form-item--mini.el-form-item {
    margin-bottom: 60px;
  }
  .loginForm {
    margin-top: 60px;
    .login_btn {
      width: 300px;
      height: 48px;
      background: linear-gradient(
        270deg,
        rgba(53, 195, 255, 1) 0%,
        rgba(24, 144, 255, 1) 100%
      );
      border-radius: 20px;
      font-size: 18px;
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

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
.loginForm {
  .el-button--primary {
    border: none;
  }
}
</style>
