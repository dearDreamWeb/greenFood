const mysql = require('mysql');
let query;
let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'shop',
    multipleStatements: true
})
query = (sql, values, callback) => {
    //连接池建立链接
    pool.getConnection((err, connection) => {
        if (err) throw new Error(`连接失败：${err}`);
        connection.query(sql, values, (err, data) => {
            if (err) throw new Error(`sql语句失败：${err}`);
            //释放连接
            pool.releaseConnection(connection);
            //回调函数
            callback && callback(data);
        })
    })
}
module.exports = query
//insert
 // 单条数据插入
    // sql:'insert into 表名 set ?'
    // values:{name: '张三', age:14}
 // 多条数据插入
    // sql:'insert into 表名(`name`,`age`) values ?'
    // values:[[['张三', 18],['李四', 19],['王五', 20]]]

// delete
    // 删除一条
        // sql:'delete from 表名 where id=?'
        // values:[1]
    // 删除多条
        // sql:'delete from 表名 where id in (?)'
        // values:[[1,2,3]]

//update
    // 注意：mysql 没有批量 update 的方法，得使用循环来单个修改
        // 更新单条数据
        // sql:'update 表名 set name=?,age=? where id=?'
        // values:['张三', 14, 1]
    // 更新全部数据(不用where)
        // sql:'update 表名 set name=?'

// select
    // 多条件查询
        // sql:'select * from 表名 where name = ? and age = ?'
        // 或 sql:'select * from 表名 where name = ? or age = ?'
        // values:['张三', 12]
    // 同条件限定查询
        // sql:'select * from 表名 where id in (?)'
        // values:[[1,2,3,4]]