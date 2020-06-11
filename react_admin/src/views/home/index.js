import React from 'react';
import { Route, Switch } from "react-router-dom";
import "./index.scss";
import NavTop from "../../components/navTop/index";  // 头部导航
import NavSide from "../../components/navSide/index";  // 侧边导航
import Main from "../../components/main/index";  // 内容区首页
import UsersList from "../../components/userList/index";  // 用户列表
import ProductManage from "../../components/productManage";  // 商品管理
import ProductEdit from "../../components/productEdit";  // 商品编辑
import OrderManage from "../../components/orderManage";  // 订单管理
import OrderDetail from "../../components/orderDetail";  // 订单详情
import NotFound from "../../views/notFound";  // 404页面

import { Layout } from 'antd';
// const { Content } = Layout;
class Home extends React.Component {
    render() {
        return (<div className="home">
            <Layout>
                <NavTop></NavTop>
                <Layout className="main" >
                    <NavSide></NavSide>
                    <Layout className="content_layout" style={{ padding: "1rem" }}>
                        <Switch>
                            <Route exact path="/" component={Main} />
                            <Route path="/product/manage" component={ProductManage}></Route>
                            <Route path="/product/edit" component={ProductEdit}></Route>
                            <Route path="/product/detail" component={ProductEdit}></Route>
                            <Route exact path="/order/manage" component={OrderManage}></Route>
                            <Route path="/order/manage/detail" component={OrderDetail}></Route>
                            <Route path="/users/manage" component={UsersList} />
                            <Route component={NotFound}></Route>
                        </Switch>
                        {/* <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            Content
                        </Content> */}
                    </Layout>
                </Layout>
            </Layout>
        </div>)
    }
}

export default Home;