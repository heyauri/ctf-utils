const is_OCT = (str: string): boolean => {
    return /^[0-7\s\/]+$/.test(str);
};

const de_OCT = (str: string): string => {
    const arr: string[] = [];
    for (const c of str.split(/[\s \/]/)) {
        arr.push(String.fromCharCode(parseInt(c, 8)));
    }
    return arr.join("");
};

const en_OCT = (str: string): string => {
    const arr: string[] = [];
    for (const c of str.split("")) {
        arr.push(c.charCodeAt(0).toString(8));
    }
    return arr.join(" ");
};

export {
    is_OCT,
    de_OCT,
    en_OCT,
    is_OCT as detect,
    de_OCT as decode,
    en_OCT as encode
};
