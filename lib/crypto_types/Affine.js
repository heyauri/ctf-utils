const utils = require("../utils/Utils");
// a:97 A:65
const en_Affine = function (in_str, opt) {
    let { a, b, mode } = opt;
    mode = mode || "upper";
    let str = mode == "upper" ? in_str.toUpperCase() : in_str.toLowerCase();
    let basic_number = mode == "upper" ? 65 : 97
    let char_codes = utils.string_to_char_codes(str);
    let encoded_char_codes = char_codes.map(code => {
        let code_num = code - basic_number;
        if (code_num >= 0 && code_num < 26) {
            return (code_num * a + b) % 26 + basic_number;
        } else {
            return code;
        }
    })
    return utils.char_codes_to_string(encoded_char_codes);
}

const de_Affine = function (in_str, opt) {
    let { a, b, i, mode, bf } = opt;
    mode = mode || "upper";
    let str = mode == "upper" ? in_str.toUpperCase() : in_str.toLowerCase();
    let basic_number = mode == "upper" ? 65 : 97;
    let char_codes = utils.string_to_char_codes(str);
    let inverse_number = i === undefined ? utils.invert_number(a, 26, bf) : i;
    let encoded_char_codes = char_codes.map(code => {
        let code_num = code - basic_number;
        if (code_num >= 0 && code_num < 26) {
            let res = ((code_num - b) * inverse_number) % 26;
            if (res < 0) {
                res = res + 26;
            }
            return res + basic_number;
        } else {
            return code;
        }
    })
    return utils.char_codes_to_string(encoded_char_codes);
}

const is_Affine = function (str) {
    return /[a-z\s]+/gi.test(str);
}

module.exports = {
    is_Affine,
    en_Affine,
    detect: is_Affine,
    encode: en_Affine,
    de_Affine,
    decode: de_Affine
}