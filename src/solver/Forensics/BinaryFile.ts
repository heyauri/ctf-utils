/**
 * Binary file analysis utilities for CTF challenges
 */

import * as fs from 'fs';

/**
 * File type signatures (magic numbers)
 */
const hexDict: Record<string, string> = {
    "FFD8FF": "jpg",
    "89504E47": "png",
    "47494638": "gif",
    "49492A00": "tif",
    "424D": "bmp",
    "41433130": "cad",
    "38425053": "psd",
    "7B5C727466": "rtf",
    "3C3F786D6C": "xml",
    "68746D6C3E": "html",
    "44656C69766572792D646174653A": "eml",
    "CFAD12FEC5FD746F": "dbx",
    "2142444E": "pst",
    "D0CF11E0": "doc / xls",
    "5374616E64617264204A": "mdb",
    "FF575043": "wpd",
    "252150532D41646F6265": "eps",
    "255044462D312E": "pdf",
    "AC9EBD8F": "qdf",
    "E3828596": "pwl",
    "504B0304": "zip",
    "52617221": "rar",
    "57415645": "wav",
    "41564920": "avi",
    "2E7261FD": "ram",
    "2E524D46": "rm",
    "000001BA": "mpg",
    "000001B3": "mpg",
    "6D6F6F76": "mov",
    "3026B2758E66CF11": "asf",
    "4D546864": "mid",
    "7573746172": "tar"
};

/**
 * Detect file type by examining the first 512 bytes
 * @param buf Input buffer
 * @returns Array of detected file types
 */
const fast_detect = (buf: Buffer): string[] => {
    const headBuff = buf.slice(0, 512);
    const out: string[] = [];
    for (const k in hexDict) {
        const hexBuffer = Buffer.from(k, "hex");
        if (headBuff.includes(hexBuffer)) {
            out.push(hexDict[k]);
        }
    }
    return out;
};

/**
 * Detect file type by examining the entire buffer
 * @param buf Input buffer
 * @returns Array of detected file types
 */
const full_detect = (buf: Buffer): string[] => {
    const out: string[] = [];
    for (const k in hexDict) {
        const hexBuffer = Buffer.from(k, "hex");
        if (buf.includes(hexBuffer)) {
            out.push(hexDict[k]);
        }
    }
    return out;
};

/**
 * Detect file type from buffer or hex string
 * @param buf Input buffer or hex string
 * @param mode Detection mode ("fast" or "full")
 * @returns Array of detected file types
 */
const is_BinaryFile = (buf: Buffer | string, mode: string = "fast"): string[] => {
    if (typeof buf === "string") {
        buf = Buffer.from(buf, "hex");
    }
    let out: string[] = [];
    switch (mode) {
        case "fast":
            out = fast_detect(buf);
            break;
        case "full":
            out = full_detect(buf);
            break;
    }
    return out;
};

/**
 * Extract file header information
 * @param buf Input buffer
 * @param size Number of bytes to extract (default: 256)
 * @returns Header information
 */
const extractHeader = (buf: Buffer, size: number = 256): {
    bytes: Buffer;
    hex: string;
    ascii: string;
    detectedTypes: string[];
} => {
    const header = buf.slice(0, size);
    return {
        bytes: header,
        hex: header.toString('hex'),
        ascii: header.toString('ascii').replace(/[\x00-\x1F\x7F]/g, '.'),
        detectedTypes: fast_detect(buf)
    };
};

/**
 * Search for pattern in binary data
 * @param buf Input buffer
 * @param pattern Pattern to search for (string or Buffer)
 * @param offset Offset to start searching from (default: 0)
 * @returns Array of offsets where pattern was found
 */
const searchPattern = (buf: Buffer, pattern: string | Buffer, offset: number = 0): number[] => {
    const patternBuffer = typeof pattern === 'string' ? Buffer.from(pattern, 'hex') : pattern;
    const offsets: number[] = [];

    for (let i = offset; i <= buf.length - patternBuffer.length; i++) {
        let match = true;
        for (let j = 0; j < patternBuffer.length; j++) {
            if (buf[i + j] !== patternBuffer[j]) {
                match = false;
                break;
            }
        }
        if (match) {
            offsets.push(i);
        }
    }

    return offsets;
};

