const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const is_Base32 = (str: string): boolean => {
    const cleaned = str.replace(/[\s=]/g, '').toUpperCase();
    if (cleaned.length === 0) return false;
    for (const c of cleaned) {
        if (!BASE32_CHARS.includes(c)) return false;
    }
    return true;
};

const de_Base32 = (str: string, type: number = 0): string | Buffer => {
    const cleaned = str.replace(/[\s=]/g, '').toUpperCase();
    const result: number[] = [];
    let buffer = 0;
    let bits = 0;

    for (const c of cleaned) {
        const val = BASE32_CHARS.indexOf(c);
        buffer = (buffer << 5) | val;
        bits += 5;

        while (bits >= 8) {
            bits -= 8;
            result.push((buffer >>> bits) & 0xFF);
        }
    }

    const buf = Buffer.from(result);
    return type === 0 ? buf.toString() : buf;
};

const en_Base32 = (str: string): string => {
    const result: string[] = [];
    let buffer = 0;
    let bits = 0;
    const len = str.length;

    for (let i = 0; i < len; i++) {
        buffer = (buffer << 8) | str.charCodeAt(i);
        bits += 8;

        while (bits >= 5) {
            bits -= 5;
            result.push(BASE32_CHARS[(buffer >>> bits) & 0x1F]);
        }
    }

    if (bits > 0) {
        result.push(BASE32_CHARS[(buffer << (5 - bits)) & 0x1F]);
    }

    while (result.length % 8 !== 0) {
        result.push('=');
    }

    return result.join('');
};

export {
    is_Base32,
    de_Base32,
    en_Base32,
    is_Base32 as detect,
    de_Base32 as decode,
    en_Base32 as encode
};
