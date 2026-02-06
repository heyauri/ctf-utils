declare module 'crypto-js' {
    export interface WordArray {
        toString(encoding?: string): string;
        concat(wordArray: WordArray): WordArray;
    }
    export interface Utf8Encoding {
        parse(str: string): WordArray;
    }
    export interface Base64Encoding {
        parse(str: string): WordArray;
        stringify(wordArray: WordArray): string;
    }
    export interface Utf16LEEncoding {
        parse(str: string): WordArray;
        stringify(wordArray: WordArray): string;
    }
    export const enc: {
        Utf8: Utf8Encoding;
        Base64: Base64Encoding;
        Hex: Base64Encoding;
        Latin1: Base64Encoding;
        Utf16LE: Utf16LEEncoding;
        [key: string]: any;
    };
    export function MD5(str: string): WordArray;
    export function SHA1(str: string): WordArray;
    export function SHA256(str: string): WordArray;
    export function SHA512(str: string): WordArray;
    export function HmacMD5(str: string, key: string): WordArray;
    export function HmacSHA1(str: string, key: string): WordArray;
    export function HmacSHA256(str: string, key: string): WordArray;
    export function AESEncrypt(message: WordArray, key: WordArray, config?: object): WordArray;
    export function AESDecrypt(ciphertext: WordArray, key: WordArray, config?: object): WordArray;
    export function DESEncrypt(message: WordArray, key: WordArray, config?: object): WordArray;
    export function DESDecrypt(ciphertext: WordArray, key: WordArray, config?: object): WordArray;
    export function RC4Encrypt(message: WordArray, key: WordArray): WordArray;
    export function RC4Decrypt(ciphertext: WordArray, key: WordArray): WordArray;
    export function RabbitEncrypt(message: WordArray, key: WordArray, config?: object): WordArray;
    export function RabbitDecrypt(ciphertext: WordArray, key: WordArray, config?: object): WordArray;
    export function TripleDESEncrypt(message: WordArray, key: WordArray, config?: object): WordArray;
    export function TripleDESDecrypt(ciphertext: WordArray, key: WordArray, config?: object): WordArray;
    export const encUtf8: Utf8Encoding;
    export const encBase64: Base64Encoding;
    export const AES: {
        encrypt(message: string | WordArray, key: string | WordArray, config?: { iv?: string | WordArray; mode?: any; padding?: any }): WordArray;
        decrypt(ciphertext: string | WordArray, key: string | WordArray, config?: { iv?: string | WordArray; mode?: any; padding?: any }): WordArray;
    };
    export const mode: {
        CBC: any;
        CTR: any;
        CFB: any;
        ECB: any;
        OFB: any;
    };
    export const pad: {
        Pkcs7: any;
        AnsiX923: any;
        Iso10126: any;
        Iso97971: any;
        ZeroPadding: any;
        NoPadding: any;
    };
}

declare module 'crypto-js/aes' {
    import CryptoJS from 'crypto-js';
    export default function encrypt(message: string | CryptoJS.WordArray, key: string | CryptoJS.WordArray, config?: { iv?: string | CryptoJS.WordArray; mode?: any; padding?: any }): CryptoJS.WordArray;
    export default function decrypt(ciphertext: string | CryptoJS.WordArray, key: string | CryptoJS.WordArray, config?: { iv?: string | CryptoJS.WordArray; mode?: any; padding?: any }): CryptoJS.WordArray;
}

declare module 'crypto-js/md5' {
    import CryptoJS from 'crypto-js';
    export default function MD5(message: string): CryptoJS.WordArray;
}

declare module 'crypto-js/sha1' {
    import CryptoJS from 'crypto-js';
    export default function SHA1(message: string): CryptoJS.WordArray;
}

declare module 'crypto-js/sha256' {
    import CryptoJS from 'crypto-js';
    export default function SHA256(message: string): CryptoJS.WordArray;
}

declare module 'crypto-js/hmac' {
    import CryptoJS from 'crypto-js';
    export default function Hmac(message: string, key: string): CryptoJS.WordArray;
}

declare module 'crypto-js/pad-ansix923' {
    import CryptoJS from 'crypto-js';
    export default function AnsiX923(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/pad-iso10126' {
    import CryptoJS from 'crypto-js';
    export default function Iso10126(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/pad-iso97971' {
    import CryptoJS from 'crypto-js';
    export default function Iso97971(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/pad-zeropadding' {
    import CryptoJS from 'crypto-js';
    export default function ZeroPadding(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/pad-nopadding' {
    import CryptoJS from 'crypto-js';
    export default function NoPadding(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/mode-cbc' {
    import CryptoJS from 'crypto-js';
    export default function CBC(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/mode-ctr' {
    import CryptoJS from 'crypto-js';
    export default function CTR(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/mode-cfb' {
    import CryptoJS from 'crypto-js';
    export default function CFB(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/mode-ecb' {
    import CryptoJS from 'crypto-js';
    export default function ECB(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}

declare module 'crypto-js/mode-ofb' {
    import CryptoJS from 'crypto-js';
    export default function OFB(axis: CryptoJS.WordArray): CryptoJS.WordArray;
}
