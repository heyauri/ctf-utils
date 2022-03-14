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

function detectAll(str) {
    let results = [];
    results.push(`MD5: ${MD5(str)}`);
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
    detectAll
}