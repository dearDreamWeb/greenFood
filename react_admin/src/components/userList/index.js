import React from "react";
import { withRouter } from "react-router-dom";
import ContentTitle from "../contentTitle";
import axios from "axios";
import { Table, message } from 'antd';

// 表头
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        // width: '20%',
    },
    {
        title: '用户名',
        dataIndex: 'username',
        // width: '20%',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
    },
    {
        title: '手机号',
        dataIndex: 'phone',
    },
    {
        title: '注册时间',
        dataIndex: 'createTime',
        render: (data) => {
            // 修改一下时间的格式，因为默认的时间格式有"上午"和"下午"这俩个词，所以替换成24小时制，
            if (new Date(data).toLocaleString().includes("上午")) {
                let time = new Date(data).toLocaleTimeString();
                time = time.replace(new RegExp(/^上午/), " ");
                return new Date(data).toLocaleDateString() + time;
            } else {
                let time = new Date(data).toLocaleTimeString().split(":");
                time[0] = time[0].replace(new RegExp(/^下午/, "g"), "");
                // 因为中午12点算是下午，所以当遇到12点就不加12了
                if (parseInt(time[0]) !== 12) {
                    time[0] = parseInt(time[0]) + 12;
                }
                time[0] = " " + time[0];
                time = time.join(":");
                return new Date(data).toLocaleDateString() + time;
            }
        }
    }
];

class UsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 用户数据
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
        };
    }

    // 生命周期：组件加载完成
    componentDidMount() {
        this.initUserCount();
        this.inintData();
    }

    /** 
     * 分页的页数发生变化时，获取对应的用户数据
     * @param     pagination 是antd组件封装好的参数，里面有current, pageSize total等参数
    */
    handleTableChange = (pagination) => {
        axios({
            method: "get",
            url: "/manage/user/list.do",
            params: {
                pageSize: pagination.pageSize,
                pageNum: pagination.current
            }
        }).then(res => {
            // 请求成功后数据赋值
            if (res.data.status === 0) {
                this.setState({
                    data: res.data.data.list,
                    loading: false,
                    pagination: Object.assign(this.state.pagination, pagination)
                })
            } else {
                message.warning(res.data.msg);
            }
        }).catch(err => {
            console.log(err);
        })
    };

    // 初始化用户总数
    initUserCount() {
        axios.get("/manage/statistic/base_count.do").then(res => {
            if (res.data.status === 0) {
                this.setState({
                    pagination: Object.assign({}, this.state.pagination, { total: res.data.data.userCount })
                })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // 初始化用户数据
    inintData = () => {
        this.setState({ loading: true });
        axios({
            method: "get",
            url: "/manage/user/list.do"
        }).then(res => {
            // 请求成功后数据赋值
            if (res.data.status === 0) {
                this.setState({
                    data: res.data.data.list,
                    loading: false
                })
            }
        }).catch(err => {
            console.log(err);
        })

    };

    render() {
        const { data, pagination, loading } = this.state;
        return (
            <div className="usersList">
                <ContentTitle title="用户列表" />
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
export default withRouter(UsersList)