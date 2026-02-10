const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const is_Base58 = (str: string): boolean => {
    if (str.length === 0) return false;
    for (const c of str) {
        if (!BASE58_CHARS.includes(c)) return false;
    }
    return true;
};

const de_Base58 = (str: string): string => {
    if (!str) return '';
    
    let num = BigInt(0);
    
    for (const c of str) {
        const val = BigInt(BASE58_CHARS.indexOf(c));
        num = num * 58n + val;
    }
    
    const hex = num.toString(16);
    const paddedHex = hex.length % 2 === 0 ? hex : '0' + hex;
    
    const bytes: number[] = [];
    for (let i = 0; i < paddedHex.length; i += 2) {
        bytes.push(parseInt(paddedHex.substr(i, 2), 16));
    }
    
    return Buffer.from(bytes).toString('ascii');
};

const en_Base58 = (str: string): string => {
    if (!str) return '';
    const data = Buffer.from(str);
    const result: string[] = [];

    for (const b of data) {
        let carry = b;
        for (let i = 0; i < result.length; i++) {
            const x = BASE58_CHARS.indexOf(result[i]) * 256 + carry;
            result[i] = BASE58_CHARS[x % 58];
            carry = Math.floor(x / 58);
        }
        while (carry > 0) {
            result.push(BASE58_CHARS[carry % 58]);
            carry = Math.floor(carry / 58);
        }
    }

    for (const c of data) {
        if (c === 0) {
            result.push(BASE58_CHARS[0]);
        } else {
            break;
        }
    }

    return result.reverse().join('');
};

export {
    is_Base58,
    de_Base58,
    en_Base58,
    is_Base58 as detect,
    de_Base58 as decode,
    en_Base58 as encode
};
