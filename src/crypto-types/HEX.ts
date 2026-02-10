const is_HEX = (str: string): boolean => {
    return /^[0-9A-F\s]+$/i.test(str);
};

const de_HEX = (str: string, type: number = 0): string | Buffer => {
    str = str.replace(/(\n|\r|\s)/gi, "");
    return type === 0 ? Buffer.from(str, "hex").toString() : Buffer.from(str, "hex");
};

const en_HEX = (str: string): string => {
    return Buffer.from(str).toString("hex");
};

export {
    is_HEX,
    de_HEX,
    en_HEX,
    is_HEX as detect,
    de_HEX as decode,
    en_HEX as encode
};
