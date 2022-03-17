const { groupBy } = require("lodash");
const _ = require("lodash");

const toBaconDict = {
    "A": "aaaaa", "B": "aaaab", "C": "aaaba", "D": "aaabb", "E": "aabaa", "F": "aabab", "G": "aabba",
    "H": "aabbb", "I": "abaaa", "J": "abaab", "K": "ababa", "L": "ababb", "M": "abbaa", "N": "abbab",
    "O": "abbba", "P": "abbbb", "Q": "baaaa", "R": "baaab", "S": "baaba", "T": "baabb", "U": "babaa",
    "V": "babab", "W": "babba", "X": "babbb", "Y": "bbaaa", "Z": "bbaab"
}

const fromBaconDict = Object.keys(toBaconDict).reduce(
    (total, curr) => {
        return {
            ...total,
            [toBaconDict[curr]]: curr
        }
    },
    {}
)

const is_Bacon = function (str) {
    return /^[AB\s \/]+$/gi.test(str);
}

const de_Bacon = function (str) {
    let out = [];
    for (let sub of str.toLowerCase().split(/[\s \/]/)) {
        let chunks = _.chunk(sub.split(""),5);
        for(let chunk of chunks){
            out.push(fromBaconDict[chunk.join("")]||"");
        }
    }
    return out.join("");
}

const en_Bacon = function (str) {
    let out = "";
    for(let c of str){
        if(Reflect.has(toBaconDict,c.toUpperCase())){
            out += toBaconDict[c.toUpperCase()];
        }else{
            out += c;
        }
    }
    return out
}

module.exports = {
    is_Bacon,
    en_Bacon,
    de_Bacon
}