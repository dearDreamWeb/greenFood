import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd'; //国际化
import zhCN from 'antd/lib/locale-provider/zh_CN'; //中文

//引入antd 
import 'antd/dist/antd.css';

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);