import CryptoJS from "crypto-js";

const is_MD5 = (str: string): boolean => {
    return /^[0-9a-fA-F]+$/.test(str);
};

const en_MD5 = (str: string): string => {
    return CryptoJS.MD5(str).toString();
};

export {
    is_MD5,
    en_MD5,
    is_MD5 as detect,
    en_MD5 as encode
};
