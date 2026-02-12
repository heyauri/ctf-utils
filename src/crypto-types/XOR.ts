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

export {
    XOR,
    bruteXOR,
    is_XOR,
    is_XOR as detect
};
