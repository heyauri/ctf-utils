const is_Brainfuck = (str: string): boolean => {
    const brainfuckChars = /^[+\-<>.,\[\]]+$/;
    return brainfuckChars.test(str) && (str.includes('[') === str.includes(']'));
};

const de_Brainfuck = (str: string): string => {
    const cells = new Uint8Array(30000);
    let ptr = 0;
    let pc = 0;
    let output = '';
    const brackets: number[] = [];
    const bracketMap = new Map<number, number>();
    
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '[') brackets.push(i);
        else if (str[i] === ']') {
            const open = brackets.pop();
            if (open !== undefined) {
                bracketMap.set(open, i);
                bracketMap.set(i, open);
            }
        }
    }
    
    while (pc < str.length) {
        const cmd = str[pc];
        switch (cmd) {
            case '+': cells[ptr] = (cells[ptr] + 1) & 0xFF; break;
            case '-': cells[ptr] = (cells[ptr] - 1) & 0xFF; break;
            case '>': ptr = (ptr + 1) % 30000; break;
            case '<': ptr = (ptr - 1 + 30000) % 30000; break;
            case '[':
                if (cells[ptr] === 0) pc = bracketMap.get(pc) || pc;
                break;
            case ']':
                if (cells[ptr] !== 0) pc = bracketMap.get(pc) || pc;
                break;
            case '.': output += String.fromCharCode(cells[ptr]); break;
        }
        pc++;
    }
    return output;
};

const en_Brainfuck = (str: string): string => {
    let result = '';
    const cells = new Uint8Array(30000);
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        const diff = charCode - cells[i];
        if (diff > 0) {
            result += '+'.repeat(diff);
        } else if (diff < 0) {
            result += '-'.repeat(-diff);
        }
        result += '.';
        result += '>';
        cells[i] = charCode;
    }
    return result;
};

const is_Ook = (str: string): boolean => {
    const ookPattern = /^(Ook[.!?]|\s)+$/i;
    return ookPattern.test(str.trim());
};

// Standard Ook! <-> Brainfuck mapping (pairs of Ook tokens)
const ookPairToBf: Record<string, string> = {
    '!!': '>',
    '??': '<',
    '?.': '+',
    '.?': '-',
    '!.': '.',
    '.!': ',',
    '?!': '[',
    '!?': ']'
};

const bfToOok = (bf: string): string => {
    const ookPair: Record<string, [string, string]> = {
        '>': ['!', '!'], '<': ['?', '?'], '+': ['?', '.'], '-': ['.', '?'],
        '.': ['!', '.'], ',': ['.', '!'], '[': ['?', '!'], ']': ['!', '?']
    };
    const tokens: string[] = [];
    for (const char of bf) {
        const pair = ookPair[char];
        if (!pair) continue;
        tokens.push('Ook' + pair[0], 'Ook' + pair[1]);
    }
    return tokens.join(' ');
};

const ookToBrainfuck = (str: string): string => {
    const tokens = str.match(/Ook[.!?]/gi) || [];
    let result = '';
    for (let i = 0; i + 1 < tokens.length; i += 2) {
        const pair = tokens[i].slice(-1) + tokens[i + 1].slice(-1);
        result += ookPairToBf[pair] || '';
    }
    return result;
};

const de_Ook = (str: string): string => {
    const bf = ookToBrainfuck(str);
    return de_Brainfuck(bf);
};

const en_Ook = (str: string): string => {
    return bfToOok(en_Brainfuck(str));
};

export {
    is_Brainfuck,
    de_Brainfuck,
    en_Brainfuck,
    is_Brainfuck as detect,
    de_Brainfuck as decode,
    en_Brainfuck as encode,
    is_Ook,
    de_Ook,
    en_Ook,
    is_Ook as detect_Ook,
    de_Ook as decode_Ook,
    en_Ook as encode_Ook
};