const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(createProxyMiddleware('/manage', {
        target: 'http://admintest.happymmall.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            "^/api": "/manage"
        }
    }))

    app.use(createProxyMiddleware('/user/logout.do', {
        target: 'http://admintest.happymmall.com',
        secure: false,
        changeOrigin: true
    }))

    app.use(createProxyMiddleware('/api', {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            "^/api": "/api"
        }
    }))
    // app.use(createProxyMiddleware('/manage/user/login.do', {
    //     target: 'http://admintest.happymmall.com/manage/user/login.do',
    //     secure: false,
    //     changeOrigin: true
    // }))
}