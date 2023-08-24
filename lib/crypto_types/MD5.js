function is_MD5(str) {
    return /^[0-9a-fA-F]+$/.test(str);
}

const CryptoJs = require("crypto-js");

function en_MD5(str) {
    return CryptoJs.MD5(str).toString();
}

module.exports = {
    is_MD5,
    detect: is_MD5,
    en_MD5,
    encode: en_MD5
}