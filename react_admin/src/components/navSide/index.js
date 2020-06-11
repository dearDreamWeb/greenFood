import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import "./index.scss";
import { Layout, Menu } from 'antd';
import { HomeOutlined, UnorderedListOutlined, UserOutlined ,DiffOutlined} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;
class NavSide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 左侧列表数据
            subMenuList: [
                {
                    title: "商品",
                    key: "sub1",
                    activeRouter: "/product",
                    icon: <UnorderedListOutlined />,
                    items: [
                        { key: "1", activeRouter: "/product/manage", title: "商品管理" },
                        // { key: "2", activeRouter: "/product/categories", title: "分类管理" }
                    ]
                },
                {
                    title: "订单",
                    key: "sub2",
                    icon: <DiffOutlined />,
                    activeRouter: "/order",
                    items: [
                        { key: "3", activeRouter: "/order/manage", title: "订单管理" }
                    ]
                },
                {
                    title: "用户",
                    key: "sub3",
                    icon: <UserOutlined />,
                    activeRouter: "/users",
                    items: [
                        { key: "4", activeRouter: "/users/manage", title: "用户管理" }
                    ]
                }
            ],
            // 选中的元素
            selectedItem: ["0"]
        }
    }
    componentWillMount() {
        // 遍历一下所有的菜单对应的路由，再根据地址栏的地址核对是哪个菜单，将其设为默认选项
        this.state.subMenuList.forEach(item => {
            item.items.forEach(item1 => {
                if (item1.activeRouter === this.props.history.location.pathname) {
                    this.setState({
                        selectedItem: [item1.key]
                    })
                }
            })
        })
    }

    render() {
        return (
            <div className="navSide">
                <Sider width={300} className="site-layout-background">
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={this.state.selectedItem}
                        defaultOpenKeys={['sub1', 'sub2', 'sub3']}
                    >
                        <Menu.Item key="0"
                            icon={<HomeOutlined />}
                            onClick={() => this.props.history.push("/")}
                        >首页
                        </Menu.Item>

                        {/* 遍历列表数据 */}
                        {this.state.subMenuList.map(item => {
                            return (
                                <SubMenu
                                    key={item.key}
                                    icon={item.icon}
                                    title={item.title}
                                >
                                    {item.items.map(item1 => {
                                        return (
                                            <Menu.Item
                                                key={item1.key}
                                            >
                                                <NavLink to={item1.activeRouter}>
                                                    {item1.title}
                                                </NavLink>
                                            </Menu.Item>)
                                    })}
                                </SubMenu>)
                        })}
                    </Menu>
                </Sider>
            </div>
        )
    }
}
export default withRouter(NavSide);