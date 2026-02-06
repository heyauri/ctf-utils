const zaHuoPu_dict1: Record<string, number> = {
    '丁不勾': 1, '示不小': 2, '王不立': 3, '罪不非': 4,
    '吾不口': 5, '交不叉': 6, '皂不白': 7, '分不刀': 8,
    '馗不首': 9, '针不金': 0
};

const zaHuoPu_dict2: Record<string, number> = {
    '平头': 1, '空工': 2, '横川': 3, '侧目': 4,
    '缺丑': 5, '断大': 6, '皂底': 7, '分头': 8,
    '未丸': 9, '田心': 0
};

const dict = { ...zaHuoPu_dict1, ...zaHuoPu_dict2 };

const is_ZaHuoPu = (str: string): boolean => {
    for (const key in dict) {
        if (str.indexOf(key) > -1) {
            return true;
        }
    }
    return false;
};

const de_ZaHuoPu = (str: string): string => {
    for (const key in dict) {
        const reg = new RegExp(key, "g");
        str = str.replace(reg, dict[key].toString());
    }
    return str;
};

export {
    is_ZaHuoPu,
    de_ZaHuoPu,
    is_ZaHuoPu as detect,
    de_ZaHuoPu as decode
};
