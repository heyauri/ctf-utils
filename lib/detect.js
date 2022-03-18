function MD5(str) {
    return /^[0-9a-fA-F]+$/.test(str);
}
function unicode(str) {
    return is_unicode1(str) || is_unicode2(str) || is_unicode3(str);
}
function is_unicode1(str) {
    return /(\\u)(\w{1,4})/gi.test(str);
}
function is_unicode2(str) {
    return /(&#)(\d{1,6});/gi.test(str);
}
function is_unicode3(str) {
    return /(&#x)(\w{1,4});/gi.test(str);
}

const DangPu = require("./crypyo_types/DangPu").is_DangPu;
const YuFoLunChan = require("./crypyo_types/YuFoLunChan").is_YufoLunChan;
const OCT = require("./crypyo_types/OCT").is_OCT;
const HEX = require("./crypyo_types/HEX").is_HEX;
const Morse = require("./crypyo_types/Morse").is_Morse;
const Bacon = require("./crypyo_types/Bacon").is_Bacon;
const Exponential = require("./crypyo_types/Exponential").is_Exponential;
const BinaryFile = require("./crypyo_types/BinaryFile").is_BinaryFile

function detectAll(str) {
    let results = [];
    results.push(`OCT: ${OCT(str)}`);
    results.push(`HEX: ${HEX(str)}`);
    results.push(`MD5: ${MD5(str)}`);
    results.push(`Morse: ${Morse(str)}`);
    results.push(`Unicode: ${unicode(str)}`);
    results.push(`DangPu: ${DangPu(str)}`);
    results.push(`YuFoLunChan: ${YuFoLunChan(str)}`);
    return results;
}

module.exports = {
    MD5,
    unicode,
    DangPu,
    YuFoLunChan,
    OCT,
    HEX,
    Morse,
    Bacon,
    Exponential,
    BinaryFile,
    detectAll
}