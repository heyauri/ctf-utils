const BASE91_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~';

const BASE91_DECODE: number[] = new Array(256).fill(-1);
for (let i = 0; i < BASE91_TABLE.length; i++) {
    BASE91_DECODE[BASE91_TABLE.charCodeAt(i)] = i;
}

const is_Base91 = (str: string): boolean => {
    if (str.length === 0) return false;
    for (const c of str) {
        if (c === '\n' || c === '\r' || c === ' ') continue;
        const decoded = BASE91_DECODE[c.charCodeAt(0)];
        if (decoded === -1) return false;
    }
    return true;
};

const de_Base91 = (str: string): string => {
    let num = 0n;
    for (const c of str) {
        const d = BigInt(BASE91_DECODE[c.charCodeAt(0)]);
        if (d === -1n) continue;
        num = num * 91n + d;
    }

    if (num === 0n) return '';

    const bytes: number[] = [];
    while (num > 0n) {
        bytes.push(Number(num & 0xFFn));
        num >>= 8n;
    }

    return Buffer.from(bytes.reverse()).toString();
};

const en_Base91 = (str: string): string => {
    if (!str) return '';

    let num = 0n;
    for (const byte of Buffer.from(str)) {
        num = num * 256n + BigInt(byte);
    }

    if (num === 0n) return BASE91_TABLE[0];

    const result: string[] = [];
    while (num > 0n) {
        const div = num / 91n;
        const mod = num % 91n;
        result.push(BASE91_TABLE[Number(mod)]);
        num = div;
    }

    return result.reverse().join('');
};

export {
    is_Base91,
    de_Base91,
    en_Base91,
    is_Base91 as detect,
    de_Base91 as decode,
    en_Base91 as encode
};