let dangpu_dict = { '口': 0, '田': 0, '由': 1, '中': 2, '人': 3, '工': 4, '大': 5, '王': 6, '夫': 7, '井': 8, '羊': 9 }
let dangpu_reverse_dict = { 0: '口', 1: '由', 2: '中', 3: '人', 4: '工', 5: '大', 6: '王', 7: '夫', 8: '井', 9: '羊' }

function de_DangPu(str) {
    for (let k in dangpu_dict) {
        str = str.replace(new RegExp(k, "gm"), dangpu_dict[k]);
    }
    return str;
}

function en_DangPu(str) {
    return str.replace(/[0-9]/g, (match) => dangpu_reverse_dict[parseInt(match)]);
}

let dangpu_array = ['口', '田', '由', '中', '人', '工', '大', '王', '夫', '井', '羊']
function is_DangPu(str) {
    for (let c of dangpu_array) {
        if (str.includes(c)) {
            return true
        }
    }
    return false;
}

module.exports = {
    de_DangPu,
    en_DangPu,
    is_DangPu,
    decode: de_DangPu,
    detect: is_DangPu,
    encode: en_DangPu
}