import { decode, decodeSync } from "./decode";
import { encode, encodeSync } from "./encode";
import { detect, detectSync, detectAll, detectAllSync } from "./detect";
import * as Utils from "./utils/Utils";
import * as cryptoTypes from "./crypto-types/_index";
import util from "util";

class CTFUtils {
    oriTarget: string;
    currTarget: string;
    decode: Record<string, unknown>;
    detect: Record<string, unknown>;
    encode: Record<string, unknown>;
    decodeSync: Record<string, unknown>;
    detectSync: Record<string, unknown>;
    encodeSync: Record<string, unknown>;
    private args: unknown[];

    constructor(target: string, ...args: unknown[]) {
        this.oriTarget = target;
        this.currTarget = target;
        this.args = args;
        this.decode = {};
        this.detect = {};
        this.encode = {};
        this.decodeSync = {};
        this.detectSync = {};
        this.encodeSync = {};

        const decodeAny: any = decode;
        for (const k in decodeAny) {
            if (typeof decodeAny[k] === 'function') {
                this.decode[k] = async (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...this.args];
                    this.currTarget = await decodeAny[k](...input);
                    return this;
                };
            }
        }

        const decodeSyncAny: any = decodeSync;
        for (const k in decodeSyncAny) {
            if (typeof decodeSyncAny[k] === 'function') {
                this.decodeSync[k] = (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...this.args];
                    this.currTarget = decodeSyncAny[k](...input);
                    return this;
                };
            }
        }

        const detectAny: any = detect;
        for (const k in detectAny) {
            if (typeof detectAny[k] === 'function') {
                this.detect[k] = async (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...this.args];
                    return await detectAny[k](...input);
                };
            }
        }

        const detectSyncAny: any = detectSync;
        for (const k in detectSyncAny) {
            if (typeof detectSyncAny[k] === 'function') {
                this.detectSync[k] = (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...this.args];
                    return detectSyncAny[k](...input);
                };
            }
        }

        const encodeAny: any = encode;
        for (const k in encodeAny) {
            if (typeof encodeAny[k] === 'function') {
                this.encode[k] = async (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...this.args];
                    this.currTarget = await encodeAny[k](...input);
                    return this;
                };
            }
        }

        const encodeSyncAny: any = encodeSync;
        for (const k in encodeSyncAny) {
            if (typeof encodeSyncAny[k] === 'function') {
                this.encodeSync[k] = (...inputArgs: unknown[]) => {
                    const input = inputArgs.length ? [this.currTarget, ...inputArgs] : [this.currTarget, ...this.args];
                    this.currTarget = encodeSyncAny[k](...input);
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

export { decode, encode, detect, decodeSync, encodeSync, detectSync, detectAll, detectAllSync, Utils, CTFUtils };
export * from "./crypto-types/_index";
