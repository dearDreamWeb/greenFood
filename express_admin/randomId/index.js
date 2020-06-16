module.exports = () => {
    // 加载 crypto 模块
    const crypto = require('crypto')
    // 创建 Hmac 的算法， 可通过crypt.getHashes() 方法获取算法各类
    const Algorithm = 'sha1'
    // 创建 Hmac 实例  用时间当秘钥
    const hmac = crypto.createHmac(Algorithm, new Date().getTime().toString())
    // 使用update方法更新要加密的数据
    hmac.update(new Date().getTime().toString())
    // 生成加密后的数据, 以 hex 方式生成
    let digest = hmac.digest('hex').slice(0,16);
    return digest;
}