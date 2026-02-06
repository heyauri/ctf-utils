const atbash_alphabet = 'ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba';

const en_Atbash = (input: string): string => {
    let result = '';
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const upperChar = char.toUpperCase();
        const index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(upperChar);
        if (index >= 0) {
            result += atbash_alphabet[index];
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
