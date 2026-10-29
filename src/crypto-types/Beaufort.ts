// Beaufort cipher
// A reciprocal polyalphabetic cipher: c = (key - plain) mod 26.
// The same operation both encrypts and decrypts.

const cleanText = (str: string): string => str.toUpperCase().replace(/[^A-Z]/g, '');
const cleanKey = (key: string): string => {
    const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleaned) throw new Error('Beaufort: key must contain at least one letter');
    return cleaned;
};

const beaufort = (input: string, key: string): string => {
    const text = cleanText(input);
    const normalizedKey = cleanKey(key);
    if (!text) return '';
    return text
        .split('')
        .map((char, i) => {
            const p = char.charCodeAt(0) - 65;
            const k = normalizedKey.charCodeAt(i % normalizedKey.length) - 65;
            return String.fromCharCode(((k - p + 26) % 26) + 65);
        })
        .join('');
};

const en_Beaufort = (input: string, key: string): string => beaufort(input, key);
const de_Beaufort = (input: string, key: string): string => beaufort(input, key);

export {
    en_Beaufort,
    de_Beaufort,
    en_Beaufort as encode,
    de_Beaufort as decode
};
