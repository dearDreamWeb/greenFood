import React from "react";
import { Select, Input, message } from 'antd';
// import { AudioOutlined } from '@ant-design/icons';


class ProductSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectValue: "productId",
            keyWord: ""
        };
    }

    // select变化更新state
    handleChange(value) {
        this.setState({
            selectValue: value
        })
    }

    // 输入框的内容提交，更新state，在提交给父组件
    inputValue(value) {
        value = value.trim();
        this.setState({
            keyWord: value
        }, () => {
            this.props.onChange({
                selectValue: this.state.selectValue,
                keyWord: this.state.keyWord
            });
        })
    }

    // 在输入框中按回车键的时候，触发inputValue方法
    keyUpEnter(e, value) {
        if (e.keyCode === 13) {
            this.inputValue(value);
        }
    }

    render() {
        const { Search } = Input;
        const { Option } = Select;
        return (<div className="product-search" style={{ display: "flex", boxSizing: "border-box", paddingBottom: "1rem" }}>
            <div className="select-wrap">
                <Select defaultValue="productId" onChange={(value) => this.handleChange(value)}>
                    <Option value="productId">按{this.props.title ? this.props.title : "商品"}ID查询</Option>
                    <Option value="productName" style={{ display: this.props.productNameVisible ? "none" : "block" }}>按{this.props.title ? this.props.title : "商品"}名字查询</Option>
                </Select>
            </div>
            <div className="search-wrap">
                <Search
                    placeholder="关键词"
                    onSearch={value => this.inputValue(value)}
                    onKeyUp={value => this.keyUpEnter(Event, value)}
                    style={{ width: 200 }}
                />
            </div>
        </div>)
    }
}

export default ProductSearch;