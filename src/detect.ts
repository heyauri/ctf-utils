import * as cryptoTypes from "./crypto-types/_index";

const detectSync_dict: Record<string, (str: string) => boolean> = {};
const detect_dict: Record<string, (str: string) => Promise<boolean>> = {};
for (const curr in cryptoTypes) {
    const cryptoType = cryptoTypes[curr as keyof typeof cryptoTypes];
    if (cryptoType && typeof cryptoType === 'object' && 'detect' in cryptoType) {
        const detectFn = (cryptoType as { detect?: (str: string) => boolean }).detect;
        if (detectFn) {
            detectSync_dict[curr] = detectFn;
            detect_dict[curr] = async function (str: string): Promise<boolean> {
                return Promise.resolve().then(() => detectFn(str));
            };
        }
    }
}

const detectAll = async (str: string): Promise<Record<string, boolean>> => {
    const results: Record<string, boolean> = {};
    for (const curr in detectSync_dict) {
        results[curr] = await detect_dict[curr](str);
    }
    return results;
};

const detectAllSync = (str: string): Record<string, boolean> => {
    const results: Record<string, boolean> = {};
    for (const curr in detectSync_dict) {
        results[curr] = detectSync_dict[curr](str);
    }
    return results;
};

export { detectSync_dict as detectSync, detectAllSync, detectAll, detect_dict as detect };
