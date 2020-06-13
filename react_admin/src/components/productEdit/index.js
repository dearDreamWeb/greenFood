import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
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
    const [state, setState] = useState({
        imageUrl: "", loading: false
    })

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
                setState({ imageUrl: objData["productImageUrl"] })

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
            // 有productId说明是编辑页面，没有productId说明是添加商品页面
            let paramsData = (props.location.state && props.location.state.productId)
                ?
                { ...values, productId: props.location.state.productId }
                : values


            // 请求数据
            axios({
                method: "get",
                url: "/api/product_edit",
                params: paramsData
            }).then(res => {
                if (res.data.status === 0) {
                    message.success(res.data.message);
                    props.history.push("/product/manage");
                }
            }).catch(err => {
                console.log(err);
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };


    // 图片上传前的校验
    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传JPG/PNG格式的文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('上传图片大小不能超过2M');
        }
        return isJpgOrPng && isLt2M;
    }

    // 改变图片时
    const handleChange = info => {
        info.fileList.splice(0, 1); //因为只要一张图片，所以把fileList的第一个去掉，只留第二个
        if (info.file.status === 'uploading') {
            setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            if (info.file.response.status === 0) {
                // 把图片更到form表单域中
                form.setFieldsValue({ productImageUrl: info.file.response.filename });
                setState({
                    imageUrl: info.file.response.filename,  //图片的路径
                    loading: false,
                })
            } else {
                message.error(info.file.response.message);
            }
        }
    };

    const uploadButton = (
        <div>
            {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">选择图片</div>
        </div>
    );
    const { imageUrl } = state;

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
                        parser={value => value.replace(/￥\/斤\s?|(,*)/g, '')}
                        disabled={isDisabled}
                    />
                </Form.Item>

                {/* 商品图片 */}
                <Form.Item
                    {...formItemLayout}
                    name="productImageUrl"
                    label="商品图片"
                >
                    <Upload
                        name="avatar"
                        method="post"
                        disabled={isDisabled}
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="/api/productIamge_upload"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
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