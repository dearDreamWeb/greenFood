module.exports = (useRouter, crud) => {

    // 订单初始化
    useRouter.get("/init_orders", (req, res) => {
        crud("SELECT * FROM `order`", [], data => {
            crud("SELECT*FROM `order` LEFT JOIN `users` ON  order.uid = users.id ORDER BY orderTime desc limit 0,10; ", [], data1 => {
                data1.forEach(item => {
                    item.password = ""
                });
                res.json({
                    status: 0,
                    list: data1,
                    total: data.length
                })
            })
        })
    })


    // 订单查询
    useRouter.get("/order/search", (req, res) => {
        let { pageSize, pageNum } = req.query;
        pageSize = pageSize ? pageSize : 10;
        pageNum = pageNum ? pageNum : 1;
        crud("SELECT * FROM `order`  WHERE orderId=? ", [req.query.orderId], data => {
            res.json({
                status: 0,
                list: data,
                total: 1
            })
        })

    })


    // 改变订单状态
    useRouter.get("/order_changeStatus", (req, res) => {
        const { orderId, status } = req.query;
        crud("UPDATE `order` SET status =? WHERE orderId =?", [status, orderId], () => {
            res.json({
                status: 0
            })
        })
    })

    // 订单分页查询
    useRouter.get("/order/list", (req, res) => {
        let { pageSize, pageNum } = req.query;
        let startIndex = (pageNum == 1) ? 0 : pageSize * (pageNum - 1); //开始查询的数据
        crud("SELECT * FROM `order`", [], data => {
            // 按照创建订单降序排列
            crud("SELECT * FROM `order` ORDER BY orderTime desc limit " + startIndex + "," + pageSize + "", [], data1 => {
                res.json({
                    status: 0,
                    list: data1,
                    total: data.length
                })
            })
        })
    })

    // 订单详情
    useRouter.get("/order/detail", (req, res) => {
        crud("SELECT * FROM `order` WHERE orderId =?", [req.query.orderId], data => {
            res.json({
                status: 0,
                data:data[0]
            })
        })
    })
}