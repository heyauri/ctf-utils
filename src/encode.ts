const unicode1 = (str: string): string => {
    let value = '';
    for (let i = 0; i < str.length; i++) {
        value += '\\u' + leftZero4(str.charCodeAt(i).toString(16));
    }
    return value;
};

const unicode2 = (str: string): string => {
    let value = '';
    for (let i = 0; i < str.length; i++) {
        value += '&#' + str.charCodeAt(i) + ';';
    }
    return value;
};

const unicode3 = (str: string): string => {
    let value = '';
    for (let i = 0; i < str.length; i++) {
        value += '&#x' + leftZero4(str.charCodeAt(i).toString(16)) + ';';
    }
    return value;
};

const leftZero4 = (str: string | number): string => {
    if (str != null && str !== '' && str !== undefined) {
        if (String(str).length === 2) {
            return '00' + str;
        }
    }
    return String(str);
};

import * as cryptoTypes from "./crypto_types/_index";

const encode_dict: Record<string, (str: string, ...args: unknown[]) => string | Buffer> = {};
for (const curr in cryptoTypes) {
    const cryptoType = cryptoTypes[curr as keyof typeof cryptoTypes];
    if (cryptoType && typeof cryptoType === 'object' && 'encode' in cryptoType) {
        const encodeFn = (cryptoType as { encode?: (str: string, ...args: unknown[]) => string | Buffer }).encode;
        if (encodeFn) {
            encode_dict[curr] = encodeFn;
        }
    }
}

export default { ...cryptoTypes, unicode1, unicode2, unicode3, encode_dict };
