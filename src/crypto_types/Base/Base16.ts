const is_Base16 = (str: string): boolean => {
    const cleaned = str.replace(/[\s\n\r]/g, '');
    if (cleaned.length % 2 !== 0) return false;
    return /^[0-9A-F]+$/i.test(cleaned);
};

const de_Base16 = (str: string, type: number = 0): string | Buffer => {
    const cleaned = str.replace(/(\n|\r|\s)/gi, "");
    return type === 0 ? Buffer.from(cleaned, "hex").toString() : Buffer.from(cleaned, "hex");
};

const en_Base16 = (str: string): string => {
    return Buffer.from(str).toString("hex").toUpperCase();
};

export {
    is_Base16,
    de_Base16,
    en_Base16,
    is_Base16 as detect,
    de_Base16 as decode,
    en_Base16 as encode
};