/**
 * Extract specific region from binary data
 * @param buf Input buffer
 * @param offset Start offset
 * @param length Number of bytes to extract
 * @returns Extracted buffer
 */
const extractRegion = (buf: Buffer, offset: number, length: number): Buffer => {
    return buf.slice(offset, offset + length);
};

/**
 * Analyze binary data statistics
 * @param buf Input buffer
 * @returns Statistical analysis of the binary data
 */
const analyzeStatistics = (buf: Buffer): {
    size: number;
    entropy: number;
    zeroBytes: number;
    uniqueBytes: number;
    byteDistribution: Record<number, number>;
    printableAscii: number;
} => {
    const size = buf.length;
    let zeroBytes = 0;
    const byteDistribution: Record<number, number> = {};
    let printableAscii = 0;

    for (let i = 0; i < size; i++) {
        const byte = buf[i];
        if (byte === 0) zeroBytes++;
        if (byte >= 0x20 && byte <= 0x7E) printableAscii++;
        byteDistribution[byte] = (byteDistribution[byte] || 0) + 1;
    }

    // Calculate entropy
    let entropy = 0;
    for (const byte in byteDistribution) {
        const probability = byteDistribution[byte] / size;
        entropy -= probability * Math.log2(probability);
    }

    return {
        size,
        entropy,
        zeroBytes,
        uniqueBytes: Object.keys(byteDistribution).length,
        byteDistribution,
        printableAscii
    };
};

/**
 * Compare two binary buffers
 * @param buf1 First buffer
 * @param buf2 Second buffer
 * @returns Comparison result
 */
const compareBuffers = (buf1: Buffer, buf2: Buffer): {
    identical: boolean;
    sizeMatch: boolean;
    differingOffsets: number[];
    similarity: number;
} => {
    const sizeMatch = buf1.length === buf2.length;
    const minSize = Math.min(buf1.length, buf2.length);
    const differingOffsets: number[] = [];

    for (let i = 0; i < minSize; i++) {
        if (buf1[i] !== buf2[i]) {
            differingOffsets.push(i);
        }
    }

    const identical = sizeMatch && differingOffsets.length === 0;
    const similarity = (minSize - differingOffsets.length) / Math.max(buf1.length, buf2.length);

    return {
        identical,
        sizeMatch,
        differingOffsets,
        similarity
    };
};

/**
 * Find all occurrences of a specific byte value
 * @param buf Input buffer
 * @param byteValue Byte value to find (0-255)
 * @returns Array of offsets where byte value was found
 */
const findByte = (buf: Buffer, byteValue: number): number[] => {
    const offsets: number[] = [];
    for (let i = 0; i < buf.length; i++) {
        if (buf[i] === byteValue) {
            offsets.push(i);
        }
    }
    return offsets;
};

/**
 * Extract strings from binary data
 * @param buf Input buffer
 * @param minLength Minimum string length (default: 4)
 * @returns Array of extracted strings
 */
const extractStrings = (buf: Buffer, minLength: number = 4): string[] => {
    const strings: string[] = [];
    let currentString = '';

    for (let i = 0; i < buf.length; i++) {
        const byte = buf[i];
        if (byte >= 0x20 && byte <= 0x7E) {
            currentString += String.fromCharCode(byte);
        } else {
            if (currentString.length >= minLength) {
                strings.push(currentString);
            }
            currentString = '';
        }
    }

    if (currentString.length >= minLength) {
        strings.push(currentString);
    }

    return strings;
};

/**
 * Read binary file from disk
 * @param filePath Path to file
 * @returns Buffer containing file data
 */
const readBinaryFile = (filePath: string): Buffer => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    return fs.readFileSync(filePath);
};

export {
    is_BinaryFile,
    is_BinaryFile as detect,
    extractHeader,
    searchPattern,
    extractRegion,
    analyzeStatistics,
    compareBuffers,
    findByte,
    extractStrings,
    readBinaryFile
};
