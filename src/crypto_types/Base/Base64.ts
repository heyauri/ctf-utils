const is_Base64 = (str: string): boolean => {
    const cleaned = str.replace(/[\s=]/g, '');
    if (cleaned.length % 4 !== 0) return false;
    return /^[A-Za-z0-9+/]+$/.test(cleaned);
};

const de_Base64 = (str: string, type: number = 0): string | Buffer => {
    const cleaned = str.replace(/[\s=]/g, '');
    return type === 0 ? Buffer.from(cleaned, "base64").toString() : Buffer.from(cleaned, "base64");
};

const en_Base64 = (str: string): string => {
    return Buffer.from(str).toString("base64");
};

export {
    is_Base64,
    de_Base64,
    en_Base64,
    is_Base64 as detect,
    de_Base64 as decode,
    en_Base64 as encode
};
