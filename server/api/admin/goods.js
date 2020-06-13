module.exports = (useRouter, crud, app) => {

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


    // 前端编辑页面上传的商品图片
    const multer = require('multer');
    const path = require("path");
    const fs = require("fs");
    //解析图片文件,并保存位置
    const upload = (multer({ dest: path.resolve(__dirname, "../../static/product") }).any());
    useRouter.post("/productIamge_upload", upload, (req, res) => {

        // 给图片重命名
        fs.rename(req.files[0].path, req.files[0].path + path.parse(req.files[0].originalname).ext, (err) => {
            if (err) {
                res.json({
                    status: 1,
                    message: "图片上传失败"
                })
            } else {
                res.json({
                    status: 0,
                    filename: `http://localhost:3000/images/product/${req.files[0].filename + path.parse(req.files[0].originalname).ext}`
                })
            }
        })
    })


    // 商品编辑
    useRouter.get("/product_edit", (req, res) => {
        const { productId, productName, price, productImageUrl } = req.query;
        if (productId) {
            crud(
                "UPDATE `goods` SET productName=?, price=?, productImageUrl=? WHERE productId=?",
                [productName, price, productImageUrl, productId], () => {
                    res.json({
                        status: 0,
                        message: "修改商品成功"
                    })
                })
        } else {
            let randomId = require("../../randomId")();
            crud("INSERT INTO `goods` SET ?", { productId: randomId, productName, price, productImageUrl }, () => {
                res.json({
                    status: 0,
                    message: "添加商品成功"
                })
            })
        }

    })


    // 删除商品
    useRouter.delete("/remove_product", (req, res) => {
        crud("DELETE FROM `goods` WHERE productId =?", [req.query.productId], () => {
            res.json({
                status: 0,
                message: "删除商品成功"
            })
        })
    })
}