/**
 *  杂货铺编码
 */
let dic1 = { '丁不勾': 1, '示不小': 2, '王不立': 3, '罪不非': 4, '吾不口': 5, '交不叉': 6, '皂不白': 7, '分不刀': 8, '馗不首': 9, '针不金': 0 }
let dic2 = { '平头': 1, '空工': 2, '横川': 3, '侧目': 4, '缺丑': 5, '断大': 6, '皂底': 7, '分头': 8, '未丸': 9, '田心': 0 }

let dict = { ...dic1, ...dic2 };

function is_ZaHuoPu(str) {
    for (let key in dict) {
        if (str.indexOf(key) > -1) {
            return true;
        }
    }
    return false;
}

function de_ZaHuoPu(str) {
    for (let key in dict) {
        let reg = new RegExp(key, "g");
        str = str.replace(reg, dict[key]);
    }
    return str;
}

module.exports = {
    is_ZaHuoPu,
    de_ZaHuoPu,
    detect: is_ZaHuoPu,
    decode: de_ZaHuoPu
}