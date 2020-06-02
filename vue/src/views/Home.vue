<template>
  <el-row>
    <nav-brand>
      <router-link to="/">商品</router-link>
    </nav-brand>

    <el-row class="sortHeader">
      <span>默认排序:</span>
      <span class="text" @click="orderPrice"
        >价格<i
          class="el-icon-top"
          :class="{ 'el-icon-bottom': !orderByDefault }"
        ></i
      ></span>
    </el-row>

    <el-row class="goodsContent">
      <el-col :md="3">
        <h2 class="title">价格</h2>
        <ul class="price">
          <li
            v-for="(item, index) in choose"
            :key="index"
            :class="{ active: activeIndex === index }"
            @click="filterPrice(index)"
          >
            {{ item }}
          </li>
        </ul>
      </el-col>
      <!-- 商品展示内容 -->
      <el-col :md="21" class="goodsMain">
        <el-row>
          <el-col
            :md="6"
            v-for="(item, index) in goods"
            :key="index"
            class="goodsItem"
          >
            <img
              src="http://192.168.199.106:3000/images/loading-svg/loading-bars.svg"
              class="images"
              data-isLoaded="0"
              :data-src="item.productImageUrl"
              ref="images"
            />
            <h1 class="text">{{ item.productName }}</h1>
            <p class="price">￥{{ item.price }}</p>
            <el-button type="danger" plain class="btn" @click="addCart(item)"
              >加入购物车</el-button
            >
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import NavBrand from "../components/NavBrand";
export default {
  data() {
    return {
      goods: [],
      choose: [
        "所有",
        "0.00 - 100.00",
        "100.00 - 500.00",
        "500.00 - 1000.00",
        "1000.00 - 2000.00"
      ],
      activeIndex: 0,
      orderByDefault: true
    };
  },
  methods: {
    // 初始化商品
    initGoods() {
      this.$axios({
        method: "get",
        url: "/goods"
      })
        .then(res => {
          this.goods = res.data.goods;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 懒加载图片
    loading() {
      this.$nextTick(() => {
        class LoadImage {
          constructor() {
            this.speed = 10; // 节流时间
            this.init();
          }
          init() {
            setTimeout(() => {
              this.start();
            }, 300);
            window.onscroll = this.start.bind(this);
          }
          /**
           * 先设置定时器进行节流(这次的节流和没节流没什么区别，因为时间太短了，就是做一下样子)
           * 先遍历data-isLoaded是否为0，0为没加载，1为已加载
           * 再把未加载的图片等到滚动到视图内加载图片
           */
          start() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              // 获取 所有图片
              this.imgs = Array.from(document.querySelectorAll(".images"));
              // 过滤得到未加载的图片
              let arr = this.imgs.filter(item => {
                return item.attributes["data-isLoaded"].nodeValue === "0";
              });
              // 遍历未加载图片，判断是否在视图中，在就加载
              arr.forEach(list => {
                if (this.isShow(list)) {
                  let nowSrc = list.attributes["data-src"].nodeValue;
                  list.setAttribute("src", nowSrc);
                  list.setAttribute("data-isLoaded", "1");
                }
              });
            }, this.speed);
          }
          // 判断图片是否在加载范围
          isShow(el) {
            return el.getBoundingClientRect().top < window.innerHeight;
          }
        }
        new LoadImage();
      });
    },
    // 价格升序和降序
    orderPrice() {
      this.orderByDefault = !this.orderByDefault; // 更改默认排序
      this.goods.reverse();
      this.$nextTick(() => {
        let imgs = this.$refs.images;
        imgs.forEach(item => {
          let nowSrc = item.attributes["data-src"].nodeValue;
          item.setAttribute("src", nowSrc);
        });
      });
    },
    // 查找价格范围
    filterPrice(index) {
      this.activeIndex = index;
      let arr = this.choose[index].includes("-")
        ? this.choose[index].split("-")
        : false;
      this.$axios({
        method: "get",
        url: "/orderPrice",
        params: {
          min: arr[0],
          max: arr[1],
          default: this.orderByDefault
        }
      })
        .then(res => {
          this.goods = res.data.goods;
          this.$nextTick(() => {
            let imgs = this.$refs.images;
            imgs.forEach(item => {
              let nowSrc = item.attributes["data-src"].nodeValue;
              item.setAttribute("src", nowSrc);
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 加入购物车
    addCart(data) {
      let isLogin = JSON.parse(this.$store.getters.getUserInfo.isLogin);
      if (isLogin) {
        // 计算购物车里商品的数量
        if (!data.count) {
          this.$set(data, "count", 1);
        } else {
          data.count++;
        }
        let userId = JSON.parse(this.$store.getters.getUserInfo.userInfo)
          .userId;
        this.$axios({
          method: "get",
          url: "/addCart",
          params: {
            userId: userId,
            id: data.productId,
            name: data.productName,
            count: data.count,
            price: data.price,
            imgUrl: data.productImageUrl
          }
        })
          .then(res => {
            if (res.data.message) {
              // 增加数量
              this.$store.commit("addCount");
              this.$message.success("加入购物车成功");
            } else {
              this.$message.error("加入购物车失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message.warning("未登录，请先登录！");
      }
    }
  },
  created() {
    this.initGoods();
    this.loading();
  },
  // 路由跳转，取消图片懒加载
  beforeRouteLeave(to, from, next) {
    window.onscroll = null;
    next();
  },
  components: {
    NavBrand
  }
};
</script>

<style lang="scss" scoped>
.sortHeader {
  margin-top: 5rem;
  padding: 1rem;
  background: #fff;
  text-align: end;
  .text {
    padding-left: 0.6rem;
    color: #f40;
    &:hover {
      cursor: pointer;
    }
  }
}
.goodsContent {
  padding: 3rem 1rem 0 1rem;
  .title {
    font-size: 1.3rem;
    padding-bottom: 2rem;
  }
  .price {
    li {
      padding: 0.5rem;
      &:hover {
        cursor: pointer;
        color: #f40;
      }
    }
    .active {
      color: #f40;
    }
  }
  .goodsMain {
    .goodsItem {
      background: #fff;
      padding: 1rem;
      border: 1px solid rgba(77, 77, 77, 0.1);
      .images {
        width: 100%;
      }
      .text {
        padding: 1rem 0;
        font-size: 1.2rem;
        color: rgb(236, 8, 8);
      }
      .btn {
        margin-top: 3rem;
        width: 100%;
      }
    }
  }
}
</style>
