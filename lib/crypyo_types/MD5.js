function is_MD5(str) {
    return /^[0-9a-fA-F]+$/.test(str);
}

module.exports= {
    is_MD5
}