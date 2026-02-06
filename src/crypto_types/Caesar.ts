const rotCharCode = (charCode: number, basicNumber: number, rot: number = 13): number => {
    return (charCode - basicNumber + rot) % 26 + basicNumber;
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

const de_Caesar = (input: string | Buffer, type: number | string = 13): string | Buffer => {
    const t = Object.prototype.toString.call(type);
    if (t === "[object Number]") {
        return ROT(input, type as number);
    }
    if (t === "[object String]") {
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
                return ROT(input, parseInt(type as string));
        }
    }
    return "Caesar type is invalid";
};

export {
    de_Caesar,
    de_Caesar as decode,
    de_Caesar as encode
};
