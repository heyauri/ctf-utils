import * as cryptoTypes from "./crypto-types/_index";

const encodeSync_dict: Record<string, (str: string, ...args: unknown[]) => string | Buffer> = {};
const encode_dict: Record<string, (str: string, ...args: unknown[]) => Promise<string | Buffer>> = {};
for (const curr in cryptoTypes) {
    const cryptoType = cryptoTypes[curr as keyof typeof cryptoTypes];
    if (cryptoType && typeof cryptoType === 'object' && 'encode' in cryptoType) {
        const encodeFn = (cryptoType as { encode?: (str: string, ...args: unknown[]) => string | Buffer }).encode;
        if (encodeFn) {
            encodeSync_dict[curr] = encodeFn;
            encode_dict[curr] = async function(str: string, ...args: unknown[]): Promise<string | Buffer> {
                return Promise.resolve().then(() => encodeFn(str, ...args));
            };
        }
    }
}

export { encodeSync_dict as encodeSync,encode_dict as encode };
