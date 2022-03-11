
dangpu_dict = { '口': 0, '田': 0, '由': 1, '中': 2, '人': 3, '工': 4, '大': 5, '王': 6, '夫': 7, '井': 8, '羊': 9 }
function de_DangPu(str) {
    for(let k in dangpu_dict){
        str = str.replace(new RegExp(k,"gm"),dangpu_dict[k]);
    }
    return str;
}

let dangpu_array = ['口', '田', '由', '中', '人', '工', '大', '王', '夫', '井', '羊']
function is_DangPu(str) {
    for(let c of dangpu_array){
        if(str.match(c)){
            return true
        }
    }
    return false;
}

module.exports = {
    de_DangPu,
    is_DangPu
}