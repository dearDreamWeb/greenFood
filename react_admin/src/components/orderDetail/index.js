import React, { useState, useEffect } from 'react';
import { Form, Input, Table } from 'antd';
import axios from "axios";
import "./index.scss"
const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 8,
    },
};

const formItemLayoutDetail = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 10,
    },
};



// 组件
const OrderDetail = (props) => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState(null)
    const [data, setData] = useState([])

    // 初始化数据
    const initOrderData = () => {
        axios({
            method: "get",
            url: "/api/order/detail",
            params: {
                orderId: props.location.state.orderId
            }
        }).then(res => {
            if (res.data.status === 0) {
                // 获取数据
                let getData = res.data.data;
                getData.status = data.status === 1 ? "已发货" : "未发货";
                setFormData(getData);

                // 获取订单详情数据，因为自带的没有总价，所以遍历计算一下
                let orderInfo = JSON.parse(getData.orderInfo);
                orderInfo.forEach(item => {
                    item.totalPrice = (item.price * item.count).toFixed(2)
                })
                setData(orderInfo);
            }
        }).catch(err => {
            console.log(err);
        })

    }

    const columns = [
        {
            title: '商品图片',
            dataIndex: 'productImageUrl',
            key: 'productImageUrl',
            render: value => {
                return (
                    <img
                        src={value}
                        alt="商品图片"
                        width="100px"
                        height="100px"
                    />)
            }
        },
        {
            title: '商品信息',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            render: value => `${value}元`
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count'
        },
        {
            title: '合计',
            dataIndex: "totalPrice",
            key: 'totalPrice',
            render: value => `${value}元`
        },
    ];

    useEffect(() => {
        initOrderData();
    }, [])

    useEffect(() => {
        form.setFieldsValue(formData);
    }, [formData])




    return (
        <div className="orderDetail">
            <Form form={form} name="dynamic_rule">

                {/* 订单号 */}
                <Form.Item
                    {...formItemLayout}
                    name="orderId"
                    label="订单号"
                >
                    <Input disabled />
                </Form.Item>

                {/* 创建时间 */}
                <Form.Item
                    {...formItemLayout}
                    name="orderTime"
                    label="创建时间"
                >
                    <Input disabled />
                </Form.Item>

                {/* 收件人 */}
                <Form.Item
                    {...formItemLayout}
                    name="receiver"
                    label="收件人"
                >
                    <Input disabled />
                </Form.Item>


                {/* 订单状态 */}
                <Form.Item
                    {...formItemLayout}
                    name="status"
                    label="订单状态"
                >
                    <Input disabled />
                </Form.Item>

                {/* 订单金额 */}
                <Form.Item
                    {...formItemLayout}
                    name="orderMoney"
                    label="订单金额"
                >
                    <Input disabled />
                </Form.Item>


                {/* 商品列表 */}
                <Form.Item
                    {...formItemLayoutDetail}
                    className="productList"
                    label="商品列表"
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        scroll={{ x: true }}
                        bordered
                    />
                </Form.Item>
            </Form>
        </div >
    );
};
export default OrderDetail;