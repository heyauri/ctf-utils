/**
 *  Exponential 幂数加密
 */

const is_Exponential = function(str){
    return /^[012348\s \/]+$/.test(str);
}

// Experimental 
const de_Exponential = function(str){
    if(/^[012348]+$/.test(str)){
        let out = "";
        for(let sub of str.split("0")){
            let sum = 0;
            for(let c of sub){
                sum += parseInt(c)
            }
            out += String.fromCharCode(64+sum);
        }
        return out;
    }
}

module.exports = {
    is_Exponential,
    de_Exponential
}