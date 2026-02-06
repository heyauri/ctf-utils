import * as cryptoTypes from "./crypto_types/_index";

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

export default { ...decode_dict };
