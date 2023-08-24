/** 
 * &#x [Hex]：&#x0068;&#x0065;&#x006C;&#x006C;&#x006F;
 * &# [Decimal]：&#00104;&#00101;&#00108;&#00108;&#00111;
 * \U [Hex]：\U0068\U0065\U006C\U006C\U006F
 * \U+ [Hex]：\U+0068\U+0065\U+006C\U+006C\U+006F
 * @returns 
 */
const crypto_types = require("./crypto_types/_index");

function unicode(str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
        return (String.fromCharCode(parseInt((encodeURIComponent($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
        return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
        return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });
    return str;
}

function base64(str, type = 0) {
    return type == 0 ? (Buffer.from(str, "base64")).toString() : Buffer.from(str, "base64");
}

const decode_dict = Object.keys(crypto_types).reduce((prev, curr) => {
    let crypto_type = crypto_types[curr];
    if (crypto_type["decode"]) {
        prev[curr] = crypto_type["decode"];
    }
    return prev;
}, {});

module.exports = {
    ...decode_dict,
    unicode,
    base64,
}