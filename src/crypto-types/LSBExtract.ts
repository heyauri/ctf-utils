import * as fs from 'fs';
import * as path from 'path';

interface LSBExtractOptions {
    bitPlane?: number;
    startOffset?: number;
    endOffset?: number;
    outputFormat?: 'binary' | 'text' | 'hex';
}

interface PNGChunk {
    length: number;
    type: string;
    data: Buffer;
    crc: number;
}

class PNGParser {
    static parse(buffer: Buffer): { width: number; height: number; data: Buffer } {
        if (buffer.readUInt32BE(0) !== 0x89504E47) {
            throw new Error('Not a PNG file');
        }
        
        if (buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
            throw new Error('Invalid PNG signature');
        }
        
        let offset = 8;
        let width = 0;
        let height = 0;
        let dataBuffer: Buffer | null = null;
        
        while (offset < buffer.length) {
            const length = buffer.readUInt32BE(offset);
            offset += 4;
            
            const type = buffer.toString('ascii', offset, offset + 4);
            offset += 4;
            
            const data = buffer.slice(offset, offset + length);
            offset += length;
            
            const crc = buffer.readUInt32BE(offset);
            offset += 4;
            
            if (type === 'IHDR') {
                width = data.readUInt32BE(0);
                height = data.readUInt32BE(4);
            } else if (type === 'IDAT') {
                if (!dataBuffer) {
                    dataBuffer = data;
                } else {
                    dataBuffer = Buffer.concat([dataBuffer, data]);
                }
            } else if (type === 'IEND') {
                break;
            }
        }
        
        if (!dataBuffer) {
            throw new Error('No IDAT chunk found');
        }
        
        return {
            width,
            height,
            data: dataBuffer
        };
    }
}

const extractLSB = (imagePath: string, options: LSBExtractOptions = {}): string => {
    const {
        bitPlane = 0,
        startOffset = 0,
        endOffset = Infinity,
        outputFormat = 'text'
    } = options;
    
    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
    }
    
    const buffer = fs.readFileSync(imagePath);
    const { data } = PNGParser.parse(buffer);
    
    const bits: number[] = [];
    let currentOffset = 0;
    
    for (let i = 0; i < data.length; i++) {
        const byte = data[i];
        const bit = (byte >> bitPlane) & 1;
        
        if (currentOffset >= startOffset) {
            bits.push(bit);
        }
        
        currentOffset++;
        
        if (currentOffset >= endOffset) {
            break;
        }
    }
    
    let result = '';
    
    if (outputFormat === 'binary') {
        result = bits.join('');
    } else if (outputFormat === 'hex') {
        let hex = '';
        for (let i = 0; i < bits.length; i += 8) {
            const byteBits = bits.slice(i, i + 8).join('');
            if (byteBits.length === 8) {
                const byte = parseInt(byteBits, 2);
                hex += byte.toString(16).padStart(2, '0');
            }
        }
        result = hex;
    } else {
        let text = '';
        for (let i = 0; i < bits.length; i += 8) {
            const byteBits = bits.slice(i, i + 8).join('');
            if (byteBits.length === 8) {
                const byte = parseInt(byteBits, 2);
                if (byte === 0) break;
                text += String.fromCharCode(byte);
            }
        }
        result = text;
    }
    
    return result;
};

const extractAllBitPlanes = (imagePath: string): string[] => {
    const planes: string[] = [];
    
    for (let plane = 0; plane < 8; plane++) {
        const result = extractLSB(imagePath, { bitPlane: plane, outputFormat: 'text' });
        planes.push(result);
    }
    
    return planes;
};

const detectSteganography = (imagePath: string): { detected: boolean; confidence: number; possiblePlanes: number[] } => {
    const planes = extractAllBitPlanes(imagePath);
    const possiblePlanes: number[] = [];
    let totalScore = 0;
    
    for (let plane = 0; plane < planes.length; plane++) {
        const content = planes[plane];
        const score = analyzeContent(content);
        
        if (score > 0.5) {
            possiblePlanes.push(plane);
            totalScore += score;
        }
    }
    
    const confidence = possiblePlanes.length > 0 ? totalScore / possiblePlanes.length : 0;
    
    return {
        detected: possiblePlanes.length > 0,
        confidence: parseFloat((confidence * 100).toFixed(2)),
        possiblePlanes
    };
};

const analyzeContent = (content: string): number => {
    if (!content || content.length < 10) return 0;
    
    const alphaChars = (content.match(/[a-zA-Z]/g) || []).length;
    const alphaRatio = alphaChars / content.length;
    
    const printableChars = (content.match(/[\x20-\x7E]/g) || []).length;
    const printableRatio = printableChars / content.length;
    
    const hasCommonWords = /\b(the|and|is|in|to|of|for|with|on|at)\b/i.test(content);
    const hasFlagPattern = /CTF\{[^}]+\}/i.test(content);
    
    let score = 0;
    score += alphaRatio * 0.3;
    score += printableRatio * 0.3;
    score += hasCommonWords ? 0.2 : 0;
    score += hasFlagPattern ? 0.2 : 0;
    
    return Math.min(1, score);
};

const embedLSB = (imagePath: string, data: string, outputPath: string, options: LSBExtractOptions = {}): void => {
    const { bitPlane = 0, startOffset = 0 } = options;
    
    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
    }
    
    const buffer = fs.readFileSync(imagePath);
    const pngData = PNGParser.parse(buffer);
    const { data: imageData } = pngData;
    
    const bits = [];
    for (const char of data) {
        const byte = char.charCodeAt(0);
        for (let i = 7; i >= 0; i--) {
            bits.push((byte >> i) & 1);
        }
    }
    
    bits.push(0);
    
    let currentOffset = 0;
    let bitIndex = 0;
    
    const modifiedData = Buffer.from(imageData);
    
    for (let i = 0; i < modifiedData.length && bitIndex < bits.length; i++) {
        if (currentOffset >= startOffset) {
            const byte = modifiedData[i];
            const mask = ~(1 << bitPlane);
            const newByte = (byte & mask) | (bits[bitIndex] << bitPlane);
            modifiedData[i] = newByte;
            bitIndex++;
        }
        currentOffset++;
    }
    
    fs.writeFileSync(outputPath, modifiedData);
};

export {
    extractLSB,
    extractAllBitPlanes,
    detectSteganography,
    embedLSB,
    PNGParser
};
