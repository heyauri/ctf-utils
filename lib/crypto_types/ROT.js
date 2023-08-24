function rot13(input) {
    if (Buffer.isBuffer(input)) {
        for (let i = 0; i < input.length; i++) {
            let d = input[i];
            d = d >= 65 && d <= 90 ? d + 13 > 90 ? d - 13 : d + 13 : d;
            d = d >= 97 && d <= 122 ? d + 13 > 122 ? d - 13 : d + 13 : d;
            input[i] = d;
        }
        return input;
    } else {
        return input
            .split('')
            .map(i => i.charCodeAt(0))
            .map(d => d >= 65 && d <= 90 ? d + 13 > 90 ? d - 13 : d + 13 : d)
            .map(d => d >= 97 && d <= 122 ? d + 13 > 122 ? d - 13 : d + 13 : d)
            .map(d => String.fromCharCode(d))
            .reduce((a, c) => a + c, '');
    }
}

function de_ROT(input, type = 13) {
    if (type == 13) {
        return rot13(input)
    }
    return input
}

module.exports = {
    de_ROT,
    decode: de_ROT
}