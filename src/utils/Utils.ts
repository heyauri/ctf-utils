const stringToCharCodes = (str: string, sep: string = ""): number[] => {
    const chars = str.split(sep);
    return chars.map(item => item.charCodeAt(0));
};

const charCodesToString = (arr: number[], sep: string = ""): string => {
    return arr.map(item => String.fromCharCode(parseInt(item.toString()))).join(sep);
};

const invertNumber = (k: number, mod: number, bf: boolean = false): number => {
    if (bf) {
        for (let i = 1; i < mod; i += 2) {
            if ((i * k) % mod === 1) {
                return i;
            }
        }
    } else {
        let x1 = 1, x2 = 0, x3 = mod;
        let y1 = 0, y2 = 1, y3 = k;
        while (1) {
            if (y3 === 0) {
                break;
            }
            if (y3 === 1) {
                break;
            }
            const q = Math.floor(x3 / y3);
            const t1 = x1 - q * y1;
            const t2 = x2 - q * y2;
            const t3 = x3 - q * y3;
            x1 = y1; x2 = y2; x3 = y3;
            y1 = t1; y2 = t2; y3 = t3;
        }
        return y2;
    }
    return 0;
};

const invertBuffer = (buf: Buffer): Buffer => {
    const newBuf = Buffer.from(buf);
    for (let i = 0; i < buf.length; i++) {
        newBuf[i] = buf[buf.length - 1 - i];
    }
    return newBuf;
};

export {
    invertNumber,
    invertBuffer,
    stringToCharCodes,
    charCodesToString
};
