const dangpu_dict: Record<string, number> = {
    '口': 0, '田': 0, '由': 1, '中': 2, '人': 3, '工': 4,
    '大': 5, '王': 6, '夫': 7, '井': 8, '羊': 9
};

const dangpu_reverse_dict: Record<number, string> = {
    0: '口', 1: '由', 2: '中', 3: '人', 4: '工',
    5: '大', 6: '王', 7: '夫', 8: '井', 9: '羊'
};

const de_DangPu = (str: string): string => {
    for (const k in dangpu_dict) {
        str = str.replace(new RegExp(k, "gm"), dangpu_dict[k].toString());
    }
    return str;
};

const en_DangPu = (str: string): string => {
    return str.replace(/[0-9]/g, (match) => dangpu_reverse_dict[parseInt(match)].toString());
};

const dangpu_array = ['口', '田', '由', '中', '人', '工', '大', '王', '夫', '井', '羊'];

const is_DangPu = (str: string): boolean => {
    for (const c of dangpu_array) {
        if (str.includes(c)) {
            return true;
        }
    }
    return false;
};

export {
    de_DangPu,
    en_DangPu,
    is_DangPu,
    de_DangPu as decode,
    en_DangPu as encode,
    is_DangPu as detect
};
