<template>
  <div class="login-container"  @keyup.enter="handleLogin">
    <el-form
      v-if="tigger == 1"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
    >
      <h3 class="title">商城后台</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model="loginForm.loginName"
          name="username"
          type="text"
           auto-complete="on"
          placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <!--<el-form-item prop="imageCode">-->
      <!--<div style="display:flex;">-->
      <!--<el-input-->
      <!--v-model="loginForm.imageCode"-->
      <!--name="imageCode"-->
      <!--type="text"-->
      <!--auto-complete="on"-->
      <!--placeholder="验证码"/>-->
      <!--<img :src="imageCode" @click="getCode" style="width:200px;height:50px;">-->
      <!--</div>-->
      <!--</el-form-item>-->
      <el-button type="text" class="tiggerType" @click="tiggerType(2)">切换手机登陆</el-button>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
    <el-form
      v-else
      ref="loginForm"
      :model="loginMessForm"
      :rules="loginMessRules"
      class="login-form"
      label-position="left">
      <h3 class="title">商城后台</h3>
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model="loginMessForm.mobile"
          name="mobile"
          type="number"
          auto-complete="on"
          placeholder="请输入手机号码"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <!--<el-form-item prop="imageCode">-->
      <!--<div style="display:flex;">-->
      <!--<el-input-->
      <!--class="deal"-->
      <!--v-model="loginMessForm.imageCode"-->
      <!--name="imageCode"-->
      <!--type="text"-->
      <!--auto-complete="on"-->
      <!--placeholder="请输入图片验证码"-->
      <!--@keyup.enter.native="handleLogin"-->
      <!--/>-->
      <!--<img :src="imageCode" @click="getCode" style="width:200px;height:50px;">-->
      <!--</div>-->
      <!--</el-form-item>-->
      <el-form-item prop="smsCode">
        <div style="display:flex;">
          <el-input
            v-model="loginMessForm.smsCode"
            name="smsCode"
            type="text"
            auto-complete="on"
            placeholder="请输入短信验证码"
            @keyup.enter.native="handleLogin"
          />
          <el-button  :disabled="bOk" style="width:200px;height:50px;" @click="getMsg">{{smsMessage}}</el-button>
        </div>
      </el-form-item>
      <el-button type="text" class="tiggerType" @click="tiggerType(1)">切换邮箱登陆</el-button>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
