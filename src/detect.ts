import * as cryptoTypes from "./crypto-types/_index";

const detect_dict: Record<string, (str: string) => boolean> = {};
for (const curr in cryptoTypes) {
    const cryptoType = cryptoTypes[curr as keyof typeof cryptoTypes];
    if (cryptoType && typeof cryptoType === 'object' && 'detect' in cryptoType) {
        const detectFn = (cryptoType as { detect?: (str: string) => boolean }).detect;
        if (detectFn) {
            detect_dict[curr] = detectFn;
        }
    }
}

const detectAll = (str: string): Record<string, boolean> => {
    const results: Record<string, boolean> = {};
    for (const curr in detect_dict) {
        results[curr] = detect_dict[curr](str);
    }
    return results;
};

export default { ...detect_dict, detectAll };
