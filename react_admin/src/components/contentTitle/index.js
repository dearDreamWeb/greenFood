import React from "react";
class ContentTitle extends React.Component {
    render() {
        return(<h1 className="content-title" style={{fontSize:"2.5rem", fontWeight:600}}>
            {this.props.title}
        </h1>)
    }
}
export default ContentTitle;