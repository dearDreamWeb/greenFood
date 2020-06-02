<template>
  <el-row class="produceOrder">
    <nav-brand>
      <slot>订单结果</slot>
    </nav-brand>
    <v-step :step="step"></v-step>
    <el-row class="main">
      <el-row class="content-wrapper">
        <i class="el-icon-circle-check icon"></i>
        <h1 class="text">订单完成</h1>
      </el-row>
      <el-row>
        <el-button
          type="primary"
          class="btn"
          @click.stop.prevent="$router.push({ name: 'homeLink' })"
          >返回首页</el-button
        >
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import NavBrand from "../components/NavBrand"; // 头部条
import Step from "../components/Step"; //步骤条
export default {
  data() {
    return {
      step: 3
    };
  },
  // 如果未登录就禁止访问
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.getters.getUserInfo.isLogin != "true") {
        alert("请先登录！");
        vm.$router.push({ name: "loginLink" });
        return false;
      }
    });
  },
  components: {
    NavBrand,
    vStep: Step
  }
};
</script>

<style lang="scss" scoped>
.produceOrder {
  .main {
    .content-wrapper {
      padding: 2rem;
      text-align: center;
      .icon {
        display: inline-block;
        font-size: 5rem;
        color: #70c545;
        transition: all 0.3s cubic-bezier(0.44, 0.53, 0.51, 1.07);
        // transform: rotate3d(0,0,360deg);
        transform: rotateZ(360deg);
      }
      .text {
        padding: 2rem 0;
        font-size: 2rem;
      }
    }
    .btn {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 6rem;
      height: 3rem;
    }
  }
}
</style>
