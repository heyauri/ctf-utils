const ADFGVX_TABLE = 'ADFGVX';
const POLYBIUS_SQUARE = [
    'P', 'H', 'Q', 'G', 'M', 'E',
    'A', 'D', 'X', 'L', 'U', 'Y',
    'N', 'F', 'O', 'R', 'C', 'V',
    'S', 'K', 'W', 'B', 'T', 'Z',
    'I', 'J', ' ', ' ', ' ', ' ',
    ' ', ' ', ' ', ' ', ' ', ' '
];

const is_ADFGVX = (str: string): boolean => {
    if (!str) return false;
    const chars = str.toUpperCase();
    for (const c of chars) {
        if (!ADFGVX_TABLE.includes(c)) {
            return false;
        }
    }
    return true;
};

const en_ADFGVX = (str: string, key: string): string => {
    str = str.toUpperCase().replace(/[^A-Z]/g, '');
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (!str || !key) return '';
    
    let polybius = '';
    for (const c of str) {
        const index = POLYBIUS_SQUARE.indexOf(c);
        if (index === -1) continue;
        const row = Math.floor(index / 6);
        const col = index % 6;
        polybius += ADFGVX_TABLE[row] + ADFGVX_TABLE[col];
    }
    
    const sortedKey = [...key].map((c, i) => ({ char: c, index: i }))
        .sort((a, b) => a.char.localeCompare(b.char));
    
    const columns: string[] = new Array(key.length).fill('');
    for (let i = 0; i < polybius.length; i++) {
        columns[i % key.length] += polybius[i];
    }
    
    let result = '';
    for (const { index } of sortedKey) {
        result += columns[index];
    }
    
    return result;
};

const de_ADFGVX = (str: string, key: string): string => {
    str = str.toUpperCase().replace(/[^ADFGVX]/g, '');
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (!str || !key) return '';
    
    const sortedKey = [...key].map((c, i) => ({ char: c, index: i }))
        .sort((a, b) => a.char.localeCompare(b.char));
    
    const columnLength = Math.ceil(str.length / key.length);
    const shortColumns = key.length - (str.length % key.length || key.length);
    
    let pos = 0;
    const columns: string[] = new Array(key.length).fill('');
    
    for (const { index } of sortedKey) {
        const len = index < shortColumns ? columnLength - 1 : columnLength;
        columns[index] = str.slice(pos, pos + len);
        pos += len;
    }
    
    let polybius = '';
    for (let i = 0; i < columnLength; i++) {
        for (let j = 0; j < key.length; j++) {
            if (i < columns[j].length) {
                polybius += columns[j][i];
            }
        }
    }
    
    let result = '';
    for (let i = 0; i < polybius.length; i += 2) {
        const row = ADFGVX_TABLE.indexOf(polybius[i]);
        const col = ADFGVX_TABLE.indexOf(polybius[i + 1]);
        if (row === -1 || col === -1) continue;
        const index = row * 6 + col;
        if (index < POLYBIUS_SQUARE.length) {
            result += POLYBIUS_SQUARE[index];
        }
    }
    
    return result;
};

export {
    is_ADFGVX,
    en_ADFGVX,
    de_ADFGVX,
    is_ADFGVX as detect,
    en_ADFGVX as encode,
    de_ADFGVX as decode
};
