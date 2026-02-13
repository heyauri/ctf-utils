interface DictionaryOptions {
    length?: number;
    minLength?: number;
    maxLength?: number;
    charset?: string;
    prefix?: string;
    suffix?: string;
}

interface KeyboardLayout {
    name: string;
    rows: string[];
}

const KeyboardLayouts: KeyboardLayout[] = [
    {
        name: 'qwerty',
        rows: [
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
        ]
    },
    {
        name: 'azerty',
        rows: [
            'AZERTYUIOP',
            'QSDFGHJKLM',
            'WXCVBN'
        ]
    },
    {
        name: 'qwertz',
        rows: [
            'QWERTZUIOP',
            'ASDFGHJKL',
            'YXCVBNM'
        ]
    }
];

const generateCombinations = (charset: string, length: number): string[] => {
    if (length === 0) return [''];
    if (length === 1) return charset.split('');
    
    const combinations: string[] = [];
    const prevCombinations = generateCombinations(charset, length - 1);
    
    for (const prev of prevCombinations) {
        for (const char of charset) {
            combinations.push(prev + char);
        }
    }
    
    return combinations;
};

const generateDateFormats = (startYear: number, endYear: number, formats: string[] = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYYMMDD', 'DDMMYYYY', 'MMDDYYYY']): string[] => {
    const dates: string[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                for (const format of formats) {
                    let dateStr = format
                        .replace('YYYY', year.toString().padStart(4, '0'))
                        .replace('MM', month.toString().padStart(2, '0'))
                        .replace('DD', day.toString().padStart(2, '0'));
                    dates.push(dateStr);
                }
            }
        }
    }
    
    return dates;
};

const generateKeyboardPaths = (layoutName: string = 'qwerty', length: number = 3, maxDistance: number = 2): string[] => {
    const layout = KeyboardLayouts.find(l => l.name === layoutName.toLowerCase());
    if (!layout) {
        throw new Error(`Unknown keyboard layout: ${layoutName}`);
    }
    
    const charPositions: Record<string, { row: number; col: number }> = {};
    for (let rowIndex = 0; rowIndex < layout.rows.length; rowIndex++) {
        const row = layout.rows[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            charPositions[row[colIndex]] = { row: rowIndex, col: colIndex };
        }
    }
    
    const getDistance = (char1: string, char2: string): number => {
        const pos1 = charPositions[char1];
        const pos2 = charPositions[char2];
        if (!pos1 || !pos2) return Infinity;
        return Math.sqrt(Math.pow(pos1.row - pos2.row, 2) + Math.pow(pos1.col - pos2.col, 2));
    };
    
    const generatePaths = (current: string, remaining: number): string[] => {
        if (remaining === 0) return [current];
        
        const paths: string[] = [];
        const lastChar = current[current.length - 1];
        
        for (const [char, pos] of Object.entries(charPositions)) {
            const distance = getDistance(lastChar, char);
            if (distance <= maxDistance) {
                const newPaths = generatePaths(current + char, remaining - 1);
                paths.push(...newPaths);
            }
        }
        
        return paths;
    };
    
    const allPaths: string[] = [];
    for (const char of Object.keys(charPositions)) {
        const paths = generatePaths(char, length - 1);
        allPaths.push(...paths);
    }
    
    return allPaths;
};

const generateDictionary = (options: DictionaryOptions = {}): string[] => {
    const {
        length = 4,
        minLength = length,
        maxLength = length,
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        prefix = '',
        suffix = ''
    } = options;
    
    const words: string[] = [];
    
    for (let currentLength = minLength; currentLength <= maxLength; currentLength++) {
        const combinations = generateCombinations(charset, currentLength);
        for (const combination of combinations) {
            words.push(prefix + combination + suffix);
        }
    }
    
    return words;
};

const generateLeetSpeak = (words: string[]): string[] => {
    const leetMap: Record<string, string[]> = {
        'A': ['4', '@', '∀', 'λ'],
        'B': ['8', '6', '13'],
        'C': ['(', '{', '[', '<'],
        'D': ['|)', 'o|', 'ð'],
        'E': ['3', '€', '£'],
        'F': ['7', '|='],
        'G': ['6', '9', '&'],
        'H': ['#', '4', '|-|'],
        'I': ['1', '!', '|'],
        'J': ['j', '_|'],
        'K': ['|<', '>|'],
        'L': ['1', '|_'],
        'M': ['44', '|\/|', '^^'],
        'N': ['|\|', '//', 'n'],
        'O': ['0', '()', '[]'],
        'P': ['p', '|D'],
        'Q': ['q', '0_'],
        'R': ['r', '|2'],
        'S': ['5', '$', '§'],
        'T': ['7', '+', '†'],
        'U': ['u', '|_|'],
        'V': ['v', '\/'],
        'W': ['w', '\/\/', 'vv'],
        'X': ['x', '×', '><'],
        'Y': ['y', '¥'],
        'Z': ['z', '2']
    };
    
    const generateLeetVariations = (word: string, index: number = 0): string[] => {
        if (index === word.length) return [''];
        
        const char = word[index].toUpperCase();
        const variations: string[] = [];
        
        const possibleChars = leetMap[char] || [char.toLowerCase()];
        const nextVariations = generateLeetVariations(word, index + 1);
        
        for (const possibleChar of possibleChars) {
            for (const nextVariation of nextVariations) {
                variations.push(possibleChar + nextVariation);
            }
        }
        
        return variations;
    };
    
    const leetWords: string[] = [];
    for (const word of words) {
        const variations = generateLeetVariations(word);
        leetWords.push(...variations);
    }
    
    return leetWords;
};

const generateCommonPasswords = (baseWords: string[] = ['password', 'admin', 'user', 'test', 'secret']): string[] => {
    const variations: string[] = [];
    
    for (const base of baseWords) {
        variations.push(base);
        variations.push(base.toUpperCase());
        variations.push(base.toLowerCase());
        variations.push(base.charAt(0).toUpperCase() + base.slice(1));
        
        for (let i = 0; i <= 99; i++) {
            variations.push(base + i);
            variations.push(i + base);
        }
        
        variations.push(base + '123');
        variations.push(base + '!');
        variations.push(base + '@');
        variations.push(base + '#');
    }
    
    return [...new Set(variations)];
};

const saveDictionary = (words: string[], filePath: string): void => {
    const fs = require('fs');
    const content = words.join('\n');
    fs.writeFileSync(filePath, content);
};

export {
    generateDictionary,
    generateDateFormats,
    generateKeyboardPaths,
    generateLeetSpeak,
    generateCommonPasswords,
    saveDictionary,
    KeyboardLayouts
};
