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

export default { ...cryptoTypes, encode_dict };
