const express = require("express");
const app = express();
const cors = require("cors");
const history = require('connect-history-api-fallback');
const bodyParser = require("body-parser");

const crud = require("./crud"); // 引入crud接口

require("./session")(app); // 引用session

app.use(history());

app.listen(3000);

// post的请求body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 解决跨域
const corsOptions = {
    origin: ["http://localhost:8080", "http://localhost:6060"],
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

// 创建路由
const useRouter = express.Router();
app.use("/api", useRouter);



const imageUrl = "http://localhost:3000/images/";//图片服务器的根地址

// 引入收货地址的api
require("./api/address")(useRouter, crud);

// 引入订单的api
require("./api/order")(useRouter, crud);

// 引入后台管理的api
require("./api/admin")(useRouter, crud);

// 初始化商品
useRouter.use("/goods", (req, res) => {
    crud("SELECT * FROM `goods` ORDER BY price;", [], data => {
        data.forEach(item => {
            item.productImageUrl = imageUrl + item.productImageUrl;
        });
        res.json({
            "goods": data
        })
    })
});

// 删除购物车列表商品
useRouter.delete("/deleteCartList", (req, res) => {
    crud("DELETE FROM `cart` WHERE cartId = ?", [req.query.cartId], data => {
        if (data) {
            res.json({
                "status": 1
            })
        }
    })
});

let minPrice = 0;
let maxPrice = 10000000000;
let orderBy = "";

// 价格排序
useRouter.use("/orderPrice", (req, res) => {
    // 给最大值和最小值赋值
    if (req.query.min || req.query.max) {
        minPrice = Number(req.query.min);
        maxPrice = Number(req.query.max);
    } else {
        minPrice = 0;
        maxPrice = 1000000000;
    }
    orderBy = req.query.default ? "desc" : "asc"; // 升序还是降序
    crud("SELECT * FROM `goods`WHERE price BETWEEN ? AND ? ORDER BY price " + orderBy + ";", [minPrice, maxPrice], data => {
        data.forEach(item => {
            item.productImageUrl = imageUrl + item.productImageUrl;
        });
        res.json({
            "goods": data
        })
    })
})

// 注册   先查询数据库是否已存在用户名   不存在再插入
useRouter.use("/register", (req, res) => {
    crud("SELECT * FROM `users` WHERE userName = ?", [req.query.userName], data => {
        if (data.length > 0) {
            res.json({
                "status": 0
            });
        } else {
            crud("INSERT INTO `users` SET ?", { "userName": req.query.userName, "password": req.query.passWord }, data1 => {
                res.json({
                    "status": 1
                });
            });
        }
    })

})

// 登录   把用户信息保存在session里面  并查询购物车总数
useRouter.use("/login", (req, res) => {
    crud("SELECT * FROM `users` WHERE userName = ? AND password = ?", [req.query.userName, req.query.passWord], data => {
        if (data.length > 0) {
            // 把用户信息保存在session里面
            req.session.userInfo = data[0];
            // 查询购物车总数
            crud("SELECT * FROM `cart`LEFT JOIN `users` ON cart.uid = users.id WHERE cart.uid = ?;", [data[0].id], data1 => {
                if (data1.length > 0) {
                    let num = 0;
                    data1.forEach(item => {
                        num += item.count;
                    });
                    res.json({
                        "isLogin": 1,
                        "data": req.session.userInfo,
                        num
                    });
                }
            })
        } else {
            res.json({
                isLogin: 0
            })
        }
    })
});

// 退出登录，注销session
useRouter.use("/loginOut", (req, res) => {
    req.session.destroy(() => res.json({ "loginOut": true }));
});

// 加入购物车
useRouter.use("/addCart", (req, res) => {
    // 为了防止前端有人改了userId ,所以要和session里面的userId对照一下
    if (req.query.userId == req.session.userInfo.id) {
        crud("SELECT * FROM `cart` WHERE uid = ? AND productId = ?;", [req.session.userInfo.id, req.query.id], data => {
            // 当数据库中没有该数据是插入
            // 当数据库有该数据的话，只改变count
            if (data.length == 0) {
                let obj = {
                    uid: req.session.userInfo.id,
                    productId: req.query.id,
                    productName: req.query.name,
                    count: req.query.count,
                    price: req.query.price,
                    productImageUrl: req.query.imgUrl
                }
                crud("INSERT INTO `cart` set ? ;", obj, data => {
                    data ? res.json({ "message": true }) : false;
                })
            } else {
                let id = data[0].cartId;
                let num = data[0].count;
                num++;
                crud("UPDATE `cart` SET count = ?  WHERE cartId =?;", [num, id], data => {
                    data ? res.json({ "message": true }) : false;
                })
            }
        })
    } else {
        console.log(req.query.userId, req.session.userInfo.userId)
        console.log("前后端userId不一样");
    }

});

// 获取购物车商品总数
useRouter.use("/cartCount", (req, res) => {
    crud("SELECT * FROM `cart`LEFT JOIN `users` ON cart.uid = users.id WHERE cart.uid = ?;", [req.query.userId], data => {
        let num = 0;
        data.forEach(item => {
            num += item.count;
        });
        res.json({
            num
        });
    });
});

// 初始化购物车界面购物车数据
useRouter.use("/getCart", (req, res) => {
    if (req.session.userInfo) {
        crud("SELECT * FROM `cart` WHERE uid = ?", [req.session.userInfo.id], data => {
            res.json({
                "status": 1,
                data
            });
        })
    }

});

//更改购物车商品数量
useRouter.put("/changeCount", (req, res) => {
    crud("UPDATE `cart` SET count = ? WHERE cartId = ?", [req.query.count, req.query.cartId], data1 => {
        // data ? res.json({ "status": 1 }) : false;
        crud("SELECT * FROM `cart`LEFT JOIN `users` ON cart.uid = users.id WHERE cart.uid = ?;", [req.session.userInfo.id], data => {
            let num = 0;
            data.forEach(item => {
                num += item.count;
            });
            res.json({
                num
            });
        });
    })
})

// 静态托管
app.use("/images", express.static("./static"));