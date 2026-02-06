const is_Decimal = (str: string): boolean => {
    const cleaned = str.replace(/[\s,]/g, '');
    return /^\d+$/.test(cleaned);
};

const de_Decimal = (str: string, separator: string = ' '): string => {
    const nums = str.split(/[\s,]+/).filter(s => s.length > 0);
    let result = '';
    for (const num of nums) {
        const charCode = parseInt(num, 10);
        if (!isNaN(charCode)) {
            result += String.fromCharCode(charCode);
        }
    }
    return result;
};

const en_Decimal = (str: string, separator: string = ' '): string => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (i > 0) result += separator;
        result += str.charCodeAt(i);
    }
    return result;
};

export {
    is_Decimal,
    de_Decimal,
    en_Decimal,
    is_Decimal as detect,
    de_Decimal as decode,
    en_Decimal as encode
};
