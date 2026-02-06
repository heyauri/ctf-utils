import { stringToCharCodes, charCodesToString, invertNumber } from "../utils/Utils";

export interface AffineOptions {
    a: number;
    b: number;
    i?: number;
    mode?: string;
    bf?: boolean;
}

const en_Affine = (inStr: string, opt: AffineOptions): string => {
    let { a, b, mode } = opt;
    mode = mode || "upper";
    const str = mode === "upper" ? inStr.toUpperCase() : inStr.toLowerCase();
    const basicNumber = mode === "upper" ? 65 : 97;
    const charCodes = stringToCharCodes(str);
    const encodedCharCodes = charCodes.map((code: number) => {
        const codeNum = code - basicNumber;
        if (codeNum >= 0 && codeNum < 26) {
            return (codeNum * a + b) % 26 + basicNumber;
        } else {
            return code;
        }
    });
    return charCodesToString(encodedCharCodes);
};

const de_Affine = (inStr: string, opt: AffineOptions): string => {
    let { a, b, i, mode, bf } = opt;
    mode = mode || "upper";
    const str = mode === "upper" ? inStr.toUpperCase() : inStr.toLowerCase();
    const basicNumber = mode === "upper" ? 65 : 97;
    const charCodes = stringToCharCodes(str);
    const inverseNumber = i === undefined ? invertNumber(a, 26, bf) : i;
    const encodedCharCodes = charCodes.map((code: number) => {
        const codeNum = code - basicNumber;
        if (codeNum >= 0 && codeNum < 26) {
            let res = ((codeNum - b) * inverseNumber) % 26;
            if (res < 0) {
                res = res + 26;
            }
            return res + basicNumber;
        } else {
            return code;
        }
    });
    return charCodesToString(encodedCharCodes);
};

const is_Affine = (str: string): boolean => {
    return /[a-z\s]+/gi.test(str);
};

export {
    is_Affine,
    en_Affine,
    de_Affine,
    is_Affine as detect,
    en_Affine as encode,
    de_Affine as decode
};
