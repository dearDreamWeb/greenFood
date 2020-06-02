<template>
  <el-row class="step" style="background:#fff;">
    <el-row style="width:80%;margin: 0 auto;padding:10px 0;">
      <el-steps :active="step" finish-status="success">
        <el-step title="收货地址"></el-step>
        <el-step title="订单交易"></el-step>
        <el-step title="生成订单"></el-step>
      </el-steps>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style></style>
