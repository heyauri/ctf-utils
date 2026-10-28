const rotCharCode = (charCode: number, basicNumber: number, rot: number = 13, mod: number = 26): number => {
    let result = (charCode - basicNumber + rot) % mod;
    if (result < 0) result += mod;
    return result + basicNumber;
};

const rot13 = (input: string | Buffer): string | Buffer => {
    if (Buffer.isBuffer(input)) {
        for (let i = 0; i < input.length; i++) {
            let d = input[i];
            if (d >= 65 && d <= 90) {
                d = d + 13 > 90 ? d - 13 : d + 13;
            } else if (d >= 97 && d <= 122) {
                d = d + 13 > 122 ? d - 13 : d + 13;
            }
            input[i] = d;
        }
        return input;
    } else {
        return input
            .split('')
            .map(i => i.charCodeAt(0))
            .map(d => {
                if (d >= 65 && d <= 90) {
                    return d + 13 > 90 ? d - 13 : d + 13;
                } else if (d >= 97 && d <= 122) {
                    return d + 13 > 122 ? d - 13 : d + 13;
                }
                return d;
            })
            .map(d => String.fromCharCode(d))
            .reduce((a, c) => a + c, '');
    }
};

const rotPerCode = (d: number, rot: number): number => {
    if (rot === 5) {
        // ROT5: digits only
        if (d >= 48 && d <= 57) {
            d = rotCharCode(d, 48, rot, 10);
        }
    } else if (rot === 47) {
        // ROT47: ASCII printable range
        if (d >= 33 && d <= 126) {
            d = rotCharCode(d, 33, rot, 94);
        }
    } else {
        // Letter rotation for arbitrary shifts (ROT13 is the rot=13 special case)
        if (d >= 65 && d <= 90) {
            d = rotCharCode(d, 65, rot, 26);
        } else if (d >= 97 && d <= 122) {
            d = rotCharCode(d, 97, rot, 26);
        }
    }
    return d;
};

const ROT = (input: string | Buffer, rot: number = 13): string | Buffer => {
    if (Buffer.isBuffer(input)) {
        for (let i = 0; i < input.length; i++) {
            input[i] = rotPerCode(input[i], rot);
        }
        return input;
    } else {
        return input
            .split('')
            .map(i => i.charCodeAt(0))
            .map(d => rotPerCode(d, rot))
            .map(d => String.fromCharCode(d))
            .reduce((a, c) => a + c, '');
    }
};

const de_ROT = (input: string | Buffer, type: number = 13): string | Buffer => {
    return ROT(input, type);
};

export {
    rotCharCode,
    rot13,
    rotPerCode,
    ROT,
    de_ROT,
    de_ROT as decode,
    de_ROT as encode
};
