import * as cryptoTypes from "./crypto_types/_index";

const unicode = (str: string): string => {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0: string) {
        return (String.fromCharCode(parseInt((encodeURIComponent($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0: string) {
        return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0: string) {
        return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });
    return str;
};

const base64 = (str: string, type: number = 0): string | Buffer => {
    return type === 0 ? Buffer.from(str, "base64").toString() : Buffer.from(str, "base64");
};

const decode_dict: Record<string, (str: string, ...args: unknown[]) => string | Buffer> = {};
for (const curr in cryptoTypes) {
    const cryptoType = cryptoTypes[curr as keyof typeof cryptoTypes];
    if (cryptoType && typeof cryptoType === 'object' && 'decode' in cryptoType) {
        const decodeFn = (cryptoType as { decode?: (str: string, ...args: unknown[]) => string | Buffer }).decode;
        if (decodeFn) {
            decode_dict[curr] = decodeFn;
        }
    }
}

export default {
    ...cryptoTypes,
    unicode,
    base64,
    decode_dict
}
