<template>
  <div id="app">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script>
import vHeader from "./components/Header";
export default {
  components: {
    vHeader
  }
};
</script>

<style lang="scss">
body {
  background: rgba(233, 245, 245, 0.5);
}
.el-message-box {
  @media screen and (max-width: 981px) {
    width: 80vw !important;
  }
}
</style>
