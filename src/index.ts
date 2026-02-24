/**
 * CTF Utils main module
 */

import { decode, decodeSync } from "./decode";
import { encode, encodeSync } from "./encode";
import { detect, detectSync, detectAll, detectAllSync } from "./detect";
import * as Utils from "./utils/Utils";
import * as cryptoTypes from "./crypto-types/_index";
import * as solver from "./solver";
import util from "util";

/**
 * CTF Utils class for method chaining
 */
class CTFUtils {
    private readonly oriTarget: string;
    private currTarget: string;
    private readonly args: unknown[];
    
    // Dynamic properties for encode/decode/detect methods
    public readonly decode: Record<string, (...inputArgs: unknown[]) => Promise<this>>;
    public readonly detect: Record<string, (...inputArgs: unknown[]) => Promise<unknown>>;
    public readonly encode: Record<string, (...inputArgs: unknown[]) => Promise<this>>;
    public readonly decodeSync: Record<string, (...inputArgs: unknown[]) => this>;
    public readonly detectSync: Record<string, (...inputArgs: unknown[]) => unknown>;
    public readonly encodeSync: Record<string, (...inputArgs: unknown[]) => this>;
    public readonly solver: typeof solver;

    /**
     * Create a new CTFUtils instance
     * @param target Target string to process
     * @param args Additional arguments
     */
    constructor(target: string, ...args: unknown[]) {
        this.oriTarget = target;
        this.currTarget = target;
        this.args = args;
        this.solver = solver;

        // Initialize method maps
        this.decode = this.buildMethodMap(decode);
        this.decodeSync = this.buildMethodMapSync(decodeSync);
        this.detect = this.buildDetectMethodMap(detect);
        this.detectSync = this.buildDetectMethodMapSync(detectSync);
        this.encode = this.buildMethodMap(encode);
        this.encodeSync = this.buildMethodMapSync(encodeSync);
    }

    /**
     * Build method map for async methods
     * @param methods Method object
     * @returns Method map
     */
    private buildMethodMap(
        methods: Record<string, (str: string, ...args: unknown[]) => Promise<string | Buffer>>
    ): Record<string, (...inputArgs: unknown[]) => Promise<this>> {
        const methodMap: Record<string, (...inputArgs: unknown[]) => Promise<this>> = {};

        for (const [key, method] of Object.entries(methods)) {
            if (typeof method === 'function') {
                methodMap[key] = async (...inputArgs: unknown[]) => {
                    const input = inputArgs.length 
                        ? [this.currTarget, ...inputArgs] 
                        : [this.currTarget, ...this.args];
                    
                    const result = await method(...(input as [string, ...unknown[]]));
                    this.currTarget = typeof result === 'string' ? result : result.toString();
                    return this;
                };
            }
        }

        return methodMap;
    }

    /**
     * Build method map for sync methods
     * @param methods Method object
     * @returns Method map
     */
    private buildMethodMapSync(
        methods: Record<string, (str: string, ...args: unknown[]) => string | Buffer>
    ): Record<string, (...inputArgs: unknown[]) => this> {
        const methodMap: Record<string, (...inputArgs: unknown[]) => this> = {};

        for (const [key, method] of Object.entries(methods)) {
            if (typeof method === 'function') {
                methodMap[key] = (...inputArgs: unknown[]) => {
                    const input = inputArgs.length 
                        ? [this.currTarget, ...inputArgs] 
                        : [this.currTarget, ...this.args];
                    
                    const result = method(...(input as [string, ...unknown[]]));
                    this.currTarget = typeof result === 'string' ? result : result.toString();
                    return this;
                };
            }
        }

        return methodMap;
    }

    /**
     * Build method map for detect methods
     * @param methods Method object
     * @returns Method map
     */
    private buildDetectMethodMap(
        methods: Record<string, (str: string) => Promise<boolean>>
    ): Record<string, (...inputArgs: unknown[]) => Promise<unknown>> {
        const methodMap: Record<string, (...inputArgs: unknown[]) => Promise<unknown>> = {};

        for (const [key, method] of Object.entries(methods)) {
            if (typeof method === 'function') {
                methodMap[key] = async () => {
                    return await method(this.currTarget);
                };
            }
        }

        return methodMap;
    }

    /**
     * Build method map for sync detect methods
     * @param methods Method object
     * @returns Method map
     */
    private buildDetectMethodMapSync(
        methods: Record<string, (str: string) => boolean>
    ): Record<string, (...inputArgs: unknown[]) => unknown> {
        const methodMap: Record<string, (...inputArgs: unknown[]) => unknown> = {};

        for (const [key, method] of Object.entries(methods)) {
            if (typeof method === 'function') {
                methodMap[key] = () => {
                    return method(this.currTarget);
                };
            }
        }

        return methodMap;
    }

    /**
     * Get the current value
     * @returns Current processed value
     */
    val(): string {
        return this.currTarget;
    }

    /**
     * Reset to original target
     * @returns This instance for method chaining
     */
    reset(): this {
        this.currTarget = this.oriTarget;
        return this;
    }

    /**
     * Slice the current target
     * @param start Start index
     * @param end End index
     * @returns This instance for method chaining
     */
    slice(start?: number, end?: number): this {
        this.currTarget = this.currTarget.slice(start, end);
        return this;
    }

    /**
     * Replace in the current target
     * @param searchValue Search value
     * @param replaceValue Replace value
     * @returns This instance for method chaining
     */
    replace(searchValue: string | RegExp, replaceValue: string): this {
        this.currTarget = this.currTarget.replace(searchValue, replaceValue);
        return this;
    }

    /**
     * Custom inspect method
     * @returns Current value
     */
    [util.inspect.custom](): string {
        return this.currTarget;
    }

    /**
     * Get the original target
     * @returns Original target string
     */
    get original(): string {
        return this.oriTarget;
    }

    /**
     * Check if current value is different from original
     * @returns Whether value has been modified
     */
    get isModified(): boolean {
        return this.currTarget !== this.oriTarget;
    }
}

export { decode, encode, detect, decodeSync, encodeSync, detectSync, detectAll, detectAllSync, Utils, CTFUtils, solver };
export * from "./crypto-types/_index";
export default CTFUtils;
