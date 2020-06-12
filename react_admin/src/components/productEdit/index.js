import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
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
const formTailLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 8,
        offset: 4,
    },
};

// 组件
const ProductEdit = (props) => {
    const [form] = Form.useForm();
    const [isDisabled, setIsDisabled] = useState(false); //当是详情页的话，输入框为不可调试

    // 如果是查看详情，所有input不能更改
    const changeInputDisabled = () => {
        if (props.location.pathname === "/product/detail") {
            setIsDisabled(true);
        }
    }

    // 如果是编辑商品或者是查看商品详情，通过路由传参的id过去该商品的信息，并把信息入对应的表单中
    const initEditData = () => {
        if (props.location.state) {
            axios({
                method: "get",
                url: "/api/init_goods/search",
                params: {
                    productId: props.location.state.productId
                }
            }).then(res => {
                let objData = res.data.list[0];//将请求的数据赋值给objData变量

                /**
                 * 将传过来的图片转换成数组，
                 * 因为传过来的图片数据是这样的：1.jpg,2.jpg 所以要把它转换数组[{uid:"1.jpg", url:"http://....1.jpg" }]
                 */

                objData["productImageUrl"] = [{ uid: objData.productImageUrl, url: `http://localhost:3000/images/${objData.productImageUrl}` }]
                // antd 中设置表单某项的值
                form.setFieldsValue(objData);
            }).catch(err => {
                console.log(err);
            })
        }

    }

    // 提交表单 ,提交成功返回商品管理界面
    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            // 将图片转换成数组，再转换成字符串，因为后端接口这样要求，我也没办法呀
            // let arr = [];
            // values.productImageUrl.forEach(item => {
            //     arr.push(item.response.data.uri);
            // })
            // let imagesString = arr.join(",");
            // 请求数据
            axios({
                method: "get",
                url: "/api/product_edit",
                params: Object.assign({}, values, { productImageUrl: values.productImageUrl })
            }).then(res => {
                if (res.data.status === 0) {
                    message.success(res.data.data);
                    props.history.push("/product/manage");
                }
            }).catch(err => {
                console.log(err);
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };


    // 图片上传后的回调
    const normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // 生命周期组件初始化
    useEffect(() => {
        initEditData();
        changeInputDisabled();
    }, [])

    return (
        <div className="productEdit">
            <Form form={form} name="dynamic_rule">

                {/* 商品名称 */}
                <Form.Item
                    {...formItemLayout}
                    name="productName"
                    label="商品名称"
                    validateTrigger="onBlur"
                    rules={[
                        {
                            required: true,
                            message: '内容不能为空',
                        }
                    ]}
                >
                    <Input placeholder="请输入商品名称" disabled={isDisabled} />
                </Form.Item>

                {/* 商品价格 */}
                <Form.Item
                    {...formItemLayout}
                    name="price"
                    label="商品价格"
                    validateTrigger="onBlur"
                    rules={[
                        {
                            required: true,
                            message: '内容不能为空',
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        max={100000000}
                        step="5"
                        formatter={value => `${value}￥/斤`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/￥\s?|(,*)/g, '')}
                        disabled={isDisabled}
                    />
                </Form.Item>

                {/* 商品图片 */}
                <Form.Item
                    {...formItemLayout}
                    name="productImageUrl"
                    label="商品图片"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload name="upload_file" action="/api/productImage_upload" listType="picture" disabled={isDisabled}>
                        <Button disabled={isDisabled}>
                            <UploadOutlined />点击上传
                        </Button>
                    </Upload>
                </Form.Item>

                {/* 提交 */}
                <Form.Item {...formTailLayout} className="submit" style={{ display: isDisabled ? "none" : false }}>
                    <Button type="primary" onClick={onCheck} block>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default ProductEdit;