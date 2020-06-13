import React from "react";
import { withRouter } from "react-router-dom";
import ContentTitle from "../contentTitle";
import axios from "axios";
import { Table, message } from 'antd';
import "./index.scss";
import ProductSearch from "../productSearch";



class OrderManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 分类的所有数据
            data: [],
            // 当前多少页，每页多少条数据
            pagination: {
                current: 1,  //当前页数
                pageSize: 10, // 每页多少条数据
                total: 0,     // 获取的数据数量
                showQuickJumper: true
            },
            // 是否开启加载动画
            loading: false,
            // 查询类型
            selectValue: "productId",
            // 查询的关键词
            keyWord: ""
        };

    }

    // 生命周期：组件加载完成
    componentDidMount() {
        this.inintData();
    }

    /** 
     * 分页的页数发生变化时，获取对应的用户数据
     * @param     pagination 是state的参数，里面有current, pageSize等参数
    */
    handleTableChange = (pagination) => {
        axios({
            method: "get",
            url: "/api/order/list",
            params: {
                pageSize: pagination.pageSize,
                pageNum: pagination.current
            }
        }).then(res => {
            this.setState({
                data: res.data.list,
                loading: false,
                pagination: Object.assign(this.state.pagination, pagination)
            })
        }).catch(err => {
            console.log(err);
        })
    };

    // 初始化商品数据
    inintData = () => {
        this.setState({ loading: true });
        return axios({
            method: "get",
            url: "/api/init_orders"
        }).then(res => {
            // 请求成功后数据赋值
            if (res.data.status === 0) {
                this.setState({
                    data: res.data.list,
                    loading: false,
                    pagination: Object.assign({}, this.state.pagination, { total: res.data.total })
                })
            }
        }).catch(err => {
            console.log(err);
        })

    };

    /** 
     * 搜索组件提交搜索框内容，过滤查找一下
     * 更新一下state
    */
    searchChange(value) {
        this.setState({
            selectValue: value.selectValue,
            keyWord: value.keyWord
        }, async () => {
            if (this.state.keyWord === "") {
                this.inintData();
            } else {
                axios({
                    method: "get",
                    url: "/api/order/search",
                    params: {
                        orderId: this.state.keyWord
                    }
                }).then(res => {
                    if (res.data.status === 0) {
                        this.setState({
                            data: res.data.list,
                            pagination: Object.assign({}, this.state.pagination, { current: 1, total: res.data.total })
                        })
                    } else {
                        message.warning(res.data.msg)
                    }

                }).catch(err => {
                    console.log(err);
                })
            }

        })


    }


    // 点击改变订单状态
    changeOrderStatus(rowData) {
        let changeStatus = rowData.status === 1 ? 0 : 1;
        axios({
            method: "get",
            url: "/api/order_changeStatus",
            params: {
                orderId: rowData.orderId,
                status: changeStatus
            }
        }).then(res => {
            if (res.data.status === 0) {
                // 数据库修改完成后，遍历data数据找到相应的数据，更新status值
                let newData = this.state.data;
                newData.forEach(item => {
                    if (item.orderId === rowData.orderId) {
                        item.status = changeStatus;
                    }
                })

                this.setState({
                    data: newData
                })
            }
        }).catch(err => console.log(err));
    }

    // 点击修改名称出现模态框
    jumpOrderDetail(data) {
        this.props.history.push({ pathname: "/order/manage/detail", state: { orderId: data.orderId } })
    }

    render() {
        // 表头
        const columns = [
            {
                title: '订单号',
                dataIndex: 'orderId'
            },
            {
                title: '收件人',
                dataIndex: 'receiver'
            },
            {
                title: '订单状态',
                dataIndex: 'status',
                render: (data, rowData) => {
                    return (
                        <p className="order_statusWrapper">
                            <a
                                className={data === 0 ? "checked" : ""}
                                onClick={data === 0 ? null : () => { this.changeOrderStatus(rowData) }}
                            >未发货</a>
                            <a
                                className={data === 1 ? "checked" : ""}
                                onClick={data === 1 ? null : () => { this.changeOrderStatus(rowData) }}
                            >已发货</a>
                        </p >
                    )
                }
            },
            {
                title: '订单总价',
                dataIndex: 'orderMoney',
                render: data => data + "元"
            },
            {
                title: '创建时间',
                dataIndex: 'orderTime'
            },
            {
                title: '操作',
                render: (data, record) => <span className="optionWrap">
                    <a className="option" onClick={() => this.jumpOrderDetail(record)}>查看</a>
                </span>
            }
        ];

        const { data, pagination, loading } = this.state;
        return (
            <div className="productManage">
                <ContentTitle title="订单列表" />
                <ProductSearch title="订单" productNameVisible={true} onChange={(value) => this.searchChange(value)} />
                {/* 表格 */}
                <Table
                    style={{ overflow: "auto" }}
                    columns={columns}
                    rowKey={() => Math.random() * 1000000}
                    dataSource={data}           // 用户数据
                    pagination={pagination}     // 分页配置参数
                    loading={loading}           // 是否开启加载
                    onChange={this.handleTableChange}   // 分页改变触发回调函数
                    bordered={true}             // 是否显示边框
                />
            </div>
        );
    }
}
export default withRouter(OrderManage)