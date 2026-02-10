const atbash_alphabet_upper = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
const atbash_alphabet_lower = 'zyxwvutsrqponmlkjihgfedcba';

const en_Atbash = (input: string): string => {
    let result = '';
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const upperIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(char);
        const lowerIndex = 'abcdefghijklmnopqrstuvwxyz'.indexOf(char);
        if (upperIndex >= 0) {
            result += atbash_alphabet_upper[upperIndex];
        } else if (lowerIndex >= 0) {
            result += atbash_alphabet_lower[lowerIndex];
        } else {
            result += char;
        }
    }
    return result;
};

const de_Atbash = en_Atbash;

const is_Atbash = (input: string): boolean => {
    const atbashPattern = /^[ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba]+$/;
    return atbashPattern.test(input);
};

export {
    en_Atbash,
    de_Atbash,
    en_Atbash as encode,
    de_Atbash as decode,
    is_Atbash as detect
};
