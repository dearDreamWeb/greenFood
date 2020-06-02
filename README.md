# 小型的购物商城
全栈开发的购物平台，采用的是响应式布局。

# 技术栈
主要用到的技术栈是  
- express
- vue
- element-ui
- mysql
- sass

# 运行条件
## node环境：
- 用于vue-cli3 的开发和后端node框架express开发
## ruby环境:
- 用于css预处理器sass的运行

# 运行方式
- 启动vue脚手架vue-cli3
    - 先在cmd中 cd一下vue文件夹，再<font color="#f40" size="5">npm run serve </font>
- 启动node
    - 先在cmd中 cd一下server文件夹，再node index.js
    - 建议使用<font color="#f40" size="5"> nodemon index.js</font> (node的热更新,安装完nodemon即可使用)
- mysql数据库
    - 根目录有一个shop.sql文件是本商城的数据库文件

# 一些小功能
   - Html5中canvas写的验证码
   - 商城首页的商品采用的懒加载技术
   - 登录状态通过后端传入后，配合Html5的sessionStorage存储状态，再配合vuex来进行登录状态的存储和更改
   - 未登录状态不能进入购物车等界面，采用的是vue-router的路由守卫

# 安利一碗鸡汤
>   热爱生命  
    汪国真  
    
>    我不去想是否能够成功  
    既然选择了远方  
    便只顾风雨兼程  
    
>    我不去想能否赢得爱情  
    既然钟情于玫瑰  
    就勇敢地吐露真诚  
    
>    我不去想身后会不会袭来寒风冷雨  
    既然目标是地平线    
    留给世界的只能是背影  
    
>    我不去想未来是平坦还是泥泞  
    只要热爱生命  
    一切，都在意料之中
