const XOR = (input: string | Buffer, key: number | Buffer): string | Buffer => {
    const inputBuf = Buffer.isBuffer(input) ? input : Buffer.from(input);
    const keyBuf = Buffer.isBuffer(key) ? key : Buffer.from([key]);
    const output = Buffer.alloc(inputBuf.length);

    for (let i = 0; i < inputBuf.length; i++) {
        output[i] = inputBuf[i] ^ keyBuf[i % keyBuf.length];
    }

    return Buffer.isBuffer(input) ? output : output.toString();
};

const bruteXOR = (input: string | Buffer, keyLength: number = 1): { key: Buffer; result: string }[] => {
    const inputBuf = Buffer.isBuffer(input) ? input : Buffer.from(input);
    const results: { key: Buffer; result: string }[] = [];

    if (keyLength === 1) {
        for (let k = 0; k < 256; k++) {
            const result = XOR(inputBuf, k);
            const str = Buffer.isBuffer(result) ? result.toString() : result;
            if (isReadable(str)) {
                results.push({ key: Buffer.from([k]), result: str });
            }
        }
    } else {
        bruteXORRecursive(inputBuf, Buffer.alloc(keyLength), 0, results);
    }

    return results;
};

const bruteXORRecursive = (
    input: Buffer,
    key: Buffer,
    pos: number,
    results: { key: Buffer; result: string }[]
): void => {
    if (pos === key.length) {
        const result = XOR(input, key);
        const str = Buffer.isBuffer(result) ? result.toString() : result;
        if (isReadable(str)) {
            results.push({ key: Buffer.from(key), result: str });
        }
        return;
    }

    for (let k = 0; k < 256; k++) {
        key[pos] = k;
        bruteXORRecursive(input, key, pos + 1, results);
    }
};

const isReadable = (str: string): boolean => {
    let printable = 0;
    for (const c of str) {
        const code = c.charCodeAt(0);
        if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
            printable++;
        }
    }
    return printable / str.length > 0.9 && str.length > 0;
};

const is_XOR = (input: string | Buffer): boolean => {
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
    return buf.length > 0;
};

/**
 * Calculate index of coincidence for a buffer
 * @param buf Input buffer
 * @returns Index of coincidence
 */
const calculateIC = (buf: Buffer): number => {
    const freq: number[] = new Array(256).fill(0);
    let total = 0;
    
    for (const byte of buf) {
        freq[byte]++;
        total++;
    }
    
    if (total < 2) return 0;
    
    let ic = 0;
    for (const count of freq) {
        ic += count * (count - 1);
    }
    
    return ic / (total * (total - 1));
};

/**
 * Detect XOR key length using index of coincidence
 * @param input Input string or buffer
 * @param maxLength Maximum key length to check (default: 32)
 * @returns Most likely key length
 */
const detectKeyLength = (input: string | Buffer, maxLength: number = 32): number => {
    const inputBuf = Buffer.isBuffer(input) ? input : Buffer.from(input);
    
    if (inputBuf.length < 2) {
        return 1;
    }
    
    const icValues: { length: number; ic: number }[] = [];
    
    for (let length = 1; length <= maxLength; length++) {
        if (inputBuf.length < length * 2) break;
        
        const chunks: Buffer[] = [];
        for (let i = 0; i < length; i++) {
            const chunk = Buffer.alloc(Math.floor((inputBuf.length - i) / length));
            for (let j = 0; j < chunk.length; j++) {
                chunk[j] = inputBuf[i + j * length];
            }
            chunks.push(chunk);
        }
        
        const avgIC = chunks.reduce((sum, chunk) => sum + calculateIC(chunk), 0) / chunks.length;
        icValues.push({ length, ic: avgIC });
    }
    
    if (icValues.length === 0) return 1;
    
    // Sort by IC value (higher is better)
    icValues.sort((a, b) => b.ic - a.ic);
    
    return icValues[0].length;
};

export {
    XOR,
    bruteXOR,
    is_XOR,
    is_XOR as detect,
    detectKeyLength
};
