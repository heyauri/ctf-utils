// AES/DES symmetric encryption algorithms

import * as crypto from 'crypto';

/**
 * Encryption modes
 */
enum Mode {
    ECB = 'ecb',
    CBC = 'cbc',
    CFB = 'cfb',
    OFB = 'ofb',
    CTR = 'ctr'
}

/**
 * Padding schemes
 */
enum Padding {
    PKCS7 = 'pkcs7',
    ZERO = 'zero',
    ANSI_X923 = 'ansi_x923',
    ISO_10126 = 'iso_10126'
}

/**
 * AES/DES encryption options
 */
interface EncryptionOptions {
    mode?: Mode;
    padding?: Padding;
    iv?: string | Buffer;
    keyLength?: number;
}

/**
 * AES class
 */
class AES {
    /**
     * Encrypt data with AES
     */
    static encrypt(data: string | Buffer, key: string | Buffer, options: EncryptionOptions = {}): {
        encrypted: Buffer;
        iv: Buffer;
    } {
        const {
            mode = Mode.CBC,
            padding = Padding.PKCS7,
            iv = crypto.randomBytes(16)
        } = options;

        const keyBuffer = this.normalizeKey(key, options.keyLength || 256);
        const ivBuffer = Buffer.isBuffer(iv) ? iv : Buffer.from(iv, 'hex');

        const cipher = crypto.createCipheriv(
            `aes-${keyBuffer.length * 8}-${mode}`,
            keyBuffer,
            ivBuffer
        );

        cipher.setAutoPadding(padding === Padding.PKCS7);

        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            encrypted,
            iv: ivBuffer
        };
    }

    /**
     * Decrypt data with AES
     */
    static decrypt(encrypted: string | Buffer, key: string | Buffer, iv: string | Buffer, options: EncryptionOptions = {}): Buffer {
        const {
            mode = Mode.CBC,
            padding = Padding.PKCS7
        } = options;

        const keyBuffer = this.normalizeKey(key, options.keyLength || 256);
        const ivBuffer = Buffer.isBuffer(iv) ? iv : Buffer.from(iv, 'hex');
        const encryptedBuffer = Buffer.isBuffer(encrypted) ? encrypted : Buffer.from(encrypted, 'hex');

        const decipher = crypto.createDecipheriv(
            `aes-${keyBuffer.length * 8}-${mode}`,
            keyBuffer,
            ivBuffer
        );

        decipher.setAutoPadding(padding === Padding.PKCS7);

        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted;
    }

    /**
     * Normalize key to specified length
     */
    private static normalizeKey(key: string | Buffer, keyLength: number): Buffer {
        let keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key);
        const bytesNeeded = keyLength / 8;

        if (keyBuffer.length > bytesNeeded) {
            // Truncate
            keyBuffer = keyBuffer.slice(0, bytesNeeded);
        } else if (keyBuffer.length < bytesNeeded) {
            // Pad with zeros
            const padded = Buffer.alloc(bytesNeeded);
            keyBuffer.copy(padded);
            keyBuffer = padded;
        }

        return keyBuffer;
    }
}

/**
 * DES class
 */
class DES {
    /**
     * Encrypt data with DES
     */
    static encrypt(data: string | Buffer, key: string | Buffer, options: EncryptionOptions = {}): {
        encrypted: Buffer;
        iv: Buffer;
    } {
        const {
            mode = Mode.CBC,
            padding = Padding.PKCS7,
            iv = crypto.randomBytes(8)
        } = options;

        const keyBuffer = this.normalizeKey(key);
        const ivBuffer = Buffer.isBuffer(iv) ? iv : Buffer.from(iv, 'hex');

        const cipher = crypto.createCipheriv(
            `des-${mode}`,
            keyBuffer,
            ivBuffer
        );

        cipher.setAutoPadding(padding === Padding.PKCS7);

        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            encrypted,
            iv: ivBuffer
        };
    }

    /**
     * Decrypt data with DES
     */
    static decrypt(encrypted: string | Buffer, key: string | Buffer, iv: string | Buffer, options: EncryptionOptions = {}): Buffer {
        const {
            mode = Mode.CBC,
            padding = Padding.PKCS7
        } = options;

        const keyBuffer = this.normalizeKey(key);
        const ivBuffer = Buffer.isBuffer(iv) ? iv : Buffer.from(iv, 'hex');
        const encryptedBuffer = Buffer.isBuffer(encrypted) ? encrypted : Buffer.from(encrypted, 'hex');

        const decipher = crypto.createDecipheriv(
            `des-${mode}`,
            keyBuffer,
            ivBuffer
        );

        decipher.setAutoPadding(padding === Padding.PKCS7);

        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted;
    }

    /**
     * Normalize DES key (8 bytes)
     */
    private static normalizeKey(key: string | Buffer): Buffer {
        let keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key);
        const bytesNeeded = 8;

        if (keyBuffer.length > bytesNeeded) {
            keyBuffer = keyBuffer.slice(0, bytesNeeded);
        } else if (keyBuffer.length < bytesNeeded) {
            const padded = Buffer.alloc(bytesNeeded);
            keyBuffer.copy(padded);
            keyBuffer = padded;
        }

        return keyBuffer;
    }
}

