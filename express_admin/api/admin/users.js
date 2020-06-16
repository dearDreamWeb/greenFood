module.exports = (useRouter, crud) => {

    // 用户列表初始化
    useRouter.get("/init_users", (req, res) => {
        crud("SELECT * FROM `users`", [], data => {
            crud("SELECT*FROM `users` limit 0,10; ", [], data1 => {
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


    // 用户分页查询
    useRouter.get("/user/list", (req, res) => {
        let { pageSize, pageNum } = req.query;
        let startIndex = (pageNum == 1) ? 0 : pageSize * (pageNum - 1); //开始查询的数据
        crud("SELECT * FROM `users`", [], data => {
            // 按照创建订单降序排列
            crud("SELECT * FROM `users`  limit " + startIndex + "," + pageSize + "", [], data1 => {
                res.json({
                    status: 0,
                    list: data1,
                    total: data.length
                })
            })
        })
    })


}