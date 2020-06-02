<template>
  <div>
    <canvas width="250px" height="100px" ref="canvas" @click="curCanvas">
      该浏览器不支持canvas
    </canvas>
    <a href="javascript:;" class="refresh" @click="curCanvas"
      >看不清？点击刷新</a
    >
  </div>
</template>

<script>
export default {
  methods: {
    curCanvas() {
      let myCanvas = this.$refs.canvas;
      let ctx = myCanvas.getContext("2d");
      let canvasH = myCanvas.offsetHeight; // canvas 高
      let canvasW = myCanvas.offsetWidth; //canvas宽
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, canvasW, canvasH);
      // 生成干扰点
      for (let i = 0; i < 200; i++) {
        this.producePoint(ctx, canvasW, canvasH);
      }
      // 随机验证码
      let str = "";
      let arr = this.allCharacter();
      for (let i = 0; i < 4; i++) {
        str += arr[this.randomValue(0, 61)];
      }

      // 核心代码
      //设置4个内容 将canvas 平分成4分 然后让内容在1/4的空间旋转缩放
      //原理 ：每次都是位移旋转之后再回复原位
      for (let i = 0; i < str.length; i++) {
        let colorR = this.randomValue(0, 256);
        let colorG = this.randomValue(0, 256);
        let colorB = this.randomValue(0, 256);
        let deg = this.randomValue(-30, 30);
        let x = this.randomValue(20, 30);
        // 设置颜色 和字体大小以及样式
        ctx.font = "3rem sans-serif";
        ctx.fillStyle = `rgb(${colorR},${colorG},${colorB})`;
        // 先把原点调到字符出现的位置，再旋转 ，然后填充字符
        ctx.translate(x + 50 * i, 0);
        ctx.rotate((Math.PI / 180) * deg);
        ctx.fillText(str[i], 0, canvasH / 2 + 10);
        // 把原点和旋转角度复位
        ctx.rotate((Math.PI / 180) * -deg);
        ctx.translate(-(x + 50 * i), 0);
      }

      // 每次刷新验证码都向父组件用自定义事件传值
      this.$emit("nowVal", str);
    },

    // 随机数之间的最小值到最大值
    randomValue(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    // 获取0-9和a-z之间的字符
    allCharacter() {
      let arr = [];
      for (let i = 48; i < 58; i++) {
        arr.push(String.fromCharCode(i));
      }
      for (let j = 65; j < 123; j++) {
        if (j >= 91 && j <= 96) {
          continue;
        }
        arr.push(String.fromCharCode(j));
      }
      return arr;
    },

    // 生成干扰点
    producePoint(ctx, canvasW, canvasH) {
      ctx.beginPath();
      let x = this.randomValue(5, canvasW - 5);
      let y = this.randomValue(5, canvasH - 5);
      let r = this.randomValue(2, 4);
      let colorR = this.randomValue(0, 256);
      let colorG = this.randomValue(0, 256);
      let colorB = this.randomValue(0, 256);
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${colorR},${colorG},${colorB})`;
      ctx.fill();
      ctx.closePath();
    }
  },
  mounted() {
    this.curCanvas();
  }
};
</script>

<style lang="scss" scoped>
.refresh {
  color: blue;
  padding-left: 1rem;
  @media screen and (min-width: 981px) and (max-width: 1200px) {
    display: block;
  }
}
</style>
