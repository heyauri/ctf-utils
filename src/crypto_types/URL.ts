const en_URL = (input: string): string => {
    return encodeURIComponent(input);
};

const de_URL = (input: string): string => {
    return decodeURIComponent(input);
};

const is_URL = (input: string): boolean => {
    return /%[0-9A-Fa-f]{2}/.test(input) || /[^\w\-_.~%]/.test(encodeURIComponent(input));
};

export {
    en_URL,
    de_URL,
    en_URL as encode,
    de_URL as decode,
    is_URL as detect
};
