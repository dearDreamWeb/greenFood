module.exports = (useRouter, crud) => {

    useRouter.get("/init_orders", (req, res) => {
        crud("SELECT * FROM `order`", [], data => {
            res.json({
                status: 0,
                orderData: data
            })
        })
    })

}