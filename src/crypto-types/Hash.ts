import CryptoJS from "crypto-js";

/**
 * Hash algorithms supported
 */
export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'ripemd160';

/**
 * Calculate hash for input string
 * @param str Input string
 * @param algorithm Hash algorithm (default: 'md5')
 * @returns Hash value as hex string
 */
const hash = (str: string, algorithm: HashAlgorithm = 'md5'): string => {
  switch (algorithm) {
    case 'md5':
      return CryptoJS.MD5(str).toString();
    case 'sha1':
      return CryptoJS.SHA1(str).toString();
    case 'sha256':
      return CryptoJS.SHA256(str).toString();
    case 'sha512':
      return CryptoJS.SHA512(str).toString();
    case 'ripemd160':
      return CryptoJS.RIPEMD160(str).toString();
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }
};

/**
 * Detect if string is a hash value
 * @param str Input string
 * @param algorithm Optional hash algorithm to check
 * @returns True if string is a valid hash
 */
const detect = (str: string, algorithm?: HashAlgorithm): boolean => {
  // Check if string is hexadecimal
  if (!/^[0-9a-fA-F]+$/.test(str)) {
    return false;
  }
  
  // Check length based on algorithm
  if (algorithm) {
    switch (algorithm) {
      case 'md5':
        return str.length === 32;
      case 'sha1':
        return str.length === 40;
      case 'sha256':
        return str.length === 64;
      case 'sha512':
        return str.length === 128;
      case 'ripemd160':
        return str.length === 40;
      default:
        return false;
    }
  }
  
  // Check if length matches any supported algorithm
  const validLengths = [32, 40, 64, 128];
  return validLengths.includes(str.length);
};

/**
 * Calculate MD5 hash
 */
const md5 = (str: string): string => {
  return hash(str, 'md5');
};

/**
 * Calculate SHA-1 hash
 */
const sha1 = (str: string): string => {
  return hash(str, 'sha1');
};

/**
 * Calculate SHA-256 hash
 */
const sha256 = (str: string): string => {
  return hash(str, 'sha256');
};

/**
 * Calculate SHA-512 hash
 */
const sha512 = (str: string): string => {
  return hash(str, 'sha512');
};

/**
 * Calculate RIPEMD-160 hash
 */
const ripemd160 = (str: string): string => {
  return hash(str, 'ripemd160');
};

export {
  hash,
  detect,
  md5,
  sha1,
  sha256,
  sha512,
  ripemd160
};
