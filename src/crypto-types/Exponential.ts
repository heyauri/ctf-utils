const is_Exponential = (str: string): boolean => {
    return /^[012348\s\/]+$/.test(str);
};

const de_Exponential = (str: string): string => {
    if (/^[01248]+$/.test(str)) {
        let out = "";
        for (const sub of str.split("0")) {
            let sum = 0;
            for (const c of sub) {
                sum += parseInt(c);
            }
            out += String.fromCharCode(64 + sum);
        }
        return out;
    }
    if (/^[01234\s \/]+$/.test(str)) {
        let out = "";
        for (const sub of str.split(/[\s\/]+/)) {
            let stack: string[] = [sub[0]];
            for (let i = 1; i < sub.length; i++) {
                if (sub[i] > stack[stack.length - 1]) {
                    stack.push(sub[i]);
                } else {
                    let tmp = stack.reduce((total: number, curr: string) => {
                        return total + 2 ** parseInt(curr);
                    }, 0);
                    out += String.fromCharCode(tmp + 64);
                    stack = [sub[i]];
                }
            }
            let tmp = stack.reduce((total: number, curr: string) => {
                return total + 2 ** parseInt(curr);
            }, 0);
            out += String.fromCharCode(tmp + 64);
        }
        return out;
    }
    throw new Error(`Exponential: input does not match a known format`);
};

const en_Exponential = (str: string): string => {
    // Encode each letter as ascending power-of-two exponents (0-4), groups separated by spaces.
    // E.g. 'C' (3 = 2^0 + 2^1) -> '01'
    return str.toUpperCase()
        .split('')
        .filter(c => c >= 'A' && c <= 'Z')
        .map(c => {
            let value = c.charCodeAt(0) - 64;
            const exponents: number[] = [];
            for (let bit = 0; bit <= 4 && value > 0; bit++) {
                if (value & 1) exponents.push(bit);
                value >>= 1;
            }
            return exponents.join('');
        })
        .join(' ');
};

export {
    is_Exponential,
    de_Exponential,
    en_Exponential,
    is_Exponential as detect,
    de_Exponential as decode,
    en_Exponential as encode
};
