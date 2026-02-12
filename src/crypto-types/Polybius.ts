const DEFAULT_POLYBIUS: Record<string, string> = {
    'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
    'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24',
    'K': '31', 'L': '32', 'M': '33', 'N': '34', 'O': '35',
    'P': '41', 'Q': '42', 'R': '43', 'S': '44', 'T': '45',
    'U': '51', 'V': '52', 'W': '53', 'X': '54', 'Y': '55', 'Z': '56'
};

const createPolybiusTable = (customAlphabet?: string): Record<string, string> => {
    const table: Record<string, string> = {};
    const alphabet = customAlphabet || 'ABCDEFGHIKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < alphabet.length; i++) {
        const row = Math.floor(i / 5) + 1;
        const col = (i % 5) + 1;
        table[alphabet[i]] = `${row}${col}`;
    }

    return table;
};

const reverseTable = (table: Record<string, string>): Record<string, string> => {
    const reverse: Record<string, string> = {};
    for (const key in table) {
        reverse[table[key]] = key;
    }
    return reverse;
};

const en_Polybius = (input: string, customAlphabet?: string): string => {
    const table = customAlphabet ? createPolybiusTable(customAlphabet) : DEFAULT_POLYBIUS;
    return input.toUpperCase()
        .replace(/J/g, 'I')
        .split('')
        .map(char => table[char])
        .filter((code): code is string => code !== undefined)
        .join(' ');
};

const de_Polybius = (input: string, customAlphabet?: string): string => {
    const table = customAlphabet ? createPolybiusTable(customAlphabet) : DEFAULT_POLYBIUS;
    const reverse = reverseTable(table);
    const codes = input.trim().split(/[\s,]+/);
    return codes.map(code => reverse[code] || '').join('');
};

const is_Polybius = (input: string): boolean => {
    const cleaned = input.replace(/[\s,]+/g, '');
    return /^[0-9]+$/.test(cleaned) && cleaned.length % 2 === 0;
};

export {
    en_Polybius,
    de_Polybius,
    en_Polybius as encode,
    de_Polybius as decode,
    is_Polybius,
    is_Polybius as detect,
    createPolybiusTable
};
