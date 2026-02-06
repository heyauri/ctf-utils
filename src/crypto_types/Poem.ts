let abc = "abcdefghijklmnopqrstuvwxyz";

import { combinate } from "../utils/Combination";

const is_Poem = (str: string): boolean => {
    return /^[^0-9]+$/ig.test(str);
};

const splitWords = (str: string): string[] | null => {
    return str.match(/[a-z]+/gi);
};

const findPotentialWords = (words: string[], target: string): string[][] => {
    const poArr: number[] = [];
    const out: string[][] = [];
    const firstWord = splitWords(target)?.[0] || "";
    for (const c of firstWord) {
        poArr.push(abc.indexOf(c));
    }
    for (let i in poArr) {
        let idx = poArr[i];
        out[i] = [];
        while (idx < words.length) {
            out[i].push(words[idx]);
            idx += 26;
        }
    }
    return out;
};

const de_Poem = (target: string, poem: string, msg?: string[]): string[] => {
    poem = poem.toLowerCase();
    target = target.toLowerCase();
    const words = splitWords(poem) || [];
    const cwords = splitWords(target)?.slice(1) || [];
    const res: string[] = [];

    if (msg && Object.prototype.toString.call(msg) === "[object Array]") {
        const cipherWords = msg.map((idx: string) => (words[parseInt(idx)]));
        let pwords = cipherWords.join("");
        let plen = pwords.length;
        const pcode: string[] = [];
        let i = 0;
        while (i < plen) {
            for (const c of abc) {
                for (let idx = 0; idx < pwords.length; idx++) {
                    if (pwords[idx] !== c) {
                        continue;
                    }
                    pcode.push(cwords[idx]);
                    i++;
                }
            }
        }
        let deStr = "";
        for (let j = 0; j < pcode[0].length; j++) {
            for (const w of pcode) {
                deStr += w[j];
            }
        }
        res.push(deStr);
        return res;
    } else {
        const cipherWords = findPotentialWords(words, target);
        const combs = combinate(cipherWords);
        const mappedCombs = combs.map((item: Record<number, string>) => Object.values(item));

        for (const comb of mappedCombs) {
            let pwords = comb.join("");
            let plen = pwords.length;
            const pcode: string[] = [];
            let i = 0;
            while (i < plen) {
                for (const c of abc) {
                    for (let idx = 0; idx < pwords.length; idx++) {
                        if (pwords[idx] !== c) {
                            continue;
                        }
                        pcode.push(cwords[idx]);
                        i++;
                    }
                }
            }
            let deStr = "";
            for (let j = 0; j < pcode[0].length; j++) {
                for (const w of pcode) {
                    deStr += w[j];
                }
            }
            res.push(deStr);
        }
        return res.sort();
    }
};

export {
    is_Poem,
    de_Poem,
    is_Poem as detect,
    de_Poem as decode
};
