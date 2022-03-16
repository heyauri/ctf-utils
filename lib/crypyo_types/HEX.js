function is_HEX(str) {
    return /^[0-9A-F\s ]+$/i.test(str);
}

function de_HEX(str) {
    return (Buffer.from(str,"hex")).toString();
}

function en_HEX(str) {
    return (Buffer.from(str)).toString("hex");
}

module.exports={
    is_HEX,
    de_HEX,
    en_HEX
}