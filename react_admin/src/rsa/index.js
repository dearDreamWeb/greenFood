import JSEncrypt from 'jsencrypt';

// 私钥内容
const PRIV_KEY = `MIICXQIBAAKBgQDsNBA0WAtqWTNan3YrP20wbeIivc/dsXF0GBGLj3LmYrlPfOCa
7sr0yzzzSmeb9iloig8C8Ao/swjw6iUdlcPV/pfY/FiFTTMiUNFLF503dvKkPRIf
CLgnGb/5ZGunm7u/2W4ForUW1LsphlwUGbRmIOIuMUwXo6c8FR/4GhmqPwIDAQAB
AoGBAOBwhClIs+gkxEBLH1zu0tDeyK6cT+Tm09gtepZzAwnZKx5VmZJ+bsl2SP8g
ZxzyJdyYurTe484tT8SjqArZoQ9lP6Qs6ngH80WPg9O0dHFF8QD1bHFG2IfSlS40
p5Tqlc2WT6RJgIK4NekowC7tPu7PONbf67CUCv2Fi0s3zpopAkEA/+lyaJNyVpA4
Bd7mb5tvk8VmcPhHdpNkVuP29Glc74P5+VdsvNvDgo/StYooi8TscDNcIjBGLtom
gljLARBqAwJBAOxI4SeYo6Vak8Eib83QiHEcDdM3HxEmzzRZkQJohipZwNGEqCDV
WWsrXL2upUOT16xzOElZmnpOsxkRA3llqBUCQQD7AeX2ztCyOSjKEVSiman6Hf+Z
xNyLYIxlcZnzJzlBsIhKWcbNAx0j/Z+l8opMdW2Xq7ity/26zLxC04biV1AzAkAJ
BUdDQbqNp4WYi/4Et39eAhotBB+1gevLLdgxZVgp6b9IwG3CwyJkywUBYNeCWvSS
6tstQbR6EuMXg+TED7N5AkA2xfsjd4z6jG1C6n8GpTo9S+Sz8obk2QUH0EqsN1E6
Fg3nV/1B8xdPlhWhy77uC5UEDuJ57+5hj27jKf01CmU/`;

// 公钥内容
const PUB_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDsNBA0WAtqWTNan3YrP20wbeIi
vc/dsXF0GBGLj3LmYrlPfOCa7sr0yzzzSmeb9iloig8C8Ao/swjw6iUdlcPV/pfY
/FiFTTMiUNFLF503dvKkPRIfCLgnGb/5ZGunm7u/2W4ForUW1LsphlwUGbRmIOIu
MUwXo6c8FR/4GhmqPwIDAQAB`;
// 公钥加密
function encrypt(text) {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUB_KEY);
    const encrypted = encrypt.encrypt(text);
    return encrypted;
}

// 私钥解密
function decrypt(text) {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(PRIV_KEY);
    const decrypted = decrypt.decrypt(text);
    return decrypted;
}

export default {
    encrypt,
    decrypt
}