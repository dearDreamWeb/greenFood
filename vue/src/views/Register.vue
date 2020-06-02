<template>
  <el-row class="register-wrapper">
    <nav-brand>
      <slot>注册</slot>
    </nav-brand>
    <el-row class="register">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="60px"
        label-position="top"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item label="验证码" prop="confirmCode">
          <el-row>
            <el-col>
              <v-canvas @nowVal="nowVal"></v-canvas>
            </el-col>
            <el-col>
              <el-input v-model="ruleForm.confirmCode"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </el-row>
</template>

<script>
import NavBrand from "../components/NavBrand"; // 头部条
import vCanvas from "../components/Canvas"; // canvas验证码
export default {
  data() {
    // 用户名
    var checkName = (rule, value, callback) => {
      let reg = /^\s*$/;
      let regName = /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,8}$/;
      if (reg.test(value)) {
        return callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        if (regName.test(value)) {
          callback();
        } else {
          callback(new Error("请输入中文，数字，字母，下划线，长度是3到8个"));
        }
      }, 1000);
    };
    // 密码
    var validatePass = (rule, value, callback) => {
      let reg = /^\s*$/;
      let regName = /\w{6,16}/;
      //是否包含不允许的特殊字符 允许的特殊字符有 ,.@
      let regWord = /[`!#$%^&*()_+<>?:"{}\\/;'[\]·！#￥（——）：；“”‘、，|《。》？、【】[\]]/i;
      if (reg.test(value)) {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        if (regName.test(value) && !regWord.test(value)) {
          callback();
        } else {
          return callback(
            new Error("密码只允许英文或数字或字符,.@ 长度为6到16个")
          );
        }
      }
    };
    // 确认密码
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 验证码
    var checkConfirmCode = (rule, value, callback) => {
      // 校验看验证码是否输入正确
      if (
        value.toString().toLowerCase() ===
        this.nowConfirmCode.toString().toLowerCase()
      ) {
        callback();
      } else {
        callback(new Error("验证码输入错误"));
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        name: "",
        confirmCode: "" //输入框的值
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        name: [{ validator: checkName, trigger: "blur" }],
        confirmCode: [{ validator: checkConfirmCode, trigger: "blur" }]
      },
      nowConfirmCode: "" // 验证码的值
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/register",
            params: {
              userName: this.ruleForm.name,
              passWord: this.ruleForm.pass
            }
          })
            .then(res => {
              switch (res.data.status) {
                case 1:
                  this.$message.success("恭喜你，注册成功");
                  break;

                case 0:
                  this.$message.error("该用户名已存在");
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 当前验证码的值
    nowVal(val) {
      this.nowConfirmCode = val;
    }
  },
  components: {
    NavBrand,
    vCanvas
  }
};
</script>

<style lang="scss" scoped>
.register-wrapper {
  .register {
    margin: 2rem auto;
    width: 30%;
    @media screen and (max-width: 900px) {
      left: 0;
      width: 90%;
    }
  }
}
</style>
