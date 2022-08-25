let abc = "abcdefghijklmnopqrstuvwxyz";

const combinate = require("../utils/Combination").combinate;

const is_Poem = function (str) {
    return /^[^0-9]+$/ig.test(str);
}

const splitWords = function (str) {
    return str.match(/[a-z]+/gi);
}

const findPotentialWords = function (words, target) {
    let po_arr = [], out = [];
    for (let c of splitWords(target).shift()) {
        po_arr.push(abc.indexOf(c));
    }
    for (let i in po_arr) {
        let idx = po_arr[i];
        out[i] = []
        while (idx < words.length) {
            out[i].push(words[idx]);
            idx += 26;
        }
    }
    return out;
}

const de_Poem = function (target, poem, msg = null) {
    poem = poem.toLowerCase();
    target = target.toLowerCase();
    let words = splitWords(poem), cwords = splitWords(target).slice(1), ciperWords, res = [];
    if (Object.prototype.toString.call(msg) === "[object Array]") {
        ciperWords = msg.map(idx => (words[idx]));
        let pwords = comb.join("");
        let plen = pwords.length;
        let pcode = [];
        let i = 0;
        while (i < plen) {
            for (let c of abc) {
                // console.log(c);
                for (let idx in pwords) {
                    if (pwords[idx] != c) {
                        continue;
                    }
                    pcode.push(cwords[idx]);
                    // console.log(idx,pwords[idx],pcode);
                    i++;
                }
            }
        }
        // console.log(pcode);
        let deStr = "";
        for (let j = 0; j < pcode[0].length; j++) {
            for (let w of pcode) {
                deStr += w[j];
            }
        }
        res.push(deStr);
        return res;
    } else {
        ciperWords = findPotentialWords(words, target);
        let combs = combinate(ciperWords);
        combs = combs.map(item => {
            return Object.values(item);
        });
        for (let comb of combs) {
            let pwords = comb.join("");
            let plen = pwords.length;
            let pcode = [];
            let i = 0;
            while (i < plen) {
                for (let c of abc) {
                    // console.log(c);
                    for (let idx in pwords) {
                        if (pwords[idx] != c) {
                            continue;
                        }
                        pcode.push(cwords[idx]);
                        // console.log(idx,pwords[idx],pcode);
                        i++;
                    }
                }
            }
            // console.log(pcode);
            let deStr = "";
            for (let j = 0; j < pcode[0].length; j++) {
                for (let w of pcode) {
                    deStr += w[j];
                }
            }
            res.push(deStr);
        }
        return res.sort();
    }
}


module.exports = {
    is_Poem,
    de_Poem
}