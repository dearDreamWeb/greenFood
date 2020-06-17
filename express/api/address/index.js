module.exports = (useRouter, crud) => {
    // 获取收货地址
    useRouter.get("/getAddress", (req, res) => {
        if (req.session.userInfo) {
            crud("SELECT * FROM `address` WHERE uid = ? ORDER BY `default` DESC", [req.session.userInfo.id], data => {
                res.json({
                    "status": 1,
                    data
                });
            });
        }
    });

    // 设置默认地址
    useRouter.get("/setDefaultAddress", (req, res) => {
        if (req.session.userInfo) {
            // 先把该用户的所有地址都设为非默认地址
            // 再把要设的默认地址通过id找到并设置
            crud("UPDATE `address` SET `default` = CASE uid   WHEN " + req.session.userInfo.id + " THEN 0 END    WHERE uid = " + req.session.userInfo.id + "",
                [], data => {
                    crud("UPDATE `address` SET `default` = ? WHERE addressId = ? ", [1, req.query.updateAddressId],
                        data => {
                            res.json({
                                "status": 1
                            })
                        })
                })
        }
    });

    // 删除默认地址
    useRouter.delete("/deleteAddress", (req, res) => {
        crud("DELETE FROM `address` WHERE addressId = ?", [req.query.addressId], data => {
            res.json({
                "status": 1
            })
        })
    });

    // 添加收货地址
    useRouter.get("/addAddress", (req, res) => {
        crud("INSERT INTO `address` SET ?", {
            uid: req.session.userInfo.id,
            receiver: req.query.userName,
            phone: req.query.phone,
            userAddress: req.query.address
        }, data => {
            res.json({
                "status": 1
            });
        });
    });

    // 接收到购物车选中的商品更新数据库对应的checked
    useRouter.get("/updateCartChecked", (req, res) => {
        let arr = req.query.arrCartId;
        crud("UPDATE `cart` SET checked = 1 WHERE cartId IN (?)", [[...arr]], data => {
            res.json({
                "status": 1
            });
        })
    });

    // 当从地址界面跳转到其他界面（不是订单页面）时，把购物车选中的商品checked都为0
    useRouter.put("/updateCartChecked", (req, res) => {
        crud("UPDATE `cart` SET checked = 0", [], data => {
            res.json({
                "status": 1
            });
        });
    })
}