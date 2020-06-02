<template>
  <div class="navBrand">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        ><router-link to="/">首页</router-link></el-breadcrumb-item
      >
      <el-breadcrumb-item><slot></slot></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.navBrand {
  padding: 1rem;
  background: #e6e5e5;
  border-top: 1px solid rgba(77, 77, 77, 0.1);
  border-bottom: 1px solid rgba(77, 77, 77, 0.1);
}
</style>
