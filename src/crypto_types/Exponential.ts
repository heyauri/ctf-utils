const is_Exponential = (str: string): boolean => {
    return /^[012348\s\/]+$/.test(str);
};

const de_Exponential = (str: string): string => {
    if (/^[01248]+$/.test(str)) {
        let out = "";
        for (const sub of str.split("0")) {
            let sum = 0;
            for (const c of sub) {
                sum += parseInt(c);
            }
            out += String.fromCharCode(64 + sum);
        }
        return out;
    }
    if (/^[01234\s \/]+$/.test(str)) {
        let out = "";
        for (const sub of str.split(/[\s\/]+/)) {
            let stack: string[] = [sub[0]];
            for (let i = 1; i < sub.length; i++) {
                if (sub[i] > stack[stack.length - 1]) {
                    stack.push(sub[i]);
                } else {
                    let tmp = stack.reduce((total: number, curr: string) => {
                        return total + 2 ** parseInt(curr);
                    }, 0);
                    out += String.fromCharCode(tmp + 64);
                    stack = [sub[i]];
                }
            }
            let tmp = stack.reduce((total: number, curr: string) => {
                return total + 2 ** parseInt(curr);
            }, 0);
            out += String.fromCharCode(tmp + 64);
        }
        return out;
    }
    return `${str}: Not Expected Format`;
};

export {
    is_Exponential,
    de_Exponential,
    is_Exponential as detect,
    de_Exponential as decode
};
