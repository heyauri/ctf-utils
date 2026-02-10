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
        result += '>';
        cells[i] = charCode;
    }
    return result;
};

const is_Ook = (str: string): boolean => {
    const ookPattern = /Ook/i;
    return ookPattern.test(str);
};

const ookToBrainfuck = (str: string): string => {
    let result = '';
    const tokens = str.match(/Ook\.{1,3}|Ook\?{1,3}|Ook!{1,3}/gi) || [];
    
    for (const token of tokens) {
        const upper = token.toLowerCase();
        switch (upper) {
            case 'ook.': result += '.'; break;
            case 'ook..': result += ','; break;
            case 'ook...': result += '['; break;
            case 'ook!': result += ','; break;
            case 'ook!!': result += '['; break;
            case 'ook!!!': result += '['; break;
            case 'ook?': result += ','; break;
            case 'ook??': result += '['; break;
            case 'ook???': result += '['; break;
            case 'ook.ook': result += '>'; break;
            case 'ook!ook': result += '>'; break;
            case 'ook?ook': result += '>'; break;
            case 'ook.ook!': result += '<'; break;
            case 'ook!ook!': result += '<'; break;
            case 'ook?ook?': result += '<'; break;
            case 'ook.ook.': result += '+'; break;
            case 'ook!ook!': result += '+'; break;
            case 'ook?ook?': result += '+'; break;
            case 'ook.ook?': result += '-'; break;
            case 'ook!ook?': result += '-'; break;
            case 'ook?ook!': result += '-'; break;
            case 'ook.ook!': result += '['; break;
            case 'ook!ook.': result += ']'; break;
            case 'ook.ook?': result += ']'; break;
            case 'ook!ook?': result += ']'; break;
            case 'ook?ook!': result += '['; break;
            case 'ook?ook.': result += ']'; break;
        }
    }
    return result;
};

const de_Ook = (str: string): string => {
    const bf = ookToBrainfuck(str);
    return de_Brainfuck(bf);
};

const en_Ook = (str: string): string => {
    let bf = '';
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        bf += '+'.repeat(charCode);
        bf += '.';
    }
    
    let ook = '';
    for (const char of bf) {
        switch (char) {
            case '.': ook += 'Ook. Ook.'; break;
            case ',': ook += 'Ook! Ook!'; break;
            case '[': ook += 'Ook? Ook.'; break;
            case ']': ook += 'Ook. Ook?'; break;
            case '+': ook += 'Ook. Ook!'; break;
            case '-': ook += 'Ook! Ook.'; break;
            case '>': ook += 'Ook! Ook?'; break;
            case '<': ook += 'Ook? Ook!'; break;
        }
    }
    return ook;
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