/** 
 * &#x [Hex]：&#x0068;&#x0065;&#x006C;&#x006C;&#x006F;
 * &# [Decimal]：&#00104;&#00101;&#00108;&#00108;&#00111;
 * \U [Hex]：\U0068\U0065\U006C\U006C\U006F
 * \U+ [Hex]：\U+0068\U+0065\U+006C\U+006C\U+006F
 * @returns 
 */

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

const decode_dict = {
    DangPu: require("./crypyo_types/DangPu").de_DangPu,
    YuFoLunChan: require("./crypyo_types/YuFoLunChan").de_YuFoLunChan,
    OCT: require("./crypyo_types/OCT").de_OCT,
    HEX: require("./crypyo_types/HEX").de_HEX,
    Morse: require("./crypyo_types/Morse").de_Morse,
    Bacon: require("./crypyo_types/Bacon").de_Bacon,
    Exponential: require("./crypyo_types/Exponential").de_Exponential,
    Poem: require("./crypyo_types/Poem").de_Poem,
    ROT: require("./crypyo_types/ROT").de_ROT,
}

module.exports = {
    ...decode_dict,
    unicode,
    base64,
}