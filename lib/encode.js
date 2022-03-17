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

const MD5 = function(str){
    return CryptoJs.MD5(str).toString();
};
const base64 = function (str) { return (Buffer.from(str)).toString("base64") }
const OCT = require("./crypyo_types/OCT").en_OCT;
const HEX = require("./crypyo_types/HEX").en_HEX;
const Morse = require("./crypyo_types/Morse").en_Morse;
const Bacon = require("./crypyo_types/Bacon").en_Bacon;



module.exports = {
    unicode1,
    unicode2,
    unicode3,
    MD5,
    base64,
    OCT,
    HEX,
    Morse,
    Bacon
}