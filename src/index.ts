import decode from "./decode";
import encode from "./encode";
import detect from "./detect";
import * as Utils from "./utils/Utils";
import util from "util";

class CTFUtils {
    oriTarget: string;
    currTarget: string;
    decode: Record<string, unknown>;
    detect: Record<string, unknown>;
    encode: Record<string, unknown>;

    constructor(target: string, ...args: unknown[]) {
        this.oriTarget = target;
        this.currTarget = target;
        this.decode = {};
        this.detect = {};
        this.encode = {};

        const decodeAny: any = decode;
        for (const k in decodeAny) {
            if (typeof decodeAny[k] === 'function') {
                this.decode[k] = (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...args];
                    this.currTarget = decodeAny[k](...input);
                    console.log("decode", k, this.currTarget);
                    return this;
                };
            }
        }

        const detectAny: any = detect;
        for (const k in detectAny) {
            if (typeof detectAny[k] === 'function') {
                this.detect[k] = (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...args];
                    console.log("detect", k, detectAny[k](...input));
                    return this;
                };
            }
        }

        const encodeAny: any = encode;
        for (const k in encodeAny) {
            if (typeof encodeAny[k] === 'function') {
                this.encode[k] = (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...args];
                    console.log("encode", k, encodeAny[k](...input));
                    return this;
                };
            }
        }
    }

    val(): string {
        return this.currTarget;
    }

    slice(start?: number, end?: number): this {
        this.currTarget = this.currTarget.slice(start, end);
        return this;
    }

    replace(searchValue: string | RegExp, replaceValue: string): this {
        this.currTarget = this.currTarget.replace(searchValue, replaceValue);
        return this;
    }

    [util.inspect.custom](): string {
        return this.currTarget;
    }

    [key: string]: unknown;
}

export { decode, encode, detect, Utils, CTFUtils };
