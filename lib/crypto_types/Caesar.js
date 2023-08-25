function rot_char_code(char_code, basic_number, rot = 13) {
    return (char_code - basic_number + rot) % 26 + basic_number
}

function ROT(input, rot = 13) {
    rot = parseInt(rot);
    if (Buffer.isBuffer(input)) {
        for (let i = 0; i < input.length; i++) {
            let d = input[i];
            d = d >= 65 && d <= 90 ? rot_char_code(d, 65, rot) : d;
            d = d >= 97 && d <= 122 ? rot_char_code(d, 97, rot) : d;
            input[i] = d;
        }
        return input;
    } else {
        return input
            .split('')
            .map(i => i.charCodeAt(0))
            .map(d => d >= 65 && d <= 90 ? rot_char_code(d, 65, rot) : d)
            .map(d => d >= 97 && d <= 122 ? rot_char_code(d, 97, rot) : d)
            .map(d => String.fromCharCode(d))
            .reduce((a, c) => a + c, '');
    }
}

function de_Caesar(input, type = 13) {
    // if (type == 13) {
    //     return rot13(input)
    // }
    let t = Object.prototype.toString.call(type);
    if (t == "[object Number]") {
        return ROT(input, type)
    }
    if (t == "[object String]") {
        switch (type) {
            case "Avocat":
                return ROT(input, 10);
            case "ROT13":
                return ROT(input, 13);
            case "Cassis":
                return ROT(input, -5);
            case "Cassette":
                return ROT(input, -6);
            default:
                return ROT(input, type)
        }
    }
    return "Caesar type is invalid"
}

module.exports = {
    de_Caesar,
    decode: de_Caesar,
    encode: de_Caesar
}