import * as fs from 'fs';

interface ZIPFileHeader {
    signature: number;
    version: number;
    flags: number;
    compression: number;
    modTime: number;
    modDate: number;
    crc32: number;
    compressedSize: number;
    uncompressedSize: number;
    fileNameLength: number;
    extraFieldLength: number;
    fileName: string;
    offset: number;
    isEncrypted: boolean;
}

interface ZIPCentralDirectoryRecord {
    signature: number;
    versionMadeBy: number;
    versionNeeded: number;
    flags: number;
    compression: number;
    modTime: number;
    modDate: number;
    crc32: number;
    compressedSize: number;
    uncompressedSize: number;
    fileNameLength: number;
    extraFieldLength: number;
    fileCommentLength: number;
    diskNumberStart: number;
    internalFileAttr: number;
    externalFileAttr: number;
    relativeOffset: number;
    fileName: string;
    fileComment: string;
    isEncrypted: boolean;
}

interface ZIPEndOfCentralDirectory {
    signature: number;
    diskNumber: number;
    centralDirectoryStartDisk: number;
    entriesOnThisDisk: number;
    totalEntries: number;
    centralDirectorySize: number;
    centralDirectoryOffset: number;
    zipFileCommentLength: number;
    zipFileComment: string;
}

interface ZIPInfoResult {
    valid: boolean;
    files: ZIPFileHeader[];
    centralDirectory: ZIPCentralDirectoryRecord[];
    endOfCentralDirectory: ZIPEndOfCentralDirectory | null;
    issues: string[];
    warnings: string[];
    isPseudoEncrypted: boolean;
    totalFiles: number;
    compressedSize: number;
    uncompressedSize: number;
}

const ZIP_SIGNATURES = {
    LOCAL_FILE_HEADER: 0x04034B50,
    CENTRAL_DIRECTORY: 0x02014B50,
    END_OF_CENTRAL_DIRECTORY: 0x06054B50
};

const COMPRESSION_METHODS = {
    0: 'Stored',
    1: 'Shrunk',
    2: 'Reduced with compression factor 1',
    3: 'Reduced with compression factor 2',
    4: 'Reduced with compression factor 3',
    5: 'Reduced with compression factor 4',
    6: 'Imploded',
    7: 'Tokenizing compression algorithm',
    8: 'Deflated',
    9: 'Enhanced Deflating using Deflate64(tm)',
    10: 'PKWARE Data Compression Library Imploding',
    11: 'Reserved for PKWARE',
    12: 'BZIP2',
    13: 'Reserved for PKWARE',
    14: 'LZMA',
    15: 'Reserved for PKWARE',
    16: 'IBM z/OS CMPSC Compression',
    17: 'Reserved for PKWARE',
    18: 'IBMCMS',
    19: 'IBMTAR',
    20: 'reserved',
    21: 'ZLIB',
    22: 'IZMA',
    97: 'WavPack compressed data',
    98: 'PPMd version I, Rev 1'
};

const parseZIPFileHeader = (buffer: Buffer, offset: number): ZIPFileHeader | null => {
    if (offset + 30 > buffer.length) {
        return null;
    }
    
    const signature = buffer.readUInt32LE(offset);
    if (signature !== ZIP_SIGNATURES.LOCAL_FILE_HEADER) {
        return null;
    }
    
    const version = buffer.readUInt16LE(offset + 4);
    const flags = buffer.readUInt16LE(offset + 6);
    const compression = buffer.readUInt16LE(offset + 8);
    const modTime = buffer.readUInt16LE(offset + 10);
    const modDate = buffer.readUInt16LE(offset + 12);
    const crc32 = buffer.readUInt32LE(offset + 14);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const uncompressedSize = buffer.readUInt32LE(offset + 22);
    const fileNameLength = buffer.readUInt16LE(offset + 26);
    const extraFieldLength = buffer.readUInt16LE(offset + 28);
    
    if (offset + 30 + fileNameLength + extraFieldLength > buffer.length) {
        return null;
    }
    
    const fileName = buffer.toString('utf8', offset + 30, offset + 30 + fileNameLength);
    const isEncrypted = (flags & 0x0001) !== 0;
    
    return {
        signature,
        version,
        flags,
        compression,
        modTime,
        modDate,
        crc32,
        compressedSize,
        uncompressedSize,
        fileNameLength,
        extraFieldLength,
        fileName,
        offset,
        isEncrypted
    };
};

