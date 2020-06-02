<template>
  <el-row class="addAddress">
    <el-row class="form">
      <el-form ref="form" label-width="80px">
        <el-form-item label="收货人">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" @keyup.enter.native="submit">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-button class="btn" type="primary" @click="submit">确定</el-button>
        <i class="el-icon-close icon" @click="changeStatus"></i>
      </el-form>
    </el-row>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        phone: "",
        address: ""
      }
    };
  },
  methods: {
    // 先父组件传递一个自定义事件，让其关闭模态框
    changeStatus() {
      this.$emit("closed");
    },
    // 提交
    submit() {
      let reg = /^\s*$/;
      let regPhone = /^1\d{10}$/;
      if (
        reg.test(this.form.name) ||
        reg.test(this.form.phone) ||
        reg.test(this.form.address)
      ) {
        this.$message.error("选项不能为空");
        regPhone.test(this.form.phone)
          ? false
          : this.$message.error("手机号码不正确");
      } else {
        this.$axios({
          method: "get",
          url: "/addAddress",
          params: {
            userName: this.form.name,
            phone: this.form.phone,
            address: this.form.address
          }
        })
          .then(res => {
            if (res.data.status === 1) {
              this.$emit("closed");
              this.$message.success("添加地址成功！");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.addAddress {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(210, 209, 209, 0.9);
  .form {
    position: relative;
    margin: 0 auto;
    padding: 3rem;
    transform: translateY(20%);
    width: 50%;
    background: #fff;
    border-radius: 5px;
    @media screen and (max-width: 981px) {
      padding-left: 0;
      padding-right: 1rem;
      transform: translateY(0);
      width: 100%;
      height: 100%;
    }
    .btn {
      width: 100%;
    }
    .icon {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 1.5rem;
      font-weight: 500;
      &:hover {
        cursor: pointer;
        color: #f40;
      }
    }
  }
}
</style>
