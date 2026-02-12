import * as fs from 'fs';

interface PNGChunk {
    length: number;
    type: string;
    data: Buffer;
    crc: number;
    offset: number;
}

interface PNGCheckResult {
    valid: boolean;
    width: number;
    height: number;
    bitDepth: number;
    colorType: number;
    compression: number;
    filter: number;
    interlace: number;
    chunks: PNGChunk[];
    issues: string[];
    warnings: string[];
}

interface PNGColorType {
    type: number;
    name: string;
    description: string;
}

const PNG_COLOR_TYPES: PNGColorType[] = [
    { type: 0, name: 'Grayscale', description: '1 channel' },
    { type: 2, name: 'RGB', description: '3 channels' },
    { type: 3, name: 'Indexed', description: 'Paletted' },
    { type: 4, name: 'Grayscale+Alpha', description: '2 channels' },
    { type: 6, name: 'RGBA', description: '4 channels' }
];

const calculateCRC = (data: Buffer): number => {
    let crc = 0xFFFFFFFF;
    const crcTable: number[] = [];
    
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            if (c & 1) {
                c = 0xEDB88320 ^ (c >>> 1);
            } else {
                c = c >>> 1;
            }
        }
        crcTable[i] = c;
    }
    
    for (let i = 0; i < data.length; i++) {
        crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    
    return crc ^ 0xFFFFFFFF;
};

const checkPNG = (filePath: string): PNGCheckResult => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    
    const buffer = fs.readFileSync(filePath);
    const result: PNGCheckResult = {
        valid: true,
        width: 0,
        height: 0,
        bitDepth: 0,
        colorType: 0,
        compression: 0,
        filter: 0,
        interlace: 0,
        chunks: [],
        issues: [],
        warnings: []
    };
    
    if (buffer.length < 8) {
        result.valid = false;
        result.issues.push('File too short to be a valid PNG');
        return result;
    }
    
    if (buffer.readUInt32BE(0) !== 0x89504E47) {
        result.valid = false;
        result.issues.push('Invalid PNG signature');
        return result;
    }
    
    if (buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
        result.valid = false;
        result.issues.push('Invalid PNG signature (incorrect line endings)');
        return result;
    }
    
    let offset = 8;
    let seenIHDR = false;
    let seenIDAT = false;
    let seenIEND = false;
    
    while (offset < buffer.length) {
        if (offset + 12 > buffer.length) {
            result.valid = false;
            result.issues.push('Truncated PNG file');
            break;
        }
        
        const length = buffer.readUInt32BE(offset);
        offset += 4;
        
        const type = buffer.toString('ascii', offset, offset + 4);
        offset += 4;
        
        if (offset + length > buffer.length) {
            result.valid = false;
            result.issues.push(`Truncated chunk: ${type}`);
            break;
        }
        
        const data = buffer.slice(offset, offset + length);
        offset += length;
        
        const crc = buffer.readUInt32BE(offset);
        offset += 4;
        
        const chunk: PNGChunk = {
            length,
            type,
            data,
            crc,
            offset: offset - 12
        };
        
        result.chunks.push(chunk);
        
        const expectedCRC = calculateCRC(Buffer.concat([Buffer.from(type), data]));
        if (crc !== expectedCRC) {
            result.warnings.push(`CRC mismatch for chunk ${type}: expected ${expectedCRC.toString(16)}, got ${crc.toString(16)}`);
        }
        
        if (type === 'IHDR') {
            if (seenIHDR) {
                result.issues.push('Multiple IHDR chunks found');
            }
            seenIHDR = true;
            
            if (length !== 13) {
                result.issues.push('Invalid IHDR chunk length');
            } else {
                result.width = data.readUInt32BE(0);
                result.height = data.readUInt32BE(4);
                result.bitDepth = data[8];
                result.colorType = data[9];
                result.compression = data[10];
                result.filter = data[11];
                result.interlace = data[12];
                
                if (result.width === 0 || result.height === 0) {
                    result.issues.push('Invalid image dimensions');
                }
                
                const validBitDepths = [1, 2, 4, 8, 16];
                if (!validBitDepths.includes(result.bitDepth)) {
                    result.issues.push(`Invalid bit depth: ${result.bitDepth}`);
                }
                
                const validColorTypes = [0, 2, 3, 4, 6];
                if (!validColorTypes.includes(result.colorType)) {
                    result.issues.push(`Invalid color type: ${result.colorType}`);
                }
                
                if (result.compression !== 0) {
                    result.issues.push(`Invalid compression method: ${result.compression}`);
                }
                
                if (result.filter !== 0) {
                    result.issues.push(`Invalid filter method: ${result.filter}`);
                }
                
                if (![0, 1].includes(result.interlace)) {
                    result.issues.push(`Invalid interlace method: ${result.interlace}`);
                }
            }
        } else if (type === 'IDAT') {
            seenIDAT = true;
        } else if (type === 'IEND') {
            seenIEND = true;
            break;
        } else if (type.startsWith('s')) {
            result.warnings.push(`Found private chunk: ${type}`);
        }
    }
    
    if (!seenIHDR) {
        result.issues.push('Missing IHDR chunk');
    }
    
    if (!seenIDAT) {
        result.issues.push('Missing IDAT chunk');
    }
    
    if (!seenIEND) {
        result.issues.push('Missing IEND chunk');
    }
    
    if (result.issues.length > 0) {
        result.valid = false;
    }
    
    return result;
};

