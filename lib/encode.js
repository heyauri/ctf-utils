const crypto_types = require("./crypto_types/_index");

const CryptoJs = require("crypto-js");

function unicode1(str) {
    var value = '';
    for (var i = 0; i < str.length; i++) {
        value += '\\u' + left_zero_4(parseInt(str.charCodeAt(i)).toString(16));
    }
    return value;
}
function unicode2(str) {
    var value = '';
    for (var i = 0; i < str.length; i++)
        value += '&#' + str.charCodeAt(i) + ';';
    return value;
}
function unicode3(str) {
    var value = '';
    for (var i = 0; i < str.length; i++) {
        value += '\&#x' + left_zero_4(parseInt(str.charCodeAt(i)).toString(16)) + ';';
    }
    return value;
}
function left_zero_4(str) {
    if (str != null && str != '' && str != 'undefined') {
        if (str.length == 2) {
            return '00' + str;
        }
    }
    return str;
}

const encode_dict = Object.keys(crypto_types).reduce((prev, curr) => {
    let crypto_type = crypto_types[curr];
    if (crypto_type["encode"]) {
        prev[curr] = crypto_type["encode"];
    }
    return prev;
}, {});

module.exports = {
    unicode1,
    unicode2,
    unicode3,
    ...encode_dict
}