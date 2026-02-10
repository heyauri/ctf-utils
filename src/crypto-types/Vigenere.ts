const isLetter = (char: string): boolean => {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
};

const toUpperCase = (char: string): string => {
    if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(char.charCodeAt(0) - 32);
    }
    return char;
};

const vigenere = (input: string | Buffer, key: string, decrypt: boolean = false): string | Buffer => {
    const normalizeKey = (k: string): string => {
        return k.replace(/[^a-zA-Z]/g, '').toUpperCase();
    };

    if (Buffer.isBuffer(input)) {
        const str = input.toString('utf8');
        const normalizedKey = normalizeKey(key);
        if (!normalizedKey) return input;

        const keyLen = normalizedKey.length;
        const result = Buffer.alloc(input.length);

        for (let i = 0; i < input.length; i++) {
            let char = String.fromCharCode(input[i]);
            if (isLetter(char)) {
                const isUpper = char >= 'A' && char <= 'Z';
                const charCode = input[i];
                const base = isUpper ? 65 : 97;
                const p = charCode - base;
                const k = normalizedKey.charCodeAt(i % keyLen) - 65;
                let c: number;
                if (decrypt) {
                    c = (p - k + 26) % 26;
                } else {
                    c = (p + k) % 26;
                }
                result[i] = base + c;
            } else {
                result[i] = input[i];
            }
        }
        return result;
    } else {
        const normalizedKey = normalizeKey(key);
        if (!normalizedKey) return input;

        const keyLen = normalizedKey.length;
        let keyIndex = 0;

        return input.split('').map(char => {
            if (isLetter(char)) {
                const isUpper = char >= 'A' && char <= 'Z';
                const charCode = char.charCodeAt(0);
                const base = isUpper ? 65 : 97;
                const p = charCode - base;
                const k = normalizedKey.charCodeAt(keyIndex % keyLen) - 65;
                keyIndex++;
                let c: number;
                if (decrypt) {
                    c = (p - k + 26) % 26;
                } else {
                    c = (p + k) % 26;
                }
                return String.fromCharCode(base + c);
            }
            return char;
        }).join('');
    }
};

const en_Vigenere = (input: string | Buffer, key: string): string | Buffer => {
    return vigenere(input, key, false);
};

const de_Vigenere = (input: string | Buffer, key: string): string | Buffer => {
    return vigenere(input, key, true);
};

export {
    en_Vigenere,
    de_Vigenere,
    en_Vigenere as encode,
    de_Vigenere as decode
};
