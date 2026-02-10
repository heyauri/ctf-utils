const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const is_Base62 = (str: string): boolean => {
    if (str.length === 0) return false;
    for (const c of str) {
        if (!BASE62_CHARS.includes(c)) return false;
    }
    return true;
};

const de_Base62 = (str: string): string => {
    if (!str) return '';
    
    let num = BigInt(0);
    
    for (const c of str) {
        const val = BigInt(BASE62_CHARS.indexOf(c));
        num = num * 62n + val;
    }
    
    const hex = num.toString(16);
    const paddedHex = hex.length % 2 === 0 ? hex : '0' + hex;
    
    const bytes: number[] = [];
    for (let i = 0; i < paddedHex.length; i += 2) {
        bytes.push(parseInt(paddedHex.substr(i, 2), 16));
    }
    
    return Buffer.from(bytes).toString('ascii');
};

const en_Base62 = (str: string): string => {
    if (!str) return '';
    const data = Buffer.from(str);
    const result: string[] = [];

    for (const b of data) {
        let carry = b;
        for (let i = 0; i < result.length; i++) {
            const x = BASE62_CHARS.indexOf(result[i]) * 256 + carry;
            result[i] = BASE62_CHARS[x % 62];
            carry = Math.floor(x / 62);
        }
        while (carry > 0) {
            result.push(BASE62_CHARS[carry % 62]);
            carry = Math.floor(carry / 62);
        }
    }

    for (const c of data) {
        if (c === 0) {
            result.push(BASE62_CHARS[0]);
        } else {
            break;
        }
    }

    return result.reverse().join('');
};

export {
    is_Base62,
    de_Base62,
    en_Base62,
    is_Base62 as detect,
    de_Base62 as decode,
    en_Base62 as encode
};
