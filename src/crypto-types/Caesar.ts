const rotCharCode = (charCode: number, basicNumber: number, rot: number = 13): number => {
    let result = (charCode - basicNumber + rot) % 26;
    if (result < 0) result += 26;
    return result + basicNumber;
};

const ROT = (input: string | Buffer, rot: number = 13): string | Buffer => {
    if (Buffer.isBuffer(input)) {
        for (let i = 0; i < input.length; i++) {
            let d = input[i];
            if (d >= 65 && d <= 90) {
                d = rotCharCode(d, 65, rot);
            } else if (d >= 97 && d <= 122) {
                d = rotCharCode(d, 97, rot);
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
                    return rotCharCode(d, 65, rot);
                } else if (d >= 97 && d <= 122) {
                    return rotCharCode(d, 97, rot);
                }
                return d;
            })
            .map(d => String.fromCharCode(d))
            .reduce((a, c) => a + c, '');
    }
};

const parseCaesarShift = (type: number | string): number | null => {
    const t = Object.prototype.toString.call(type);
    if (t === "[object Number]") {
        return type as number;
    }
    if (t === "[object String]") {
        switch (type) {
            case "Avocat":
                return 10;
            case "ROT13":
                return 13;
            case "Cassis":
                return -5;
            case "Cassette":
                return -6;
            default:
                return parseInt(type as string);
        }
    }
    return null;
};

const en_Caesar = (input: string | Buffer, type: number | string = 13): string | Buffer => {
    const rot = parseCaesarShift(type);
    if (rot === null || isNaN(rot)) {
        return "Caesar type is invalid";
    }
    return ROT(input, rot);
};

const de_Caesar = (input: string | Buffer, type: number | string = 13): string | Buffer => {
    const rot = parseCaesarShift(type);
    if (rot === null || isNaN(rot)) {
        return "Caesar type is invalid";
    }
    return ROT(input, 26 - rot);
};

export {
    en_Caesar,
    de_Caesar,
    de_Caesar as decode,
    en_Caesar as encode
};
