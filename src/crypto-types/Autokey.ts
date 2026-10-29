// Autokey cipher (Vigenere variant)
// The keystream is the key followed by the plaintext itself.

const cleanText = (str: string): string => str.toUpperCase().replace(/[^A-Z]/g, '');
const cleanKey = (key: string): string => {
    const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleaned) throw new Error('Autokey: key must contain at least one letter');
    return cleaned;
};

const en_Autokey = (input: string, key: string): string => {
    const text = cleanText(input);
    const normalizedKey = cleanKey(key);
    if (!text) return '';
    const keystream = normalizedKey + text;
    return text
        .split('')
        .map((char, i) => {
            const p = char.charCodeAt(0) - 65;
            const k = keystream.charCodeAt(i) - 65;
            return String.fromCharCode(((p + k) % 26) + 65);
        })
        .join('');
};

const de_Autokey = (input: string, key: string): string => {
    const text = cleanText(input);
    const normalizedKey = cleanKey(key);
    if (!text) return '';
    const keystream = normalizedKey.split('');
    return text
        .split('')
        .map((char, i) => {
            const c = char.charCodeAt(0) - 65;
            const k = keystream[i].charCodeAt(0) - 65;
            const p = (c - k + 26) % 26;
            keystream.push(String.fromCharCode(p + 65));
            return String.fromCharCode(p + 65);
        })
        .join('');
};

export {
    en_Autokey,
    de_Autokey,
    en_Autokey as encode,
    de_Autokey as decode
};