const parseZIPCentralDirectoryRecord = (buffer: Buffer, offset: number): ZIPCentralDirectoryRecord | null => {
    if (offset + 46 > buffer.length) {
        return null;
    }
    
    const signature = buffer.readUInt32LE(offset);
    if (signature !== ZIP_SIGNATURES.CENTRAL_DIRECTORY) {
        return null;
    }
    
    const versionMadeBy = buffer.readUInt16LE(offset + 4);
    const versionNeeded = buffer.readUInt16LE(offset + 6);
    const flags = buffer.readUInt16LE(offset + 8);
    const compression = buffer.readUInt16LE(offset + 10);
    const modTime = buffer.readUInt16LE(offset + 12);
    const modDate = buffer.readUInt16LE(offset + 14);
    const crc32 = buffer.readUInt32LE(offset + 16);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraFieldLength = buffer.readUInt16LE(offset + 30);
    const fileCommentLength = buffer.readUInt16LE(offset + 32);
    const diskNumberStart = buffer.readUInt16LE(offset + 34);
    const internalFileAttr = buffer.readUInt16LE(offset + 36);
    const externalFileAttr = buffer.readUInt32LE(offset + 38);
    const relativeOffset = buffer.readUInt32LE(offset + 42);
    
    if (offset + 46 + fileNameLength + extraFieldLength + fileCommentLength > buffer.length) {
        return null;
    }
    
    const fileName = buffer.toString('utf8', offset + 46, offset + 46 + fileNameLength);
    const fileComment = buffer.toString('utf8', offset + 46 + fileNameLength + extraFieldLength, offset + 46 + fileNameLength + extraFieldLength + fileCommentLength);
    const isEncrypted = (flags & 0x0001) !== 0;
    
    return {
        signature,
        versionMadeBy,
        versionNeeded,
        flags,
        compression,
        modTime,
        modDate,
        crc32,
        compressedSize,
        uncompressedSize,
        fileNameLength,
        extraFieldLength,
        fileCommentLength,
        diskNumberStart,
        internalFileAttr,
        externalFileAttr,
        relativeOffset,
        fileName,
        fileComment,
        isEncrypted
    };
};

const parseZIPEndOfCentralDirectory = (buffer: Buffer, offset: number): ZIPEndOfCentralDirectory | null => {
    if (offset + 22 > buffer.length) {
        return null;
    }
    
    const signature = buffer.readUInt32LE(offset);
    if (signature !== ZIP_SIGNATURES.END_OF_CENTRAL_DIRECTORY) {
        return null;
    }
    
    const diskNumber = buffer.readUInt16LE(offset + 4);
    const centralDirectoryStartDisk = buffer.readUInt16LE(offset + 6);
    const entriesOnThisDisk = buffer.readUInt16LE(offset + 8);
    const totalEntries = buffer.readUInt16LE(offset + 10);
    const centralDirectorySize = buffer.readUInt32LE(offset + 12);
    const centralDirectoryOffset = buffer.readUInt32LE(offset + 16);
    const zipFileCommentLength = buffer.readUInt16LE(offset + 20);
    
    let zipFileComment = '';
    if (zipFileCommentLength > 0 && offset + 22 + zipFileCommentLength <= buffer.length) {
        zipFileComment = buffer.toString('utf8', offset + 22, offset + 22 + zipFileCommentLength);
    }
    
    return {
        signature,
        diskNumber,
        centralDirectoryStartDisk,
        entriesOnThisDisk,
        totalEntries,
        centralDirectorySize,
        centralDirectoryOffset,
        zipFileCommentLength,
        zipFileComment
    };
};

const findEndOfCentralDirectory = (buffer: Buffer): number => {
    for (let i = buffer.length - 22; i >= 0; i--) {
        if (i + 22 <= buffer.length) {
            const signature = buffer.readUInt32LE(i);
            if (signature === ZIP_SIGNATURES.END_OF_CENTRAL_DIRECTORY) {
                return i;
            }
        }
    }
    return -1;
};

