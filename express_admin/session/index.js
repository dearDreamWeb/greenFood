module.exports = app => {
        const session = require("express-session");
        app.use(session({
            secret: 'dfafadfadfa1231asd121dadada', //秘钥
            resave: true,          //即使 session 没有被修改，也保存 session 值，默认为 true。
            saveUninitialized: true,//无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
            cookie: ('name', 'value', { secure: false })//当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效。
        }))
}


