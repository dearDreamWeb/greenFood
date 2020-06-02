<template>
  <el-row class="cart">
    <nav-brand>
      <slot>购物车</slot>
    </nav-brand>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="productImageUrl" label="商品图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.productImageUrl" class="images" />
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" align="center">
      </el-table-column>
      <el-table-column prop="price" label="商品价格" align="center">
        <template slot-scope="scope"> ￥{{ scope.row.price }} </template>
      </el-table-column>
      <el-table-column prop="count" label="商品数量" align="center" width="140">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.count"
            :min="1"
            :max="99"
            size="small"
            @change="changeCount(scope.row.count, scope.row)"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品总价" align="center">
        <template slot-scope="scope">
          ￥{{ scope.row.price * scope.row.count }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-button @click="toggleSelection()" type="primary" plain
        >取消选择</el-button
      >
      <el-row class="result">
        <span class="text"
          >合计:<span class="money">￥{{ result }}</span></span
        >
        <el-button type="success" :disabled="result === 0" @click="jumpAddress"
          >结算</el-button
        >
      </el-row>
    </div>
  </el-row>
</template>

<script>
import NavBrand from "../components/NavBrand";
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: []
    };
  },

  methods: {
    //   取消已选中的商品
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 被选中的行的数据信息被添加到数组中，最后传到multipleSelection数组中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除商品
    handleDelete(index, row) {
      console.log(index, row);
      this.tableData.splice(index, 1);
      this.$axios({
        method: "delete",
        url: "/deleteCartList",
        params: {
          cartId: row.cartId
        }
      })
        .then(res => {
          if (res.data.status === 1) {
            this.$message.success("删除成功");
          } else {
            this.$message.error("删除失败！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 更改商品数量
    changeCount(val, row) {
      this.$axios({
        method: "put",
        url: "/changeCount",
        params: {
          count: val,
          cartId: row.cartId
        }
      })
        .then(res => {
          // 把新增的购物车商品数量更新
          this.$store.commit("setCount", res.data.num);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 初始化购物车 并将购物车所有的商品都在数据库里显示为未选中
    initCart() {
      let p1 = this.$axios({
        method: "get",
        url: "/getCart"
      });
      let p2 = this.$axios({
        method: "put",
        url: "/updateCartChecked"
      });
      Promise.all([p1, p2])
        .then(res => {
          if (res[0].data.status == 1 && res[1].data.status == 1) {
            this.tableData = res[0].data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转到地址
    jumpAddress() {
      let arrCartId = [];
      this.multipleSelection.forEach(item => {
        arrCartId.push(item.cartId);
      });
      this.$axios({
        method: "get",
        url: "/updateCartChecked",
        params: {
          arrCartId
        }
      })
        .then(res => {
          // 当选中购物车商品数据库修改成功后，跳转到地址
          res.data.status === 1
            ? this.$router.push({ name: "addressLink" })
            : this.$message.error("购物车选中失败");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    //   选中的结算的商品价格
    result() {
      let totalPrice = 0;
      this.multipleSelection.forEach(item => {
        totalPrice += item.price * item.count;
      });
      return totalPrice;
    }
  },
  created() {
    this.$nextTick(() => {
      this.initCart();
    });
  },
  // 如果未登录，不允许进入购物车页面
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.getters.getUserInfo.isLogin != "true") {
        alert("请先登录！");
        vm.$router.push({ name: "loginLink" });
      }
    });
  },
  components: {
    NavBrand
  }
};
</script>

<style lang="scss" scoped>
.cart {
  .images {
    width: 120px;
    @media screen and (max-width: 931px) {
      width: 60px;
    }
  }
  .footer {
    position: relative;
    margin-top: 20px;
    padding: 10px 0 10px 20px;
    background: #fff;
    .result {
      position: absolute;
      display: inline-block;
      right: 20px;
      .text {
        padding-right: 10px;
        font-size: 1.2rem;
        line-height: 1.2rem;
        .money {
          color: #f40;
        }
      }
    }
  }
}
</style>
