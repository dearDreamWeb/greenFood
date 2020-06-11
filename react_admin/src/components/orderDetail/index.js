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
    const [imageHost, setImageHost] = useState(""); //图片的根地址http://img.happymmall.com/

    // 初始化数据
    const initOrderData = () => {
        axios({
            method: "get",
            url: "/manage/order/detail.do",
            params: {
                orderNo: props.location.state.id
            }
        }).then(res => {
            if (res.data.status === 0) {
                setFormData(res.data.data)
                setData(res.data.data.orderItemVoList);
                setImageHost(res.data.data.imageHost)
            }
        }).catch(err => {
            console.log(err);
        })

    }

    const columns = [
        {
            title: '商品图片',
            dataIndex: 'productImage',
            key: 'productImage',
            render: value => {
                return (
                    <img
                        src={imageHost + value}
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
            dataIndex: 'currentUnitPrice',
            key: 'currentUnitPrice',
            render: value => "￥" + value
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: '合计',
            dataIndex: "totalPrice",
            key: 'totalPrice',
            render: value => "￥" + value
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
                    name="orderNo"
                    label="订单号"
                >
                    <Input disabled />
                </Form.Item>

                {/* 创建时间 */}
                <Form.Item
                    {...formItemLayout}
                    name="createTime"
                    label="创建时间"
                >
                    <Input disabled />
                </Form.Item>

                {/* 收件人 */}
                <Form.Item
                    {...formItemLayout}
                    name="receiverName"
                    label="收件人"
                >
                    <Input disabled />
                </Form.Item>


                {/* 订单状态 */}
                <Form.Item
                    {...formItemLayout}
                    name="statusDesc"
                    label="订单状态"
                >
                    <Input disabled />
                </Form.Item>


                {/* 支付方式 */}
                <Form.Item
                    {...formItemLayout}
                    name="paymentTypeDesc"
                    label="支付方式"
                >
                    <Input disabled />
                </Form.Item>

                {/* 订单金额 */}
                <Form.Item
                    {...formItemLayout}
                    name="payment"
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