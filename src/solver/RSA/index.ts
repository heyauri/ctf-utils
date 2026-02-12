// RSA solver for CTF crypto challenges
// Supports key generation, encryption/decryption, and common attacks

// Import from modular files
import * as types from './types';
import * as utils from './utils';
import * as keygen from './keygen';
import * as crypto from './crypto';
import * as attacks from './attacks';

// Re-export types
export type {
  RSAKeyPair,
  RSACiphertext,
  RSAPublicKey,
  RSAPrivateKey,
  RSAPrivateKeyWithPrimes
} from './types';

// Re-export utility functions
export const {
  stringToBigint,
  bigintToString,
  gcd,
  lcm,
  egcd,
  modInv,
  isPrime,
  evaluateKeyStrength,
  randomBigint,
  modPow,
  isCarmichael
} = utils;

// Re-export key generation functions
export const {
  generateKeyPair,
  generatePublicKey,
  generatePrivateKey
} = keygen;

// Re-export crypto functions
export const {
  encrypt,
  decrypt,
  decryptCRT
} = crypto;

// Re-export attacks
export { attacks };

/**
 * RSA solver class
 */
export class RSASolver {
  /**
   * Generate key pair
   */
  static async generateKeyPair(bitLength: number = 2048): Promise<types.RSAKeyPair> {
    return keygen.generateKeyPair(bitLength);
  }
  
  /**
   * Encrypt message
   */
  static encrypt(message: string | bigint, publicKey: types.RSAPublicKey): bigint {
    const msgBigint = typeof message === 'string' ? utils.stringToBigint(message) : message;
    return crypto.encrypt(msgBigint, publicKey);
  }
  
  /**
   * Decrypt message
   */
  static decrypt(ciphertext: bigint, privateKey: types.RSAPrivateKey): string {
    const m = crypto.decrypt(ciphertext, privateKey);
    return utils.bigintToString(m);
  }
  
  /**
   * Decrypt with CRT
   */
  static decryptCRT(ciphertext: bigint, privateKey: types.RSAPrivateKeyWithPrimes): string {
    const m = crypto.decryptCRT(ciphertext, privateKey);
    return utils.bigintToString(m);
  }
  
  /**
   * Convert string to bigint
   */
  static stringToBigint(str: string): bigint {
    return utils.stringToBigint(str);
  }
  
  /**
   * Convert bigint to string
   */
  static bigintToString(num: bigint): string {
    return utils.bigintToString(num);
  }
  
  /**
   * Run attack
   */
  static attack(type: string, ...args: any[]): bigint | string | object | null {
    switch (type) {
      case 'smallExponent':
        return attacks.smallExponent(args[0], args[1]);
      case 'commonModulus':
        return attacks.commonModulus(args[0], args[1], args[2], args[3]);
      case 'wiener':
        return attacks.wiener(args[0]);
      case 'hastadBroadcast':
        return attacks.hastadBroadcast(args[0], args[1]);
      case 'franklinReiter':
        return attacks.franklinReiter(args[0], args[1], args[2], args[3]);
      case 'bonehDurfee':
        return attacks.bonehDurfee(args[0]);
      case 'coppersmith':
        return attacks.coppersmith(args[0], args[1], args[2]);
      case 'factorKnownPrimes':
        return attacks.factorKnownPrimes(args[0], args[1], args[2]);
      case 'privateKeyFromFactors':
        return attacks.privateKeyFromFactors(args[0], args[1], args[2]);
      case 'trialDivision':
        return attacks.trialDivision(args[0]);
      default:
        throw new Error(`Unknown attack type: ${type}`);
    }
  }
  
  /**
   * Calculate modular inverse
   */
  static modInv(a: bigint, m: bigint): bigint {
    return utils.modInv(a, m);
  }
  
  /**
   * Calculate greatest common divisor
   */
  static gcd(a: bigint, b: bigint): bigint {
    return utils.gcd(a, b);
  }
  
  /**
   * Calculate least common multiple
   */
  static lcm(a: bigint, b: bigint): bigint {
    return utils.lcm(a, b);
  }
  
  /**
   * Test if a number is prime
   */
  static async isPrime(n: bigint, iterations: number = 16): Promise<boolean> {
    return utils.isPrime(n, iterations);
  }
  
  /**
   * Evaluate RSA key strength
   */
  static evaluateKeyStrength(modulus: bigint): { keySize: number; strength: string } {
    return utils.evaluateKeyStrength(modulus);
  }
  
  /**
   * Generate a random big integer
   */
  static async randomBigint(bitLength: number): Promise<bigint> {
    return utils.randomBigint(bitLength);
  }
  
  /**
   * Calculate modular exponentiation
   */
  static modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    return utils.modPow(base, exponent, modulus);
  }
  
  /**
   * Check if a number is a Carmichael number
   */
  static async isCarmichael(n: bigint): Promise<boolean> {
    return utils.isCarmichael(n);
  }
}

export default {
  generateKeyPair,
  generatePublicKey,
  generatePrivateKey,
  encrypt,
  decrypt,
  decryptCRT,
  stringToBigint,
  bigintToString,
  gcd,
  lcm,
  egcd,
  modInv,
  isPrime,
  evaluateKeyStrength,
  randomBigint,
  modPow,
  isCarmichael,
  attacks,
  RSASolver
};
