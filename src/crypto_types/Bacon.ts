import * as _ from "lodash";

const toBaconDict: Record<string, string> = {
    "A": "aaaaa", "B": "aaaab", "C": "aaaba", "D": "aaabb", "E": "aabaa", "F": "aabab", "G": "aabba",
    "H": "aabbb", "I": "abaaa", "J": "abaab", "K": "ababa", "L": "ababb", "M": "abbaa", "N": "abbab",
    "O": "abbba", "P": "abbbb", "Q": "baaaa", "R": "baaab", "S": "baaba", "T": "baabb", "U": "babaa",
    "V": "babab", "W": "babba", "X": "babbb", "Y": "bbaaa", "Z": "bbaab"
};

const fromBaconDict: Record<string, string> = Object.keys(toBaconDict).reduce(
    (total, curr) => {
        return {
            ...total,
            [toBaconDict[curr]]: curr
        };
    },
    {} as Record<string, string>
);

const is_Bacon = (str: string): boolean => {
    return /^[AB\s\/]+$/gi.test(str);
};

const de_Bacon = (str: string): string => {
    const out: string[] = [];
    const parts = str.toLowerCase().split(/[\s \/]/);
    for (const sub of parts) {
        const chunks = _.chunk(sub.split(""), 5);
        for (const chunk of chunks) {
            out.push(fromBaconDict[chunk.join("")] || "");
        }
    }
    return out.join("");
};

const en_Bacon = (str: string): string => {
    let out = "";
    for (const c of str) {
        if (Reflect.has(toBaconDict, c.toUpperCase())) {
            out += toBaconDict[c.toUpperCase()];
        } else {
            out += c;
        }
    }
    return out;
};

export {
    is_Bacon,
    en_Bacon,
    de_Bacon,
    is_Bacon as detect,
    en_Bacon as encode,
    de_Bacon as decode
};