// import { isvalidUsername } from "@/utils/validate";
import { getImg, loginAfter, sms, getUserActionAfterLogin } from "@/api/login";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      tigger: 1,
      loginForm: {
        loginName: "",
        password: "",
        flag:1
        // imageCode: ""
      },
      loginMessForm: {
        mobile: '',
        // imageCode: '',
        smsCode: ''
      },

        bOk: false,
        smsMessage: '获取短信验证码',
        imageCode: "",
        loginRules: {
          username: [
            { required: true, trigger: "blur", validator: validateUsername }
          ],
          password: [
            { required: true, trigger: "blur", validator: validatePass }
          ]
        },
        loginMessRules: {
          mobile: [
            {required: true,  message: '请输入手机号' , trigger: 'blur'},
          ],
          smsCode: [
            {required: true,  message: '请输入短信验证码' , trigger: 'blur'},
          ]
        },
        loading: false,
        pwdType: "password",
        redirect: undefined
      };
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    },
    methods: {
      tiggerType(val) {
        
        this.tigger = val;
        if(this.tigger == 1) {
          this.$refs['loginMessForm'].resetFields();
        }else {
          this.$refs['loginForm'].resetFields();
        }
      },

      // 获取短信验证码
      getMsg() {
        let reg = /^[1]\d{10}$/;
        if (reg.test(this.loginMessForm.mobile)) {
          // if(this.loginMessForm.imageCode !== '') {
          let parmas = {
            mobile: this.loginMessForm.mobile
            // imageCode: this.loginMessForm.imageCode
          };
          let num = 60;
          this.bOk = true;
          sms(parmas).then((res) => {
            if(res.code == 200) {
              let _this = this;
              let interval = setInterval(function () {
                num--;
                _this.smsMessage = '请在' + num + 's后重试';
                if (num <= 0) {
                  clearInterval(interval);
                  _this.smsMessage = '获取短信验证码';
                  _this.bOk = false;
                  _this.getCode();
                }
              }, 1000);
            }else {
              this.smsMessage = '获取短信验证码';
              this.bOk = false;
            }
          })
          // }else {
          //   this.$notify.error({
          //     title: '请输入图片验证码!'
          //   });
          // }
        } else {
          this.$notify.error({
            title: '请输入11位手机号!'
          });
        }
      },


      /**
       * @密码明文
       */
      showPwd() {
        if (this.pwdType === "password") {
          this.pwdType = "";
        } else {
          this.pwdType = "password";
        }
      },
      /**
       * @登录方法
       */
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if(this.tigger == 1) {
            if (valid) {
              this.loading = true;
              this.$store
                .dispatch("Login", this.loginForm)
                .then(data => {
                  if (data.code == 200) {
                    getUserActionAfterLogin().then(res => {
                      if(res.code ==200) {
                        this.$store.dispatch('getPermission', res.result);
                      }
                    }).catch(err => {
                      console.log(err, 'getUser')
                    });
                    //
                    loginAfter()
                      .then(res => {
                        if (res.code == "200") {
                          let menuList = res.result.menuList;
                          let userName = res.result.loginAuthDto.userName;
                          let loginName = res.result.loginAuthDto.loginName;
                          let url = menuList[0].vueRouter + menuList[0].subMenu[0].url;
                          console.log(url);
                          this.$router.push({ path: url });
                          sessionStorage.setItem('menuActiveIndex', '0-0');
                          sessionStorage.setItem('userName', userName);
                          sessionStorage.setItem('loginName', loginName);
                        }
                      })
                      .catch(err => {});
                  }else{
                    this.$message.error(data.message);
                  }
                  this.loading = false;
                })
                .catch(() => {
                  this.getCode();
                  this.loading = false;
                });
            } else {
              console.log("error submit!!");
              return false;
            }
          }else {
            let reg = /^[1]\d{10}$/;
            if (reg.test(this.loginMessForm.mobile)) {
              if(this.loginMessForm.smsCode !== '') {
                let parmas = {
                  mobile: this.loginMessForm.mobile,
                  smsCode: this.loginMessForm.smsCode
                };
                this.$store
                  .dispatch("mobileLogin", parmas)
                  .then(data => {
                   if (data.code == 200) {
                    getUserActionAfterLogin().then(res => {
                      if(res.code ==200) {
                        this.$store.dispatch('getPermission', res.result);
                      }
                    }).catch(err => {
                      console.log(err)
                    });
                    //
                    loginAfter()
                    .then(res => {
                      if (res.code == "200") {
                        let menuList = res.result.menuList;
                        this.$router.push({ path: menuList[0].vueRouter });
                        localStorage.setItem('menuActiveIndex', '0-0')
                      }
                    }).catch(err => {});
                  }
                  this.loading = false;
                }).catch(err => {
                  this.getCode();
                })
              }else {
                this.$notify.error({
                  title: '请输入短信验证码!'
                });
              }
            } else {
              this.$notify.error({
                title: '请输入11位手机号!'
              });
            }
          }
        });
      },
      /**
       * @获取图形验证码
       */
      getCode() {
        localStorage.removeItem("token");
        getImg()
          .then(res => {
            this.imageCode = "data:image/jpg;base64," + res.result;
          })
          .catch(err => {});
      }
    },
    mounted() {
      // this.getCode();
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">

  input::-webkit-outer-spin-button,

  input::-webkit-inner-spin-button { -webkit-appearance: none; }

  input[type="number"]{ -moz-appearance: textfield; }

  $bg: #2d3a4b;
  $light_gray: #eee;
  /* reset element-ui css */
  .login-container {
    .tiggerType {
      margin-bottom: 22px;
      text-align: right;
      width: 100%;
      padding: 0;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
