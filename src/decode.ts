import * as cryptoTypes from "./crypto-types/_index";

const decodeSync_dict: Record<string, (str: string, ...args: unknown[]) => string | Buffer> = {};
const decode_dict: Record<string, (str: string, ...args: unknown[]) => Promise<string | Buffer>> = {};
for (const curr in cryptoTypes) {
    const cryptoType = cryptoTypes[curr as keyof typeof cryptoTypes];
    if (cryptoType && typeof cryptoType === 'object' && 'decode' in cryptoType) {
        const decodeFn = (cryptoType as { decode?: (str: string, ...args: unknown[]) => string | Buffer }).decode;
        if (decodeFn) {
            decodeSync_dict[curr] = decodeFn;
            decode_dict[curr] = async function(str: string, ...args: unknown[]): Promise<string | Buffer> {
                return Promise.resolve().then(() => decodeFn(str, ...args));
            };
        }
    }
}

export { decodeSync_dict as decodeSync, decode_dict as decode };
