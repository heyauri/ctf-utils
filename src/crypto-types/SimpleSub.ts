const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const is_SimpleSub = (str: string): boolean => {
    if (!str) return false;
    const chars = str.toUpperCase().replace(/[^A-Z]/g, '');
    if (chars.length === 0) return false;
    
    const freq: Record<string, number> = {};
    for (const c of chars) {
        freq[c] = (freq[c] || 0) + 1;
    }
    
    const sortedFreq = Object.values(freq).sort((a, b) => b - a);
    const expectedFreq = [8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074];
    
    const correlation = sortedFreq.reduce((sum, count, i) => {
        const expected = expectedFreq[i] || 0;
        const actual = (count / chars.length) * 100;
        return sum + Math.abs(actual - expected);
    }, 0);
    
    return correlation < 50;
};

const en_SimpleSub = (str: string, key: string): string => {
    str = str.toUpperCase();
    key = key.toUpperCase();
    
    if (!str || !key || key.length !== 26) return '';
    
    const mapping: Record<string, string> = {};
    for (let i = 0; i < ALPHABET.length; i++) {
        mapping[ALPHABET[i]] = key[i];
    }
    
    let result = '';
    for (const c of str) {
        if (mapping[c]) {
            result += mapping[c];
        } else {
            result += c;
        }
    }
    
    return result;
};

const de_SimpleSub = (str: string, key: string): string => {
    str = str.toUpperCase();
    key = key.toUpperCase();
    
    if (!str || !key || key.length !== 26) return '';
    
    const mapping: Record<string, string> = {};
    for (let i = 0; i < ALPHABET.length; i++) {
        mapping[key[i]] = ALPHABET[i];
    }
    
    let result = '';
    for (const c of str) {
        if (mapping[c]) {
            result += mapping[c];
        } else {
            result += c;
        }
    }
    
    return result;
};

export {
    is_SimpleSub,
    en_SimpleSub,
    de_SimpleSub,
    is_SimpleSub as detect,
    en_SimpleSub as encode,
    de_SimpleSub as decode
};
