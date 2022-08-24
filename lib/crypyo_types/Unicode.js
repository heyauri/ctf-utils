
function is_Unicode(str) {
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

module.exports= {
    is_Unicode
}