/**
 * 3DES (Triple DES) class
 */
class TripleDES {
    /**
     * Encrypt data with 3DES
     */
    static encrypt(data: string | Buffer, key: string | Buffer, options: EncryptionOptions = {}): {
        encrypted: Buffer;
        iv: Buffer;
    } {
        const {
            mode = Mode.CBC,
            padding = Padding.PKCS7,
            iv = crypto.randomBytes(8)
        } = options;

        const keyBuffer = this.normalizeKey(key);
        const ivBuffer = Buffer.isBuffer(iv) ? iv : Buffer.from(iv, 'hex');

        const cipher = crypto.createCipheriv(
            `des-ede3-${mode}`,
            keyBuffer,
            ivBuffer
        );

        cipher.setAutoPadding(padding === Padding.PKCS7);

        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            encrypted,
            iv: ivBuffer
        };
    }

    /**
     * Decrypt data with 3DES
     */
    static decrypt(encrypted: string | Buffer, key: string | Buffer, iv: string | Buffer, options: EncryptionOptions = {}): Buffer {
        const {
            mode = Mode.CBC,
            padding = Padding.PKCS7
        } = options;

        const keyBuffer = this.normalizeKey(key);
        const ivBuffer = Buffer.isBuffer(iv) ? iv : Buffer.from(iv, 'hex');
        const encryptedBuffer = Buffer.isBuffer(encrypted) ? encrypted : Buffer.from(encrypted, 'hex');

        const decipher = crypto.createDecipheriv(
            `des-ede3-${mode}`,
            keyBuffer,
            ivBuffer
        );

        decipher.setAutoPadding(padding === Padding.PKCS7);

        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted;
    }

    /**
     * Normalize 3DES key (24 bytes)
     */
    private static normalizeKey(key: string | Buffer): Buffer {
        let keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key);
        const bytesNeeded = 24;

        if (keyBuffer.length > bytesNeeded) {
            keyBuffer = keyBuffer.slice(0, bytesNeeded);
        } else if (keyBuffer.length < bytesNeeded) {
            const padded = Buffer.alloc(bytesNeeded);
            keyBuffer.copy(padded);
            keyBuffer = padded;
        }

        return keyBuffer;
    }
}

/**
 * Encrypt data with AES
 */
const encryptAES = (data: string | Buffer, key: string | Buffer, options: EncryptionOptions = {}): string => {
    const result = AES.encrypt(data, key, options);
    return `${result.iv.toString('hex')}:${result.encrypted.toString('hex')}`;
};

/**
 * Decrypt data with AES
 */
const decryptAES = (encrypted: string, key: string | Buffer, options: EncryptionOptions = {}): string => {
    const [ivHex, encryptedHex] = encrypted.split(':');
    const result = AES.decrypt(encryptedHex, key, ivHex, options);
    return result.toString('utf8');
};

/**
 * Encrypt data with DES
 */
const encryptDES = (data: string | Buffer, key: string | Buffer, options: EncryptionOptions = {}): string => {
    const result = DES.encrypt(data, key, options);
    return `${result.iv.toString('hex')}:${result.encrypted.toString('hex')}`;
};

/**
 * Decrypt data with DES
 */
const decryptDES = (encrypted: string, key: string | Buffer, options: EncryptionOptions = {}): string => {
    const [ivHex, encryptedHex] = encrypted.split(':');
    const result = DES.decrypt(encryptedHex, key, ivHex, options);
    return result.toString('utf8');
};

/**
 * Encrypt data with 3DES
 */
const encrypt3DES = (data: string | Buffer, key: string | Buffer, options: EncryptionOptions = {}): string => {
    const result = TripleDES.encrypt(data, key, options);
    return `${result.iv.toString('hex')}:${result.encrypted.toString('hex')}`;
};

/**
 * Decrypt data with 3DES
 */
const decrypt3DES = (encrypted: string, key: string | Buffer, options: EncryptionOptions = {}): string => {
    const [ivHex, encryptedHex] = encrypted.split(':');
    const result = TripleDES.decrypt(encryptedHex, key, ivHex, options);
    return result.toString('utf8');
};

/**
 * Detect if data is encrypted
 */
const detect = (data: string | Buffer): boolean => {
    // Simple detection: check if data looks like hex-encoded encrypted data
    if (typeof data === 'string') {
        return /^[0-9a-fA-F]{32,}:[0-9a-fA-F]{32,}$/.test(data);
    }
    return Buffer.isBuffer(data) && data.length % 16 === 0;
};

export {
    AES,
    DES,
    TripleDES,
    encryptAES,
    decryptAES,
    encryptDES,
    decryptDES,
    encrypt3DES,
    decrypt3DES,
    detect,
    encryptAES as encode,
    decryptAES as decode,
    Mode,
    Padding,
    EncryptionOptions
};
