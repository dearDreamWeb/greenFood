<template>
  <el-row class="address" @scroll.prevent.stop="false">
    <nav-brand>
      <slot>收货地址</slot>
    </nav-brand>
    <v-step :step="step"></v-step>
    <!-- 地址区域 -->
    <el-row class="main">
      <!-- 遍历数据库的所有地址信息 -->
      <el-col
        :md="5"
        style="margin:10px;"
        v-for="(item, index) in addressList"
        :key="index"
      >
        <el-card shadow="hover">
          <el-row slot="header">
            <span class="receiver">收货人: {{ item.receiver }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="danger"
              v-if="item.default === 1"
              disabled
              >默认收货地址</el-button
            >
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              v-else
              @click="setDefaultAddress(index, item)"
              >设为默认收货地址</el-button
            >
          </el-row>
          <p class="phone">手机号码: {{ item.phone }}</p>
          <p class="userAddress">收货地址: {{ item.userAddress }}</p>
          <!-- 删除收货地址信息 -->
          <p
            class="el-icon-delete icon"
            @click="deleteAddress(item, index)"
          ></p>
        </el-card>
      </el-col>
      <!-- 添加地址 -->
      <el-col :md="5" style="margin:10px;">
        <el-popover
          placement="top-start"
          title="提示"
          width="200"
          trigger="hover"
          content="添加收货地址"
        >
          <el-card
            shadow="hover"
            slot="reference"
            class="addWrapper"
            @click.native.stop.prevent="toggle"
          >
            <i class="el-icon-plus icon"></i>
          </el-card>
        </el-popover>
      </el-col>
    </el-row>

    <!--上一步和 下一步 -->
    <el-row class="next">
      <el-button
        class="next-btn"
        type="success"
        @click.stop.prevent="$router.push({ name: 'cartLink' })"
        >上一步</el-button
      >
      <el-button class="next-btn" type="success" @click.stop.prevent="jump"
        >下一步</el-button
      >
    </el-row>

    <!-- 添加地址组件  transition过渡动画-->
    <transition
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutUp"
      duration="500"
    >
      <add-address v-show="modal" @closed="closedModal"></add-address>
    </transition>
  </el-row>
</template>

<script>
import NavBrand from "../components/NavBrand"; // 头部条
import Step from "../components/Step"; //步骤条
import AddAddress from "../components/AddAddress"; // 添加地址组件
export default {
  data() {
    return {
      addressList: [], // 所有地址
      modal: false,
      text: true,
      step: 0
    };
  },
  methods: {
    // 初始化地址数据
    initData() {
      this.$axios({
        method: "get",
        url: "/getAddress"
      })
        .then(res => {
          res.data.status === 1 ? (this.addressList = res.data.data) : false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 设置默认地址
    setDefaultAddress(index, address) {
      // 把要更改的数组的id传到后端
      this.$axios({
        method: "get",
        url: "/setDefaultAddress",
        params: {
          updateAddressId: address.addressId
        }
      })
        .then(res => {
          // 当数据库修改成功后，提示
          res.data.status === 1
            ? this.$message.success("设置默认地址成功")
            : this.$message.error("设置默认地址失败");
          // 重置一下地址数组里面的默认地址
          this.addressList.forEach((item, i) => {
            i === index ? (item.default = 1) : (item.default = 0);
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除收货地址
    deleteAddress(item, index) {
      // 如果是默认地址，不可以删除
      if (item.default === 1) {
        this.$message.warning("默认地址不可以删除!");
        return false;
      } else {
        // 确认是否删除
        this.$confirm("确定删除该收货地址吗？", "提示", {
          confirmButtonText: "确定",
          cancelmButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 向后端传输数据
            this.$axios({
              method: "delete",
              url: "/deleteAddress",
              params: {
                addressId: item.addressId
              }
            })
              .then(res => {
                if (res.data.status === 1) {
                  // 数据库删除成功之后，addressList里面删除要删除的内容。
                  this.addressList.splice(index, 1);
                  this.$message.success("删除成功");
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      }
    },
    // 点击出现模态框，添加新的地址界面
    toggle() {
      this.modal = true;
    },
    // 通过自定义事件关闭模态框 并刷新数据
    closedModal() {
      this.modal = false;
      this.initData();
    },

    // 跳转到订单页面   先遍历数组判断是否有默认地址，没有的话警告，有的话跳转
    jump() {
      let isDefault = this.addressList.some(item => {
        return item.default === 1;
      });
      isDefault
        ? this.$router.push({ name: "orderLink" })
        : this.$message.warning("请选择默认收货地址");
    }
  },
  created() {
    this.initData();
  },
  // 如果未登录就禁止访问
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.getters.getUserInfo.isLogin != "true") {
        alert("请先登录！");
        vm.$router.push({ name: "loginLink" });
      }
    });
  },
  // 当地址跳转的下个路由不是订单路由的话，把购物车选中的商品的数据库中的checked为0
  beforeRouteLeave(to, from, next) {
    if (to.name === "orderLink" && from.name === "addressLink") {
      next();
    } else {
      this.$axios({
        method: "put",
        url: "/updateCartChecked"
      })
        .then(res => {
          if (res.data.status === 1) {
            next();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    vStep: Step,
    NavBrand,
    AddAddress
  }
};
</script>

<style lang="scss" scoped>
.address {
  width: 100%;
  background: #fff;
  .main {
    margin-top: 2rem;
    padding: 0 20px;
    .phone,
    .userAddress {
      line-height: 2rem;
    }
    .icon {
      margin-top: 1rem;
      font-size: 1.2rem;
      &:hover {
        cursor: pointer;
        color: #f40;
      }
    }
    // 添加地址
    .addWrapper {
      position: relative;
      height: 200px;
      border: 2px dashed #ccc;
      &:hover {
        cursor: pointer;
      }
      .icon {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        font-size: 2rem;
        color: #ccc;
      }
    }
  }
  // 下一步
  .next {
    padding: 1rem 1rem 1rem 2rem;
    .next-btn {
      width: 6rem;
    }
    @media screen and (max-width: 981px) {
      .next-btn {
        width: 48%;
      }
    }
  }
}
</style>
