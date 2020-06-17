module.exports = (useRouter, crud) => {
    let moment = require('moment'); //时间格式化工具
    moment.locale('zh-cn');
    // 获取默认地址和已选商品
    useRouter.get("/getOrderData", (req, res) => {
        let arr = [];
        crud("SELECT * FROM `cart` WHERE uid = ? AND checked = 1;", [req.session.userInfo.id], data => {
            arr.push(data);
            crud("SELECT * FROM `address` WHERE uid = ? AND `default` = 1;", [req.session.userInfo.id], data1 => {
                arr.push(data1);
                res.json({
                    "status": 1,
                    data: arr
                })
            })
        })
    });
    // 生成订单并删除购物车（cart表）的结算的商品
    useRouter.get("/produceOrder", (req, res) => {
        let randomNum = Math.floor(Math.random() * 10).toString();
        let randomNum1 = Math.floor(Math.random() * 10).toString();
        let date = moment(new Date()).format("YYYYMMDDHHmmss").toString();
        let orderId = randomNum + randomNum1 + date;
        let orderTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let orderMoney = req.query.resultMoney; // 订单金额
        let orderInfo = req.query.orderInfo;    // 订单商品信息
        let uid = req.session.userInfo.id; // 订单用户
        let cartIdArr = req.query.cartIdArr;      // 结算的所有商品的id
        let address = req.query.address;         // 订单地址
        let receiver = req.query.receiver;         // 订单地址

        crud("INSERT INTO `order` SET ?", { orderId, orderTime, uid, orderMoney, orderInfo, address, receiver }, data => {
            crud("DELETE FROM `cart` WHERE cartId in (?) ", [cartIdArr], data => {
                res.json({
                    "status": 1
                })
            })
        })
    });
}