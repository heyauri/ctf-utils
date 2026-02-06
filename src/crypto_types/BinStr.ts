const is_Binary = (str: string): boolean => {
    const cleaned = str.replace(/[\s]/g, '');
    return /^[01]+$/.test(cleaned) && cleaned.length >= 8;
};

const de_Binary = (str: string, separator: string = ' '): string => {
    const cleaned = str.trim();
    const hasSpace = cleaned.includes(' ');
    const bins = hasSpace 
        ? cleaned.split(/[\s]+/).filter(s => s.length > 0)
        : cleaned.match(/.{1,8}/g) || [];
    let result = '';
    for (const bin of bins) {
        if (bin.length > 0) {
            const charCode = parseInt(bin, 2);
            if (!isNaN(charCode) && charCode > 0) {
                result += String.fromCharCode(charCode);
            }
        }
    }
    return result;
};

const en_Binary = (str: string, separator: string = ' '): string => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (i > 0 && separator) result += separator;
        result += str.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return result;
};

export {
    is_Binary,
    de_Binary,
    en_Binary,
    is_Binary as detect,
    de_Binary as decode,
    en_Binary as encode
};
