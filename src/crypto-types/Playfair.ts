const generateKeySquare = (key: string): string[][] => {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    const keySquare: string[][] = [];
    const usedChars = new Set<string>();
    
    const processChar = (char: string) => {
        const upperChar = char.toUpperCase();
        if (upperChar === 'J') return 'I';
        if (alphabet.includes(upperChar) && !usedChars.has(upperChar)) {
            usedChars.add(upperChar);
            return upperChar;
        }
        return null;
    };
    
    const allChars = (key + alphabet).split('');
    let row: string[] = [];
    
    for (const char of allChars) {
        const processedChar = processChar(char);
        if (processedChar) {
            row.push(processedChar);
            if (row.length === 5) {
                keySquare.push(row);
                row = [];
            }
        }
    }
    
    return keySquare;
};

const findCharPosition = (keySquare: string[][], char: string): { row: number; col: number } => {
    const target = char.toUpperCase() === 'J' ? 'I' : char.toUpperCase();
    
    for (let i = 0; i < keySquare.length; i++) {
        for (let j = 0; j < keySquare[i].length; j++) {
            if (keySquare[i][j] === target) {
                return { row: i, col: j };
            }
        }
    }
    
    return { row: -1, col: -1 };
};

const preparePlaintext = (text: string): string[] => {
    const processed = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const pairs: string[] = [];
    
    let i = 0;
    while (i < processed.length) {
        let first = processed[i];
        let second = i + 1 < processed.length ? processed[i + 1] : 'X';
        
        if (first === second) {
            second = 'X';
            i++;
        } else {
            i += 2;
        }
        
        pairs.push(first + second);
    }
    
    return pairs;
};

const en_Playfair = (input: string, key: string): string => {
    if (!key || key.length === 0) {
        return input;
    }
    
    const keySquare = generateKeySquare(key);
    const pairs = preparePlaintext(input);
    let result = '';
    
    for (const pair of pairs) {
        const [a, b] = pair.split('');
        const posA = findCharPosition(keySquare, a);
        const posB = findCharPosition(keySquare, b);
        
        if (posA.row === posB.row) {
            const newA = keySquare[posA.row][(posA.col + 1) % 5];
            const newB = keySquare[posB.row][(posB.col + 1) % 5];
            result += newA + newB;
        } else if (posA.col === posB.col) {
            const newA = keySquare[(posA.row + 1) % 5][posA.col];
            const newB = keySquare[(posB.row + 1) % 5][posB.col];
            result += newA + newB;
        } else {
            const newA = keySquare[posA.row][posB.col];
            const newB = keySquare[posB.row][posA.col];
            result += newA + newB;
        }
    }
    
    return result;
};

const de_Playfair = (input: string, key: string): string => {
    if (!key || key.length === 0) {
        return input;
    }
    
    const keySquare = generateKeySquare(key);
    const pairs = [];
    
    for (let i = 0; i < input.length; i += 2) {
        if (i + 1 < input.length) {
            pairs.push(input.substring(i, i + 2));
        }
    }
    
    let result = '';
    
    for (const pair of pairs) {
        const [a, b] = pair.split('');
        const posA = findCharPosition(keySquare, a);
        const posB = findCharPosition(keySquare, b);
        
        if (posA.row === posB.row) {
            const newA = keySquare[posA.row][(posA.col - 1 + 5) % 5];
            const newB = keySquare[posB.row][(posB.col - 1 + 5) % 5];
            result += newA + newB;
        } else if (posA.col === posB.col) {
            const newA = keySquare[(posA.row - 1 + 5) % 5][posA.col];
            const newB = keySquare[(posB.row - 1 + 5) % 5][posB.col];
            result += newA + newB;
        } else {
            const newA = keySquare[posA.row][posB.col];
            const newB = keySquare[posB.row][posA.col];
            result += newA + newB;
        }
    }
    
    let cleanedResult = '';
    for (let i = 0; i < result.length; i++) {
        if (result[i] === 'X' && i > 0 && result[i-1] === result[i+1]) {
            continue;
        }
        cleanedResult += result[i];
    }
    
    if (cleanedResult.endsWith('X')) {
        cleanedResult = cleanedResult.slice(0, -1);
    }
    
    return cleanedResult;
};

const detect = (input: string): boolean => {
    if (!input || input.length < 2) {
        return false;
    }
    
    const cleanInput = input.replace(/[^A-Z]/gi, '');
    if (cleanInput.length % 2 !== 0) {
        return false;
    }
    
    return cleanInput.length >= 2;
};

export {
    en_Playfair,
    de_Playfair,
    detect,
    en_Playfair as encode,
    de_Playfair as decode
};
