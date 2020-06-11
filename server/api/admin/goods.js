module.exports = (useRouter, crud) => {

    // 初始化商品数据
    useRouter.get("/init_goods", (req, res) => {
        crud("SELECT * FROM `goods`", [], data => {
            crud("SELECT * FROM `goods` limit 0,10", [], data1 => {
                res.json({
                    status: 0,
                    list: data1,
                    total: data.length
                })
            })
        })
    })

    // 商品分页查询
    useRouter.get("/init_goods/list", (req, res) => {
        let { pageSize, pageNum } = req.query;
        let startIndex = (pageNum == 1) ? 0 : pageSize * (pageNum - 1); //开始查询的数据
        crud("SELECT * FROM `goods`", [], data => {
            crud("SELECT * FROM `goods` limit " + startIndex + "," + pageSize + "", [], data1 => {
                res.json({
                    status: 0,
                    list: data1,
                    total: data.length
                })
            })
        })
    })


    // 商品查询
    useRouter.get("/init_goods/search", (req, res) => {
        let { pageSize, pageNum } = req.query;
        pageSize = pageSize ? pageSize : 10;
        pageNum = pageNum ? pageNum : 1;
        let startIndex = (pageNum == 1) ? 0 : pageSize * (pageNum - 1); //开始查询的数据

        if (req.query.productId) {
            crud("SELECT * FROM `goods`  WHERE productId=? ", [req.query.productId], data1 => {
                res.json({
                    status: 0,
                    list: data1,
                    total: 1
                })
            })
        } else {
            crud("SELECT * FROM `goods`  WHERE productName LIKE ? ", [`%${req.query.productName}%`], data => {
                res.json({
                    status: 0,
                    list: data,
                    total: data.slice(startIndex, startIndex + pageSize)
                })
            })
        }



    })
}