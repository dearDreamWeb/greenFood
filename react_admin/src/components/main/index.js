import React from "react";
import ContentTitle from "../contentTitle";
import "./index.scss";
import { Card, Col, Row } from 'antd';
import { UnorderedListOutlined, UserOutlined, DiffOutlined } from '@ant-design/icons';
import axios from "axios";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 数据
            count: [
                { count: 0, title: "用户总数", jumpLink: "/users/manage", icon: <UserOutlined />, background: "#66ef66" },
                { count: 0, title: "商品总数", jumpLink: "/product/manage", icon: <UnorderedListOutlined />, background: "#f9cb4a" },
                { count: 0, title: "订单总数", jumpLink: "/order/manage", icon: <DiffOutlined />, background: "#f93232" }
            ]
        }
    }

    // 获取统计数据
    initData() {
        axios.get("/api/base_count").then(res => {
            if (res.data.status === 0) {
                this.setState({
                    count: [
                        Object.assign({}, this.state.count[0], { count: res.data.data.userCount }),
                        Object.assign({}, this.state.count[1], { count: res.data.data.productCount }),
                        Object.assign({}, this.state.count[2], { count: res.data.data.orderCount })
                    ]
                })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.initData();
    }
    render() {
        return (<div className="main">
            <ContentTitle title="首页" />
            <div className="site-card-wrapper">
                <Row gutter={16}>
                    {this.state.count.map((item, index) => {
                        return (<Col key={index} md={8} xs={24}>
                            <Card 
                            bordered={false} 
                            hoverable={true} 
                            className="item" 
                            style={{ background: item.background }}
                            onClick={()=>this.props.history.push(item.jumpLink  )}
                            >
                                <div className="content-wrap">
                                    <h1 className="title">{item.count}</h1>
                                    <footer className="footer">
                                        {item.icon}{item.title}
                                    </footer>
                                </div>
                            </Card>
                        </Col>)
                    })}
                </Row>
            </div>
        </div>)
    }
}
export default Main