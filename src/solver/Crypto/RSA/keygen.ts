// RSA key generation
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import { RSAKeyPair, RSAPublicKey, RSAPrivateKey } from './types';

/**
 * Generate RSA key pair
 * @param bitLength Key bit length (default: 2048)
 * @returns RSA key pair
 */
export const generateKeyPair = async (bitLength: number = 2048): Promise<RSAKeyPair> => {
  // Generate two large primes
  const p = await bigintCryptoUtils.prime(bitLength / 2);
  const q = await bigintCryptoUtils.prime(bitLength / 2);
  
  // Calculate modulus
  const n = p * q;
  
  // Calculate Euler's totient function
  const phi = (p - 1n) * (q - 1n);
  
  // Choose public exponent (usually 65537)
  const e = 65537n;
  
  // Calculate private exponent
  const d = await bigintCryptoUtils.modInv(e, phi);
  
  return {
    publicKey: {
      n,
      e
    },
    privateKey: {
      d,
      n
    }
  };
};

/**
 * Generate RSA public key
 * @param n Modulus
 * @param e Public exponent
 * @returns RSA public key
 */
export const generatePublicKey = (n: bigint, e: bigint): RSAPublicKey => {
  return { n, e };
};

/**
 * Generate RSA private key
 * @param n Modulus
 * @param d Private exponent
 * @returns RSA private key
 */
export const generatePrivateKey = (n: bigint, d: bigint): RSAPrivateKey => {
  return { d, n };
};
