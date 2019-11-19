<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img src="https://dwz.cn/zz4V0dV7" class="user-avatar" />
        <span>{{userName}}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <!--<router-link class="inlineBlock" to="/">-->
        <!--<el-dropdown-item>Home</el-dropdown-item>-->
        <!--</router-link>-->
        <el-dropdown-item divided>
          <span style="display:block;" @click="openChangePassword">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-drawer
      title="修改密码"
      :before-close="handleClose"
      :visible.sync="dialog"
      destroy-on-close
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
          <el-form-item label="当前登录密码" prop="oldPassword">
            <el-input
              :style="inputWidth"
              placeholder="请输入旧密码"
              v-model="form.oldPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="新的登录密码" prop="newPassword">
            <el-input
              :style="inputWidth"
              placeholder="请输入新密码"
              v-model="form.newPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新的登录密码" prop="confirmPwd">
            <el-input
              :style="inputWidth"
              placeholder="确认新的登录密码"
              v-model="form.confirmPwd"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="dialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmChangePwd"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { modifyUserPwd } from "@/api/login";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { PcCookie, enums } from "@/utils";

export default {
  mounted() {
    if (window.sessionStorage.getItem("userName")) {
      this.userName = window.sessionStorage.getItem("userName");
    }
    if (window.sessionStorage.getItem("loginName")) {
      this.form.loginName = window.sessionStorage.getItem("loginName");
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.confirmPwd !== "") {
          this.$refs.ruleForm.validateField("newPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userName: "",
      form: {
        loginName: "",
        oldPassword: "",
        newPassword: "",
        confirmPwd: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入原始密码", trigger: "blur" }
        ],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        confirmPwd: [{ validator: validatePass2, trigger: "blur" }]
      },
      formLabelWidth: "160px",
      inputWidth: "width:230px;",
      table: false,
      dialog: false,
      loading: false
    };
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    handleClose(done) {
      this.form.oldPassword = "";
      this.form.newPassword = "";
      this.form.confirmPwd = "";
      done();
    },
    //修改密码弹出层展开
    openChangePassword() {
      this.dialog = true;
    },
    //提交修改密码
    confirmChangePwd() {
      let params = Object.assign({}, this.form);
      modifyUserPwd(params)
        .then(res => {
          if (res.code == "200") {
            this.loading = false;
            this.dialog = false;
            this.$message({
              message: res.message,
              type: "success"
            });
            this.form.oldPassword = "";
            this.form.newPassword = "";
            this.form.confirmPwd = "";
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定"
            });
            this.form.oldPassword = "";
            this.form.newPassword = "";
            this.form.confirmPwd = "";
          }
        })
        .catch(err => {
          this.loading = false;
          this.dialog = false;
        });
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store
        .dispatch("LogOut")
        .then(() => {
          console.log("调用登出的store方法成功");
        })
        .catch(err => {
          console.log("调用登出的store方法失败");
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        // position: absolute;
        // right: -20px;
        // top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

