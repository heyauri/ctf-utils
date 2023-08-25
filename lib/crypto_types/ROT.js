/**  
 *  A-> 65 a->97 (0-9)->(48-57)
*/

function rot_char_code(char_code, basic_number, rot = 13, mod = 26) {
    return (char_code - basic_number + rot) % mod + basic_number
}

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

function rot_per_code(d, rot) {
    if (rot == 13) {
        d = d >= 65 && d <= 90 ? rot_char_code(d, 65, rot, 26) : d;
        d = d >= 97 && d <= 122 ? rot_char_code(d, 97, rot, 26) : d;
    }
    if (rot == 5) {
        d = d >= 48 && d <= 57 ? rot_char_code(d, 48, rot, 10) : d;
    }
    if (rot == 47) {
        d = d >= 33 && d <= 126 ? rot_char_code(d, 33, rot, 94) : d;
    }
    return d;
}

function ROT(input, rot = 13) {
    if (Buffer.isBuffer(input)) {
        for (let i = 0; i < input.length; i++) {
            let d = input[i];
            input[i] = rot_per_code(d, rot);
        }
        return input;
    } else {
        return input
            .split('')
            .map(i => i.charCodeAt(0))
            .map(d => { return rot_per_code(d, rot) })
            .map(d => String.fromCharCode(d))
            .reduce((a, c) => a + c, '');
    }
}

function de_ROT(input, type = 13) {
    // if (type == 13) {
    //     return rot13(input)
    // }
    return ROT(input, type)
}

module.exports = {
    de_ROT,
    decode: de_ROT,
    encode: de_ROT
}