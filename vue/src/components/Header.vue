<template>
  <div class="header">
    <el-row>
      <el-col :span="4">
        <a href="javascript:;" @click="$router.push({ name: 'homeLink' })">
          <img src="../../public/logo.png" alt="logo" />
        </a>
      </el-col>
      <el-col :span="20" class="right" v-if="!getUser">
        <router-link :to="{ name: 'loginLink' }">
          <p class="login">登录</p>
        </router-link>
        <router-link :to="{ name: 'registerLink' }">
          <p class="register">注册</p>
        </router-link>
      </el-col>
      <el-col :span="20" class="loginTrue" v-else>
        <span class="userName">{{ getUserName }}</span>
        <span @click="removeUser" class="loginOut">注销</span>
        <!-- 购物车计数 -->
        <el-badge :value="totalNum" :max="99">
          <router-link :to="{ name: 'cartLink' }">
            <i class="el-icon-shopping-cart-2 cart"> </i>
          </router-link>
        </el-badge>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  computed: {
    // 获取用户名是否登录
    getUser() {
      return JSON.parse(this.$store.getters.getUserInfo.isLogin);
    },
    // 获取用户名
    getUserName() {
      let jsonData = JSON.parse(this.$store.getters.getUserInfo.userInfo);
      if (jsonData) {
        return jsonData.userName;
      }
      return false;
    },
    // 计算购物车总数
    totalNum() {
      return this.$store.getters.getCount;
    }
  },
  methods: {
    // 退出登录 删除vuex里的用户信息
    removeUser() {
      this.$axios({
        method: "get",
        url: "/loginOut"
      })
        .then(res => {
          if (res.data.loginOut) {
            this.$store.commit("deleteUserInfo");
            this.$message.success("退出登录成功！");
            this.$router.push({ name: "homeLink" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //  初始化购物车商品总数
    initCartCount() {
      let userInfo = JSON.parse(this.$store.getters.getUserInfo.userInfo);
      if (userInfo) {
        let userId = userInfo.userId;
        this.$axios({
          method: "get",
          url: "/cartCount",
          params: {
            userId
          }
        })
          .then(res => {
            this.$store.commit("setCount", res.data.num);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  created() {
    this.initCartCount();
  }
};
</script>

<style lang="scss" socped>
.header {
  background: #fff;
  .right {
    display: flex;
    padding: 2rem 2rem 1rem 0;
    justify-content: flex-end;
    font-size: 1.1rem;
    .register {
      padding: 0 1rem;
    }
    & :nth-child(n) {
      &:hover {
        cursor: pointer;
      }
    }
  }
  .loginTrue {
    display: flex;
    padding: 2rem 2rem 1rem 0;
    justify-content: flex-end;
    font-size: 1.1rem;
    .userName {
      padding-right: 1rem;
    }
    .loginOut {
      padding-right: 1rem;
      &:hover {
        cursor: pointer;
        color: #f40;
      }
    }
    .cart {
      font-size: 1.3rem;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