const getPNGInfo = (filePath: string): string => {
    const result = checkPNG(filePath);
    let info = `PNG File Analysis\n`;
    info += `=================\n`;
    info += `Valid: ${result.valid ? 'Yes' : 'No'}\n`;
    info += `Dimensions: ${result.width}x${result.height}\n`;
    info += `Bit Depth: ${result.bitDepth}\n`;
    
    const colorType = PNG_COLOR_TYPES.find(ct => ct.type === result.colorType);
    info += `Color Type: ${result.colorType} (${colorType ? colorType.name : 'Unknown'})\n`;
    info += `Compression: ${result.compression}\n`;
    info += `Filter: ${result.filter}\n`;
    info += `Interlace: ${result.interlace === 0 ? 'None' : 'Adam7'}\n`;
    info += `Chunks: ${result.chunks.length}\n`;
    
    result.chunks.forEach((chunk, index) => {
        info += `  ${index + 1}. ${chunk.type} (${chunk.length} bytes)\n`;
    });
    
    if (result.warnings.length > 0) {
        info += `\nWarnings:\n`;
        result.warnings.forEach(warning => {
            info += `  - ${warning}\n`;
        });
    }
    
    if (result.issues.length > 0) {
        info += `\nIssues:\n`;
        result.issues.forEach(issue => {
            info += `  - ${issue}\n`;
        });
    }
    
    return info;
};

const detectPNGSteganography = (filePath: string): { detected: boolean; methods: string[]; confidence: number } => {
    const result = checkPNG(filePath);
    const methods: string[] = [];
    let confidence = 0;
    
    result.chunks.forEach(chunk => {
        if (chunk.type === 'tEXt' || chunk.type === 'zTXt' || chunk.type === 'iTXt') {
            methods.push('Text chunks');
            confidence += 20;
        }
        
        if (chunk.type.startsWith('s')) {
            methods.push('Private chunks');
            confidence += 30;
        }
    });
    
    if (result.warnings.length > 0) {
        methods.push('CRC anomalies');
        confidence += 15;
    }
    
    if (result.issues.length > 0) {
        methods.push('File structure issues');
        confidence += 25;
    }
    
    confidence = Math.min(100, confidence);
    
    return {
        detected: methods.length > 0,
        methods,
        confidence: parseFloat(confidence.toFixed(2))
    };
};

export {
    checkPNG,
    getPNGInfo,
    detectPNGSteganography,
    PNG_COLOR_TYPES
};
