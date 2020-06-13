<template>
  <el-row class="order">
    <nav-brand>
      <slot>订单</slot>
    </nav-brand>
    <v-step :step="step"></v-step>
    <el-row class="main">
      <!-- 结账商品表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="productImageUrl" label="商品图片">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.productImageUrl"
              class="images"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称"> </el-table-column>
        <el-table-column prop="price" label="价格">
          <template slot-scope="scope">
            <span>￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量">
          <template slot-scope="scope">
            <span>x {{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="总金额">
          <template slot-scope="scope">
            <span>￥{{ (scope.row.price * scope.row.count).toFixed(2) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 默认地址 -->
      <el-row class="defaultAddress" v-if="addressDefault[0]">
        <el-card shadow="never" class="card">
          <p slot="header">收货人：{{ addressDefault[0].receiver }}</p>
          <p style="padding-bottom:1rem;">
            手机号码：{{ addressDefault[0].phone }}
          </p>
          <p>收货地址：{{ addressDefault[0].userAddress }}</p>
        </el-card>
      </el-row>
      <!-- 上一步和结算 -->
      <el-row class="footer">
        <el-button
          type="success"
          @click.stop.prevent="$router.push({ name: 'addressLink' })"
          >上一步</el-button
        >
        <el-row class="result">
          <p class="money-wrapper">
            总价：<span class="money">￥{{ result }}</span>
          </p>
          <el-button type="success" @click.stop.prevent="settleAccounts"
            >结算</el-button
          >
        </el-row>
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
      step: 1,
      tableData: [],
      addressDefault: [],
    };
  },
  methods: {
    // 从数据库把选中的购物车商品和默认地址获取到
    initOrderData() {
      this.$axios({
        method: "get",
        url: "/getOrderData",
      })
        .then(res => {
          if (res.data.status === 1) {
            this.tableData = res.data.data[0];
            this.addressDefault = res.data.data[1];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 结账并生成订单
    async settleAccounts() {
      if (this.tableData.length != 0 && this.addressDefault.length != 0) {
        let promiseResult = await this.$confirm(
          `本次消费需要${this.result}元,是否确定的支付?`,
          "支付",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.$message({
              type: "success",
              message: "正在支付中...",
            });
            return true;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消支付",
            });
            return false;
          });
        //支付成功之后 把订单信息传给后端，后端把值传到数据库，并删除购物车结算的商品
        if (promiseResult) {
          let cartIdArr = [];
          this.tableData.forEach(item => {
            cartIdArr.push(item.cartId);
          });

          this.$axios({
            method: "get",
            url: "/produceOrder",
            params: {
              cartIdArr,
              resultMoney: this.result,
              orderInfo: JSON.stringify(this.tableData),
              address: this.addressDefault[0].userAddress,
              receiver: this.addressDefault[0].receiver,
            },
          })
            .then(res => {
              if (res.data.status === 1) {
                setTimeout(() => {
                  this.$message({
                    type: "success",
                    message: "支付成功",
                  });
                  this.$router.push({ name: "produceOrderLink" });
                }, 4000);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        // 当订单页面没有要结算的商品或者默认地址时，提示用户，并不做跳转
        this.$message.error("未设置默认地址或者没有添加要结算商品！");
      }
    },
  },
  computed: {
    result() {
      let money = 0;
      this.tableData.forEach(item => {
        money += item.price * item.count;
      });
      return money.toFixed(2);
    },
  },
  created() {
    this.initOrderData();
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
    vStep: Step,
  },
};
</script>

<style lang="scss" scoped>
.order {
  background: #fff;
  .main {
    padding: 0 2rem;
    @media screen and (max-width: 931px) {
      padding: 0;
    }
    .images {
      width: 120px;
      @media screen and (max-width: 931px) {
        width: 60px;
      }
    }
  }
  .defaultAddress {
    .card {
      background: rgba(244, 253, 228, 0.4);
    }
  }
  .footer {
    padding: 1rem 2rem;
    .result {
      float: right;
      .money-wrapper {
        display: inline-block;
        padding-right: 1rem;
        .money {
          font-size: 2rem;
          color: #f40;
          @media screen and (max-width: 981px) {
            font-size: 1.3rem;
          }
        }
      }
    }
  }
}
</style>
