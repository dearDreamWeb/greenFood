import React from "react";
import { Link } from "react-router-dom";
class NotFound extends React.Component {
    render() {
        return (
            <div style={{textAlign:"center"}}>
                <h1 style={{fontSize:"3rem"}}>404，访问的页面出错啦！</h1>
                <Link to="/">点我返回首页</Link>
            </div>
        )
    }
}
export default NotFound;