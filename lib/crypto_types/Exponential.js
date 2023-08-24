/**
 *  Exponential 幂数加密
 */

const is_Exponential = function (str) {
    return /^[012348\s\/]+$/.test(str);
}

// Experimental 
const de_Exponential = function (str) {
    if (/^[01248]+$/.test(str)) {
        let out = "";
        for (let sub of str.split("0")) {
            let sum = 0;
            for (let c of sub) {
                sum += parseInt(c)
            }
            out += String.fromCharCode(64 + sum);
        }
        return out;
    }
    if (/^[01234\s \/]+$/.test(str)) {
        let out = "";
        for (let sub of str.split(/[\s\/]+/)) {
            let stack = [sub[0]];
            for (let i = 1; i < sub.length; i++) {
                if (sub[i] > stack[stack.length - 1]) {
                    stack.push(sub[i]);
                } else {
                    let tmp = stack.reduce((total, curr) => {
                        return total + 2 ** curr;
                    }, 0);
                    out += String.fromCharCode(tmp + 64);
                    stack = [sub[i]];
                }
            }
            let tmp = stack.reduce((total, curr) => {
                return total + 2 ** curr;
            }, 0);
            out += String.fromCharCode(tmp + 64);
        }
        return out;
    }

    return `${str}: Not Expected Format`;
}

module.exports = {
    is_Exponential,
    de_Exponential,
    detect: is_Exponential,
    decode: de_Exponential
}