const analyzeZIP = (filePath: string): ZIPInfoResult => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    
    const buffer = fs.readFileSync(filePath);
    const result: ZIPInfoResult = {
        valid: true,
        files: [],
        centralDirectory: [],
        endOfCentralDirectory: null,
        issues: [],
        warnings: [],
        isPseudoEncrypted: false,
        totalFiles: 0,
        compressedSize: 0,
        uncompressedSize: 0
    };
    
    if (buffer.length < 4) {
        result.valid = false;
        result.issues.push('File too short to be a valid ZIP');
        return result;
    }
    
    const eocdOffset = findEndOfCentralDirectory(buffer);
    if (eocdOffset === -1) {
        result.valid = false;
        result.issues.push('End of Central Directory record not found');
        return result;
    }
    
    const eocd = parseZIPEndOfCentralDirectory(buffer, eocdOffset);
    if (!eocd) {
        result.valid = false;
        result.issues.push('Invalid End of Central Directory record');
        return result;
    }
    
    result.endOfCentralDirectory = eocd;
    
    if (eocd.centralDirectoryOffset + eocd.centralDirectorySize > buffer.length) {
        result.valid = false;
        result.issues.push('Central Directory out of bounds');
        return result;
    }
    
    let currentOffset = eocd.centralDirectoryOffset;
    for (let i = 0; i < eocd.totalEntries; i++) {
        const cdRecord = parseZIPCentralDirectoryRecord(buffer, currentOffset);
        if (!cdRecord) {
            result.warnings.push(`Invalid Central Directory record at offset ${currentOffset}`);
            break;
        }
        
        result.centralDirectory.push(cdRecord);
        
        const fileHeader = parseZIPFileHeader(buffer, cdRecord.relativeOffset);
        if (fileHeader) {
            result.files.push(fileHeader);
            result.compressedSize += fileHeader.compressedSize;
            result.uncompressedSize += fileHeader.uncompressedSize;
        }
        
        currentOffset += 46 + cdRecord.fileNameLength + cdRecord.extraFieldLength + cdRecord.fileCommentLength;
    }
    
    result.totalFiles = result.files.length;
    
    let hasEncryptedFiles = false;
    let hasUnencryptedFiles = false;
    
    for (const file of result.files) {
        if (file.isEncrypted) {
            hasEncryptedFiles = true;
        } else {
            hasUnencryptedFiles = true;
        }
    }
    
    for (const record of result.centralDirectory) {
        if (record.isEncrypted) {
            hasEncryptedFiles = true;
        } else {
            hasUnencryptedFiles = true;
        }
    }
    
    if (hasEncryptedFiles) {
        const isPseudo = checkPseudoEncryption(result.files, result.centralDirectory);
        result.isPseudoEncrypted = isPseudo;
        
        if (isPseudo) {
            result.warnings.push('Pseudo-encryption detected - files appear encrypted but are not');
        } else {
            result.warnings.push('Encrypted files detected');
        }
    }
    
    if (result.files.length !== eocd.totalEntries) {
        result.warnings.push(`Mismatch in file count: ${result.files.length} files found, ${eocd.totalEntries} expected`);
    }
    
    if (result.centralDirectory.length !== eocd.totalEntries) {
        result.warnings.push(`Mismatch in central directory records: ${result.centralDirectory.length} records found, ${eocd.totalEntries} expected`);
    }
    
    for (const file of result.files) {
        if (file.compression === 0) {
            if (file.compressedSize !== file.uncompressedSize) {
                result.warnings.push(`File ${file.fileName}: Compressed size mismatch for stored file`);
            }
        }
    }
    
    if (result.issues.length > 0) {
        result.valid = false;
    }
    
    return result;
};

const checkPseudoEncryption = (files: ZIPFileHeader[], centralDirectory: ZIPCentralDirectoryRecord[]): boolean => {
    for (const file of files) {
        if (file.isEncrypted) {
            if (file.compression === 0) {
                return true;
            }
        }
    }
    
    for (const record of centralDirectory) {
        if (record.isEncrypted) {
            if (record.compression === 0) {
                return true;
            }
        }
    }
    
    return false;
};

const getZIPInfo = (filePath: string): string => {
    const result = analyzeZIP(filePath);
    let info = `ZIP File Analysis\n`;
    info += `=================\n`;
    info += `Valid: ${result.valid ? 'Yes' : 'No'}\n`;
    info += `Total Files: ${result.totalFiles}\n`;
    info += `Compressed Size: ${result.compressedSize} bytes\n`;
    info += `Uncompressed Size: ${result.uncompressedSize} bytes\n`;
    info += `Pseudo-encrypted: ${result.isPseudoEncrypted ? 'Yes' : 'No'}\n`;
    
    if (result.files.length > 0) {
        info += `\nFiles:\n`;
        result.files.forEach((file, index) => {
            const compressionName = COMPRESSION_METHODS[file.compression as keyof typeof COMPRESSION_METHODS] || `Unknown (${file.compression})`;
            info += `  ${index + 1}. ${file.fileName}\n`;
            info += `     Size: ${file.uncompressedSize} bytes (compressed: ${file.compressedSize})\n`;
            info += `     Compression: ${compressionName}\n`;
            info += `     Encrypted: ${file.isEncrypted}\n`;
        });
    }
    
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

export {
    analyzeZIP,
    getZIPInfo,
    checkPseudoEncryption,
    COMPRESSION_METHODS
};
