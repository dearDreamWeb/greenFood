module.exports = (useRouter, crud) => {

    // 商品的操作
    require("./goods")(useRouter, crud);

    // 管理员登录
    useRouter.post("/admin_login", (req, res) => {
        crud("SELECT * FROM `admin_users` WHERE adminName=? AND adminPassword=?",
            [req.body.adminName, req.body.adminPassword], data => {
                if (data.length !== 0) {
                    res.json({
                        status: 0,
                        message: "登录成功"
                    })
                } else {
                    res.json({
                        status: 1,
                        message: "请输入正确的管理员账号和密码"
                    })
                }
            })
    })

    // 用户总数、商品总数、订单总数
    useRouter.get("/base_count", (req, res) => {
        // 统计的数量
        let count = { userCount: 0, productCount: 0, orderCount: 0 };
        crud("SELECT * FROM `users`", [], data => count.userCount = data.length);
        crud("SELECT * FROM `goods`", [], data => count.productCount = data.length);
        crud("SELECT * FROM `order`", [], data => count.orderCount = data.length);
        setTimeout(() => {
            res.json({
                status: 0,
                data: { ...count }
            })
        }, 300)

    })
}