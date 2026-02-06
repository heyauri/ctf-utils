const BASE85_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';

const is_Base85 = (str: string): boolean => {
    if (str.length === 0) return false;
    for (const c of str) {
        if (!BASE85_CHARS.includes(c) && c !== 'z') return false;
    }
    return true;
};

const de_Base85 = (str: string, type: number = 0): string | Buffer => {
    const result: number[] = [];
    let buffer = 0;
    let bits = 0;
    let count = 0;

    for (const c of str) {
        if (c === 'z') {
            if (count > 0) {
                for (let i = 0; i < count - 1; i++) {
                    result.push(0);
                }
            }
            count = 0;
            buffer = 0;
            bits = 0;
            continue;
        }

        const val = BASE85_CHARS.indexOf(c);
        buffer = (buffer << 8) | val;
        bits += 8;
        count++;

        while (bits >= 32) {
            bits -= 32;
            const divisor = Math.pow(85, 4 - count);
            const subValue = buffer >>> bits;
            for (let i = 0; i < 4; i++) {
                result.push((subValue / Math.pow(85, 3 - i)) % 85);
            }
        }
    }

    const buf = Buffer.from(result);
    return type === 0 ? buf.toString() : buf;
};

const en_Base85 = (str: string): string => {
    const data = Buffer.from(str);
    const result: string[] = [];

    for (let i = 0; i < data.length; i += 4) {
        const chunk = data.slice(i, i + 4);
        let value = 0;
        for (let j = 0; j < chunk.length; j++) {
            value = (value << 8) | chunk[j];
        }

        if (value === 0) {
            result.push('z');
            continue;
        }

        for (let j = 4; j >= 0; j--) {
            const divisor = Math.pow(85, j);
            const digit = Math.floor(value / divisor) % 85;
            result.push(BASE85_CHARS[digit]);
        }
    }

    return result.join('');
};

export {
    is_Base85,
    de_Base85,
    en_Base85,
    is_Base85 as detect,
    de_Base85 as decode,
    en_Base85 as encode
};
